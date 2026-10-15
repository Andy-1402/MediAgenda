const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = 3001
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'citas.json')

app.use(cors())
app.use(express.json())

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ESPECIALIDADES_VALIDAS = new Set([
  'Medicina general',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Traumatología',
  'Fisiatría',
  'Ginecología',
  'Oftalmología',
])

// Mutex para evitar escrituras concurrentes
let writeChain = Promise.resolve()

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8')
  }
}

async function readCitas() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if (err.code === 'ENOENT') {
      await ensureDataFile()
      return []
    }
    if (err instanceof SyntaxError) {
      console.error('Archivo citas.json corrupto, se reinicia:', err.message)
      await fs.writeFile(DATA_FILE, '[]', 'utf-8')
      return []
    }
    throw err
  }
}

async function writeCitasAtomic(citas) {
  const tmpFile = DATA_FILE + '.tmp'
  await fs.writeFile(tmpFile, JSON.stringify(citas, null, 2), 'utf-8')
  await fs.rename(tmpFile, DATA_FILE)
}

function validarCita(body) {
  const errores = []
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['El cuerpo debe ser un objeto JSON.']
  }

  const { solicitante, email, motivo, fecha, especialidad } = body

  if (!solicitante || typeof solicitante !== 'string' || solicitante.trim().length < 2) {
    errores.push('El solicitante es obligatorio (mínimo 2 caracteres).')
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errores.push('El email no tiene un formato válido.')
  }
  if (!motivo || typeof motivo !== 'string' || motivo.trim().length < 3) {
    errores.push('El motivo es obligatorio (mínimo 3 caracteres).')
  } else if (motivo.trim().length > 300) {
    errores.push('El motivo no puede superar los 300 caracteres.')
  }
  if (!especialidad || typeof especialidad !== 'string' || !ESPECIALIDADES_VALIDAS.has(especialidad)) {
    errores.push('La especialidad no es válida.')
  }
  if (!fecha || typeof fecha !== 'string') {
    errores.push('La fecha es obligatoria (formato YYYY-MM-DD).')
  } else {
    const f = new Date(fecha.length === 10 ? fecha + 'T00:00:00' : fecha)
    if (Number.isNaN(f.getTime())) {
      errores.push('La fecha no es válida.')
    } else {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      if (f < hoy) {
        errores.push('La fecha no puede ser en el pasado.')
      }
    }
  }

  return errores
}

app.get('/registros', async (_req, res) => {
  try {
    const citas = await readCitas()
    res.status(200).json(citas)
  } catch (err) {
    console.error('GET /registros', err)
    res.status(500).json({ error: 'No se pudo leer el archivo de citas.' })
  }
})

app.post('/registros', async (req, res) => {
  const errores = validarCita(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores })
  }

  const { solicitante, email, motivo, fecha, especialidad } = req.body
  const nuevaCita = {
    id: crypto.randomUUID(),
    solicitante: solicitante.trim(),
    email: email.trim(),
    motivo: motivo.trim(),
    fecha,
    especialidad,
    createdAt: new Date().toISOString(),
  }

  writeChain = writeChain.then(async () => {
    const citas = await readCitas()
    citas.push(nuevaCita)
    await writeCitasAtomic(citas)
  })

  try {
    await writeChain
    res.status(201).json(nuevaCita)
  } catch (err) {
    console.error('POST /registros', err)
    res.status(500).json({ error: 'No se pudo guardar la cita.' })
  }
})

// Errores de JSON mal formado del body-parser
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición.' })
  }
  console.error('Error no controlado:', err)
  res.status(500).json({ error: 'Error interno del servidor.' })
})

// Guardarraíl para que el servidor no se caiga ante errores inesperados
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})

ensureDataFile()
  .catch((err) => console.error('No se pudo preparar data/citas.json:', err))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`MediAgenda backend escuchando en http://localhost:${PORT}`)
    })
  })

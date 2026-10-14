const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = 3001
const DATA_FILE = path.join(__dirname, 'data', 'citas.json')

app.use(cors())
app.use(express.json())

// Mutex sencillo para evitar escrituras concurrentes que corrompan el archivo
let writeChain = Promise.resolve()

async function readCitas() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeCitasAtomic(citas) {
  const tmpFile = DATA_FILE + '.tmp'
  const payload = JSON.stringify(citas, null, 2)
  await fs.writeFile(tmpFile, payload, 'utf-8')
  await fs.rename(tmpFile, DATA_FILE)
}

app.get('/registros', async (_req, res) => {
  try {
    const citas = await readCitas()
    res.json(citas)
  } catch (err) {
    console.error('GET /registros', err)
    res.status(500).json({ error: 'No se pudo leer el archivo de citas.' })
  }
})

app.post('/registros', async (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un objeto JSON.' })
  }

  const nuevaCita = {
    id: crypto.randomUUID(),
    ...body,
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

app.listen(PORT, () => {
  console.log(`MediAgenda backend escuchando en http://localhost:${PORT}`)
})

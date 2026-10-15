// Pruebas de extremo a extremo de la API: levantan el servidor real en un
// puerto y carpeta de datos temporales, sin tocar data/citas.json.
const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const PORT = 3099
const BASE = `http://localhost:${PORT}`
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'mediagenda-test-'))
const DATA_FILE = path.join(DATA_DIR, 'citas.json')

let server

function iniciarServidor() {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [path.join(__dirname, '..', 'index.js')], {
      env: { ...process.env, PORT: String(PORT), DATA_DIR },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const timer = setTimeout(() => reject(new Error('El servidor no arrancó a tiempo')), 10000)
    proc.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('escuchando')) {
        clearTimeout(timer)
        resolve(proc)
      }
    })
    proc.on('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`El servidor terminó con código ${code}`))
    })
  })
}

function detenerServidor(proc) {
  return new Promise((resolve) => {
    if (!proc || proc.exitCode !== null) return resolve()
    proc.removeAllListeners('exit')
    proc.once('exit', () => resolve())
    proc.kill()
  })
}

function fechaFutura(dias = 7) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function citaValida(extra = {}) {
  return {
    solicitante: 'Ana Prueba',
    email: 'ana@correo.com',
    motivo: 'Chequeo general',
    fecha: fechaFutura(),
    especialidad: 'Medicina general',
    ...extra,
  }
}

function postCita(body) {
  return fetch(`${BASE}/registros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

before(async () => {
  server = await iniciarServidor()
})

after(async () => {
  await detenerServidor(server)
  fs.rmSync(DATA_DIR, { recursive: true, force: true })
})

test('inicializa el archivo con una lista vacía', async () => {
  const res = await fetch(`${BASE}/registros`)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), [])
  assert.equal(fs.readFileSync(DATA_FILE, 'utf-8'), '[]')
})

test('crea un registro con id único y responde 201', async () => {
  const res = await postCita(citaValida())
  assert.equal(res.status, 201)
  const cita = await res.json()
  assert.match(cita.id, /^[0-9a-f-]{36}$/)
  assert.ok(cita.createdAt)

  const otra = await (await postCita(citaValida({ solicitante: 'Luis Prueba' }))).json()
  assert.notEqual(otra.id, cita.id)
})

test('consulta los registros guardados sin perder los anteriores', async () => {
  const res = await fetch(`${BASE}/registros`)
  assert.equal(res.status, 200)
  const citas = await res.json()
  assert.equal(citas.length, 2)
  assert.deepEqual(citas.map((c) => c.solicitante), ['Ana Prueba', 'Luis Prueba'])
})

test('rechaza datos inválidos con 400 y detalle de errores', async () => {
  const casos = [
    [{}, 'cuerpo vacío'],
    [citaValida({ email: 'no-es-email' }), 'email mal formado'],
    [citaValida({ solicitante: 'A' }), 'nombre muy corto'],
    [citaValida({ especialidad: 'Astrología' }), 'especialidad inexistente'],
    [citaValida({ fecha: '2020-01-01' }), 'fecha en el pasado'],
    [citaValida({ fecha: '2099-02-31' }), 'fecha imposible (31 de febrero)'],
    [citaValida({ fecha: '2099-13-01' }), 'mes inexistente'],
    [citaValida({ fecha: '01/05/2099' }), 'formato distinto a YYYY-MM-DD'],
  ]
  for (const [body, descripcion] of casos) {
    const res = await postCita(body)
    assert.equal(res.status, 400, `Debió rechazar: ${descripcion}`)
    const data = await res.json()
    assert.ok(Array.isArray(data.detalles) && data.detalles.length > 0, descripcion)
  }
})

test('responde 400 ante JSON mal formado sin caerse', async () => {
  const res = await postCita('{ esto no es json')
  assert.equal(res.status, 400)
  assert.equal((await fetch(`${BASE}/registros`)).status, 200)
})

test('sigue guardando después de un error de escritura', async () => {
  // Una carpeta con el nombre del archivo temporal hace fallar la escritura
  const tmp = DATA_FILE + '.tmp'
  fs.mkdirSync(tmp)
  try {
    const fallida = await postCita(citaValida({ solicitante: 'Falla Prueba' }))
    assert.equal(fallida.status, 500)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }

  const res = await postCita(citaValida({ solicitante: 'Recuperada Prueba' }))
  assert.equal(res.status, 201, 'El servidor debe recuperarse tras el fallo')
})

test('los registros persisten al reiniciar el backend', async () => {
  const antes = await (await fetch(`${BASE}/registros`)).json()

  await detenerServidor(server)
  server = await iniciarServidor()

  const despues = await (await fetch(`${BASE}/registros`)).json()
  assert.deepEqual(despues, antes)
  assert.equal(despues.length, 3)
})

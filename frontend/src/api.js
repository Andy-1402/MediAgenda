export const API_URL = 'http://localhost:3001'

export async function getRegistros() {
  const res = await fetch(`${API_URL}/registros`)
  if (!res.ok) throw new Error(`Error ${res.status} al obtener registros`)
  return res.json()
}

export async function postRegistro(payload) {
  const res = await fetch(`${API_URL}/registros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error ${res.status} al guardar la cita`)
  return res.json()
}

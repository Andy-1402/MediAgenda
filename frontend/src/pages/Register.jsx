import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import { postRegistro } from '../api'

const ESPECIALIDADES = [
  'Medicina general',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Traumatología',
  'Fisiatría',
  'Ginecología',
  'Oftalmología',
]

const EMPTY = {
  solicitante: '',
  email: '',
  motivo: '',
  fecha: '',
  especialidad: '',
}

function Register() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await postRegistro(form)
      setStatus('success')
      setForm(EMPTY)
      setTimeout(() => navigate('/lista'), 1200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'No se pudo guardar la cita.')
    }
  }

  const loading = status === 'loading'

  return (
    <MainContainer narrow>
      <div className="page-head">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Nueva cita</span>
          <h1 style={{ marginTop: 16 }}>Agendar una consulta</h1>
          <p>Completa los datos del solicitante y selecciona la especialidad. La reserva se guarda en el servidor y queda disponible en el listado.</p>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="solicitante">Solicitante</label>
              <input
                id="solicitante"
                required
                value={form.solicitante}
                onChange={(e) => update('solicitante', e.target.value)}
                placeholder="Nombres y apellidos"
                disabled={loading}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="paciente@correo.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="especialidad">Especialidad</label>
              <select
                id="especialidad"
                required
                value={form.especialidad}
                onChange={(e) => update('especialidad', e.target.value)}
                disabled={loading}
              >
                <option value="">Seleccionar especialidad</option>
                {ESPECIALIDADES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                required
                value={form.fecha}
                onChange={(e) => update('fecha', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="motivo">Motivo de consulta</label>
            <textarea
              id="motivo"
              required
              value={form.motivo}
              onChange={(e) => update('motivo', e.target.value)}
              placeholder="Describe brevemente el motivo de la cita."
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { setForm(EMPTY); setStatus('idle'); setErrorMsg('') }}
              disabled={loading}
            >
              Limpiar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>

        {status === 'success' && (
          <div className="notice" role="status">
            Cita registrada correctamente. Te llevamos al listado.
          </div>
        )}
        {status === 'error' && (
          <div className="notice notice-error" role="alert">
            {errorMsg}
          </div>
        )}
      </div>
    </MainContainer>
  )
}

export default Register

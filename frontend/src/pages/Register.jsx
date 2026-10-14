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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(form) {
  const errors = {}

  if (!form.solicitante.trim()) {
    errors.solicitante = 'El solicitante es obligatorio.'
  } else if (form.solicitante.trim().length < 2) {
    errors.solicitante = 'Debe tener al menos 2 caracteres.'
  }

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'El formato del correo no es válido.'
  }

  if (!form.motivo.trim()) {
    errors.motivo = 'El motivo es obligatorio.'
  } else if (form.motivo.trim().length < 3) {
    errors.motivo = 'Describe el motivo con al menos 3 caracteres.'
  }

  if (!form.especialidad) {
    errors.especialidad = 'Selecciona una especialidad.'
  }

  if (!form.fecha) {
    errors.fecha = 'La fecha es obligatoria.'
  } else {
    const f = new Date(form.fecha + 'T00:00:00')
    if (Number.isNaN(f.getTime())) {
      errors.fecha = 'La fecha no es válida.'
    } else {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      if (f < hoy) {
        errors.fecha = 'La fecha no puede ser en el pasado.'
      }
    }
  }

  return errors
}

function Register() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('')
  const navigate = useNavigate()

  const todayISO = new Date().toISOString().slice(0, 10)

  function update(key, value) {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) {
      setErrors(validar(next))
    }
  }

  function markTouched(key) {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors(validar(form))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const currentErrors = validar(form)
    setErrors(currentErrors)
    setTouched({
      solicitante: true,
      email: true,
      motivo: true,
      fecha: true,
      especialidad: true,
    })
    if (Object.keys(currentErrors).length > 0) {
      setStatus('error')
      setServerMsg('Revisa los campos marcados antes de continuar.')
      return
    }

    setStatus('loading')
    setServerMsg('')
    try {
      await postRegistro({
        solicitante: form.solicitante.trim(),
        email: form.email.trim(),
        motivo: form.motivo.trim(),
        fecha: form.fecha,
        especialidad: form.especialidad,
      })
      setStatus('success')
      setForm(EMPTY)
      setTouched({})
      setErrors({})
      setTimeout(() => navigate('/lista'), 1200)
    } catch (err) {
      setStatus('error')
      setServerMsg(err.message || 'No se pudo guardar la cita.')
    }
  }

  function resetAll() {
    setForm(EMPTY)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setServerMsg('')
  }

  const loading = status === 'loading'
  const showError = (key) => touched[key] && errors[key]

  return (
    <MainContainer narrow>
      <div className="page-head">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Nueva cita</span>
          <h1 style={{ marginTop: 16 }}>Agendar una consulta</h1>
          <p>Completa los datos del solicitante. Validamos los campos antes de enviarlos al servidor.</p>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="field">
              <label htmlFor="solicitante">Solicitante</label>
              <input
                id="solicitante"
                value={form.solicitante}
                onChange={(e) => update('solicitante', e.target.value)}
                onBlur={() => markTouched('solicitante')}
                placeholder="Nombres y apellidos"
                aria-invalid={!!showError('solicitante')}
                disabled={loading}
              />
              {showError('solicitante') && <span className="field-error">{errors.solicitante}</span>}
            </div>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder="paciente@correo.com"
                aria-invalid={!!showError('email')}
                disabled={loading}
              />
              {showError('email') && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="especialidad">Especialidad</label>
              <select
                id="especialidad"
                value={form.especialidad}
                onChange={(e) => update('especialidad', e.target.value)}
                onBlur={() => markTouched('especialidad')}
                aria-invalid={!!showError('especialidad')}
                disabled={loading}
              >
                <option value="">Seleccionar especialidad</option>
                {ESPECIALIDADES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {showError('especialidad') && <span className="field-error">{errors.especialidad}</span>}
            </div>
            <div className="field">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                min={todayISO}
                value={form.fecha}
                onChange={(e) => update('fecha', e.target.value)}
                onBlur={() => markTouched('fecha')}
                aria-invalid={!!showError('fecha')}
                disabled={loading}
              />
              {showError('fecha') && <span className="field-error">{errors.fecha}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="motivo">Motivo de consulta</label>
            <textarea
              id="motivo"
              value={form.motivo}
              onChange={(e) => update('motivo', e.target.value)}
              onBlur={() => markTouched('motivo')}
              placeholder="Describe brevemente el motivo de la cita."
              aria-invalid={!!showError('motivo')}
              disabled={loading}
            />
            {showError('motivo') && <span className="field-error">{errors.motivo}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={resetAll} disabled={loading}>
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
        {status === 'error' && serverMsg && (
          <div className="notice notice-error" role="alert">
            {serverMsg}
          </div>
        )}
      </div>
    </MainContainer>
  )
}

export default Register

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import { specialties } from '../data/appointments'

const EMPTY = {
  patient: '',
  idNumber: '',
  email: '',
  phone: '',
  specialty: '',
  doctor: '',
  date: '',
  time: '',
  reason: '',
}

function Register() {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate('/lista'), 1200)
  }

  return (
    <MainContainer narrow>
      <div className="page-head">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Nueva cita</span>
          <h1 style={{ marginTop: 16 }}>Agendar una consulta</h1>
          <p>Completa los datos del paciente y selecciona la especialidad. La reserva queda en estado pendiente hasta la confirmación del centro médico.</p>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="patient">Nombre del paciente</label>
              <input id="patient" required value={form.patient} onChange={(e) => update('patient', e.target.value)} placeholder="Nombres y apellidos" />
            </div>
            <div className="field">
              <label htmlFor="idNumber">Documento de identidad</label>
              <input id="idNumber" required value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)} placeholder="Cédula o pasaporte" />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="paciente@correo.com" />
            </div>
            <div className="field">
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+593 99 000 0000" />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="specialty">Especialidad</label>
              <select id="specialty" required value={form.specialty} onChange={(e) => update('specialty', e.target.value)}>
                <option value="">Seleccionar especialidad</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="doctor">Especialista</label>
              <input id="doctor" value={form.doctor} onChange={(e) => update('doctor', e.target.value)} placeholder="Dra. Nombre Apellido" />
              <span className="field-hint">Opcional, asignamos uno si lo dejas en blanco.</span>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="date">Fecha</label>
              <input id="date" type="date" required value={form.date} onChange={(e) => update('date', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="time">Hora</label>
              <input id="time" type="time" required value={form.time} onChange={(e) => update('time', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="reason">Motivo de consulta</label>
            <textarea id="reason" value={form.reason} onChange={(e) => update('reason', e.target.value)} placeholder="Describe brevemente el motivo (opcional)." />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Limpiar</button>
            <button type="submit" className="btn btn-primary">Confirmar reserva</button>
          </div>
        </form>

        {submitted && (
          <div className="notice" role="status">
            Cita registrada. Te redirigimos al listado de citas.
          </div>
        )}
      </div>
    </MainContainer>
  )
}

export default Register

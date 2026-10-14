const STATUS_LABEL = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
}

const STATUS_CLASS = {
  confirmada: 'chip chip-ok',
  pendiente: 'chip chip-pending',
  cancelada: 'chip chip-cancel',
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-EC', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function AppointmentCard({ appointment }) {
  const { patient, reason, doctor, specialty, date, time, status } = appointment

  return (
    <article className="appt-card">
      <div className="appt-top">
        <div className="appt-patient">
          <div className="avatar" aria-hidden="true">{initials(patient)}</div>
          <div>
            <div className="appt-name">{patient}</div>
            <div className="appt-reason">{reason}</div>
          </div>
        </div>
        <span className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="appt-meta">
        <div className="meta-item">
          <span className="meta-label">Fecha</span>
          <span className="meta-value">{formatDate(date)} · {time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Especialista</span>
          <span className="meta-value">{doctor}</span>
          <span className="appt-reason">{specialty}</span>
        </div>
      </div>
    </article>
  )
}

export default AppointmentCard

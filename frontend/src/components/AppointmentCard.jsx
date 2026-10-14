function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}

function formatDate(iso) {
  if (!iso) return 'Sin fecha'
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-EC', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function AppointmentCard({ appointment }) {
  const {
    solicitante,
    email,
    motivo,
    fecha,
    especialidad,
    createdAt,
  } = appointment

  return (
    <article className="appt-card">
      <div className="appt-top">
        <div className="appt-patient">
          <div className="avatar" aria-hidden="true">{initials(solicitante)}</div>
          <div>
            <div className="appt-name">{solicitante || 'Sin solicitante'}</div>
            <div className="appt-reason">{motivo || 'Sin motivo registrado'}</div>
          </div>
        </div>
        <span className="chip chip-ok">{especialidad || 'General'}</span>
      </div>

      <div className="appt-meta">
        <div className="meta-item">
          <span className="meta-label">Fecha</span>
          <span className="meta-value">{formatDate(fecha)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Contacto</span>
          <span className="meta-value">{email || 'No proporcionado'}</span>
          {createdAt && (
            <span className="appt-reason">
              Registrado el {new Date(createdAt).toLocaleDateString('es-EC')}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default AppointmentCard

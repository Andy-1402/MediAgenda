import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import AppointmentCard from '../components/AppointmentCard'
import { mockAppointments } from '../data/appointments'

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'confirmada', label: 'Confirmadas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'cancelada', label: 'Canceladas' },
]

function List() {
  const [filter, setFilter] = useState('todas')

  const items = useMemo(() => {
    if (filter === 'todas') return mockAppointments
    return mockAppointments.filter((a) => a.status === filter)
  }, [filter])

  return (
    <MainContainer>
      <div className="page-head">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Agenda</span>
          <h1 style={{ marginTop: 16 }}>Próximas citas</h1>
          <p>Revisa el estado de cada reserva y filtra por el estado que necesites gestionar.</p>
        </div>
        <Link to="/registro" className="btn btn-primary">Agendar nueva</Link>
      </div>

      <div className="toolbar" role="tablist" aria-label="Filtrar por estado">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className={'filter-pill' + (filter === f.key ? ' active' : '')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <strong>No hay citas en este estado</strong>
          Prueba con otro filtro o agenda una nueva consulta.
        </div>
      ) : (
        <div className="appt-grid">
          {items.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </MainContainer>
  )
}

export default List

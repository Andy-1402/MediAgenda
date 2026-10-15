import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import AppointmentCard from '../components/AppointmentCard'
import { getRegistros } from '../api'

function SkeletonCard() {
  return (
    <div className="appt-card skeleton-card" aria-hidden="true">
      <div className="appt-patient">
        <span className="skeleton skeleton-avatar" />
        <div className="skeleton-lines">
          <span className="skeleton skeleton-line" style={{ width: '60%' }} />
          <span className="skeleton skeleton-line" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="appt-meta">
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-line" />
      </div>
    </div>
  )
}

function List() {
  const [citas, setCitas] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function cargarCitas() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await getRegistros()
      const citasOrdenadas = Array.isArray(data)
        ? [...data].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''))
        : []
      setCitas(citasOrdenadas)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'No se pudo cargar la lista.')
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  return (
    <MainContainer>
      <div className="page-head">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Agenda</span>
          <h1 className="page-title">
            Citas registradas
            {status === 'success' && (
              <span className="count-badge">{citas.length}</span>
            )}
          </h1>
          <p>Listado en tiempo real de las citas almacenadas en el servidor.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={cargarCitas} disabled={status === 'loading'}>
            <svg className={status === 'loading' ? 'spin' : undefined} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
            {status === 'loading' ? 'Actualizando...' : 'Actualizar'}
          </button>
          <Link to="/registro" className="btn btn-primary">Agendar nueva</Link>
        </div>
      </div>

      {status === 'loading' && (
        <div className="appt-grid" role="status" aria-label="Cargando citas">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {status === 'error' && (
        <div className="empty empty-error" role="alert">
          <div className="empty-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
          </div>
          <strong>No se pudo obtener la lista</strong>
          {errorMsg} · Verifica que el backend esté corriendo.
          <div className="empty-actions">
            <button className="btn btn-ghost" onClick={cargarCitas}>Reintentar</button>
          </div>
        </div>
      )}

      {status === 'success' && citas.length === 0 && (
        <div className="empty">
          <div className="empty-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <strong>Aún no hay citas registradas</strong>
          Agenda la primera consulta desde el formulario.
          <div className="empty-actions">
            <Link to="/registro" className="btn btn-primary">Agendar primera cita</Link>
          </div>
        </div>
      )}

      {status === 'success' && citas.length > 0 && (
        <div className="appt-grid">
          {citas.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </MainContainer>
  )
}

export default List

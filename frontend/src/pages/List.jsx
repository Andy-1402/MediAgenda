import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import AppointmentCard from '../components/AppointmentCard'
import { getRegistros } from '../api'

function List() {
  const [citas, setCitas] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function cargarCitas() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await getRegistros()
      setCitas(Array.isArray(data) ? data : [])
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
          <h1 style={{ marginTop: 16 }}>Citas registradas</h1>
          <p>Listado en tiempo real de las citas almacenadas en el servidor.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={cargarCitas} disabled={status === 'loading'}>
            {status === 'loading' ? 'Actualizando...' : 'Actualizar'}
          </button>
          <Link to="/registro" className="btn btn-primary">Agendar nueva</Link>
        </div>
      </div>

      {status === 'loading' && (
        <div className="empty">
          <strong>Cargando citas...</strong>
          Consultando el servidor en http://localhost:3001
        </div>
      )}

      {status === 'error' && (
        <div className="empty">
          <strong>No se pudo obtener la lista</strong>
          {errorMsg} · Verifica que el backend esté corriendo.
        </div>
      )}

      {status === 'success' && citas.length === 0 && (
        <div className="empty">
          <strong>Aún no hay citas registradas</strong>
          Agenda la primera consulta desde el formulario.
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

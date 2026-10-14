import { NavLink, Link } from 'react-router-dom'

function NavBar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="MediAgenda, inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          MediAgenda
        </Link>

        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Inicio
          </NavLink>
          <NavLink to="/lista" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Citas
          </NavLink>
          <NavLink to="/registro" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Agendar
          </NavLink>
        </nav>

        <div className="nav-cta">
          <Link to="/lista" className="btn btn-ghost">Ver agenda</Link>
          <Link to="/registro" className="btn btn-primary">Nueva cita</Link>
        </div>
      </div>
    </header>
  )
}

export default NavBar

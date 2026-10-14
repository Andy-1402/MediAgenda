import { Link } from 'react-router-dom'
import MainContainer from '../components/MainContainer'

function Home() {
  return (
    <MainContainer>
      <section className="hero">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Plataforma clínica</span>
          <h1>Agenda médica clara, para pacientes y equipos.</h1>
          <p className="hero-sub">
            MediAgenda centraliza la reserva, confirmación y seguimiento de citas
            en un solo lugar, para que tu consultorio funcione sin fricciones.
          </p>
          <div className="hero-actions">
            <Link to="/registro" className="btn btn-primary">Agendar una cita</Link>
            <Link to="/lista" className="btn btn-ghost">Ver próximas citas</Link>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">1,284</div>
              <div className="hero-stat-label">Citas gestionadas este mes</div>
            </div>
            <div>
              <div className="hero-stat-value">38</div>
              <div className="hero-stat-label">Especialistas activos</div>
            </div>
            <div>
              <div className="hero-stat-value">4 min</div>
              <div className="hero-stat-label">Tiempo medio de reserva</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="preview-card" role="img" aria-label="Vista previa de la agenda del día">
            <div className="preview-head">
              <span className="preview-title">Agenda del día</span>
              <span className="preview-date">Jue 16 de octubre</span>
            </div>
            <div className="preview-row">
              <span className="preview-time">09:30</span>
              <div>
                <strong>Mariana Alvear</strong>
                <small>Cardiología · Dra. Reinoso</small>
              </div>
              <span className="chip chip-ok">Confirmada</span>
            </div>
            <div className="preview-row">
              <span className="preview-time">11:00</span>
              <div>
                <strong>Esteban Cordero</strong>
                <small>Traumatología · Dr. Vallejo</small>
              </div>
              <span className="chip chip-pending">Pendiente</span>
            </div>
            <div className="preview-row">
              <span className="preview-time">15:45</span>
              <div>
                <strong>Lucía Benavides</strong>
                <small>Medicina general · Dra. Montenegro</small>
              </div>
              <span className="chip"><span className="chip-dot" /> En espera</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-head">
          <h2>Lo esencial para tu consulta</h2>
          <p>Herramientas pensadas para reducir ausencias y mantener la agenda organizada sin complicaciones.</p>
        </div>

        <div className="feature-grid">
          <article className="feature">
            <div className="feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <h3>Reservas en minutos</h3>
            <p>Formulario breve con validación en línea para registrar nuevas citas sin fricción.</p>
          </article>
          <article className="feature">
            <div className="feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7 9 18l-5-5" />
              </svg>
            </div>
            <h3>Confirmación clara</h3>
            <p>Estados visuales que distinguen una cita confirmada, pendiente o cancelada de un vistazo.</p>
          </article>
          <article className="feature">
            <div className="feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3>Vista por paciente y hora</h3>
            <p>Encuentra la próxima cita del día o filtra por especialidad en el panel de citas.</p>
          </article>
        </div>
      </section>
    </MainContainer>
  )
}

export default Home

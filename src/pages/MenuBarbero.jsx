import './MenuBarbero.css'

function MenuBarbero({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  return (
    <div className="mb-container">
      <div className="mb-sidebar">
        <div className="mb-brand" onClick={irAlInicio}>
          <span className="mb-brand-scissors">✂</span>
          <h1 className="mb-brand-name">BARBERBOOK</h1>
        </div>
        <div className="mb-divider" />
        <nav className="mb-nav">
          <p className="mb-nav-label">MI PANEL</p>
          <button className="mb-nav-btn" onClick={() => navegarA('horarioBarbero')}>
            <span className="mb-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            Ingresar horario disponible
          </button>
          <button className="mb-nav-btn" onClick={() => navegarA('agendaBarbero')}>
            <span className="mb-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </span>
            Agenda
          </button>
          <button className="mb-nav-btn" onClick={() => navegarA('gestionCitasBarbero')}>
            <span className="mb-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            Gestionar mis citas
          </button>
        </nav>
        <div className="mb-spacer" />
        <button className="mb-logout" onClick={cerrarSesion}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>

      <div className="mb-main">
        <div className="mb-topbar">
          <div className="mb-topbar-left">
            <h2 className="mb-welcome">Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}</h2>
            <p className="mb-date">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mb-avatar">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>

        <div className="mb-cards">
          <div className="mb-card" onClick={() => navegarA('horarioBarbero')}>
            <div className="mb-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="mb-card-title">Horario</h3>
            <p className="mb-card-desc">Define tu disponibilidad semanal</p>
            <span className="mb-card-arrow">→</span>
          </div>
          <div className="mb-card" onClick={() => navegarA('agendaBarbero')}>
            <div className="mb-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 className="mb-card-title">Agenda</h3>
            <p className="mb-card-desc">Consulta tus próximas citas</p>
            <span className="mb-card-arrow">→</span>
          </div>
          <div className="mb-card" onClick={() => navegarA('gestionCitasBarbero')}>
            <div className="mb-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3 className="mb-card-title">Gestionar Citas</h3>
            <p className="mb-card-desc">Administra y cancela tus citas</p>
            <span className="mb-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBarbero

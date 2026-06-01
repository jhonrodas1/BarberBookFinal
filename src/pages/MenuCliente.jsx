import './MenuCliente.css'

function MenuCliente({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  return (
    <div className="mcl-container">
      <div className="mcl-sidebar">
        <div className="mcl-brand" onClick={irAlInicio}>
          <span className="bb-scissors">✂</span>
          <h1 className="mcl-brand-name">BARBERBOOK</h1>
        </div>
        <div className="mcl-divider" />
        <nav className="mcl-nav">
          <p className="mcl-nav-label">EXPLORAR</p>
          <button className="mcl-nav-btn" onClick={() => navegarA('servicios')}>
            <span className="mcl-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3a3 3 0 0 1 6 0v2M6 3a3 3 0 0 0-3 3v1h18V6a3 3 0 0 0-3-3M3 9v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9"/><path d="M9 12h6"/></svg></span>
            Servicios
          </button>
          <button className="mcl-nav-btn" onClick={() => navegarA('barberos')}>
            <span className="mcl-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
            Barberos
          </button>
          <button className="mcl-nav-btn" onClick={() => navegarA('citas')}>
            <span className="mcl-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            Agendar Cita
          </button>
          <button className="mcl-nav-btn" onClick={() => navegarA('misCitas')}>
            <span className="mcl-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
            Mis Citas
          </button>
          <button className="mcl-nav-btn" onClick={() => navegarA('editarCliente')}>
            <span className="mcl-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></span>
            Editar Perfil
          </button>
        </nav>
        <div className="mcl-spacer" />
        <button className="mcl-logout" onClick={cerrarSesion}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      <div className="mcl-main">
        <div className="mcl-topbar">
          <div>
            <h2 className="mcl-welcome">Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}</h2>
            <p className="mcl-date">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mcl-avatar" onClick={() => navegarA('editarCliente')} style={{ cursor: 'pointer' }} title="Editar perfil">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
        </div>

        <div className="mcl-cards">
          <div className="mcl-card" onClick={() => navegarA('servicios')}>
            <div className="mcl-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 3a3 3 0 0 1 6 0v2M6 3a3 3 0 0 0-3 3v1h18V6a3 3 0 0 0-3-3M3 9v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9"/><path d="M9 12h6"/></svg></div>
            <h3 className="mcl-card-title">Servicios</h3>
            <p className="mcl-card-desc">Conoce nuestros cortes y precios</p>
            <span className="mcl-card-arrow">→</span>
          </div>
          <div className="mcl-card" onClick={() => navegarA('citas')}>
            <div className="mcl-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <h3 className="mcl-card-title">Agendar Cita</h3>
            <p className="mcl-card-desc">Reserva tu próxima visita</p>
            <span className="mcl-card-arrow">→</span>
          </div>
          <div className="mcl-card" onClick={() => navegarA('misCitas')}>
            <div className="mcl-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <h3 className="mcl-card-title">Mis Citas</h3>
            <p className="mcl-card-desc">Revisa y gestiona tus reservas</p>
            <span className="mcl-card-arrow">→</span>
          </div>
          <div className="mcl-card" onClick={() => navegarA('editarCliente')}>
            <div className="mcl-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <h3 className="mcl-card-title">Editar Perfil</h3>
            <p className="mcl-card-desc">Actualiza tus datos personales</p>
            <span className="mcl-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuCliente
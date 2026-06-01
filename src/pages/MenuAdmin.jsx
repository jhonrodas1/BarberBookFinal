import './MenuAdmin.css'

function MenuAdmin({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  return (
    <div className="ma-container">
      <div className="ma-sidebar">
        <div className="ma-brand" onClick={irAlInicio}>
          <span className="bb-scissors">✂</span>
          <h1 className="ma-brand-name">BARBERBOOK</h1>
        </div>
        <div className="ma-divider" />
        <nav className="ma-nav">
          <p className="ma-nav-label">ADMINISTRACIÓN</p>
          <button className="ma-nav-btn" onClick={() => navegarA('registrarBarbero')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></span>
            Registrar Barbero
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionUsuarios')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="17" r="4"/><path d="M17 14v6M14 17h6"/></svg></span>
            Gestión Usuarios
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionBarberos')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            Gestión Barberos
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionServicios')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span>
            Gestión Servicios
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('configurarJornadas')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
            Configurar Jornadas
          </button>
        </nav>
        <div className="ma-spacer" />
        <button className="ma-logout" onClick={cerrarSesion}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      <div className="ma-main">
        <div className="ma-topbar">
          <div>
            <h2 className="ma-welcome">Panel de Administración{usuario?.nombre ? ` · ${usuario.nombre}` : ''}</h2>
            <p className="ma-date">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="ma-avatar">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
        </div>
        <div className="ma-cards">
          <div className="ma-card" onClick={() => navegarA('registrarBarbero')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></div>
            <h3 className="ma-card-title">Registrar Barbero</h3>
            <p className="ma-card-desc">Añade nuevos barberos al equipo</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionUsuarios')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="17" r="4"/><path d="M17 14v6M14 17h6"/></svg></div>
            <h3 className="ma-card-title">Gestión Usuarios</h3>
            <p className="ma-card-desc">Administra los clientes</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionBarberos')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <h3 className="ma-card-title">Gestión Barberos</h3>
            <p className="ma-card-desc">Gestiona el equipo de trabajo</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionServicios')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <h3 className="ma-card-title">Gestión Servicios</h3>
            <p className="ma-card-desc">Administra los servicios ofrecidos</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('configurarJornadas')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
            <h3 className="ma-card-title">Configurar Jornadas</h3>
            <p className="ma-card-desc">Define los horarios de cada barbero</p>
            <span className="ma-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuAdmin
import './MenuCliente.css'

function MenuAdmin({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  return (
    <div className="home-container">
      <div className="mc-wrapper">

        <div className="mc-izquierda">
          <h1 className="mc-logo" onClick={irAlInicio} style={{cursor: 'pointer'}}>BARBERBOOK</h1>
          <button className="home-btn" style={{width: '260px'}} onClick={() => navegarA('registrarBarbero')}>
            <em>Registrar Barbero</em>
          </button>
          <button className="home-btn" style={{width: '260px'}} onClick={() => navegarA('calendarioAdmin')}>
            <em>Calendario</em>
          </button>
        </div>

        <div className="mc-derecha">
          <div className="mc-avatar">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          {usuario && (
            <p style={{ color: 'white', fontFamily: 'Georgia, serif', fontSize: '14px', textAlign: 'center', marginBottom: '4px' }}>
              {usuario.nombre}
            </p>
          )}
          <button className="mc-btn-crema" onClick={() => navegarA('gestionUsuarios')}>
            <em>Gestión Usuarios</em>
          </button>
          <button className="mc-btn-crema" onClick={() => navegarA('gestionBarberos')}>
            <em>Gestión Barberos</em>
          </button>
          <button className="mc-btn-crema" onClick={cerrarSesion}>
            <em>Cerrar Sesión</em>
          </button>
        </div>

      </div>
    </div>
  )
}

export default MenuAdmin
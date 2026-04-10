import './MenuCliente.css'

function MenuCliente({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  return (
    <div className="home-container">
      <div className="mc-wrapper">

        <div className="mc-izquierda">
          <h1 className="mc-logo" onClick={irAlInicio} style={{ cursor: 'pointer' }}>
            BARBERBOOK
          </h1>

          <button className="home-btn" onClick={() => navegarA('servicios')}>
            <em>Servicios</em>
          </button>

          <button className="home-btn" onClick={() => navegarA('barberos')}>
            <em>Barberos</em>
          </button>

          <button className="home-btn" onClick={() => navegarA('citas')}>
            <em>Agendar Cita</em>
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
            <p style={{
              color: 'white',
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {usuario.nombre}
            </p>
          )}

          <button className="mc-btn-crema" onClick={() => navegarA('misCitas')}>
            <em>Mis Citas</em>
          </button>

          <button className="mc-btn-crema" onClick={cerrarSesion}>
            <em>Cerrar Sesión</em>
          </button>
        </div>

      </div>
    </div>
  )
}

export default MenuCliente
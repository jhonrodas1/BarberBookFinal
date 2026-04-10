import { useState } from 'react'
import './Home.css'

function Home({ navegarA }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="home-container">

      <header className="home-header">
        <span className="home-header-title">Inicio</span>
        <div className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {menuAbierto && (
        <div className="menu-lateral">
          <div className="menu-icono">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
              <circle cx="12" cy="8" r="3" />
              <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div className="menu-botones">
            <button className="menu-btn" onClick={() => navegarA('login')}>Iniciar Sesión</button>
            <button className="menu-btn" onClick={() => navegarA('registro')}>Registrarse</button>
          </div>
        </div>
      )}

      <main className="home-main">
        <h1 className="home-logo">BARBERBOOK</h1>
        <button className="home-btn" onClick={() => navegarA('servicios')}>Servicios Ofrecidos</button>
        <button className="home-btn" onClick={() => navegarA('barberos')}>Barberos Activos</button>
        <button className="home-btn" onClick={() => navegarA('calendarioPublico')}>Calendario</button>
      </main>

    </div>
  )
}

export default Home
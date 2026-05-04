import { useState } from 'react'
import './Home.css'

function Home({ navegarA }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-topbar-brand">
          <span className="bb-scissors">✂</span>
          <span className="home-topbar-logo">BARBERBOOK</span>
        </div>
        <button className="home-hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
          <span className="home-bar"></span>
          <span className="home-bar"></span>
          <span className="home-bar"></span>
        </button>
      </header>

      {menuAbierto && (
        <div className="home-dropdown">
          <div className="home-dropdown-inner">
            <div className="home-dropdown-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div className="home-dropdown-btns">
              <button className="home-dd-btn home-dd-btn-primary" onClick={() => navegarA('login')}>Iniciar Sesión</button>
              <button className="home-dd-btn" onClick={() => navegarA('registro')}>Registrarse</button>
            </div>
          </div>
        </div>
      )}

      <main className="home-hero">
        <div className="home-ornament">— ✦ —</div>
        <h1 className="home-hero-title">BARBERBOOK</h1>
        <div className="home-hero-divider"></div>
        <div className="home-hero-btns">
          <button className="bb-btn-gold" onClick={() => navegarA('servicios')}>Servicios Ofrecidos</button>
          <button className="bb-btn-outline" onClick={() => navegarA('barberos')}>Barberos Activos</button>
          <button className="bb-btn-outline" onClick={() => navegarA('calendarioPublico')}>Calendario</button>
        </div>
      </main>
    </div>
  )
}
export default Home

import { useEffect, useState } from 'react'
import './Barberos.css'
import './Home.css'
import { apiFetch } from '../api/client'

function Barberos({ navegarA, irAlInicio, origen = 'home' }) {
  const [barberos, setBarberos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => {
        if (data.length === 0) return []
        return apiFetch(`/appointments/services/${data[0].id}/employees`)
      })
      .then(data => setBarberos(data || []))
      .catch(() => setError('No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="bb-page">
      <header className="bb-page-header">
        <button className="bb-back" onClick={() => navegarA(origen)}>
          <span className="bb-back-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
          </span>
          Volver
        </button>
        <span className="bb-logo" onClick={irAlInicio} style={{ cursor: 'pointer' }}>BARBERBOOK</span>
        <div style={{ width: '90px' }} />
      </header>

      <main className="bb-page-main">
        <div className="bb-ornament">— ✦ —</div>
        <h2 className="bb-page-titulo">Nuestros Barberos</h2>
        <div className="bb-page-divider" />

        {cargando && <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Cargando barberos...</p>}
        {error && <p style={{ color: '#800020', textAlign: 'center' }}>{error}</p>}

        <div className="bb-lista">
          {barberos.map((b, i) => (
            <div className="bb-item" key={b.id || i}>
              <div className="bb-avatar">{b.name?.charAt(0).toUpperCase()}</div>
              <div className="bb-info">
                <p className="bb-nombre">{b.name}</p>
                <p className="bb-esp">{b.available ? 'Disponible' : 'No disponible'}</p>
              </div>
            </div>
          ))}
          {!cargando && barberos.length === 0 && !error && (
            <p style={{ color: '#555', fontStyle: 'italic' }}>No hay barberos registrados aún.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Barberos
import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function GestionBarberos({ navegarA }) {
  const [barberos, setBarberos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(async (servicios) => {
        const todosIds = new Set()
        const todosBarberos = []
        for (const s of servicios) {
          try {
            const empleados = await apiFetch(`/appointments/services/${s.id}/employees`)
            for (const e of empleados) {
              if (!todosIds.has(e.id)) {
                todosIds.add(e.id)
                todosBarberos.push(e)
              }
            }
          } catch (_) {}
        }
        setBarberos(todosBarberos)
      })
      .catch(() => setError('No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuAdmin')}>
          <span className="bb-back-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
          </span>
          Volver
        </button>
        <span className="bb-logo">BARBERBOOK</span>
        <div style={{ width: '90px' }} />
      </header>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Administración</p>
            <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 6px' }}>Gestión de Barberos</h2>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>
          <button className="bb-btn-gold" style={{ fontSize: '13px', padding: '10px 20px', whiteSpace: 'nowrap', marginTop: '4px' }}
            onClick={() => navegarA('registrarBarbero')}>
            + Registrar barbero
          </button>
        </div>

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando barberos...</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {barberos.map((b, i) => (
            <div key={b.id || i} style={{
              background: '#111',
              border: '1px solid #c9a84c28',
              borderLeft: '3px solid #c9a84c',
              borderRadius: '8px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', flexShrink: 0,
              }}>
                {b.names?.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 3px' }}>
                  {b.names} {b.lastNames}
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 2px', fontStyle: 'italic' }}>
                  {b.services?.join(', ')}
                </p>
              </div>

              <span style={{
                fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '20px',
                background: '#141414', color: '#c9a84c', border: '1px solid #c9a84c30',
              }}>
                Activo
              </span>
            </div>
          ))}
        </div>

        {!cargando && !error && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{barberos.length}</span> barbero{barberos.length !== 1 ? 's' : ''} en el equipo
          </p>
        )}
      </div>
    </div>
  )
}
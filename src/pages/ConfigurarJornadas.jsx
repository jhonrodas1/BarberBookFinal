import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function ConfigurarJornadas({ navegarA, setBarberoJornada }) {
  const [barberos, setBarberos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/admin/employees')
      .then(data => setBarberos(data))
      .catch(() => setError('No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  const seleccionar = (barbero) => {
    setBarberoJornada(barbero)
    navegarA('jornadasBarbero')
  }

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
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Administración</p>
          <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 6px' }}>Configurar Jornadas</h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          <p style={{ fontSize: '13px', color: '#666', marginTop: '12px', fontStyle: 'italic' }}>
            Selecciona un barbero para configurar sus jornadas laborales
          </p>
        </div>

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando barberos...</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}

        {!cargando && !error && barberos.length === 0 && (
          <div style={{
            background: '#111', border: '1px solid #c9a84c28', borderRadius: '8px',
            padding: '40px', textAlign: 'center'
          }}>
            <p style={{ color: '#555', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
              No hay barberos registrados en el sistema.
            </p>
            <button
              onClick={() => navegarA('registrarBarbero')}
              style={{
                marginTop: '16px', padding: '10px 20px', background: 'transparent',
                border: '1px solid #c9a84c', borderRadius: '4px', color: '#c9a84c',
                fontSize: '13px', fontFamily: 'Georgia, serif', cursor: 'pointer'
              }}>
              Registrar primer barbero
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {barberos.map((b, i) => (
            <div
              key={b.employeeId || i}
              onClick={() => seleccionar(b)}
              style={{
                background: '#111', border: '1px solid #c9a84c28',
                borderLeft: '3px solid #c9a84c', borderRadius: '8px',
                padding: '18px 22px', display: 'flex', alignItems: 'center',
                gap: '18px', cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#161616'}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}
            >
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
                <p style={{ fontSize: '12px', color: '#555', margin: 0, fontStyle: 'italic' }}>
                  Clic para configurar jornadas
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>

        {!cargando && barberos.length > 0 && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{barberos.length}</span> barbero{barberos.length !== 1 ? 's' : ''} en el equipo
          </p>
        )}
      </div>
    </div>
  )
}
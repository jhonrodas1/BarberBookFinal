import { useState, useEffect } from 'react'
import './Home.css'

const barberosIniciales = [
  { nombre: 'Carlos Rodríguez',    especialidad: 'Especialista en cortes',           correo: 'carlos@barberbook.com' },
  { nombre: 'Miguel Ángel Torres', especialidad: 'Experto en estilos modernos',       correo: 'miguel@barberbook.com' },
  { nombre: 'Diego Fernández',     especialidad: 'Maestro barbero — afeitado clásico', correo: 'diego@barberbook.com' },
]

export default function GestionBarberos({ navegarA }) {
  const [barberos, setBarberos] = useState([])
  const [confirmando, setConfirmando] = useState(null)

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    setBarberos([...barberosIniciales, ...guardados])
  }, [])

  function eliminarBarbero(index) {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    const indexEnGuardados = index - barberosIniciales.length
    if (indexEnGuardados >= 0) {
      const nuevos = guardados.filter((_, i) => i !== indexEnGuardados)
      localStorage.setItem('listaBarberos', JSON.stringify(nuevos))
      setBarberos([...barberosIniciales, ...nuevos])
    }
    setConfirmando(null)
  }

  const esBase = (i) => i < barberosIniciales.length

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
        {/* Título */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Administración</p>
            <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 6px', letterSpacing: '0.5px' }}>Gestión de Barberos</h2>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>
          <button className="bb-btn-gold" style={{ fontSize: '13px', padding: '10px 20px', whiteSpace: 'nowrap', marginTop: '4px' }}
            onClick={() => navegarA('registrarBarbero')}>
            + Registrar barbero
          </button>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {barberos.map((b, i) => (
            <div key={i} style={{
              background: '#111',
              border: `1px solid ${esBase(i) ? '#1e1e1e' : '#c9a84c28'}`,
              borderLeft: `3px solid ${esBase(i) ? '#c9a84c30' : '#c9a84c'}`,
              borderRadius: '8px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}>
              {/* Avatar */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', flexShrink: 0,
              }}>
                {b.nombre.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 3px', letterSpacing: '0.3px' }}>{b.nombre}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 2px', fontStyle: 'italic' }}>{b.especialidad}</p>
                <p style={{ fontSize: '11px', color: '#444', margin: 0, letterSpacing: '0.3px' }}>{b.correo}</p>
              </div>

              {/* Badge / botón */}
              {esBase(i) ? (
                <span style={{
                  fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: '20px',
                  background: '#141414', color: '#555', border: '1px solid #2a2a2a',
                  whiteSpace: 'nowrap',
                }}>
                  Fijo
                </span>
              ) : (
                <button onClick={() => setConfirmando(i)} style={{
                  background: 'transparent', border: '1px solid #8b000050',
                  color: '#ff6b6b', borderRadius: '4px', padding: '7px 14px',
                  cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '12px',
                  transition: 'background 0.2s', whiteSpace: 'nowrap',
                }}>
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
          <span style={{ color: '#c9a84c', fontSize: '14px' }}>{barberos.length}</span> barbero{barberos.length !== 1 ? 's' : ''} en el equipo
        </p>
      </div>

      {/* Modal confirmación eliminación */}
      {confirmando !== null && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#141414', border: '1px solid #c9a84c35',
            borderTop: '2px solid #c9a84c', borderRadius: '10px',
            padding: '34px 38px', maxWidth: '380px', width: '90%', textAlign: 'center',
          }}>
            <div style={{ fontSize: '34px', color: '#c9a84c', marginBottom: '12px' }}>⚠</div>
            <h3 style={{ fontSize: '18px', color: '#f5f0e8', margin: '0 0 14px', letterSpacing: '0.5px' }}>¿Eliminar barbero?</h3>
            <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
              <p style={{ color: '#f5f0e8', margin: '0 0 4px', fontSize: '14px' }}>{barberos[confirmando]?.nombre}</p>
              <p style={{ color: '#666', margin: 0, fontSize: '12px', fontStyle: 'italic' }}>{barberos[confirmando]?.especialidad}</p>
            </div>
            <p style={{ fontSize: '12px', color: '#555', marginBottom: '22px', fontStyle: 'italic' }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmando(null)} style={{
                flex: 1, padding: '11px', background: 'transparent', border: '1px solid #333',
                borderRadius: '4px', color: '#777', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px',
              }}>Cancelar</button>
              <button onClick={() => eliminarBarbero(confirmando)} style={{
                flex: 1, padding: '11px', background: '#8b0000', border: 'none',
                borderRadius: '4px', color: '#fff', cursor: 'pointer', fontFamily: 'Georgia, serif',
                fontSize: '13px', letterSpacing: '0.5px',
              }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

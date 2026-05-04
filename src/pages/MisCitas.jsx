import { useEffect, useState } from 'react'
import './MisCitas.css'
import './Home.css'
import { apiFetch } from '../api/client'

export default function MisCitas({ navegarA }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [cancelando, setCancelando] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    apiFetch('/appointments/my')
      .then(data => setCitas(data))
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setCargando(false))
  }, [])

  const cancelarCita = async (id) => {
    try {
      await apiFetch('/appointments/cancel', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: id, reason: motivo }),
      })
      setCitas(prev => prev.map(c => c.id === id ? { ...c, status: 'CANCELADA' } : c))
      setCancelando(null)
      setMotivo('')
      setMensaje('Cita cancelada exitosamente.')
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al cancelar la cita.')
    }
  }

  return (
    <div className="mc2-page">
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuCliente')}>
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

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Mi cuenta</p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>Mis Citas</h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '28px' }} />

        {mensaje && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '16px' }}>✓ {mensaje}</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando citas...</p>}

        {!cargando && citas.length === 0 && !error && (
          <p style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>No tienes citas registradas.</p>
        )}

        {citas.map(c => (
          <div key={c.id} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderLeft: `3px solid ${c.status === 'CANCELADA' ? '#555' : '#c9a84c'}`,
            borderRadius: '6px', padding: '16px 22px', marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {c.date} · {c.startTime}
                </p>
                <p style={{ color: '#ccc', fontSize: '13px', margin: '2px 0' }}>Barbero: {c.employeeName}</p>
                <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                  Total: ${parseFloat(c.totalPrice).toLocaleString('es-CO')}
                </p>
                <p style={{ color: c.status === 'CANCELADA' ? '#555' : '#c9a84c', fontSize: '12px', marginTop: '4px' }}>
                  {c.status}
                </p>
              </div>
              {c.status !== 'CANCELADA' && (
                <button onClick={() => { setCancelando(c.id); setMotivo('') }} style={{
                  background: 'none', border: '1px solid #333', borderRadius: '4px',
                  color: '#888', fontSize: '12px', padding: '6px 12px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif'
                }}>
                  Cancelar
                </button>
              )}
            </div>

            {cancelando === c.id && (
              <div style={{ marginTop: '14px', borderTop: '1px solid #1e1e1e', paddingTop: '14px' }}>
                <input
                  type="text"
                  placeholder="Motivo de cancelación (opcional)"
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', fontSize: '13px', fontFamily: 'Georgia, serif', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => cancelarCita(c.id)} style={{
                    flex: 1, padding: '10px', background: '#800020', border: 'none',
                    borderRadius: '4px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    Confirmar cancelación
                  </button>
                  <button onClick={() => setCancelando(null)} style={{
                    padding: '10px 16px', background: 'none', border: '1px solid #333',
                    borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
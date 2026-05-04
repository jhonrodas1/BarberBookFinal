import { useState } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function HorarioBarbero({ navegarA, usuario }) {
  const [dias, setDias] = useState([{ date: '', startTime: '', endTime: '' }])
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const agregarDia = () => {
    setDias([...dias, { date: '', startTime: '', endTime: '' }])
  }

  const cambiarDia = (index, campo, valor) => {
    const nuevos = dias.map((d, i) => i === index ? { ...d, [campo]: valor } : d)
    setDias(nuevos)
    setError('')
  }

  const eliminarDia = (index) => {
    setDias(dias.filter((_, i) => i !== index))
  }

  const guardar = async () => {
    const incompleto = dias.some(d => !d.date || !d.startTime || !d.endTime)
    if (incompleto) {
      setError('Completa todos los campos de cada día.')
      return
    }
    setCargando(true)
    try {
      await apiFetch('/employee/availability', {
        method: 'POST',
        body: JSON.stringify({ days: dias }),
      })
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2200)
    } catch (err) {
      setError(err.message || 'Error al guardar la disponibilidad.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuBarbero')}>
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Mi panel</p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>Mi Disponibilidad</h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '6px' }} />
        <p style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', marginBottom: '28px' }}>
          Agrega los días y horarios en que estarás disponible
        </p>

        {dias.map((dia, index) => (
          <div key={index} style={{
            background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px',
            padding: '20px', marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold' }}>Día {index + 1}</p>
              {dias.length > 1 && (
                <button onClick={() => eliminarDia(index)} style={{
                  background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px'
                }}>×</button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Fecha:</label>
                <input
                  type="date"
                  value={dia.date}
                  onChange={e => cambiarDia(index, 'date', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Hora inicio:</label>
                  <input
                    type="time"
                    value={dia.startTime}
                    onChange={e => cambiarDia(index, 'startTime', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Hora fin:</label>
                  <input
                    type="time"
                    value={dia.endTime}
                    onChange={e => cambiarDia(index, 'endTime', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={agregarDia} style={{
          width: '100%', padding: '12px', background: 'transparent',
          border: '1px dashed #333', borderRadius: '6px', color: '#555',
          fontSize: '13px', cursor: 'pointer', marginBottom: '16px', fontFamily: 'Georgia, serif'
        }}>
          + Agregar otro día
        </button>

        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        {guardado && (
          <p style={{ color: '#c9a84c', fontSize: '13px', fontStyle: 'italic', marginBottom: '12px' }}>
            ✓ Disponibilidad guardada con éxito
          </p>
        )}

        <button onClick={guardar} disabled={cargando} style={{
          width: '100%', padding: '14px', background: '#c9a84c',
          border: 'none', borderRadius: '6px', color: '#0a0a0a',
          fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif'
        }}>
          {cargando ? 'Guardando...' : 'Guardar disponibilidad'}
        </button>
      </div>
    </div>
  )
}
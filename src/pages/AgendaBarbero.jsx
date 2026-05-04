import { useEffect, useState } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function AgendaBarbero({ navegarA }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const hoy = new Date()
  hoy.setDate(hoy.getDate() + 1)
  const fecha = hoy.toLocaleDateString('en-CA')
  apiFetch(`/employee/agenda?vista=SEMANAL&fecha=${fecha}`)
    .then(data => setCitas(data.citas || []))
    .catch(() => setError('No se pudo cargar la agenda.'))
    .finally(() => setCargando(false))
}, [])

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

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Mi panel</p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>Mi Agenda</h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '28px' }} />

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando agenda...</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}

        {!cargando && citas.length === 0 && !error && (
          <p style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>No tienes citas esta semana.</p>
        )}

        {citas.map((c, i) => (
          <div key={i} style={{
            background: '#111', border: '1px solid #1e1e1e', borderLeft: '3px solid #c9a84c',
            borderRadius: '6px', padding: '16px 22px', marginBottom: '10px'
          }}>
            <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
              {c.fecha} · {c.hora} — {c.horaFin}
            </p>
            <p style={{ color: '#ccc', fontSize: '13px', margin: '2px 0' }}>Cliente: {c.nombreCliente}</p>
            <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic' }}>{c.servicio}</p>
            <p style={{ color: c.cancelada ? '#555' : '#c9a84c66', fontSize: '12px', marginTop: '4px' }}>{c.estado}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
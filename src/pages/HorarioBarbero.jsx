import { useState } from 'react'
import './Home.css'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const HORAS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

export default function HorarioBarbero({ navegarA, usuario }) {
  const clave = `horario_${usuario?.nombre || 'barbero'}`
  const [horario, setHorario] = useState(() => JSON.parse(localStorage.getItem(clave)) || {})
  const [guardado, setGuardado] = useState(false)

  function toggleHora(dia, hora) {
    const actual = horario[dia] || []
    const nuevo = actual.includes(hora) ? actual.filter(h => h !== hora) : [...actual, hora]
    setHorario({ ...horario, [dia]: nuevo })
    setGuardado(false)
  }

  function guardar() {
    localStorage.setItem(clave, JSON.stringify(horario))
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2200)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', fontFamily:'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuBarbero')}>
          <span className="bb-back-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg></span>
          Volver
        </button>
        <span className="bb-logo">BARBERBOOK</span>
        <div style={{width:'90px'}}/>
      </header>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px' }}>
        <p style={{ fontSize:'11px', letterSpacing:'3px', color:'#555', textTransform:'uppercase', marginBottom:'8px' }}>Mi panel</p>
        <h2 style={{ fontSize:'26px', fontStyle:'italic', color:'#f5f0e8', marginBottom:'4px' }}>Mi Horario Disponible</h2>
        <div style={{ width:'40px', height:'1px', background:'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom:'6px' }}/>
        <p style={{ fontSize:'12px', color:'#555', fontStyle:'italic', marginBottom:'28px' }}>Selecciona las horas en que estás disponible cada día</p>

        <div style={{ display:'flex', flexWrap:'wrap', gap:'14px', marginBottom:'28px' }}>
          {DIAS.map(dia => (
            <div key={dia} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'6px', padding:'16px', minWidth:'150px' }}>
              <p style={{ color:'#c9a84c', fontWeight:'bold', fontSize:'13px', letterSpacing:'0.5px', marginBottom:'10px' }}>{dia}</p>
              {HORAS.map(h => {
                const activo = (horario[dia] || []).includes(h)
                return (
                  <div key={h} onClick={() => toggleHora(dia, h)} style={{
                    padding:'6px 10px', marginBottom:'4px', borderRadius:'4px', cursor:'pointer',
                    background: activo ? '#c9a84c' : '#0f0f0f',
                    color: activo ? '#0a0a0a' : '#666',
                    border: `1px solid ${activo ? '#c9a84c' : '#252525'}`,
                    fontSize:'12px', transition:'all 0.15s', fontWeight: activo ? 'bold' : 'normal'
                  }}>{h}</div>
                )
              })}
            </div>
          ))}
        </div>

        <button className="bb-btn-gold" style={{ minWidth:'180px' }} onClick={guardar}>
          {guardado ? '✓ Guardado' : 'Guardar Horario'}
        </button>
      </div>
    </div>
  )
}

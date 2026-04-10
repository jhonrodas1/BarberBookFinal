import { useState, useEffect } from 'react'
import './MenuCliente.css'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const HORAS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

export default function HorarioBarbero({ navegarA, usuario }) {
  const clave = `horario_${usuario?.nombre || 'barbero'}`
  const [horario, setHorario] = useState(() => {
    return JSON.parse(localStorage.getItem(clave)) || {}
  })
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
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 30px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }} onClick={() => navegarA('menuBarbero')}>←</span>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#800020', letterSpacing: '3px', fontSize: '22px', margin: 0 }}>BARBERBOOK</h1>
      </div>
      <div style={{ padding: '30px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '6px' }}>Mi Horario Disponible</h2>
        <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '13px', marginBottom: '24px' }}>Selecciona las horas en que estás disponible cada día</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {DIAS.map(dia => (
            <div key={dia} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', background: '#fff', minWidth: '160px' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', marginBottom: '10px', color: '#800020' }}>{dia}</p>
              {HORAS.map(h => {
                const activo = (horario[dia] || []).includes(h)
                return (
                  <div
                    key={h}
                    onClick={() => toggleHora(dia, h)}
                    style={{
                      padding: '6px 10px', marginBottom: '4px', borderRadius: '4px', cursor: 'pointer',
                      background: activo ? '#800020' : '#f5f5f5',
                      color: activo ? 'white' : '#333',
                      fontFamily: 'Georgia, serif', fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >{h}</div>
                )
              })}
            </div>
          ))}
        </div>

        <button className="home-btn" style={{ marginTop: '30px', width: '200px' }} onClick={guardar}>
          {guardado ? '✓ Guardado' : 'Guardar Horario'}
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import './MenuCliente.css'
import './MenuAdmin.css'

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function CalendarioAdmin({ navegarA }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy.getDate())

  const citas = JSON.parse(localStorage.getItem('citas')) || []

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

  const citasDelDia = citas.filter(c => {
    const f = new Date(c.fecha + 'T12:00:00')
    return f.getDate() === diaSeleccionado && f.getMonth() === mes && f.getFullYear() === anio
  })

  const diasConCita = new Set(
    citas
      .filter(c => { const f = new Date(c.fecha + 'T12:00:00'); return f.getMonth() === mes && f.getFullYear() === anio })
      .map(c => new Date(c.fecha + 'T12:00:00').getDate())
  )

  function anteriorMes() {
    if (mes === 0) { setMes(11); setAnio(anio - 1) } else setMes(mes - 1)
  }
  function siguienteMes() {
    if (mes === 11) { setMes(0); setAnio(anio + 1) } else setMes(mes + 1)
  }

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 30px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }} onClick={() => navegarA('menuAdmin')}>←</span>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#800020', letterSpacing: '3px', fontSize: '22px', margin: 0 }}>BARBERBOOK</h1>
      </div>

      <div style={{ padding: '30px 40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Calendario */}
        <div className="calendar-card-modern" style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <button onClick={anteriorMes} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6750a4' }}>‹</button>
              <strong style={{ fontFamily: 'Georgia, serif', color: '#333' }}>{MESES[mes]} {anio}</strong>
              <button onClick={siguienteMes} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6750a4' }}>›</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {DIAS_SEMANA.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#888', fontFamily: 'Georgia, serif' }}>{d}</div>)}
            </div>
            <div className="calendar-days-grid">
              {celdas.map((d, i) => (
                <div
                  key={i}
                  className={`day-number${d === diaSeleccionado ? ' active' : ''}${d && diasConCita.has(d) && d !== diaSeleccionado ? ' has-event' : ''}`}
                  onClick={() => d && setDiaSeleccionado(d)}
                >
                  {d || ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Citas del día */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', color: '#333', marginBottom: '16px' }}>
            Citas del {diaSeleccionado} de {MESES[mes]}
          </h3>
          {citasDelDia.length === 0
            ? <p style={{ fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic' }}>Sin citas para este día</p>
            : citasDelDia.map((c, i) => (
              <div key={i} className="cita-tag">
                <strong>{c.hora}</strong> — {c.cliente || c.barbero}<br />
                <span style={{ color: '#555' }}>{c.servicio} · {c.barbero}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

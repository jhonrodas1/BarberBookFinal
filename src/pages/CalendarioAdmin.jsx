import { useState } from 'react'
import './Home.css'
import './CalendarioAdmin.css'

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function CalendarioAdmin({ navegarA }) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

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
      .filter(c => {
        const f = new Date(c.fecha + 'T12:00:00')
        return f.getMonth() === mes && f.getFullYear() === anio
      })
      .map(c => new Date(c.fecha + 'T12:00:00').getDate())
  )

  function esPasado(d) {
    const fecha = new Date(anio, mes, d)
    fecha.setHours(0, 0, 0, 0)
    return fecha < hoy
  }

  function puedeIrAtras() {
    return !(mes === hoy.getMonth() && anio === hoy.getFullYear())
  }

  function anteriorMes() {
    if (!puedeIrAtras()) return
    if (mes === 0) { setMes(11); setAnio(anio - 1) } else setMes(mes - 1)
  }
  function siguienteMes() {
    if (mes === 11) { setMes(0); setAnio(anio + 1) } else setMes(mes + 1)
  }

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  return (
    <div className="ca-page">
      {/* Header */}
      <header className="ca-header">
        <button className="bb-back" onClick={() => navegarA('menuAdmin')}>
          <span className="bb-back-icon">←</span>
          Volver
        </button>
        <div className="ca-header-brand">
          <span className="bb-scissors">✂</span>
          <span className="bb-logo">BARBERBOOK</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main className="ca-main">
        <div className="ca-title-block">
          <div className="ca-ornament">— ✦ —</div>
          <h2 className="ca-title">Calendario de Citas</h2>
          <div className="ca-divider" />
        </div>

        <div className="ca-layout">
          {/* Calendario */}
          <div className="ca-left">
            <div className="ca-cal-card">
              <div className="ca-cal-nav">
                <button
                  className={'ca-nav-arrow' + (!puedeIrAtras() ? ' disabled' : '')}
                  onClick={anteriorMes}
                  disabled={!puedeIrAtras()}
                >‹</button>
                <span className="ca-cal-month">{MESES[mes]} {anio}</span>
                <button className="ca-nav-arrow" onClick={siguienteMes}>›</button>
              </div>

              <div className="ca-cal-weekdays">
                {DIAS_SEMANA.map(d => (
                  <div key={d} className="ca-weekday">{d}</div>
                ))}
              </div>

              <div className="ca-cal-grid">
                {celdas.map((d, i) => {
                  if (!d) return <div key={i} className="ca-day-empty" />
                  const esSeleccionado = d === diaSeleccionado
                  const pasado = esPasado(d)
                  const tieneCita = diasConCita.has(d)
                  const esHoy = d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
                  return (
                    <div
                      key={i}
                      className={[
                        'ca-day',
                        esSeleccionado ? 'ca-day--selected' : '',
                        pasado ? 'ca-day--past' : '',
                        esHoy && !esSeleccionado ? 'ca-day--today' : '',
                        tieneCita && !esSeleccionado ? 'ca-day--event' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => d && setDiaSeleccionado(d)}
                    >
                      {d}
                      {tieneCita && <span className="ca-dot" />}
                    </div>
                  )
                })}
              </div>

              <div className="ca-legend">
                <div className="ca-legend-item">
                  <div className="ca-legend-dot ca-legend-dot--today" />
                  <span>Hoy</span>
                </div>
                <div className="ca-legend-item">
                  <div className="ca-legend-dot ca-legend-dot--event" />
                  <span>Con citas</span>
                </div>
                <div className="ca-legend-item">
                  <div className="ca-legend-dot ca-legend-dot--selected" />
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de citas */}
          <div className="ca-right">
            <div className="ca-panel">
              <div className="ca-panel-header">
                <div className="ca-panel-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span className="ca-panel-date">
                  {diaSeleccionado} de {MESES[mes]}, {anio}
                </span>
                <span className="ca-panel-count">
                  {citasDelDia.length} {citasDelDia.length === 1 ? 'cita' : 'citas'}
                </span>
              </div>

              <div className="ca-citas-list">
                {citasDelDia.length === 0 ? (
                  <div className="ca-empty">
                    <div className="ca-empty-icon">◇</div>
                    <p>Sin citas para este día</p>
                  </div>
                ) : (
                  citasDelDia
                    .slice()
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((c, i) => (
                      <div key={i} className="ca-cita-card">
                        <div className="ca-cita-hora">{c.hora}</div>
                        <div className="ca-cita-info">
                          <span className="ca-cita-cliente">{c.cliente || 'Cliente'}</span>
                          <span className="ca-cita-detalle">{c.servicio} · {c.barbero}</span>
                        </div>
                        <div className="ca-cita-badge">Confirmada</div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

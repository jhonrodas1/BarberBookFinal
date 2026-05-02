import { useState } from 'react'
import './Home.css'
import './CalendarioPublico.css'

const BARBEROS_BASE = [
  'Carlos Rodríguez',
  'Miguel Ángel Torres',
  'Diego Fernández',
]

const HORAS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
]

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function CalendarioPublico({ navegarA }) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(
    `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`
  )

  const citas = JSON.parse(localStorage.getItem('citas')) || []
  const barberosExtra = (JSON.parse(localStorage.getItem('listaBarberos')) || []).map(b => b.nombre)
  const barberos = [...BARBEROS_BASE, ...barberosExtra]

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

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

  function seleccionarDia(d) {
    if (esPasado(d)) return
    const fecha = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    setDiaSeleccionado(fecha)
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

  const diaNum = diaSeleccionado ? parseInt(diaSeleccionado.split('-')[2]) : null
  const mesSel = diaSeleccionado ? parseInt(diaSeleccionado.split('-')[1]) - 1 : mes
  const anioSel = diaSeleccionado ? parseInt(diaSeleccionado.split('-')[0]) : anio
  const diaLabel = diaSeleccionado
    ? `${diaNum} de ${MESES[mesSel]}, ${anioSel}`
    : 'Selecciona un día'

  function horasOcupadasDe(nombreBarbero) {
    return citas
      .filter(c => c.barbero === nombreBarbero && c.fecha === diaSeleccionado)
      .map(c => c.hora)
  }

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="bb-back" onClick={() => navegarA('home')}>
          <span className="bb-back-icon">←</span>
          Volver
        </button>
        <div className="cp-header-brand">
          <span className="bb-scissors">✂</span>
          <span className="bb-logo">BARBERBOOK</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main className="cp-main">
        <div className="cp-title-block">
          <div className="cp-ornament">— ✦ —</div>
          <h2 className="cp-title">Disponibilidad</h2>
          <div className="cp-divider" />
        </div>

        <div className="cp-layout">
          <div className="cp-left">
            <div className="cp-cal-card">
              <div className="cp-cal-nav">
                <button
                  className={'cp-nav-arrow' + (!puedeIrAtras() ? ' disabled' : '')}
                  onClick={anteriorMes}
                  disabled={!puedeIrAtras()}
                >‹</button>
                <span className="cp-cal-month">{MESES[mes]} {anio}</span>
                <button className="cp-nav-arrow" onClick={siguienteMes}>›</button>
              </div>

              <div className="cp-cal-weekdays">
                {DIAS_SEMANA.map(d => (
                  <div key={d} className="cp-weekday">{d}</div>
                ))}
              </div>

              <div className="cp-cal-grid">
                {celdas.map((d, i) => {
                  if (!d) return <div key={i} className="cp-day-empty" />
                  const fechaCelda = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                  const esSeleccionado = fechaCelda === diaSeleccionado
                  const pasado = esPasado(d)
                  const tieneCita = diasConCita.has(d)
                  const esHoy = d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
                  return (
                    <div
                      key={i}
                      className={[
                        'cp-day',
                        esSeleccionado ? 'cp-day--selected' : '',
                        pasado ? 'cp-day--past' : '',
                        esHoy && !esSeleccionado ? 'cp-day--today' : '',
                        tieneCita && !pasado && !esSeleccionado ? 'cp-day--event' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => seleccionarDia(d)}
                    >
                      {d}
                      {tieneCita && !pasado && <span className="cp-dot" />}
                    </div>
                  )
                })}
              </div>

              <div className="cp-legend">
                <div className="cp-legend-item">
                  <div className="cp-legend-dot cp-legend-dot--today" />
                  <span>Hoy</span>
                </div>
                <div className="cp-legend-item">
                  <div className="cp-legend-dot cp-legend-dot--event" />
                  <span>Con citas</span>
                </div>
                <div className="cp-legend-item">
                  <div className="cp-legend-dot cp-legend-dot--selected" />
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cp-right">
            <div className="cp-table-header">
              <span className="cp-table-date-label">{diaLabel}</span>
            </div>

            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th className="cp-th cp-th-barbero">Barbero</th>
                    {HORAS.map(h => (
                      <th key={h} className="cp-th cp-th-hora">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {barberos.map((barbero, i) => {
                    const ocupadas = horasOcupadasDe(barbero)
                    return (
                      <tr key={i} className={'cp-tr' + (i % 2 === 0 ? '' : ' cp-tr--alt')}>
                        <td className="cp-td-nombre">
                          <div className="cp-avatar-row">
                            <div className="cp-avatar">{barbero.charAt(0)}</div>
                            <span className="cp-barbero-name">{barbero}</span>
                          </div>
                        </td>
                        {HORAS.map(h => {
                          const ocupada = ocupadas.includes(h)
                          return (
                            <td key={h} className={'cp-td-slot' + (ocupada ? ' cp-td-slot--busy' : ' cp-td-slot--free')}>
                              {ocupada
                                ? <span className="cp-slot-icon cp-slot-icon--busy">✕</span>
                                : <span className="cp-slot-icon cp-slot-icon--free">✓</span>
                              }
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="cp-table-legend">
              <div className="cp-legend-item">
                <div className="cp-tleg-box cp-tleg-box--free" />
                <span>Disponible</span>
              </div>
              <div className="cp-legend-item">
                <div className="cp-tleg-box cp-tleg-box--busy" />
                <span>Ocupado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

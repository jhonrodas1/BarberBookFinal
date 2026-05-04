import { useState, useEffect } from 'react'
import './Home.css'
import './CalendarioPublico.css'
import { apiFetch } from '../api/client'

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
  const [barberos, setBarberos] = useState([])
  const [slots, setSlots] = useState({}) // { barberoId: [slots] }
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(false)

  // Cargar barberos al montar
  useEffect(() => {
    apiFetch('/appointments/services')
      .then(async (svcs) => {
        setServicios(svcs)
        const todosIds = new Set()
        const todosBarberos = []
        for (const s of svcs) {
          try {
            const empleados = await apiFetch(`/appointments/services/${s.id}/employees`)
            for (const e of empleados) {
              if (!todosIds.has(e.id)) {
                todosIds.add(e.id)
                todosBarberos.push(e)
              }
            }
          } catch (_) {}
        }
        setBarberos(todosBarberos)
      })
      .catch(() => {})
  }, [])

  // Cargar slots cuando cambia la fecha o los barberos
  useEffect(() => {
    if (!diaSeleccionado || barberos.length === 0 || servicios.length === 0) return
    setCargando(true)
    const cargarSlots = async () => {
      const nuevosSlots = {}
      for (const b of barberos) {
        try {
          const params = new URLSearchParams()
          params.append('date', diaSeleccionado)
          params.append('serviceIds', servicios[0].id)
          const data = await apiFetch(`/appointments/employees/${b.id}/slots?${params}`)
          nuevosSlots[b.id] = data
        } catch (_) {
          nuevosSlots[b.id] = []
        }
      }
      setSlots(nuevosSlots)
      setCargando(false)
    }
    cargarSlots()
  }, [diaSeleccionado, barberos])

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

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
  const diaLabel = diaSeleccionado ? `${diaNum} de ${MESES[mesSel]}, ${anioSel}` : 'Selecciona un día'

  // Generar horas únicas de todos los slots disponibles
  const todasLasHoras = [...new Set(
    Object.values(slots).flat().map(s => s.startTime)
  )].sort()

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
                  const esHoy = d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
                  return (
                    <div
                      key={i}
                      className={[
                        'cp-day',
                        esSeleccionado ? 'cp-day--selected' : '',
                        pasado ? 'cp-day--past' : '',
                        esHoy && !esSeleccionado ? 'cp-day--today' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => seleccionarDia(d)}
                    >
                      {d}
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

            {cargando && <p style={{ color: '#888', fontStyle: 'italic', padding: '20px' }}>Cargando disponibilidad...</p>}

            {!cargando && barberos.length === 0 && (
              <p style={{ color: '#555', fontStyle: 'italic', padding: '20px' }}>No hay barberos disponibles.</p>
            )}

            {!cargando && barberos.length > 0 && (
              <div className="cp-table-wrap">
                <table className="cp-table">
                  <thead>
                    <tr>
                      <th className="cp-th cp-th-barbero">Barbero</th>
                      {todasLasHoras.length > 0
                        ? todasLasHoras.map(h => (
                            <th key={h} className="cp-th cp-th-hora">{h}</th>
                          ))
                        : <th className="cp-th cp-th-hora">Sin horarios</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {barberos.map((b, i) => {
                      const horasDisponibles = (slots[b.id] || []).map(s => s.startTime)
                      return (
                        <tr key={b.id} className={'cp-tr' + (i % 2 === 0 ? '' : ' cp-tr--alt')}>
                          <td className="cp-td-nombre">
                            <div className="cp-avatar-row">
                              <div className="cp-avatar">{b.names?.charAt(0)}</div>
                              <span className="cp-barbero-name">{b.names} {b.lastNames}</span>
                            </div>
                          </td>
                          {todasLasHoras.length > 0
                            ? todasLasHoras.map(h => {
                                const disponible = horasDisponibles.includes(h)
                                return (
                                  <td key={h} className={'cp-td-slot' + (disponible ? ' cp-td-slot--free' : ' cp-td-slot--busy')}>
                                    {disponible
                                      ? <span className="cp-slot-icon cp-slot-icon--free">✓</span>
                                      : <span className="cp-slot-icon cp-slot-icon--busy">✕</span>
                                    }
                                  </td>
                                )
                              })
                            : <td className="cp-td-slot"><span style={{ color: '#555', fontSize: '12px' }}>—</span></td>
                          }
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

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
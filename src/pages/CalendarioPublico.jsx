import { useState } from 'react'
import './Servicios.css'
import './MenuAdmin.css'

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
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function CalendarioPublico({ navegarA }) {
  const hoy = new Date()
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

  // Días del mes que tienen al menos una cita
  const diasConCita = new Set(
    citas
      .filter(c => {
        const f = new Date(c.fecha + 'T12:00:00')
        return f.getMonth() === mes && f.getFullYear() === anio
      })
      .map(c => new Date(c.fecha + 'T12:00:00').getDate())
  )

  function seleccionarDia(d) {
    const fecha = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    setDiaSeleccionado(fecha)
  }

  function anteriorMes() {
    if (mes === 0) { setMes(11); setAnio(anio - 1) } else setMes(mes - 1)
  }
  function siguienteMes() {
    if (mes === 11) { setMes(0); setAnio(anio + 1) } else setMes(mes + 1)
  }

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  const diaNum = diaSeleccionado ? parseInt(diaSeleccionado.split('-')[2]) : null
  const diaLabel = diaSeleccionado
    ? `${diaNum} de ${MESES[mes]}, ${anio}`
    : 'Selecciona un día'

  // Para cada barbero: qué horas tiene ocupadas ese día
  function horasOcupadasDe(nombreBarbero) {
    return citas
      .filter(c => c.barbero === nombreBarbero && c.fecha === diaSeleccionado)
      .map(c => c.hora)
  }

  return (
    <div className="home-container">
      {/* Header */}
      <div className="sv-header">
        <span className="sv-flecha" onClick={() => navegarA('home')}>←</span>
        <h1 className="sv-logo" onClick={() => navegarA('home')} style={{ cursor: 'pointer' }}>BARBERBOOK</h1>
      </div>

      <main style={{ padding: '30px 40px', fontFamily: 'Georgia, serif' }}>
        <div className="sv-titulo-box" style={{ marginBottom: '28px', alignSelf: 'center', display: 'inline-block' }}>
          <h2 className="sv-titulo">Calendario de Disponibilidad</h2>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Mini calendario */}
          <div className="calendar-card-modern" style={{ minWidth: '280px', maxWidth: '320px' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <button onClick={anteriorMes} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#800020' }}>‹</button>
                <strong style={{ color: '#333', fontSize: '15px' }}>{MESES[mes]} {anio}</strong>
                <button onClick={siguienteMes} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#800020' }}>›</button>
              </div>
              {/* Cabecera días */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
                {DIAS_SEMANA.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#888' }}>{d}</div>
                ))}
              </div>
              {/* Días */}
              <div className="calendar-days-grid">
                {celdas.map((d, i) => {
                  if (!d) return <div key={i} />
                  const fechaCelda = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                  const esSeleccionado = fechaCelda === diaSeleccionado
                  const tieneCita = diasConCita.has(d)
                  return (
                    <div
                      key={i}
                      className={`day-number${esSeleccionado ? ' active' : ''}${tieneCita && !esSeleccionado ? ' has-event' : ''}`}
                      onClick={() => seleccionarDia(d)}
                    >
                      {d}
                    </div>
                  )
                })}
              </div>
              {/* Leyenda */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid #6750a4' }}></div>
                  <span style={{ fontSize: '11px', color: '#666' }}>Con citas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6750a4' }}></div>
                  <span style={{ fontSize: '11px', color: '#666' }}>Seleccionado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de barberos × horas */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '16px', color: '#333', fontStyle: 'italic', fontSize: '16px' }}>
              {diaLabel}
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '500px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Barbero</th>
                    {HORAS.map(h => (
                      <th key={h} style={{ ...thStyle, fontSize: '11px', padding: '8px 4px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {barberos.map((barbero, i) => {
                    const ocupadas = horasOcupadasDe(barbero)
                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fdf8f8' }}>
                        <td style={tdNombreStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={avatarStyle}>{barbero.charAt(0)}</div>
                            <span style={{ fontSize: '13px' }}>{barbero}</span>
                          </div>
                        </td>
                        {HORAS.map(h => {
                          const ocupada = ocupadas.includes(h)
                          return (
                            <td key={h} style={{ ...tdStyle, background: ocupada ? '#800020' : '#e8f5e9', borderRadius: '4px' }}>
                              {ocupada
                                ? <span style={{ color: 'white', fontSize: '16px' }}>✕</span>
                                : <span style={{ color: '#2e7d32', fontSize: '16px' }}>✓</span>
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

            {/* Leyenda tabla */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#e8f5e9', border: '1px solid #4caf50' }}></div>
                <span style={{ fontSize: '12px', color: '#555' }}>Disponible</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#800020' }}></div>
                <span style={{ fontSize: '12px', color: '#555' }}>Ocupado</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

const thStyle = {
  padding: '10px 8px',
  background: '#800020',
  color: 'white',
  fontFamily: 'Georgia, serif',
  fontSize: '12px',
  fontWeight: 'normal',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '10px 6px',
  textAlign: 'center',
  margin: '2px',
}

const tdNombreStyle = {
  padding: '10px 12px',
  fontFamily: 'Georgia, serif',
  borderBottom: '1px solid #eee',
  whiteSpace: 'nowrap',
}

const avatarStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: '#f5e6d3',
  border: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#800020',
  flexShrink: 0,
}

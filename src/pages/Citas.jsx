import { useState, useEffect } from 'react'
import './Home.css'

const BARBEROS_BASE = ['Carlos Rodríguez', 'Miguel Ángel Torres', 'Diego Fernández']
const servicios = [
  { nombre: 'Corte de cabello', precio: '$15.000' },
  { nombre: 'Corte de Barba',   precio: '$12.000' },
  { nombre: 'Afeitado',         precio: '$15.000' },
  { nombre: 'Corte y Barba',    precio: '$20.000' },
]
const HORAS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

const inp = {
  padding: '11px 14px', background: '#0d0d0d', border: '1px solid #252525',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif',
  color: '#f5f0e8', outline: 'none', width: '100%',
}

export default function Citas({ navegarA, origen = 'menuCliente', usuario }) {
  const [forma, setForma] = useState({ nombre: usuario?.nombre || '', barbero: '', servicio: '', fecha: '', hora: '' })
  const [enviado, setEnviado] = useState(false)
  const [barberos, setBarberos] = useState(BARBEROS_BASE)
  const [horasOcupadas, setHorasOcupadas] = useState([])

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    setBarberos([...BARBEROS_BASE, ...guardados.map(b => b.nombre)])
  }, [])

  useEffect(() => {
    if (!forma.barbero || !forma.fecha) { setHorasOcupadas([]); return }
    const citas = JSON.parse(localStorage.getItem('citas')) || []
    setHorasOcupadas(citas.filter(c => c.barbero === forma.barbero && c.fecha === forma.fecha).map(c => c.hora))
  }, [forma.barbero, forma.fecha])

  function manejarCambio(e) {
    const nuevo = { ...forma, [e.target.name]: e.target.value }
    if (e.target.name === 'barbero' || e.target.name === 'fecha') nuevo.hora = ''
    setForma(nuevo)
  }

  function elegirHora(hora) {
    if (horasOcupadas.includes(hora)) return
    setForma({ ...forma, hora })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    if (!forma.nombre || !forma.barbero || !forma.servicio || !forma.fecha || !forma.hora) return
    const nueva = { cliente: forma.nombre, barbero: forma.barbero, servicio: forma.servicio, fecha: forma.fecha, hora: forma.hora }
    const guardadas = JSON.parse(localStorage.getItem('citas')) || []
    localStorage.setItem('citas', JSON.stringify([...guardadas, nueva]))
    setEnviado(true)
    setTimeout(() => navegarA(origen), 2200)
  }

  const mostrarHoras = forma.barbero && forma.fecha
  const servicioObj = servicios.find(s => s.nombre === forma.servicio)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA(origen)}>
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

      <div style={{ display: 'flex', justifyContent: 'center', padding: '44px 24px' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>

          {/* Título */}
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Mi cuenta</p>
          <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px', letterSpacing: '0.5px' }}>Reservar Cita</h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '32px' }} />

          {/* Card */}
          <div style={{ background: '#111', border: '1px solid #c9a84c28', borderTop: '2px solid #c9a84c', borderRadius: '8px', padding: '34px 36px' }}>

            {!enviado ? (
              <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Nombre */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>Nombre completo</label>
                  <input style={inp} type="text" name="nombre" placeholder="Tu nombre" value={forma.nombre} onChange={manejarCambio}
                    onFocus={e => e.target.style.borderColor='#c9a84c55'} onBlur={e => e.target.style.borderColor='#252525'} required />
                </div>

                {/* Barbero */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>Barbero</label>
                  <select style={inp} name="barbero" value={forma.barbero} onChange={manejarCambio}
                    onFocus={e => e.target.style.borderColor='#c9a84c55'} onBlur={e => e.target.style.borderColor='#252525'}>
                    <option value="">— Selecciona un barbero —</option>
                    {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Servicio */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>Servicio</label>
                  <select style={inp} name="servicio" value={forma.servicio} onChange={manejarCambio}
                    onFocus={e => e.target.style.borderColor='#c9a84c55'} onBlur={e => e.target.style.borderColor='#252525'}>
                    <option value="">— Selecciona un servicio —</option>
                    {servicios.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre} — {s.precio}</option>)}
                  </select>
                </div>

                {/* Fecha */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>Fecha</label>
                  <input style={{ ...inp, cursor: 'pointer' }} type="date" name="fecha" value={forma.fecha} onChange={manejarCambio}
                    min={new Date().toISOString().split('T')[0]}
                    onClick={e => e.target.showPicker && e.target.showPicker()}
                    onFocus={e => { e.target.style.borderColor='#c9a84c55'; e.target.showPicker && e.target.showPicker() }}
                    onBlur={e => e.target.style.borderColor='#252525'} />
                </div>

                {/* Horas */}
                {mostrarHoras ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>Hora disponible</label>
                      {horasOcupadas.length > 0 && (
                        <span style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>{horasOcupadas.length} ocupada{horasOcupadas.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
                      {HORAS.map(h => {
                        const ocupada = horasOcupadas.includes(h)
                        const seleccionada = forma.hora === h
                        return (
                          <div key={h} onClick={() => elegirHora(h)} style={{
                            padding: '9px 4px', borderRadius: '4px', textAlign: 'center',
                            fontSize: '12px', cursor: ocupada ? 'not-allowed' : 'pointer',
                            fontFamily: 'Georgia, serif', transition: 'all 0.15s',
                            background: seleccionada ? '#c9a84c' : ocupada ? '#0f0f0f' : '#0d2a1a',
                            border: `1px solid ${seleccionada ? '#c9a84c' : ocupada ? '#1e1e1e' : '#2d6a4f'}`,
                            color: seleccionada ? '#0a0a0a' : ocupada ? '#2a2a2a' : '#5cb85c',
                            fontWeight: seleccionada ? 'bold' : 'normal',
                          }}>
                            {h}
                          </div>
                        )
                      })}
                    </div>
                    {forma.hora && (
                      <p style={{ fontSize: '12px', color: '#c9a84c', fontStyle: 'italic' }}>
                        ✓ Seleccionada: <strong>{forma.hora}</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ background: '#0d0d0d', border: '1px dashed #252525', borderRadius: '6px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#444', fontStyle: 'italic' }}>
                      Selecciona un barbero y una fecha para ver los horarios disponibles
                    </p>
                  </div>
                )}

                <button type="submit" style={{
                  marginTop: '4px', padding: '13px', background: '#c9a84c', color: '#0a0a0a',
                  border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold',
                  letterSpacing: '1.5px', fontFamily: 'Georgia, serif', cursor: 'pointer', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.target.style.background = '#d4b55c'}
                  onMouseLeave={e => e.target.style.background = '#c9a84c'}
                >
                  Confirmar Cita
                </button>
              </form>

            ) : (
              /* Confirmación */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: '40px', color: '#c9a84c', marginBottom: '14px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '18px', letterSpacing: '0.5px' }}>¡Cita confirmada!</h3>
                <div style={{ background: '#141414', borderRadius: '6px', padding: '16px 20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[['Nombre', forma.nombre], ['Barbero', forma.barbero], ['Servicio', forma.servicio + (servicioObj ? ` — ${servicioObj.precio}` : '')], ['Fecha', forma.fecha], ['Hora', forma.hora]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#555', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', alignSelf: 'center' }}>{k}</span>
                      <span style={{ color: '#f5f0e8' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import './MisCitas.css'
import './Home.css'
import { apiFetch } from '../api/client'

const inp = {
  padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif',
  color: '#f5f0e8', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function MisCitas({ navegarA }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // cancelar
  const [cancelando, setCancelando] = useState(null)
  const [motivo, setMotivo] = useState('')

  // modificar
  const [modificando, setModificando] = useState(null)
  const [fechasDisponibles, setFechasDisponibles] = useState([])
  const [slots, setSlots] = useState([])
  const [fechaNueva, setFechaNueva] = useState('')
  const [slotNuevo, setSlotNuevo] = useState(null)
  const [cargandoFechas, setCargandoFechas] = useState(false)
  const [cargandoSlots, setCargandoSlots] = useState(false)
  const [guardandoMod, setGuardandoMod] = useState(false)
  const [errMod, setErrMod] = useState('')

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = () => {
    setCargando(true)
    apiFetch('/appointments/my')
      .then(data => setCitas(data))
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setCargando(false))
  }

  const mostrarMensaje = (texto, esError = false) => {
    if (esError) setError(texto)
    else setMensaje(texto)
    setTimeout(() => { setError(''); setMensaje('') }, 3500)
  }

  // cancelar
  const cancelarCita = async (id) => {
    try {
      await apiFetch('/appointments/cancel', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: id, reason: motivo }),
      })
      setCitas(prev => prev.map(c => c.id === id ? { ...c, status: 'CANCELADA' } : c))
      setCancelando(null)
      setMotivo('')
      mostrarMensaje('Cita cancelada exitosamente.')
    } catch (err) {
      mostrarMensaje(err.message || 'Error al cancelar la cita.', true)
    }
  }

  // modificar: abrir y cargar fechas disponibles
  const abrirModificar = async (cita) => {
    setModificando(cita)
    setFechaNueva('')
    setSlotNuevo(null)
    setSlots([])
    setErrMod('')
    setCargandoFechas(true)
    try {
      const data = await apiFetch(`/appointments/employees/${cita.employeeId}/dates`)
      setFechasDisponibles(data.availableDates || [])
    } catch (_) {
      setFechasDisponibles([])
    } finally {
      setCargandoFechas(false)
    }
  }

  const cerrarModificar = () => {
    setModificando(null)
    setFechaNueva('')
    setSlotNuevo(null)
    setSlots([])
    setErrMod('')
  }

  // cargar slots al elegir fecha
  const elegirFecha = async (fecha) => {
    setFechaNueva(fecha)
    setSlotNuevo(null)
    setSlots([])
    if (!fecha) return
    setCargandoSlots(true)
    try {
      const serviceIds = modificando.serviceIds || []
      const params = new URLSearchParams()
      params.append('date', fecha)
      serviceIds.forEach(id => params.append('serviceIds', id))
      const data = await apiFetch(`/appointments/employees/${modificando.employeeId}/slots?${params}`)
      setSlots(data)
    } catch (_) {
      setSlots([])
    } finally {
      setCargandoSlots(false)
    }
  }

  const confirmarModificacion = async () => {
    if (!fechaNueva || !slotNuevo) {
      setErrMod('Selecciona una fecha y una hora.')
      return
    }
    setGuardandoMod(true)
    setErrMod('')
    try {
      // El backend no expone un endpoint PUT de modificación por ahora,
      // así que cancelamos la cita vieja y creamos una nueva
      await apiFetch('/appointments/cancel', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: modificando.id, reason: 'Modificación de cita' }),
      })
      await apiFetch('/appointments/confirm', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: modificando.employeeId,
          date: fechaNueva,
          startTime: slotNuevo.startTime,
          serviceIds: modificando.serviceIds || [],
        }),
      })
      mostrarMensaje('Cita modificada exitosamente.')
      cerrarModificar()
      cargarCitas()
    } catch (err) {
      setErrMod(err.message || 'Error al modificar la cita.')
    } finally {
      setGuardandoMod(false)
    }
  }

  const citasActivas = citas.filter(c => c.status !== 'CANCELADA')
  const citasCanceladas = citas.filter(c => c.status === 'CANCELADA')

  return (
    <div className="mc2-page">
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuCliente')}>
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
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Mi cuenta</p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>Mis Citas</h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '28px' }} />

        {mensaje && (
          <div style={{ background: '#0d1a0d', border: '1px solid #2d6a4f', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#5cb85c' }}>✓</span>
            <p style={{ color: '#5cb85c', fontSize: '13px', margin: 0 }}>{mensaje}</p>
          </div>
        )}
        {error && (
          <div style={{ background: '#1a0d0d', border: '1px solid #5a1010', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ color: '#e07070', fontSize: '13px', margin: 0 }}>{error}</p>
          </div>
        )}

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando citas...</p>}

        {!cargando && citas.length === 0 && !error && (
          <p style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>No tienes citas registradas.</p>
        )}

        {citasActivas.length > 0 && (
          <>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>
              Activas
            </p>
            {citasActivas.map(c => (
              <div key={c.id} style={{
                background: '#111', border: '1px solid #1e1e1e', borderLeft: '3px solid #c9a84c',
                borderRadius: '6px', padding: '16px 22px', marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {c.date} · {c.startTime}
                    </p>
                    <p style={{ color: '#ccc', fontSize: '13px', margin: '2px 0' }}>Barbero: {c.employeeName}</p>
                    <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                      Total: ${parseFloat(c.totalPrice).toLocaleString('es-CO')}
                    </p>
                    <p style={{ color: '#c9a84c66', fontSize: '11px', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {c.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <button onClick={() => abrirModificar(c)} style={{
                      background: 'none', border: '1px solid #c9a84c55', borderRadius: '4px',
                      color: '#c9a84c', fontSize: '12px', padding: '6px 12px', cursor: 'pointer',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Modificar
                    </button>
                    <button onClick={() => { setCancelando(c.id); setMotivo('') }} style={{
                      background: 'none', border: '1px solid #333', borderRadius: '4px',
                      color: '#888', fontSize: '12px', padding: '6px 12px', cursor: 'pointer',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>

                {cancelando === c.id && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #1e1e1e', paddingTop: '14px' }}>
                    <input
                      type="text"
                      placeholder="Motivo de cancelación (opcional)"
                      value={motivo}
                      onChange={e => setMotivo(e.target.value)}
                      style={{ ...inp, marginBottom: '10px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => cancelarCita(c.id)} style={{
                        flex: 1, padding: '10px', background: '#800020', border: 'none',
                        borderRadius: '4px', color: '#fff', fontSize: '13px', cursor: 'pointer',
                        fontFamily: 'Georgia, serif'
                      }}>
                        Confirmar cancelación
                      </button>
                      <button onClick={() => setCancelando(null)} style={{
                        padding: '10px 16px', background: 'none', border: '1px solid #333',
                        borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer',
                        fontFamily: 'Georgia, serif'
                      }}>
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {citasCanceladas.length > 0 && (
          <>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              Canceladas
            </p>
            {citasCanceladas.map(c => (
              <div key={c.id} style={{
                background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #333',
                borderRadius: '6px', padding: '16px 22px', marginBottom: '10px', opacity: 0.6
              }}>
                <p style={{ color: '#666', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {c.date} · {c.startTime}
                </p>
                <p style={{ color: '#555', fontSize: '13px', margin: '2px 0' }}>Barbero: {c.employeeName}</p>
                <p style={{ color: '#444', fontSize: '11px', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {c.status}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal modificar cita */}
      {modificando && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
            borderRadius: '10px', padding: '32px', maxWidth: '440px', width: '100%',
            fontFamily: 'Georgia, serif', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', margin: 0 }}>
                Modificar Cita
              </h3>
              <button onClick={cerrarModificar} style={{
                background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1
              }}>×</button>
            </div>
            <p style={{ color: '#555', fontSize: '12px', marginBottom: '20px', fontStyle: 'italic' }}>
              Cita actual: {modificando.date} · {modificando.startTime} con {modificando.employeeName}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  Nueva fecha disponible
                </label>
                {cargandoFechas ? (
                  <p style={{ color: '#888', fontSize: '13px', fontStyle: 'italic' }}>Cargando fechas...</p>
                ) : (
                  <select value={fechaNueva} onChange={e => elegirFecha(e.target.value)} style={inp}>
                    <option value="">Selecciona una fecha</option>
                    {fechasDisponibles.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                )}
              </div>

              {fechaNueva && (
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Nueva hora disponible
                  </label>
                  {cargandoSlots ? (
                    <p style={{ color: '#888', fontSize: '13px', fontStyle: 'italic' }}>Cargando horarios...</p>
                  ) : slots.length === 0 ? (
                    <p style={{ color: '#555', fontSize: '13px', fontStyle: 'italic' }}>No hay horarios disponibles para esa fecha.</p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {slots.map((slot, i) => (
                        <div key={i} onClick={() => setSlotNuevo(slot)} style={{
                          padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                          background: slotNuevo?.startTime === slot.startTime ? '#c9a84c' : '#0d0d0d',
                          color: slotNuevo?.startTime === slot.startTime ? '#0a0a0a' : '#f5f0e8',
                          border: `1px solid ${slotNuevo?.startTime === slot.startTime ? '#c9a84c' : '#252525'}`
                        }}>
                          {slot.startTime}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {errMod && <p style={{ color: '#e07070', fontSize: '13px' }}>{errMod}</p>}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={cerrarModificar} style={{
                flex: 1, padding: '12px', background: 'none', border: '1px solid #333',
                borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}>
                Cancelar
              </button>
              <button onClick={confirmarModificacion} disabled={guardandoMod || !fechaNueva || !slotNuevo} style={{
                flex: 1, padding: '12px', background: '#c9a84c', border: 'none',
                borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'Georgia, serif', fontWeight: 'bold',
                opacity: guardandoMod || !fechaNueva || !slotNuevo ? 0.5 : 1
              }}>
                {guardandoMod ? 'Guardando...' : 'Confirmar cambio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
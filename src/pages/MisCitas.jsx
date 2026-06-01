import { useEffect, useState } from 'react'
import './MisCitas.css'
import './Home.css'
import { apiFetch } from '../api/client'

const PASOS = { NINGUNO: 'NINGUNO', FORM: 'FORM', CONFIRMACION: 'CONFIRMACION' }

export default function MisCitas({ navegarA }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [cancelando, setCancelando] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Modificar
  const [modificando, setModificando] = useState(null) // id de la cita
  const [paso, setPaso] = useState(PASOS.NINGUNO)
  const [servicios, setServicios] = useState([])
  const [barberos, setBarberos] = useState([])
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ serviceIds: [], employeeId: '', date: '', startTime: '' })
  const [cargandoSlots, setCargandoSlots] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorMod, setErrorMod] = useState('')

  useEffect(() => {
    apiFetch('/appointments/my')
      .then(data => setCitas(data))
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setCargando(false))
  }, [])

  // Cargar servicios al abrir el formulario
 const abrirModificar = async (cita) => {
  setModificando(cita.id)
  setErrorMod('')
  setSlots([])
  setBarberos([])
  setForm({
    serviceIds: cita.serviceIds || [],
    employeeId: cita.employeeId || '',
    date: cita.date || '',
    startTime: cita.startTime?.substring(0, 5) || '',
  })
  setPaso(PASOS.FORM)
  try {
    const data = await apiFetch('/appointments/services')
    setServicios(data)
  } catch {
    setErrorMod('No se pudieron cargar los servicios.')
    return
  }
  if (cita.serviceIds?.length > 0) {
    try {
      const barberoData = await apiFetch(`/appointments/services/${cita.serviceIds[0]}/employees`)
      setBarberos(barberoData)
    } catch {
      setErrorMod('El servicio actual no tiene disponibilidad. Selecciona otro servicio.')
    }
  }
}

const cambiarServicio = async (serviceId) => {
  const ids = [parseInt(serviceId)]
  setForm(f => ({ ...f, serviceIds: ids, employeeId: '', date: '', startTime: '' }))
  setSlots([])
  setBarberos([])
  setErrorMod('')
  try {
    const data = await apiFetch(`/appointments/services/${serviceId}/employees`)
    setBarberos(data)
  } catch {
    setErrorMod('Este servicio no tiene barberos disponibles en los próximos días. Selecciona otro servicio.')
  }
}

  // Cuando cambia el barbero, recargar fechas disponibles y limpiar slot
  const cambiarBarbero = async (employeeId) => {
    setForm(f => ({ ...f, employeeId, date: '', startTime: '' }))
    setSlots([])
  }

  // Cuando cambia la fecha, cargar slots
  const cambiarFecha = async (date) => {
    setForm(f => ({ ...f, date, startTime: '' }))
    if (!form.employeeId || !date || form.serviceIds.length === 0) return
    setCargandoSlots(true)
    setSlots([])
    try {
      const params = new URLSearchParams({
        date,
        serviceIds: form.serviceIds.join(','),
      })
      const data = await apiFetch(`/appointments/employees/${form.employeeId}/slots?${params}`)
      setSlots(data)
    } catch {
      setErrorMod('No se pudieron cargar los horarios.')
    } finally {
      setCargandoSlots(false)
    }
  }

  const cancelarModificacion = () => {
    setModificando(null)
    setPaso(PASOS.NINGUNO)
    setErrorMod('')
    setSlots([])
    setBarberos([])
  }

  const irAConfirmar = () => {
    if (!form.serviceIds.length || !form.employeeId || !form.date || !form.startTime) {
      setErrorMod('Completa todos los campos para modificar la cita.')
      return
    }
    setErrorMod('')
    setPaso(PASOS.CONFIRMACION)
  }

  const confirmarModificacion = async () => {
    setGuardando(true)
    setErrorMod('')
    try {
      const body = {
        serviceIds: form.serviceIds,
        employeeId: parseInt(form.employeeId),
        date: form.date,
        startTime: form.startTime + ':00',
      }
      const res = await apiFetch(`/appointments/${modificando}/update`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      setCitas(prev => prev.map(c => c.id === modificando
        ? { ...c, date: res.date, startTime: res.startTime, employeeName: `${res.employeeNames} ${res.employeeLastNames}`, totalPrice: res.totalPrice, status: res.status }
        : c
      ))
      setMensaje('Cita modificada exitosamente.')
      setTimeout(() => setMensaje(''), 3000)
      cancelarModificacion()
    } catch (err) {
      setErrorMod(err.message || 'Error al modificar la cita.')
      setPaso(PASOS.FORM)
    } finally {
      setGuardando(false)
    }
  }

  const cancelarCita = async (id) => {
    try {
      await apiFetch('/appointments/cancel', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: id, reason: motivo }),
      })
      setCitas(prev => prev.map(c => c.id === id ? { ...c, status: 'CANCELADA' } : c))
      setCancelando(null)
      setMotivo('')
      setMensaje('Cita cancelada exitosamente.')
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al cancelar la cita.')
    }
  }

  const citaActiva = (status) => status === 'CONFIRMADA' || status === 'MODIFICADA'

  const nombreServicio = (id) => servicios.find(s => s.id === id)?.name || id
  const nombreBarbero = () => barberos.find(b => b.id === parseInt(form.employeeId))

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

        {mensaje && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '16px' }}>✓ {mensaje}</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando citas...</p>}

        {!cargando && citas.length === 0 && !error && (
          <p style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>No tienes citas registradas.</p>
        )}

        {citas.map(c => (
          <div key={c.id} style={{
            background: '#111', border: '1px solid #1e1e1e',
            borderLeft: `3px solid ${c.status === 'CANCELADA' ? '#555' : '#c9a84c'}`,
            borderRadius: '6px', padding: '16px 22px', marginBottom: '10px'
          }}>
            {/* Cabecera de la cita */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {c.date} · {c.startTime}
                </p>
                <p style={{ color: '#ccc', fontSize: '13px', margin: '2px 0' }}>Barbero: {c.employeeName}</p>
                <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                  Total: ${parseFloat(c.totalPrice).toLocaleString('es-CO')}
                </p>
                <p style={{ color: c.status === 'CANCELADA' ? '#555' : '#c9a84c', fontSize: '12px', marginTop: '4px' }}>
                  {c.status}
                </p>
              </div>
              {citaActiva(c.status) && modificando !== c.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => abrirModificar(c)} style={{
                    background: 'none', border: '1px solid #c9a84c50', borderRadius: '4px',
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
              )}
            </div>

            {/* Panel de modificación */}
            {modificando === c.id && paso === PASOS.FORM && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #1e1e1e', paddingTop: '16px' }}>
                <p style={{ color: '#f5f0e8', fontSize: '14px', fontStyle: 'italic', marginBottom: '16px' }}>Modificar cita</p>

                {errorMod && <p style={{ color: '#800020', fontSize: '12px', marginBottom: '12px' }}>{errorMod}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Servicio */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Servicio</label>
                    <select
                      value={form.serviceIds[0] || ''}
                      onChange={e => cambiarServicio(e.target.value)}
                      style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#f5f0e8', padding: '9px 12px', fontSize: '13px', fontFamily: 'Georgia, serif' }}
                    >
                      <option value="">Seleccionar servicio</option>
                      {servicios.map(s => (
                        <option key={s.id} value={s.id}>{s.name} — ${parseFloat(s.price).toLocaleString('es-CO')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Barbero */}
                  {barberos.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Barbero</label>
                      <select
                        value={form.employeeId}
                        onChange={e => cambiarBarbero(e.target.value)}
                        style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#f5f0e8', padding: '9px 12px', fontSize: '13px', fontFamily: 'Georgia, serif' }}
                      >
                        <option value="">Seleccionar barbero</option>
                        {barberos.map(b => (
                          <option key={b.id} value={b.id}>{b.names} {b.lastNames}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Fecha */}
                  {form.employeeId && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Fecha</label>
                      <input
                        type="date"
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => cambiarFecha(e.target.value)}
                        style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#f5f0e8', padding: '9px 12px', fontSize: '13px', fontFamily: 'Georgia, serif' }}
                      />
                    </div>
                  )}

                  {/* Slots */}
                  {form.date && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Horario</label>
                      {cargandoSlots && <p style={{ color: '#666', fontSize: '12px', fontStyle: 'italic' }}>Cargando horarios...</p>}
                      {!cargandoSlots && slots.length === 0 && <p style={{ color: '#555', fontSize: '12px', fontStyle: 'italic' }}>No hay horarios disponibles para esta fecha.</p>}
                      {!cargandoSlots && slots.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {slots.map(s => (
                            <button
                              key={s.startTime}
                              onClick={() => setForm(f => ({ ...f, startTime: s.startTime.substring(0, 5) }))}
                              style={{
                                padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                                fontFamily: 'Georgia, serif',
                                background: form.startTime === s.startTime.substring(0, 5) ? '#c9a84c' : '#0a0a0a',
                                color: form.startTime === s.startTime.substring(0, 5) ? '#0a0a0a' : '#888',
                                border: `1px solid ${form.startTime === s.startTime.substring(0, 5) ? '#c9a84c' : '#2a2a2a'}`,
                              }}
                            >
                              {s.startTime.substring(0, 5)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botones */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={irAConfirmar} style={{
                      flex: 1, padding: '10px', background: '#c9a84c', border: 'none', borderRadius: '4px',
                      color: '#0a0a0a', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>
                      Continuar
                    </button>
                    <button onClick={cancelarModificacion} style={{
                      padding: '10px 16px', background: 'none', border: '1px solid #333',
                      borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Panel de confirmación */}
            {modificando === c.id && paso === PASOS.CONFIRMACION && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #1e1e1e', paddingTop: '16px' }}>
                <p style={{ color: '#f5f0e8', fontSize: '14px', fontStyle: 'italic', marginBottom: '12px' }}>¿Confirmar cambios?</p>

                {errorMod && <p style={{ color: '#800020', fontSize: '12px', marginBottom: '12px' }}>{errorMod}</p>}

                <div style={{ background: '#0d0d0d', borderRadius: '6px', padding: '14px', marginBottom: '14px', fontSize: '13px' }}>
                  <p style={{ color: '#888', margin: '0 0 6px' }}>Servicio: <span style={{ color: '#f5f0e8' }}>{form.serviceIds.map(id => nombreServicio(id)).join(', ')}</span></p>
                  <p style={{ color: '#888', margin: '0 0 6px' }}>Barbero: <span style={{ color: '#f5f0e8' }}>{nombreBarbero() ? `${nombreBarbero().names} ${nombreBarbero().lastNames}` : form.employeeId}</span></p>
                  <p style={{ color: '#888', margin: '0 0 6px' }}>Fecha: <span style={{ color: '#f5f0e8' }}>{form.date}</span></p>
                  <p style={{ color: '#888', margin: 0 }}>Hora: <span style={{ color: '#c9a84c' }}>{form.startTime}</span></p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={confirmarModificacion} disabled={guardando} style={{
                    flex: 1, padding: '10px', background: '#c9a84c', border: 'none', borderRadius: '4px',
                    color: '#0a0a0a', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    {guardando ? 'Guardando...' : 'Confirmar modificación'}
                  </button>
                  <button onClick={() => setPaso(PASOS.FORM)} style={{
                    padding: '10px 16px', background: 'none', border: '1px solid #333',
                    borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    Volver
                  </button>
                </div>
              </div>
            )}

            {/* Cancelación */}
            {cancelando === c.id && (
              <div style={{ marginTop: '14px', borderTop: '1px solid #1e1e1e', paddingTop: '14px' }}>
                <input
                  type="text"
                  placeholder="Motivo de cancelación (opcional)"
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', fontSize: '13px', fontFamily: 'Georgia, serif', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => cancelarCita(c.id)} style={{
                    flex: 1, padding: '10px', background: '#800020', border: 'none',
                    borderRadius: '4px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    Confirmar cancelación
                  </button>
                  <button onClick={() => setCancelando(null)} style={{
                    padding: '10px 16px', background: 'none', border: '1px solid #333',
                    borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
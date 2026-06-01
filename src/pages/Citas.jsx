import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

const inp = {
  padding: '11px 14px', background: '#0d0d0d', border: '1px solid #252525',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif',
  color: '#f5f0e8', outline: 'none', width: '100%',
}

export default function Citas({ navegarA, origen = 'menuCliente' }) {
  const [paso, setPaso] = useState(1)
  const [servicios, setServicios] = useState([])
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([])
  const [barberos, setBarberos] = useState([])
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null)
  const [fechasDisponibles, setFechasDisponibles] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [slots, setSlots] = useState([])
  const [slotSeleccionado, setSlotSeleccionado] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Paso 1: cargar servicios
  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => setServicios(data))
      .catch(() => setError('No se pudieron cargar los servicios.'))
  }, [])

  // Paso 2: cargar barberos cuando hay servicios seleccionados
  useEffect(() => {
    if (serviciosSeleccionados.length === 0) { setBarberos([]); return }
    console.log('Buscando barberos para servicio:', serviciosSeleccionados[0])
    setCargando(true)
    apiFetch(`/appointments/services/${serviciosSeleccionados[0]}/employees`)
      .then(data => setBarberos(data))
      .catch(() => setError('No hay barberos disponibles para ese servicio.'))
      .finally(() => setCargando(false))
  }, [serviciosSeleccionados])

  // Paso 3: cargar fechas disponibles cuando hay barbero
  useEffect(() => {
    if (!barberoSeleccionado) return
    setCargando(true)
    apiFetch(`/appointments/employees/${barberoSeleccionado.id}/dates`)
      .then(data => setFechasDisponibles(data.availableDates || []))
      .catch(() => setError('No se pudieron cargar las fechas.'))
      .finally(() => setCargando(false))
  }, [barberoSeleccionado])

  // Paso 4: cargar slots cuando hay fecha
  useEffect(() => {
    if (!fechaSeleccionada || !barberoSeleccionado) return
    setCargando(true)
    const params = new URLSearchParams()
    params.append('date', fechaSeleccionada)
    serviciosSeleccionados.forEach(id => params.append('serviceIds', id))
    apiFetch(`/appointments/employees/${barberoSeleccionado.id}/slots?${params}`)
      .then(data => setSlots(data))
      .catch(() => setError('No hay horarios disponibles para esa fecha.'))
      .finally(() => setCargando(false))
  }, [fechaSeleccionada])

  const toggleServicio = (id) => {
    setServiciosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
    setBarberoSeleccionado(null)
    setFechaSeleccionada('')
    setSlotSeleccionado(null)
    setError('')
  }

  const confirmarCita = async () => {
    setCargando(true)
    setError('')
    try {
      await apiFetch('/appointments/confirm', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: barberoSeleccionado.id,
          date: fechaSeleccionada,
          startTime: slotSeleccionado.startTime,
          serviceIds: serviciosSeleccionados,
        }),
      })
      setEnviado(true)
      setTimeout(() => navegarA(origen), 2200)
    } catch (err) {
      setError(err.message || 'Error al confirmar la cita.')
    } finally {
      setCargando(false)
    }
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', color: '#c9a84c', marginBottom: '16px' }}>✓</div>
        <p style={{ color: '#f5f0e8', fontSize: '18px', fontStyle: 'italic' }}>¡Cita agendada con éxito!</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => paso > 1 ? setPaso(paso - 1) : navegarA(origen)}>
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
          Paso {paso} de 4
        </p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>
          {paso === 1 && 'Selecciona los servicios'}
          {paso === 2 && 'Selecciona un barbero'}
          {paso === 3 && 'Selecciona fecha y hora'}
          {paso === 4 && 'Confirma tu cita'}
        </h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '28px' }} />

        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
        {cargando && <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Cargando...</p>}

        {/* Paso 1: Servicios */}
        {paso === 1 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {servicios.map(s => {
                const seleccionado = serviciosSeleccionados.includes(s.id)
                return (
                  <div key={s.id} onClick={() => toggleServicio(s.id)} style={{
                    background: seleccionado ? '#1a1a0e' : '#111',
                    border: `1px solid ${seleccionado ? '#c9a84c' : '#1e1e1e'}`,
                    borderRadius: '6px', padding: '14px 18px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ color: '#f5f0e8', fontSize: '14px' }}>{s.name}</span>
                    <span style={{ color: '#c9a84c', fontSize: '13px' }}>${s.price.toLocaleString('es-CO')}</span>
                  </div>
                )
              })}
            </div>
            <button onClick={() => { if (serviciosSeleccionados.length > 0) { setError(''); setPaso(2) } else setError('Selecciona al menos un servicio.') }}
              style={{ width: '100%', padding: '14px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              Continuar
            </button>
          </div>
        )}

        {/* Paso 2: Barberos */}
        {paso === 2 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {barberos.map(b => (
                <div key={b.id} onClick={() => { setBarberoSeleccionado(b); setFechaSeleccionada(''); setSlotSeleccionado(null) }} style={{
                  background: barberoSeleccionado?.id === b.id ? '#1a1a0e' : '#111',
                  border: `1px solid ${barberoSeleccionado?.id === b.id ? '#c9a84c' : '#1e1e1e'}`,
                  borderRadius: '6px', padding: '14px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#c9a84c22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontWeight: 'bold' }}>
                    {b.names?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#f5f0e8', fontSize: '14px' }}>{b.names}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { if (barberoSeleccionado) { setError(''); setPaso(3) } else setError('Selecciona un barbero.') }}
              style={{ width: '100%', padding: '14px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              Continuar
            </button>
          </div>
        )}

        {/* Paso 3: Fecha y hora */}
        {paso === 3 && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Fecha disponible:</label>
              <select value={fechaSeleccionada} onChange={e => { setFechaSeleccionada(e.target.value); setSlotSeleccionado(null) }} style={inp}>
                <option value="">Selecciona una fecha</option>
                {fechasDisponibles.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {fechaSeleccionada && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Hora disponible:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {slots.map((slot, i) => (
                    <div key={i} onClick={() => setSlotSeleccionado(slot)} style={{
                      padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                      background: slotSeleccionado === slot ? '#c9a84c' : '#111',
                      color: slotSeleccionado === slot ? '#0a0a0a' : '#f5f0e8',
                      border: `1px solid ${slotSeleccionado === slot ? '#c9a84c' : '#252525'}`
                    }}>
                      {slot.startTime}
                    </div>
                  ))}
                  {slots.length === 0 && !cargando && <p style={{ color: '#555', fontSize: '13px', fontStyle: 'italic' }}>No hay horarios disponibles.</p>}
                </div>
              </div>
            )}

            <button onClick={() => { if (fechaSeleccionada && slotSeleccionado) { setError(''); setPaso(4) } else setError('Selecciona fecha y hora.') }}
              style={{ width: '100%', padding: '14px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              Continuar
            </button>
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {paso === 4 && (
          <div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderTop: '2px solid #c9a84c', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
              <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Resumen</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>Barbero</span>
                  <span style={{ color: '#f5f0e8', fontSize: '13px' }}>{barberoSeleccionado?.names}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>Fecha</span>
                  <span style={{ color: '#f5f0e8', fontSize: '13px' }}>{fechaSeleccionada}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>Hora</span>
                  <span style={{ color: '#f5f0e8', fontSize: '13px' }}>{slotSeleccionado?.startTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>Servicios</span>
                  <span style={{ color: '#f5f0e8', fontSize: '13px', textAlign: 'right' }}>
                    {servicios.filter(s => serviciosSeleccionados.includes(s.id)).map(s => s.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={confirmarCita} disabled={cargando}
              style={{ width: '100%', padding: '14px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              {cargando ? 'Confirmando...' : 'Confirmar cita'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
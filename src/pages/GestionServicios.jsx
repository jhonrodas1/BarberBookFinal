import { useState, useEffect } from 'react'
import './Home.css'
import './FormPage.css'
import { apiFetch } from '../api/client'

export default function GestionServicios({ navegarA }) {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', durationMinutes: '' })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState('')

  // Estado para el modal de confirmación
  const [servicioADeshabilitar, setServicioADeshabilitar] = useState(null)
  const [deshabilitando, setDeshabilitando] = useState(false)
  const [errorDeshabilitar, setErrorDeshabilitar] = useState('')

  useEffect(() => {
    cargarServicios()
  }, [])

  const cargarServicios = () => {
    setCargando(true)
    apiFetch('/appointments/services/all') // todos, activos e inactivos
      .then(data => setServicios(data))
      .catch(() => {
        // fallback: solo activos
        apiFetch('/appointments/services')
          .then(data => setServicios(data))
          .catch(() => setError('No se pudieron cargar los servicios.'))
      })
      .finally(() => setCargando(false))
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const crearServicio = async () => {
    if (!form.name || !form.price || !form.durationMinutes) {
      setError('Nombre, precio y duración son obligatorios.')
      return
    }
    setGuardando(true)
    try {
      const nuevo = await apiFetch('/admin/services', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          durationMinutes: parseInt(form.durationMinutes),
        }),
      })
      setServicios(prev => [...prev, nuevo])
      setForm({ name: '', description: '', price: '', durationMinutes: '' })
      setMostrarForm(false)
      setExito('Servicio creado exitosamente.')
      setTimeout(() => setExito(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al crear el servicio.')
    } finally {
      setGuardando(false)
    }
  }

  const confirmarDeshabilitar = (servicio) => {
    setServicioADeshabilitar(servicio)
    setErrorDeshabilitar('')
  }

  const cancelarDeshabilitar = () => {
    setServicioADeshabilitar(null)
    setErrorDeshabilitar('')
  }

  const ejecutarDeshabilitar = async () => {
    if (!servicioADeshabilitar) return
    setDeshabilitando(true)
    setErrorDeshabilitar('')
    try {
      const res = await apiFetch(`/admin/services/${servicioADeshabilitar.id}/disable`, {
        method: 'PATCH',
      })
      // Actualizar el servicio en la lista local
      setServicios(prev =>
        prev.map(s => s.id === res.serviceId ? { ...s, isActive: false } : s)
      )
      setServicioADeshabilitar(null)
      setExito(res.message)
      setTimeout(() => setExito(''), 5000)
    } catch (err) {
      setErrorDeshabilitar(err.message || 'Error al deshabilitar el servicio.')
    } finally {
      setDeshabilitando(false)
    }
  }

  const activos   = servicios.filter(s => s.isActive !== false && s.active !== false)
  const inactivos = servicios.filter(s => s.isActive === false || s.active === false)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>

      {/* Modal de confirmación */}
      {servicioADeshabilitar && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: '#111', border: '1px solid #2a2a2a',
            borderTop: '2px solid #c9a84c', borderRadius: '12px',
            padding: '32px', maxWidth: '440px', width: '100%'
          }}>
            <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', margin: '0 0 12px' }}>
              ¿Deshabilitar servicio?
            </h3>
            <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6', margin: '0 0 8px' }}>
              Estás a punto de deshabilitar{' '}
              <span style={{ color: '#c9a84c' }}>"{servicioADeshabilitar.name}"</span>.
            </p>
            <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.6', margin: '0 0 20px' }}>
              El servicio dejará de aparecer en el catálogo y no podrá seleccionarse
              para nuevas citas. Las citas ya agendadas se mantendrán activas.
            </p>

            {errorDeshabilitar && (
              <p style={{
                color: '#f87171', fontSize: '12px', background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)', borderRadius: '6px',
                padding: '10px 14px', marginBottom: '16px'
              }}>
                {errorDeshabilitar}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelarDeshabilitar}
                disabled={deshabilitando}
                style={{
                  background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px',
                  color: '#888', padding: '9px 20px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif', fontSize: '13px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarDeshabilitar}
                disabled={deshabilitando}
                style={{
                  background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '6px',
                  color: '#fca5a5', padding: '9px 20px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif', fontSize: '13px',
                  opacity: deshabilitando ? 0.6 : 1
                }}
              >
                {deshabilitando ? 'Deshabilitando...' : 'Sí, deshabilitar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuAdmin')}>
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

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Administración</p>
            <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 6px' }}>Gestión de Servicios</h2>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>
          <button onClick={() => setMostrarForm(!mostrarForm)} style={{
            fontSize: '13px', padding: '10px 20px', whiteSpace: 'nowrap', marginTop: '4px',
            background: '#c9a84c', border: 'none', borderRadius: '4px', color: '#0a0a0a',
            fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 'bold'
          }}>
            {mostrarForm ? 'Cancelar' : '+ Nuevo servicio'}
          </button>
        </div>

        {exito && (
          <p style={{
            color: '#4ade80', fontSize: '13px', marginBottom: '16px',
            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '6px', padding: '10px 14px'
          }}>
            ✓ {exito}
          </p>
        )}
        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

        {mostrarForm && (
          <div style={{
            background: '#111', border: '1px solid #c9a84c28', borderTop: '2px solid #c9a84c',
            borderRadius: '8px', padding: '28px', marginBottom: '24px'
          }}>
            <h3 style={{ color: '#f5f0e8', fontSize: '16px', fontStyle: 'italic', marginBottom: '20px' }}>Nuevo Servicio</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-grupo">
                <label>Nombre:</label>
                <input name="name" type="text" value={form.name} onChange={cambiar} />
              </div>
              <div className="form-grupo">
                <label>Descripción:</label>
                <input name="description" type="text" value={form.description} onChange={cambiar} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-grupo" style={{ flex: 1 }}>
                  <label>Precio (COP):</label>
                  <input name="price" type="number" value={form.price} onChange={cambiar} />
                </div>
                <div className="form-grupo" style={{ flex: 1 }}>
                  <label>Duración (minutos):</label>
                  <input name="durationMinutes" type="number" value={form.durationMinutes} onChange={cambiar} />
                </div>
              </div>
              <button onClick={crearServicio} disabled={guardando} style={{
                padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '4px',
                color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}>
                {guardando ? 'Creando...' : 'Crear servicio'}
              </button>
            </div>
          </div>
        )}

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando servicios...</p>}

        {/* Servicios activos */}
        {activos.length > 0 && (
          <>
            <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '10px' }}>
              Activos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {activos.map((s, i) => (
                <div key={s.id || i} style={{
                  background: '#111', border: '1px solid #1e1e1e', borderLeft: '3px solid #c9a84c',
                  borderRadius: '8px', padding: '16px 22px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#f5f0e8', fontSize: '14px', margin: '0 0 4px' }}>{s.name}</p>
                    <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic', margin: '0 0 2px' }}>{s.description}</p>
                    <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>{s.durationMinutes} min</p>
                  </div>
                  <span style={{ color: '#c9a84c', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    ${parseFloat(s.price).toLocaleString('es-CO')}
                  </span>
                  <button
                    onClick={() => confirmarDeshabilitar(s)}
                    style={{
                      background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px',
                      color: '#888', padding: '6px 14px', cursor: 'pointer',
                      fontFamily: 'Georgia, serif', fontSize: '12px', whiteSpace: 'nowrap',
                      transition: 'border-color 0.2s, color 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
                  >
                    Deshabilitar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Servicios deshabilitados */}
        {inactivos.length > 0 && (
          <>
            <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '10px' }}>
              Deshabilitados
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {inactivos.map((s, i) => (
                <div key={s.id || i} style={{
                  background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #333',
                  borderRadius: '8px', padding: '16px 22px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                  opacity: 0.5
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 4px', textDecoration: 'line-through' }}>{s.name}</p>
                    <p style={{ color: '#444', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>{s.description}</p>
                  </div>
                  <span style={{
                    fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: '20px',
                    background: '#1a1a1a', color: '#555', border: '1px solid #222'
                  }}>
                    Inactivo
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {!cargando && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '8px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{activos.length}</span> activo{activos.length !== 1 ? 's' : ''}
            {inactivos.length > 0 && (
              <> · <span style={{ fontSize: '14px' }}>{inactivos.length}</span> deshabilitado{inactivos.length !== 1 ? 's' : ''}</>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
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
  const [exito, setExito] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [servicioEliminar, setServicioEliminar] = useState(null)
  const [fechaEliminacion, setFechaEliminacion] = useState('')
  const [errorEliminar, setErrorEliminar] = useState('')
  const [exitoEliminar, setExitoEliminar] = useState(false)

  // Persistir cambios localmente (front-end solamente)
  const persistServicios = (arr) => {
    try {
      const map = {}
      arr.forEach(s => { map[s.id ?? s.name] = s })
      localStorage.setItem('servicios', JSON.stringify(map))
    } catch (_) {}
  }

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => {
        try {
          const stored = JSON.parse(localStorage.getItem('servicios') || '{}')
          const merged = (data || []).map(s => ({ activo: true, ...s, ...(stored[s.id] || {}) }))
          setServicios(merged)
        } catch (_) {
          setServicios(data)
        }
      })
      .catch(() => setError('No se pudieron cargar los servicios.'))
      .finally(() => setCargando(false))
  }, [])

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
      // Si no viene id del backend asignar uno local y asi no morimos en el intento
      if (!nuevo.id) nuevo.id = 'c_' + Date.now()
      if (nuevo.activo === undefined) nuevo.activo = true
      setServicios(prev => {
        const next = [...prev, nuevo]
        persistServicios(next)
        return next
      })
      setForm({ name: '', description: '', price: '', durationMinutes: '' })
      setMostrarForm(false)
      setExito(true)
      setTimeout(() => setExito(false), 2500)
    } catch (err) {
      setError(err.message || 'Error al crear el servicio.')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = (servicio) => {
    setServicios(prev => {
      const next = prev.map(s => s.id === servicio.id ? { ...s, activo: s.activo === false ? true : false } : s)
      persistServicios(next)
      return next
    })
  }

  const abrirModalEliminar = (servicio) => {
    setServicioEliminar(servicio)
    setFechaEliminacion('')
    setErrorEliminar('')
    setMostrarModalEliminar(true)
  }

  const cerrarModalEliminar = () => {
    setServicioEliminar(null)
    setFechaEliminacion('')
    setErrorEliminar('')
    setMostrarModalEliminar(false)
  }

  const confirmarEliminar = () => {
    const mañana = new Date()
    mañana.setDate(mañana.getDate() + 1)
    const minFecha = mañana.toISOString().slice(0, 10)

    if (!fechaEliminacion) {
      setErrorEliminar('Selecciona una fecha para la eliminación.')
      return
    }

    if (fechaEliminacion < minFecha) {
      setErrorEliminar('La fecha debe ser a partir de mañana.')
      return
    }

    setServicios(prev => {
      const next = prev.map(s => s.id === servicioEliminar.id ? { ...s, deletionDate: fechaEliminacion } : s)
      persistServicios(next)
      return next
    })
    setExitoEliminar(true)
    setTimeout(() => {
      setExitoEliminar(false)
      cerrarModalEliminar()
    }, 2500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
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

        {exito && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '16px' }}>✓ Servicio creado exitosamente.</p>}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {servicios.map((s, i) => (
            <div key={s.id || i} style={{
              background: '#111', border: '1px solid #1e1e1e', borderLeft: '3px solid #c9a84c',
              borderRadius: '8px', padding: '16px 22px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <p style={{ color: '#f5f0e8', fontSize: '14px', margin: '0 0 4px' }}>{s.name}</p>
                <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic', margin: '0 0 2px' }}>{s.description}</p>
                <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>{s.durationMinutes} min</p>
                {!s.activo && <p style={{ color: '#e07070', fontSize: '12px', margin: '6px 0 0' }}>Inactivo</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#c9a84c', fontSize: '14px', fontWeight: 'bold' }}>
                    ${parseFloat(s.price).toLocaleString('es-CO')}
                  </span>
                  <button
                    onClick={() => toggleActivo(s)}
                    style={{
                      border: '1px solid rgba(200,200,200,0.12)',
                      background: s.activo === false ? 'rgba(200,80,80,0.08)' : 'rgba(80,200,80,0.04)',
                      color: '#f5f0e8',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Georgia, serif',
                      transition: 'background .2s ease, border-color .2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = s.activo === false ? 'rgba(200,80,80,0.18)' : 'rgba(80,200,80,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = s.activo === false ? 'rgba(200,80,80,0.08)' : 'rgba(80,200,80,0.04)'}
                  >
                    {s.activo === false ? 'Activar' : 'Deshabilitar'}
                  </button>
                  <button
                    onClick={() => abrirModalEliminar(s)}
                    style={{
                      border: '1px solid rgba(255, 80, 80, 0.35)',
                      background: 'rgba(255, 80, 80, 0.08)',
                      color: '#f5f0e8',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Georgia, serif',
                      transition: 'background .2s ease, border-color .2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 80, 80, 0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 80, 80, 0.08)'}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {s.deletionDate && (
                <p style={{ color: '#c9a84c', fontSize: '12px', margin: '10px 0 0' }}>
                  Eliminación programada: {new Date(s.deletionDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          ))}
        </div>

        {!cargando && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{servicios.length}</span> servicio{servicios.length !== 1 ? 's' : ''} registrados
          </p>
        )}
      </div>

      {mostrarModalEliminar && servicioEliminar && (() => {
        const mañana = new Date()
        mañana.setDate(mañana.getDate() + 1)
        const minFecha = mañana.toISOString().slice(0, 10)
        return (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '24px'
          }}>
            <div style={{
              background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
              borderRadius: '10px', padding: '32px', maxWidth: '420px', width: '100%',
              fontFamily: 'Georgia, serif'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ color: '#f5f0e8', fontSize: '18px', fontStyle: 'italic', margin: 0 }}>
                    Eliminar servicio
                  </h3>
                  <p style={{ color: '#888', fontSize: '12px', margin: '6px 0 0' }}>
                    Selecciona la fecha mínima para eliminar este servicio.
                  </p>
                </div>
                <button onClick={cerrarModalEliminar} style={{
                  background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1
                }}>×</button>
              </div>

              <p style={{ color: '#f5f0e8', fontSize: '14px', margin: '0 0 16px' }}><strong>{servicioEliminar.name}</strong></p>
              <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                Fecha de eliminación
              </label>
              <input
                type="date"
                value={fechaEliminacion}
                min={minFecha}
                onChange={e => { setFechaEliminacion(e.target.value); setErrorEliminar('') }}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #252525',
                  background: '#0d0d0d', color: '#f5f0e8', fontFamily: 'Georgia, serif', fontSize: '14px', marginBottom: '14px'
                }}
              />
              <p style={{ color: '#555', fontSize: '12px', margin: '0 0 18px' }}>
                La fecha mínima disponible es el <strong>{new Date(minFecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>.
              </p>
              {errorEliminar && <p style={{ color: '#e07070', fontSize: '13px', marginBottom: '14px' }}>{errorEliminar}</p>}
              {exitoEliminar && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '14px' }}>Programada eliminación para {new Date(fechaEliminacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={cerrarModalEliminar} style={{
                  flex: 1, padding: '12px', background: 'none', border: '1px solid #333', borderRadius: '4px',
                  color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>Cancelar</button>
                <button onClick={confirmarEliminar} style={{
                  flex: 1, padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '4px',
                  color: '#0a0a0a', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 'bold'
                }}>Programar eliminación</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function GestionBarberos({ navegarA }) {
  const [barberos, setBarberos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ names: '', lastNames: '', email: '', phoneNumber: '' })
  const [errForm, setErrForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const persistBarberos = (arr) => {
    try {
      const map = {}
      arr.forEach(b => { map[b.id] = b })
      localStorage.setItem('barberos', JSON.stringify(map))
    } catch (_) {}
  }

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(async (servicios) => {
        const todosIds = new Set()
        const todosBarberos = []
        for (const s of servicios) {
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
        try {
          const stored = JSON.parse(localStorage.getItem('barberos') || '{}')
          const merged = todosBarberos.map(b => ({ ...b, ...(stored[b.id] || {}) }))
          setBarberos(merged)
        } catch (_) {
          setBarberos(todosBarberos)
        }
      })
      .catch(() => setError('No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  const abrirEdicion = (b) => {
    setEditando(b)
    setForm({ names: b.names || '', lastNames: b.lastNames || '', email: b.email || '', phoneNumber: b.phoneNumber || '' })
    setErrForm({})
    setExito(false)
  }

  const cerrarEdicion = () => { setEditando(null); setErrForm({}); setExito(false) }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrForm(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validar = () => {
    const e = {}
    if (!form.names.trim()) e.names = 'El nombre es obligatorio.'
    if (!form.lastNames.trim()) e.lastNames = 'Los apellidos son obligatorios.'
    return e
  }

  const guardarCambios = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErrForm(errores); return }
    setGuardando(true)
    try {
      setBarberos(prev => {
        const next = prev.map(b => b.id === editando.id ? { ...b, ...form } : b)
        persistBarberos(next)
        return next
      })
      setExito(true)
      setTimeout(() => { cerrarEdicion() }, 1200)
    } catch (err) {
      setErrForm({ global: err.message || 'Error al guardar los cambios.' })
    } finally {
      setGuardando(false)
    }
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
            <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 6px' }}>Gestión de Barberos</h2>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>
          <button className="bb-btn-gold" style={{ fontSize: '13px', padding: '10px 20px', whiteSpace: 'nowrap', marginTop: '4px' }}
            onClick={() => navegarA('registrarBarbero')}>
            + Registrar barbero
          </button>
        </div>

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando barberos...</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {barberos.map((b, i) => (
            <div key={b.id || i} style={{
              background: '#111',
              border: '1px solid #c9a84c28',
              borderLeft: '3px solid #c9a84c',
              borderRadius: '8px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', flexShrink: 0,
              }}>
                {b.names?.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 3px' }}>
                  {b.names} {b.lastNames}
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 2px', fontStyle: 'italic' }}>
                  {b.services?.join(', ')}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => abrirEdicion(b)} style={{
                  background: 'none', border: '1px solid #333', borderRadius: '4px',
                  color: '#c9a84c', fontSize: '12px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>Editar</button>
                <span style={{
                  fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: '20px',
                  background: '#141414', color: '#c9a84c', border: '1px solid #c9a84c30',
                }}>
                  Activo
                </span>
              </div>
            </div>
          ))}
        </div>

        {editando && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '24px'
          }}>
            <div style={{
              background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
              borderRadius: '10px', padding: '32px', maxWidth: '440px', width: '100%',
              fontFamily: 'Georgia, serif'
            }}>
              {exito ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '40px', color: '#c9a84c', marginBottom: '14px' }}>✓</div>
                  <p style={{ color: '#f5f0e8', fontSize: '15px', fontStyle: 'italic' }}>Cambios guardados exitosamente.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', marginBottom: '20px' }}>Editar Barbero</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Nombre</label>
                      <input name="names" type="text" value={form.names} onChange={cambiar} style={{ padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', width: '100%' }} />
                      {errForm.names && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.names}</p>}
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Apellidos</label>
                      <input name="lastNames" type="text" value={form.lastNames} onChange={cambiar} style={{ padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', width: '100%' }} />
                      {errForm.lastNames && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.lastNames}</p>}
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Correo</label>
                      <input name="email" type="email" value={form.email} onChange={cambiar} style={{ padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Teléfono</label>
                      <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={cambiar} style={{ padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525', borderRadius: '4px', color: '#f5f0e8', width: '100%' }} />
                    </div>
                    {errForm.global && <p style={{ color: '#e07070', fontSize: '13px' }}>{errForm.global}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                    <button onClick={cerrarEdicion} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Cancelar</button>
                    <button onClick={guardarCambios} disabled={guardando} style={{ flex: 1, padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 'bold', opacity: guardando ? 0.7 : 1 }}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!cargando && !error && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{barberos.length}</span> barbero{barberos.length !== 1 ? 's' : ''} en el equipo
          </p>
        )}
      </div>
    </div>
  )
}
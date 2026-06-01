import { useState, useEffect } from 'react'
import './Home.css'
import './FormPage.css'
import { apiFetch } from '../api/client'

const inp = {
  padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif',
  color: '#f5f0e8', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function GestionUsuarios({ navegarA, usuario }) {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorGlobal, setErrorGlobal] = useState('')

  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ names: '', lastNames: '', phoneNumber: '', email: '' })
  const [errForm, setErrForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const [verHistorial, setVerHistorial] = useState(null)
  const [historial, setHistorial] = useState([])
  const [cargandoHistorial, setCargandoHistorial] = useState(false)

  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = () => {
    setCargando(true)
    // En producción: await apiFetch('/admin/clients')
    setTimeout(() => {
      setClientes([
        { id: 1, names: 'Ana', lastNames: 'García', email: 'ana@mail.com', phoneNumber: '3001234567', activo: true },
        { id: 2, names: 'Luis', lastNames: 'Martínez', email: 'luis@mail.com', phoneNumber: '3109876543', activo: true },
        { id: 3, names: 'Sofía', lastNames: 'Herrera', email: 'sofia@mail.com', phoneNumber: '3154567890', activo: false },
      ])
      setCargando(false)
    }, 500)
  }

  const puedeEditar = (cliente) => {
    if (!usuario) return false
    return usuario.rol === 'admin' || usuario.correo === cliente.email
  }

  const abrirEdicion = (cliente) => {
    if (!puedeEditar(cliente)) {
      setErrorGlobal('No tienes permisos para editar este usuario.')
      setTimeout(() => setErrorGlobal(''), 3000)
      return
    }
    setEditando(cliente)
    setForm({ names: cliente.names, lastNames: cliente.lastNames, email: cliente.email, phoneNumber: cliente.phoneNumber })
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
    if (!form.email.trim()) e.email = 'El correo es obligatorio.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Formato de correo inválido.'
    else if (clientes.some(c => c.email === form.email && c.id !== editando.id))
      e.email = 'Ya existe un usuario con ese correo.'
    if (!form.phoneNumber.trim()) e.phoneNumber = 'El teléfono es obligatorio.'
    return e
  }

  const guardarCambios = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErrForm(errores); return }
    setGuardando(true)
    try {
      // await apiFetch(`/admin/clients/${editando.id}`, { method: 'PUT', body: JSON.stringify(form) })
      setClientes(prev => prev.map(c => c.id === editando.id ? { ...c, ...form } : c))
      setExito(true)
      setTimeout(() => cerrarEdicion(), 2000)
    } catch (err) {
      setErrForm({ global: err.message || 'Error al guardar los cambios.' })
    } finally {
      setGuardando(false)
    }
  }

  const toggleEstado = (cliente) => {
    setClientes(prev => prev.map(c => c.id === cliente.id ? { ...c, activo: !c.activo } : c))
  }

  const abrirHistorial = async (cliente) => {
    setVerHistorial(cliente)
    setCargandoHistorial(true)
    try {
      // await apiFetch(`/admin/clients/${cliente.id}/appointments`)
      setHistorial([
        { fecha: '2025-04-10', hora: '10:00', servicio: 'Corte de cabello', barbero: 'Carlos Rodríguez', estado: 'COMPLETADA' },
        { fecha: '2025-03-22', hora: '14:00', servicio: 'Corte y Barba', barbero: 'Miguel Torres', estado: 'COMPLETADA' },
        { fecha: '2025-02-15', hora: '11:00', servicio: 'Afeitado', barbero: 'Diego Fernández', estado: 'CANCELADA' },
      ])
    } catch (_) {
      setHistorial([])
    } finally {
      setCargandoHistorial(false)
    }
  }

  const clientesActivos = clientes.filter(c => c.activo)
  const clientesInactivos = clientes.filter(c => !c.activo)

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

        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administración
        </p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>
          Gestión de Usuarios
        </h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '32px' }} />

        {errorGlobal && (
          <div style={{ background: '#1a0d0d', border: '1px solid #5a1010', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ color: '#e07070', fontSize: '13px', margin: 0 }}>{errorGlobal}</p>
          </div>
        )}

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando usuarios...</p>}

        {!cargando && clientes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', color: '#222' }}>👤</div>
            <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#444' }}>No hay usuarios registrados.</p>
          </div>
        )}

        {clientesActivos.length > 0 && (
          <>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>
              Activos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {clientesActivos.map(c => (
                <div key={c.id} style={{
                  background: '#111', border: '1px solid #1e1e1e', borderLeft: '3px solid #c9a84c',
                  borderRadius: '8px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 'bold', color: '#c9a84c',
                  }}>
                    {c.names.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 2px' }}>{c.names} {c.lastNames}</p>
                    <p style={{ fontSize: '12px', color: '#555', margin: 0, fontStyle: 'italic' }}>{c.email} · {c.phoneNumber}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => abrirHistorial(c)} style={{
                      background: 'none', border: '1px solid #252525', borderRadius: '4px',
                      color: '#666', fontSize: '12px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>Historial</button>
                    <button onClick={() => abrirEdicion(c)} style={{
                      background: 'none', border: '1px solid #333', borderRadius: '4px',
                      color: '#c9a84c', fontSize: '12px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>Editar</button>
                    <button onClick={() => toggleEstado(c)} style={{
                      background: 'none', border: '1px solid #333', borderRadius: '4px',
                      color: '#888', fontSize: '12px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>Desactivar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {clientesInactivos.length > 0 && (
          <>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>
              Inactivos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {clientesInactivos.map(c => (
                <div key={c.id} style={{
                  background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #333',
                  borderRadius: '8px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.6
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: '#111', border: '1.5px solid #222',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 'bold', color: '#444',
                  }}>
                    {c.names.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#555', margin: '0 0 2px' }}>{c.names} {c.lastNames}</p>
                    <p style={{ fontSize: '12px', color: '#333', margin: 0, fontStyle: 'italic' }}>{c.email}</p>
                  </div>
                  <button onClick={() => toggleEstado(c)} style={{
                    background: 'none', border: '1px solid #252525', borderRadius: '4px',
                    color: '#555', fontSize: '12px', padding: '6px 10px', cursor: 'pointer',
                    fontFamily: 'Georgia, serif', flexShrink: 0
                  }}>Activar</button>
                </div>
              ))}
            </div>
          </>
        )}

        {!cargando && clientes.length > 0 && (
          <p style={{ fontSize: '11px', color: '#444', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{clientesActivos.length}</span> usuario{clientesActivos.length !== 1 ? 's' : ''} activos
          </p>
        )}
      </div>

      {/* Modal edición */}
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
                <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', marginBottom: '20px' }}>Editar Cliente</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Nombre <span style={{ color: '#800020' }}>*</span></label>
                    <input name="names" type="text" value={form.names} onChange={cambiar} style={inp} />
                    {errForm.names && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.names}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Apellidos <span style={{ color: '#800020' }}>*</span></label>
                    <input name="lastNames" type="text" value={form.lastNames} onChange={cambiar} style={inp} />
                    {errForm.lastNames && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.lastNames}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Correo electrónico <span style={{ color: '#800020' }}>*</span></label>
                    <input name="email" type="email" value={form.email} onChange={cambiar} style={inp} />
                    {errForm.email && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.email}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Teléfono <span style={{ color: '#800020' }}>*</span></label>
                    <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={cambiar} style={inp} />
                    {errForm.phoneNumber && <p style={{ color: '#e07070', fontSize: '12px', margin: '4px 0 0' }}>{errForm.phoneNumber}</p>}
                  </div>
                  {errForm.global && <p style={{ color: '#e07070', fontSize: '13px' }}>{errForm.global}</p>}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  <button onClick={cerrarEdicion} style={{
                    flex: 1, padding: '12px', background: 'none', border: '1px solid #333',
                    borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>Cancelar</button>
                  <button onClick={guardarCambios} disabled={guardando} style={{
                    flex: 1, padding: '12px', background: '#c9a84c', border: 'none',
                    borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', cursor: 'pointer',
                    fontFamily: 'Georgia, serif', fontWeight: 'bold', opacity: guardando ? 0.7 : 1
                  }}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal historial */}
      {verHistorial && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
            borderRadius: '10px', padding: '32px', maxWidth: '480px', width: '100%',
            fontFamily: 'Georgia, serif', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', margin: 0 }}>
                Historial de {verHistorial.names}
              </h3>
              <button onClick={() => setVerHistorial(null)} style={{
                background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1
              }}>×</button>
            </div>

            {cargandoHistorial && <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Cargando historial...</p>}
            {!cargandoHistorial && historial.length === 0 && (
              <p style={{ color: '#555', fontStyle: 'italic', fontSize: '13px' }}>No hay citas registradas.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historial.map((h, i) => (
                <div key={i} style={{
                  background: '#0d0d0d', border: '1px solid #1a1a1a',
                  borderLeft: `3px solid ${h.estado === 'CANCELADA' ? '#333' : '#c9a84c'}`,
                  borderRadius: '6px', padding: '14px 18px'
                }}>
                  <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px' }}>{h.fecha} · {h.hora}</p>
                  <p style={{ color: '#ccc', fontSize: '13px', margin: '2px 0' }}>{h.servicio}</p>
                  <p style={{ color: '#666', fontSize: '12px', margin: '2px 0', fontStyle: 'italic' }}>{h.barbero}</p>
                  <p style={{ color: h.estado === 'CANCELADA' ? '#555' : '#5cb85c', fontSize: '11px', margin: '4px 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {h.estado}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
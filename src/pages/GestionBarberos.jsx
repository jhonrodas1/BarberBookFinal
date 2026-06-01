import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function GestionBarberos({ navegarA }) {
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null) // employeeId
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [errorEdit, setErrorEdit] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    Promise.all([
      apiFetch('/admin/employees'),
      apiFetch('/appointments/services'),
    ])
      .then(([emps, svcs]) => {
        setBarberos(emps)
        setServicios(svcs)
      })
      .catch(() => setError('No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  const abrirEdicion = (b) => {
    setEditando(b.employeeId)
    setErrorEdit('')
    setForm({
      names: b.names || '',
      lastNames: b.lastNames || '',
      phone: b.phone || '',
      address: b.address || '',
      serviceIds: servicios
        .filter(s => b.services?.includes(s.name))
        .map(s => s.id),
    })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setErrorEdit('')
  }

  const toggleServicio = (id) => {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter(s => s !== id)
        : [...f.serviceIds, id],
    }))
  }

  const validar = () => {
    if (!form.names?.trim()) return 'El nombre es obligatorio.'
    if (!form.lastNames?.trim()) return 'Los apellidos son obligatorios.'
    if (form.phone && !/^[0-9]{7,15}$/.test(form.phone)) return 'El teléfono debe tener entre 7 y 15 dígitos.'
    if (!form.serviceIds?.length) return 'Debes asignar al menos un servicio.'
    return ''
  }

  const guardar = async (employeeId) => {
    const err = validar()
    if (err) { setErrorEdit(err); return }

    setGuardando(true)
    setErrorEdit('')
    try {
      const res = await apiFetch(`/admin/employees/${employeeId}/update`, {
        method: 'PATCH',
        body: JSON.stringify({
          names: form.names.trim(),
          lastNames: form.lastNames.trim(),
          phone: form.phone.trim() || undefined,
          address: form.address.trim() || undefined,
          serviceIds: form.serviceIds,
        }),
      })
      setBarberos(prev => prev.map(b =>
        b.employeeId === employeeId
          ? { ...b, names: res.names, lastNames: res.lastNames, phone: res.phone, address: res.address, services: res.services }
          : b
      ))
      setMensaje('Cambios guardados correctamente.')
      setTimeout(() => setMensaje(''), 3000)
      setEditando(null)
    } catch (e) {
      setErrorEdit(e.message || 'Error al guardar los cambios.')
    } finally {
      setGuardando(false)
    }
  }

  const inputStyle = {
    background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px',
    color: '#f5f0e8', padding: '9px 12px', fontSize: '13px',
    fontFamily: 'Georgia, serif', width: '100%', boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: '11px', color: '#666', letterSpacing: '1px',
    textTransform: 'uppercase', marginBottom: '4px', display: 'block',
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

        {mensaje && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '16px' }}>✓ {mensaje}</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}
        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando barberos...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {barberos.map((b, i) => (
            <div key={b.employeeId || i} style={{
              background: '#111',
              border: '1px solid #c9a84c28',
              borderLeft: `3px solid ${b.Active ? '#c9a84c' : '#333'}`,
              borderRadius: '8px',
              padding: '18px 22px',
            }}>
              {/* Vista normal */}
              {editando !== b.employeeId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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
                    {b.phone && <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>{b.phone}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <span style={{
                      fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: '20px',
                      background: '#141414', color: b.active ? '#c9a84c' : '#555',
                      border: `1px solid ${b.active ? '#c9a84c30' : '#2a2a2a'}`,
                    }}>
                      {b.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <button onClick={() => abrirEdicion(b)} style={{
                      background: 'none', border: '1px solid #c9a84c50', borderRadius: '4px',
                      color: '#c9a84c', fontSize: '12px', padding: '5px 12px',
                      cursor: 'pointer', fontFamily: 'Georgia, serif',
                    }}>
                      Editar
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario de edición */}
              {editando === b.employeeId && (
                <div>
                  <p style={{ color: '#f5f0e8', fontSize: '14px', fontStyle: 'italic', marginBottom: '16px' }}>
                    Editar barbero
                  </p>

                  {errorEdit && <p style={{ color: '#800020', fontSize: '12px', marginBottom: '12px' }}>{errorEdit}</p>}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={labelStyle}>Nombre</label>
                      <input style={inputStyle} value={form.names}
                        onChange={e => setForm(f => ({ ...f, names: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Apellidos</label>
                      <input style={inputStyle} value={form.lastNames}
                        onChange={e => setForm(f => ({ ...f, lastNames: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Teléfono</label>
                      <input style={inputStyle} value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Dirección</label>
                      <input style={inputStyle} value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Servicios</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {servicios.map(s => {
                          const seleccionado = form.serviceIds?.includes(s.id)
                          return (
                            <button key={s.id} onClick={() => toggleServicio(s.id)} style={{
                              padding: '6px 12px', borderRadius: '4px', fontSize: '12px',
                              cursor: 'pointer', fontFamily: 'Georgia, serif',
                              background: seleccionado ? '#c9a84c' : '#0a0a0a',
                              color: seleccionado ? '#0a0a0a' : '#888',
                              border: `1px solid ${seleccionado ? '#c9a84c' : '#2a2a2a'}`,
                            }}>
                              {s.name}
                            </button>
                          )
                        })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => guardar(b.employeeId)} disabled={guardando} style={{
                      flex: 1, padding: '10px', background: '#c9a84c', border: 'none',
                      borderRadius: '4px', color: '#0a0a0a', fontSize: '13px',
                      fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif',
                    }}>
                      {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button onClick={cancelarEdicion} style={{
                      padding: '10px 16px', background: 'none', border: '1px solid #333',
                      borderRadius: '4px', color: '#888', fontSize: '13px',
                      cursor: 'pointer', fontFamily: 'Georgia, serif',
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!cargando && !error && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{barberos.length}</span> barbero{barberos.length !== 1 ? 's' : ''} en el equipo
          </p>
        )}
      </div>
    </div>
  )
}
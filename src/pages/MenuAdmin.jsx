import { useState, useEffect } from 'react'
import './MenuAdmin.css'
import { apiFetch } from '../api/client'

const inp = {
  padding: '10px 12px', background: '#0d0d0d', border: '1px solid #252525',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif',
  color: '#f5f0e8', outline: 'none', width: '100%', boxSizing: 'border-box',
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function MenuAdmin({ navegarA, usuario, cerrarSesion, irAlInicio }) {
  const [modalBarberos, setModalBarberos] = useState(false)
  const [barberos, setBarberos] = useState([])
  const [cargandoBarberos, setCargandoBarberos] = useState(false)

  const [jornadasBarbero, setJornadasBarbero] = useState(null)
  const [jornadas, setJornadas] = useState([])
  const [jornadasCache, setJornadasCache] = useState({})
  const [errJornada, setErrJornada] = useState('')
  const [guardandoJornada, setGuardandoJornada] = useState(false)
  const [exitoJornada, setExitoJornada] = useState(false)

  const abrirModalBarberos = async () => {
    setModalBarberos(true)
    setCargandoBarberos(true)
    try {
      const servicios = await apiFetch('/appointments/services')
      const ids = new Set()
      const lista = []
      for (const s of servicios) {
        try {
          const empleados = await apiFetch(`/appointments/services/${s.id}/employees`)
          for (const e of empleados) {
            if (!ids.has(e.id)) { ids.add(e.id); lista.push(e) }
          }
        } catch (_) {}
      }
      setBarberos(lista)
    } catch (_) {
      setBarberos([])
    } finally {
      setCargandoBarberos(false)
    }
  }

  const seleccionarBarbero = (barbero) => {
    setModalBarberos(false)
    setJornadasBarbero(barbero)
    setJornadas(jornadasCache[barbero.id] ?? barbero.jornadas ?? [])
    setErrJornada('')
    setExitoJornada(false)
  }

  const cerrarJornadas = () => {
    setJornadasBarbero(null)
    setJornadas([])
    setErrJornada('')
    setExitoJornada(false)
  }

  const agregarJornada = () => {
    setJornadas(prev => [...prev, { dia: '', inicio: '', fin: '' }])
    setErrJornada('')
  }

  const cambiarJornada = (index, campo, valor) => {
    setJornadas(prev => prev.map((j, i) => i === index ? { ...j, [campo]: valor } : j))
    setErrJornada('')
  }

  const eliminarJornada = (index) => {
    setJornadas(prev => prev.filter((_, i) => i !== index))
    setErrJornada('')
  }

  const validarJornadas = () => {
    for (const j of jornadas) {
      if (!j.dia || !j.inicio || !j.fin) return 'Completa todos los campos de cada jornada.'
      if (j.inicio >= j.fin) return 'La hora de inicio debe ser menor que la hora de fin.'
    }
    const dias = jornadas.map(j => j.dia)
    if (new Set(dias).size !== dias.length) return 'No se pueden configurar horarios superpuestos para el mismo día.'
    return ''
  }

  const guardarJornadas = async () => {
    const err = validarJornadas()
    if (err) { setErrJornada(err); return }
    setGuardandoJornada(true)
    try {
      setBarberos(prev => prev.map(b => b.id === jornadasBarbero.id ? { ...b, jornadas } : b))
      setJornadasCache(prev => ({ ...prev, [jornadasBarbero.id]: jornadas }))
      setExitoJornada(true)
      setTimeout(() => cerrarJornadas(), 2000)
    } catch (err) {
      setErrJornada(err.message || 'Error al guardar las jornadas.')
    } finally {
      setGuardandoJornada(false)
    }
  }

  return (
    <div className="ma-container">
      <div className="ma-sidebar">
        <div className="ma-brand" onClick={irAlInicio}>
          <span className="bb-scissors">✂</span>
          <h1 className="ma-brand-name">BARBERBOOK</h1>
        </div>
        <div className="ma-divider" />
        <nav className="ma-nav">
          <p className="ma-nav-label">ADMINISTRACIÓN</p>
          <button className="ma-nav-btn" onClick={() => navegarA('registrarBarbero')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></span>
            Registrar Barbero
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('calendarioAdmin')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            Calendario
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionUsuarios')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="17" r="4"/><path d="M17 14v6M14 17h6"/></svg></span>
            Gestión Usuarios
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionBarberos')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            Gestión Barberos
          </button>
          <button className="ma-nav-btn" onClick={() => navegarA('gestionServicios')}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span>
            Gestión Servicios
          </button>
          <button className="ma-nav-btn" onClick={abrirModalBarberos}>
            <span className="ma-nav-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>
            Asignar Jornada
          </button>
        </nav>
        <div className="ma-spacer" />
        <button className="ma-logout" onClick={cerrarSesion}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      <div className="ma-main">
        <div className="ma-topbar">
          <div>
            <h2 className="ma-welcome">Panel de Administración{usuario?.nombre ? ` · ${usuario.nombre}` : ''}</h2>
            <p className="ma-date">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="ma-avatar">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
        </div>
        <div className="ma-cards">
          <div className="ma-card" onClick={() => navegarA('registrarBarbero')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></div>
            <h3 className="ma-card-title">Registrar Barbero</h3>
            <p className="ma-card-desc">Añade nuevos barberos al equipo</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('calendarioAdmin')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <h3 className="ma-card-title">Calendario</h3>
            <p className="ma-card-desc">Vista general de todas las citas</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionUsuarios')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="17" r="4"/><path d="M17 14v6M14 17h6"/></svg></div>
            <h3 className="ma-card-title">Gestión Usuarios</h3>
            <p className="ma-card-desc">Administra los clientes</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionBarberos')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <h3 className="ma-card-title">Gestión Barberos</h3>
            <p className="ma-card-desc">Gestiona el equipo de trabajo</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={() => navegarA('gestionServicios')}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <h3 className="ma-card-title">Gestión Servicios</h3>
            <p className="ma-card-desc">Administra los servicios ofrecidos</p>
            <span className="ma-card-arrow">→</span>
          </div>
          <div className="ma-card" onClick={abrirModalBarberos}>
            <div className="ma-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div>
            <h3 className="ma-card-title">Asignar Jornada</h3>
            <p className="ma-card-desc">Configura horarios por barbero</p>
            <span className="ma-card-arrow">→</span>
          </div>
        </div>
      </div>

      {/* para seleccionar barbero */}
      {modalBarberos && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
            borderRadius: '10px', padding: '32px', maxWidth: '420px', width: '100%',
            fontFamily: 'Georgia, serif', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', margin: 0 }}>
                Selecciona un barbero
              </h3>
              <button onClick={() => setModalBarberos(false)} style={{
                background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1
              }}>×</button>
            </div>

            {cargandoBarberos && (
              <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Cargando barberos...</p>
            )}

            {!cargandoBarberos && barberos.length === 0 && (
              <p style={{ color: '#555', fontStyle: 'italic', fontSize: '13px' }}>No hay barberos registrados.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {barberos.map((b, i) => (
                <div key={b.id || i} onClick={() => seleccionarBarbero(b)} style={{
                  background: '#0d0d0d', border: '1px solid #1e1e1e',
                  borderRadius: '8px', padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  cursor: 'pointer', transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', fontWeight: 'bold', color: '#c9a84c',
                  }}>
                    {b.names?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#f5f0e8', fontSize: '14px', margin: '0 0 2px' }}>
                      {b.names} {b.lastNames}
                    </p>
                    {b.jornadas?.length > 0 ? (
                      <p style={{ color: '#c9a84c', fontSize: '11px', margin: 0 }}>
                        {b.jornadas.length} jornada{b.jornadas.length !== 1 ? 's' : ''} configurada{b.jornadas.length !== 1 ? 's' : ''}
                      </p>
                    ) : (
                      <p style={{ color: '#444', fontSize: '11px', margin: 0, fontStyle: 'italic' }}>
                        Sin jornadas configuradas
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#c9a84c', fontSize: '16px', opacity: 0.6 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* las jornadas de los barberos */}
      {jornadasBarbero && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            background: '#111', border: '1px solid #c9a84c30', borderTop: '2px solid #c9a84c',
            borderRadius: '10px', padding: '32px', maxWidth: '500px', width: '100%',
            fontFamily: 'Georgia, serif', maxHeight: '85vh', overflowY: 'auto'
          }}>
            {exitoJornada ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '40px', color: '#c9a84c', marginBottom: '14px' }}>✓</div>
                <p style={{ color: '#f5f0e8', fontSize: '15px', fontStyle: 'italic' }}>Jornadas guardadas exitosamente.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ color: '#f5f0e8', fontSize: '17px', fontStyle: 'italic', margin: 0 }}>
                    Jornadas de {jornadasBarbero.names}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => { setModalBarberos(true); setJornadasBarbero(null) }} style={{
                      background: 'none', border: 'none', color: '#555', fontSize: '13px',
                      cursor: 'pointer', fontFamily: 'Georgia, serif'
                    }}>← Volver</button>
                    <button onClick={cerrarJornadas} style={{
                      background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1
                    }}>×</button>
                  </div>
                </div>
                <p style={{ color: '#555', fontSize: '12px', marginBottom: '20px', fontStyle: 'italic' }}>
                  Define los días y horarios en que este barbero estará disponible.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {jornadas.length === 0 && (
                    <p style={{ color: '#444', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                      Sin jornadas configuradas. Este barbero no aparecerá como disponible.
                    </p>
                  )}
                  {jornadas.map((j, index) => (
                    <div key={index} style={{
                      background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <p style={{ color: '#c9a84c', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>Jornada {index + 1}</p>
                        <button onClick={() => eliminarJornada(index)} style={{
                          background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer', lineHeight: 1
                        }}>×</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Día de la semana</label>
                          <select value={j.dia} onChange={e => cambiarJornada(index, 'dia', e.target.value)} style={inp}>
                            <option value="">Selecciona un día</option>
                            {DIAS_SEMANA.map(d => (
                              <option key={d} value={d} disabled={jornadas.some((jj, ii) => ii !== index && jj.dia === d)}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Hora inicio</label>
                            <input type="time" value={j.inicio} onChange={e => cambiarJornada(index, 'inicio', e.target.value)} style={inp} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Hora fin</label>
                            <input type="time" value={j.fin} onChange={e => cambiarJornada(index, 'fin', e.target.value)} style={inp} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={agregarJornada} style={{
                  width: '100%', padding: '11px', background: 'transparent',
                  border: '1px dashed #333', borderRadius: '6px', color: '#555',
                  fontSize: '13px', cursor: 'pointer', marginBottom: '14px', fontFamily: 'Georgia, serif'
                }}>
                  + Agregar jornada
                </button>

                {errJornada && <p style={{ color: '#e07070', fontSize: '13px', marginBottom: '12px' }}>{errJornada}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={cerrarJornadas} style={{
                    flex: 1, padding: '12px', background: 'none', border: '1px solid #333',
                    borderRadius: '4px', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                  }}>Cancelar</button>
                  <button onClick={guardarJornadas} disabled={guardandoJornada} style={{
                    flex: 1, padding: '12px', background: '#c9a84c', border: 'none',
                    borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', cursor: 'pointer',
                    fontFamily: 'Georgia, serif', fontWeight: 'bold', opacity: guardandoJornada ? 0.7 : 1
                  }}>
                    {guardandoJornada ? 'Guardando...' : 'Guardar jornadas'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuAdmin
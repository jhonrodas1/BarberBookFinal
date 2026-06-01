import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

const DIAS = [
  { valor: 'MONDAY', etiqueta: 'Lunes' },
  { valor: 'TUESDAY', etiqueta: 'Martes' },
  { valor: 'WEDNESDAY', etiqueta: 'Miércoles' },
  { valor: 'THURSDAY', etiqueta: 'Jueves' },
  { valor: 'FRIDAY', etiqueta: 'Viernes' },
  { valor: 'SATURDAY', etiqueta: 'Sábado' },
  { valor: 'SUNDAY', etiqueta: 'Domingo' },
]

const nombreDia = (valor) => DIAS.find(d => d.valor === valor)?.etiqueta || valor

const formVacio = { dayOfWeek: '', startTime: '', endTime: '' }

export default function JornadasBarbero({ navegarA, barbero }) {
  const [jornadas, setJornadas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(formVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  const cargarJornadas = () => {
    setCargando(true)
    apiFetch(`/admin/employees/${barbero.employeeId}/schedules`)
      .then(data => setJornadas(data))
      .catch(() => setError('No se pudieron cargar las jornadas.'))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    if (barbero) cargarJornadas()
  }, [barbero])

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const abrirNueva = () => {
    setForm(formVacio)
    setEditandoId(null)
    setMostrarForm(true)
    setError('')
  }

  const abrirEditar = (j) => {
    setForm({
      dayOfWeek: j.dayOfWeek,
      startTime: j.startTime.substring(0, 5),
      endTime: j.endTime.substring(0, 5),
    })
    setEditandoId(j.id)
    setMostrarForm(true)
    setError('')
  }

  const cancelar = () => {
    setMostrarForm(false)
    setEditandoId(null)
    setForm(formVacio)
    setError('')
  }

  const guardar = async () => {
    if (!form.dayOfWeek || !form.startTime || !form.endTime) {
      setError('Todos los campos son obligatorios.')
      return
    }
    setGuardando(true)
    try {
      const body = {
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
      }
      if (editandoId) {
        await apiFetch(`/admin/employees/schedules/${editandoId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setExito('Jornada actualizada correctamente.')
      } else {
        await apiFetch(`/admin/employees/${barbero.employeeId}/schedules`, {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setExito('Jornada creada correctamente.')
      }
      cancelar()
      cargarJornadas()
      setTimeout(() => setExito(''), 2500)
    } catch (err) {
      setError(err.message || 'Error al guardar la jornada.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id) => {
    setEliminandoId(id)
    try {
      await apiFetch(`/admin/employees/schedules/${id}`, { method: 'DELETE' })
      setJornadas(prev => prev.filter(j => j.id !== id))
      setExito('Jornada eliminada.')
      setTimeout(() => setExito(''), 2500)
    } catch (err) {
      setError(err.message || 'Error al eliminar la jornada.')
    } finally {
      setEliminandoId(null)
    }
  }

  if (!barbero) {
    navegarA('configurarJornadas')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('configurarJornadas')}>
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
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Jornadas laborales</p>
            <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 4px' }}>
              {barbero.names} {barbero.lastNames}
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>
          <button onClick={abrirNueva} style={{
            fontSize: '13px', padding: '10px 20px', whiteSpace: 'nowrap', marginTop: '4px',
            background: '#c9a84c', border: 'none', borderRadius: '4px', color: '#0a0a0a',
            fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 'bold'
          }}>
            + Nueva jornada
          </button>
        </div>

        {exito && <p style={{ color: '#c9a84c', fontSize: '13px', marginBottom: '16px' }}>✓ {exito}</p>}
        {error && <p style={{ color: '#800020', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

        {mostrarForm && (
          <div style={{
            background: '#111', border: '1px solid #c9a84c28', borderTop: '2px solid #c9a84c',
            borderRadius: '8px', padding: '28px', marginBottom: '24px'
          }}>
            <h3 style={{ color: '#f5f0e8', fontSize: '16px', fontStyle: 'italic', marginBottom: '20px' }}>
              {editandoId ? 'Editar jornada' : 'Nueva jornada'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Día de la semana</label>
                <select name="dayOfWeek" value={form.dayOfWeek} onChange={cambiar} style={{
                  background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px',
                  color: '#f5f0e8', padding: '10px 12px', fontSize: '14px', fontFamily: 'Georgia, serif'
                }}>
                  <option value="">Seleccionar día</option>
                  {DIAS.map(d => (
                    <option key={d.valor} value={d.valor}>{d.etiqueta}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Hora inicio</label>
                  <input name="startTime" type="time" value={form.startTime} onChange={cambiar} min="08:00" max="19:00" style={{
                    background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px',
                    color: '#f5f0e8', padding: '10px 12px', fontSize: '14px', fontFamily: 'Georgia, serif'
                  }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Hora fin</label>
                  <input name="endTime" type="time" value={form.endTime} onChange={cambiar} min="08:00" max="19:00" style={{
                    background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '4px',
                    color: '#f5f0e8', padding: '10px 12px', fontSize: '14px', fontFamily: 'Georgia, serif'
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={guardar} disabled={guardando} style={{
                  flex: 1, padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '4px',
                  color: '#0a0a0a', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>
                  {guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear jornada'}
                </button>
                <button onClick={cancelar} style={{
                  padding: '12px 20px', background: 'transparent', border: '1px solid #2a2a2a',
                  borderRadius: '4px', color: '#888', fontSize: '14px', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {cargando && <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando jornadas...</p>}

        {!cargando && jornadas.length === 0 && !mostrarForm && (
          <div style={{
            background: '#111', border: '1px solid #c9a84c28', borderRadius: '8px',
            padding: '40px', textAlign: 'center'
          }}>
            <p style={{ color: '#555', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
              Este barbero no tiene jornadas configuradas.
            </p>
            <p style={{ color: '#444', fontSize: '12px', marginTop: '8px' }}>
              No aparecerá como disponible para agendar citas.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jornadas.map((j) => (
            <div key={j.id} style={{
              background: '#111', border: '1px solid #c9a84c28',
              borderLeft: '3px solid #c9a84c', borderRadius: '8px',
              padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', background: '#1a1a1a',
                border: '1.5px solid #c9a84c35', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 3px', fontWeight: 'bold' }}>
                  {nombreDia(j.dayOfWeek)}
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, fontStyle: 'italic' }}>
                  {j.startTime?.substring(0, 5)} — {j.endTime?.substring(0, 5)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => abrirEditar(j)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #c9a84c40',
                  borderRadius: '4px', color: '#c9a84c', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif'
                }}>
                  Editar
                </button>
                <button onClick={() => eliminar(j.id)} disabled={eliminandoId === j.id} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #80002040',
                  borderRadius: '4px', color: '#800020', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif'
                }}>
                  {eliminandoId === j.id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {!cargando && jornadas.length > 0 && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{jornadas.length}</span> jornada{jornadas.length !== 1 ? 's' : ''} configurada{jornadas.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
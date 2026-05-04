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

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => setServicios(data))
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
      setServicios(prev => [...prev, nuevo])
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
              </div>
              <span style={{ color: '#c9a84c', fontSize: '14px', fontWeight: 'bold' }}>
                ${parseFloat(s.price).toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>

        {!cargando && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{servicios.length}</span> servicio{servicios.length !== 1 ? 's' : ''} registrados
          </p>
        )}
      </div>
    </div>
  )
}
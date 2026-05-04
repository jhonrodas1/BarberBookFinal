import { useState, useEffect } from 'react'
import './Home.css'
import './FormPage.css'
import { apiFetch } from '../api/client'

export default function RegistrarBarbero({ navegarA, irAlInicio }) {
  const [formData, setFormData] = useState({
    names: '',
    lastNames: '',
    email: '',
    phoneNumber: '',
    documentNumber: '',
    address: '',
    password: '',
    serviceIds: [],
  })
  const [servicios, setServicios] = useState([])
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => setServicios(data))
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const toggleServicio = (id) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(s => s !== id)
        : [...prev.serviceIds, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.serviceIds.length === 0) {
      setError('Debes seleccionar al menos un servicio.')
      return
    }
    setCargando(true)
    try {
      await apiFetch('/admin/employees', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      setExito(true)
      setTimeout(() => { setExito(false); navegarA('menuAdmin') }, 1800)
    } catch (err) {
      setError(err.message || 'Error al registrar el barbero.')
    } finally {
      setCargando(false)
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
        <span className="bb-logo" onClick={irAlInicio} style={{ cursor: 'pointer' }}>BARBERBOOK</span>
        <div style={{ width: '90px' }} />
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
            Administración
          </p>
          <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px' }}>
            Registrar Barbero
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '32px' }} />

          <div style={{
            background: '#111',
            border: '1px solid #c9a84c28',
            borderTop: '2px solid #c9a84c',
            borderRadius: '8px',
            padding: '34px 36px',
          }}>
            {exito ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '38px', color: '#c9a84c', marginBottom: '12px' }}>✓</div>
                <p style={{ color: '#f5f0e8', fontSize: '15px', fontStyle: 'italic' }}>Barbero registrado con éxito</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-grupo">
                  <label>Nombre:</label>
                  <input name="names" type="text" value={formData.names} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Apellidos:</label>
                  <input name="lastNames" type="text" value={formData.lastNames} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Número de documento:</label>
                  <input name="documentNumber" type="text" value={formData.documentNumber} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Correo electrónico:</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Teléfono:</label>
                  <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Dirección:</label>
                  <input name="address" type="text" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label>Contraseña temporal:</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="form-grupo">
                  <label style={{ marginBottom: '10px', display: 'block' }}>Servicios que ofrece:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {servicios.map(s => (
                      <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f5f0e8', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.serviceIds.includes(s.id)}
                          onChange={() => toggleServicio(s.id)}
                          style={{ accentColor: '#c9a84c' }}
                        />
                        {s.name} — ${s.price.toLocaleString('es-CO')}
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p style={{ color: '#800020', fontSize: '13px' }}>{error}</p>}

                <button className="form-btn" type="submit" disabled={cargando}>
                  {cargando ? 'Registrando...' : 'Registrar Barbero'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
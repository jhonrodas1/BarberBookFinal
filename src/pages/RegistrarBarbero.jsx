import { useState } from 'react'
import './Home.css'
import './FormPage.css'

export default function RegistrarBarbero({ navegarA, irAlInicio }) {
  const [formData, setFormData] = useState({ nombre: '', especialidad: '', correo: '', password: '' })
  const [exito, setExito] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const existentes = JSON.parse(localStorage.getItem('listaBarberos')) || []
    const nuevo = { ...formData, id: Date.now(), inicial: formData.nombre.charAt(0).toUpperCase() }
    localStorage.setItem('listaBarberos', JSON.stringify([...existentes, nuevo]))
    setExito(true)
    setTimeout(() => { setExito(false); navegarA('menuAdmin') }, 1800)
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

          {/* Título */}
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
            Administración
          </p>
          <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Registrar Barbero
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '32px' }} />

          {/* Card formulario */}
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {[
                  { label: 'Nombre completo', name: 'nombre',        type: 'text',     placeholder: 'Ej: Carlos Rodríguez' },
                  { label: 'Especialidad',    name: 'especialidad',  type: 'text',     placeholder: 'Ej: Cortes modernos' },
                  { label: 'Correo electrónico', name: 'correo',     type: 'email',    placeholder: 'correo@ejemplo.com' },
                  { label: 'Contraseña provisional', name: 'password', type: 'password', placeholder: '••••••••' },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#666' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      required
                      placeholder={placeholder}
                      onChange={handleChange}
                      style={{
                        padding: '11px 14px',
                        background: '#0d0d0d',
                        border: '1px solid #252525',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'Georgia, serif',
                        color: '#f5f0e8',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#c9a84c55'}
                      onBlur={e => e.target.style.borderColor = '#252525'}
                    />
                  </div>
                ))}

                <button type="submit" style={{
                  marginTop: '6px',
                  padding: '13px',
                  background: '#c9a84c',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                  fontFamily: 'Georgia, serif',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.target.style.background = '#d4b55c'}
                  onMouseLeave={e => e.target.style.background = '#c9a84c'}
                >
                  Registrar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import './FormPage.css'

function Login({ navegarA, iniciarSesion }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  const manejarLogin = () => {
    if (!correo || !contrasena) {
      setError('Por favor completa todos los campos.')
      return
    }
    // Por ahora sin backend: simulamos que cualquier correo/contraseña válidos funcionan
    // Más adelante aquí irá la llamada al backend
    iniciarSesion({ nombre: correo.split('@')[0], correo, rol: null })
    navegarA('seleccionRol')
  }

  return (
    <div className="home-container">

      <div className="form-logo-bar">
        <h1 className="form-logo" onClick={() => navegarA('home')} style={{ cursor: 'pointer' }}>
          BARBERBOOK
        </h1>
      </div>

      <main className="form-main">
        <h2 className="form-titulo">Ingresar</h2>

        <div className="form-card">
          <div className="form-grupo">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={correo}
              onChange={e => { setCorreo(e.target.value); setError('') }}
            />
          </div>
          <div className="form-grupo">
            <label>Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={e => { setContrasena(e.target.value); setError('') }}
            />
          </div>

          {error && <p style={{ color: '#800020', fontSize: '13px', fontFamily: 'Georgia, serif' }}>{error}</p>}

          <button className="form-btn" onClick={manejarLogin}>
            Inicio de sesión
          </button>
        </div>

        <p className="form-link" onClick={() => navegarA('registro')}>
          ¿No tienes cuenta? Regístrate
        </p>
      </main>

    </div>
  )
}

export default Login
import { useState } from 'react'
import './FormPage.css'

function Registro({ navegarA, iniciarSesion }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  const manejarRegistro = () => {
    if (!nombre || !correo || !contrasena) {
      setError('Por favor completa todos los campos.')
      return
    }
    // Guardamos los datos del usuario (sin rol aún, lo elige en la siguiente pantalla)
    iniciarSesion({ nombre, correo, rol: null })
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
        <h2 className="form-titulo">Registro</h2>

        <div className="form-card">
          <div className="form-grupo">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={e => { setNombre(e.target.value); setError('') }}
            />
          </div>
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

          <button className="form-btn" onClick={manejarRegistro}>
            Registrar
          </button>
        </div>

        <p className="form-link" onClick={() => navegarA('login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </main>

    </div>
  )
}

export default Registro
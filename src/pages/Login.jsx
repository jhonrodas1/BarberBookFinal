import { useState } from 'react'
import './FormPage.css'
import { apiFetch } from '../api/client'

function Login({ navegarA, iniciarSesion }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async () => {
    if (!correo || !contrasena) {
      setError('Por favor completa todos los campos.')
      return
    }
    setCargando(true)
    try {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: correo,
      password: contrasena
    }),
  })

  localStorage.setItem('token', data.token)

  const rol = data.role?.toLowerCase()

  iniciarSesion({
    nombre: data.names,
    correo,
    rol
  })

  if (data.passwordTemporary) {
    navegarA('cambiarContrasena')
  } else if (rol === 'administrador') {
    navegarA('menuAdmin')
  } else if (rol === 'barbero') {
    navegarA('menuBarbero')
  } else {
    navegarA('menuCliente')
  }

} catch (e) {
  setError('Correo o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
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
          <button className="form-btn" onClick={manejarLogin} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Inicio de sesión'}
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
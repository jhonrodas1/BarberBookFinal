import { useState } from 'react'
import './FormPage.css'
import { apiFetch } from '../api/client'

function Registro({ navegarA, iniciarSesion }) {
  const [form, setForm] = useState({
    names: '',
    lastNames: '',
    correo: '',
    phoneNumber: '',
    contrasena: '',
    confirmar: '',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const manejarRegistro = async () => {
    if (!form.names || !form.lastNames || !form.correo || !form.phoneNumber || !form.contrasena || !form.confirmar) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setCargando(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: form.correo,
          password: form.contrasena,
          confirmPassword: form.confirmar,
          names: form.names,
          lastNames: form.lastNames,
          phoneNumber: form.phoneNumber,
        }),
      })

      // Registro exitoso → hacer login automático
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.correo, password: form.contrasena }),
      })

      localStorage.setItem('token', data.token)
      const rol = data.role?.toLowerCase()
      iniciarSesion({ nombre: form.names, correo: form.correo, rol })

      if (rol === 'admin') navegarA('menuAdmin')
      else if (rol === 'barbero') navegarA('menuBarbero')
      else navegarA('menuCliente')

    } catch (e) {
      setError(e.message || 'Error al registrar. Verifica los datos.')
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
        <h2 className="form-titulo">Registro</h2>
        <div className="form-card">
          <div className="form-grupo">
            <label>Nombre:</label>
            <input name="names" type="text" value={form.names} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Apellidos:</label>
            <input name="lastNames" type="text" value={form.lastNames} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Correo electrónico:</label>
            <input name="correo" type="email" value={form.correo} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Teléfono:</label>
            <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Contraseña:</label>
            <input name="contrasena" type="password" value={form.contrasena} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Confirmar contraseña:</label>
            <input name="confirmar" type="password" value={form.confirmar} onChange={cambiar} />
          </div>

          {error && <p style={{ color: '#800020', fontSize: '13px', fontFamily: 'Georgia, serif' }}>{error}</p>}

          <button className="form-btn" onClick={manejarRegistro} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar'}
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
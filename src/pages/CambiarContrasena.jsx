import { useState } from 'react'
import './FormPage.css'
import { apiFetch } from '../api/client'

export default function CambiarContrasena({ navegarA, usuario, iniciarSesion }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Completa todos los campos.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }
    setCargando(true)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      })

      // Login automático con la nueva contraseña para renovar el token
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: usuario.correo, password: form.newPassword }),
      })

      localStorage.setItem('token', data.token)
      const rol = data.role?.toLowerCase()
      iniciarSesion({ nombre: data.names, correo: usuario.correo, rol })

      if (rol === 'administrador') navegarA('menuAdmin')
      else if (rol === 'barbero') navegarA('menuBarbero')
      else navegarA('menuCliente')

    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="home-container">
      <div className="form-logo-bar">
        <h1 className="form-logo">BARBERBOOK</h1>
      </div>
      <main className="form-main">
        <h2 className="form-titulo">Cambiar Contraseña</h2>
        <p style={{ color: '#888', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', marginBottom: '20px' }}>
          Debes cambiar tu contraseña temporal antes de continuar.
        </p>
        <div className="form-card">
          <div className="form-grupo">
            <label>Contraseña actual:</label>
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Nueva contraseña:</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={cambiar} />
          </div>
          <div className="form-grupo">
            <label>Confirmar nueva contraseña:</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={cambiar} />
          </div>

          {error && <p style={{ color: '#800020', fontSize: '13px', fontFamily: 'Georgia, serif' }}>{error}</p>}

          <button className="form-btn" onClick={handleSubmit} disabled={cargando}>
            {cargando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </main>
    </div>
  )
}
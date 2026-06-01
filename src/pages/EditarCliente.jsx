import { useState, useEffect } from 'react'
import './EditarCliente.css'

function EditarCliente({ usuario, clienteId, onVolver }) {
  const [form, setForm] = useState({ names: '', lastNames: '', phone: '' })
  const [errores, setErrores] = useState({})
  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (usuario) {
      setForm({
        names: usuario.nombres || '',
        lastNames: usuario.apellidos || '',
        phone: usuario.telefono || '',
      })
    }
  }, [usuario])

  const validar = () => {
    const nuevosErrores = {}
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/
    const soloNumeros = /^[0-9]{7,15}$/

    if (form.names && !soloLetras.test(form.names)) {
      nuevosErrores.names = 'El nombre no puede contener caracteres numéricos'
    }
    if (form.lastNames && !soloLetras.test(form.lastNames)) {
      nuevosErrores.lastNames = 'Los apellidos no pueden contener caracteres numéricos'
    }
    if (form.phone && !soloNumeros.test(form.phone)) {
      nuevosErrores.phone = 'El teléfono debe contener entre 7 y 15 dígitos'
    }
    if (!form.names && !form.lastNames && !form.phone) {
      nuevosErrores.general = 'Debes modificar al menos un campo'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrores(prev => ({ ...prev, [name]: '', general: '' }))
    setMensajeExito('')
    setMensajeError('')
  }

  const handleSubmit = async () => {
    if (!validar()) return

    setCargando(true)
    setMensajeExito('')
    setMensajeError('')

    const body = {}
    if (form.names.trim())     body.names     = form.names.trim()
    if (form.lastNames.trim()) body.lastNames  = form.lastNames.trim()
    if (form.phone.trim())     body.phone      = form.phone.trim()

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/clients/${clienteId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        setMensajeExito(data.message || 'Los datos fueron actualizados correctamente.')
      } else if (res.status === 403) {
        setMensajeError('Autorización denegada: no tienes permisos para editar este perfil.')
      } else if (res.status === 404) {
        setMensajeError('Cliente no encontrado.')
      } else if (res.status === 409) {
        setMensajeError(data.error || 'El teléfono ya está registrado por otro cliente.')
      } else if (res.status === 400 && data.errors) {
        const backendErrors = {}
        Object.entries(data.errors).forEach(([campo, msg]) => {
          backendErrors[campo] = msg
        })
        setErrores(backendErrors)
      } else {
        setMensajeError(data.error || 'Ocurrió un error al actualizar los datos.')
      }
    } catch {
      setMensajeError('Error de conexión. Intenta de nuevo más tarde.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="ec-container">
      <div className="ec-card">
        <div className="ec-header">
          <button className="ec-back-btn" onClick={onVolver}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="ec-title-wrap">
            <span className="ec-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            <h2 className="ec-title">Editar Perfil</h2>
          </div>
        </div>

        <p className="ec-subtitle">
          Modifica solo los campos que desees actualizar.
        </p>

        {mensajeExito && (
          <div className="ec-alert ec-alert--success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {mensajeExito}
          </div>
        )}

        {mensajeError && (
          <div className="ec-alert ec-alert--error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {mensajeError}
          </div>
        )}

        {errores.general && (
          <div className="ec-alert ec-alert--error">{errores.general}</div>
        )}

        <div className="ec-form">
          <div className="ec-field">
            <label className="ec-label">Nombres</label>
            <input
              className={`ec-input${errores.names ? ' ec-input--error' : ''}`}
              type="text"
              name="names"
              value={form.names}
              onChange={handleChange}
              placeholder="Ej: Juan Carlos"
              autoComplete="off"
            />
            {errores.names && <span className="ec-field-error">{errores.names}</span>}
          </div>

          <div className="ec-field">
            <label className="ec-label">Apellidos</label>
            <input
              className={`ec-input${errores.lastNames ? ' ec-input--error' : ''}`}
              type="text"
              name="lastNames"
              value={form.lastNames}
              onChange={handleChange}
              placeholder="Ej: Pérez García"
              autoComplete="off"
            />
            {errores.lastNames && <span className="ec-field-error">{errores.lastNames}</span>}
          </div>

          <div className="ec-field">
            <label className="ec-label">Teléfono</label>
            <input
              className={`ec-input${errores.phone ? ' ec-input--error' : ''}`}
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
              autoComplete="off"
              maxLength={15}
            />
            {errores.phone && <span className="ec-field-error">{errores.phone}</span>}
          </div>
        </div>

        <div className="ec-actions">
          <button className="ec-btn ec-btn--secondary" onClick={onVolver}>
            Cancelar
          </button>
          <button
            className="ec-btn ec-btn--primary"
            onClick={handleSubmit}
            disabled={cargando}
          >
            {cargando ? (
              <span className="ec-spinner" />
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditarCliente
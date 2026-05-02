import { useState } from 'react'
import './GestionCitasBarbero.css'
import './Home.css'

export default function GestionCitasBarbero({ navegarA, usuario }) {
  const [citasState, setCitasState] = useState(() => {
    return JSON.parse(localStorage.getItem('citas')) || []
  })
  const [confirmando, setConfirmando] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const misCitas = citasState.filter(c => c.barbero === usuario?.nombre)
  const ordenadas = [...misCitas].sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora))

  const esDentroDeProximas24Horas = (fecha, hora) => {
    const fechaHoraCita = new Date(`${fecha}T${hora}`)
    const ahora = new Date()
    const diff = fechaHoraCita - ahora
    return diff >= 0 && diff < 24 * 60 * 60 * 1000
  }

  const esPasada = (fecha, hora) => {
    const fechaHoraCita = new Date(`${fecha}T${hora}`)
    return fechaHoraCita < new Date()
  }

  const handleCancelar = (cita) => {
    if (esDentroDeProximas24Horas(cita.fecha, cita.hora)) {
      setMensaje({
        tipo: 'error',
        texto: 'No se puede cancelar una cita dentro de las próximas 24 horas.'
      })
      setTimeout(() => setMensaje(null), 3500)
      return
    }
    setConfirmando(cita)
  }

  const confirmarCancelacion = () => {
    const todasLasCitas = JSON.parse(localStorage.getItem('citas')) || []
    const actualizadas = todasLasCitas.filter(c =>
      !(c.barbero === confirmando.barbero &&
        c.fecha === confirmando.fecha &&
        c.hora === confirmando.hora &&
        c.cliente === confirmando.cliente)
    )
    localStorage.setItem('citas', JSON.stringify(actualizadas))
    setCitasState(actualizadas)
    setConfirmando(null)
    setMensaje({ tipo: 'exito', texto: 'Cita cancelada exitosamente.' })
    setTimeout(() => setMensaje(null), 3000)
  }

  const getEstado = (cita) => {
    if (esPasada(cita.fecha, cita.hora)) return { label: 'Completada', clase: 'estado-completada' }
    if (esDentroDeProximas24Horas(cita.fecha, cita.hora)) return { label: 'Próxima (24h)', clase: 'estado-proxima' }
    return { label: 'Confirmada', clase: 'estado-confirmada' }
  }

  return (
    <div className="gc-container">
      {/* Header */}
      <div className="gc-header">
        <button className="bb-back" onClick={() => navegarA('menuBarbero')}>
          <span className="bb-back-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg></span>
          Volver
        </button>
        <h1 className="gc-brand">BARBERBOOK</h1>
        <div className="gc-header-spacer" />
      </div>

      <div className="gc-content">
        <div className="gc-title-row">
          <h2 className="gc-title">Gestión de Citas</h2>
          <div className="gc-ornament">✦</div>
        </div>
        <p className="gc-subtitle">Solo puedes cancelar citas con más de 24 horas de anticipación.</p>

        {/* Mensaje flash */}
        {mensaje && (
          <div className={`gc-mensaje gc-mensaje-${mensaje.tipo}`}>
            {mensaje.tipo === 'error' ? '✕' : '✓'} {mensaje.texto}
          </div>
        )}

        {ordenadas.length === 0 ? (
          <div className="gc-empty">
            <div className="gc-empty-icon">✂</div>
            <p>No tienes citas asignadas.</p>
          </div>
        ) : (
          <div className="gc-lista">
            {ordenadas.map((c, i) => {
              const estado = getEstado(c)
              const pasada = esPasada(c.fecha, c.hora)
              const proxima24 = esDentroDeProximas24Horas(c.fecha, c.hora)
              const puedeCancelar = !pasada && !proxima24

              return (
                <div key={i} className={`gc-card ${pasada ? 'gc-card-pasada' : ''}`}>
                  <div className="gc-card-left">
                    <div className="gc-card-datetime">
                      <span className="gc-card-fecha">{c.fecha}</span>
                      <span className="gc-card-hora">{c.hora}</span>
                    </div>
                    <div className="gc-card-info">
                      <p className="gc-card-cliente">
                        <span className="gc-label">Cliente</span>
                        {c.cliente}
                      </p>
                      <p className="gc-card-servicio">
                        <span className="gc-label">Servicio</span>
                        {c.servicio}
                      </p>
                    </div>
                  </div>
                  <div className="gc-card-right">
                    <span className={`gc-estado ${estado.clase}`}>{estado.label}</span>
                    {!pasada && (
                      <button
                        className={`gc-btn-cancelar ${!puedeCancelar ? 'gc-btn-disabled' : ''}`}
                        onClick={() => handleCancelar(c)}
                        disabled={!puedeCancelar}
                        title={!puedeCancelar ? 'No se puede cancelar dentro de 24h' : 'Cancelar cita'}
                      >
                        {proxima24 ? '🔒 Bloqueada' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal confirmación */}
      {confirmando && (
        <div className="gc-overlay">
          <div className="gc-modal">
            <div className="gc-modal-icon">⚠</div>
            <h3 className="gc-modal-title">¿Cancelar esta cita?</h3>
            <div className="gc-modal-info">
              <p><strong>{confirmando.fecha}</strong> a las <strong>{confirmando.hora}</strong></p>
              <p>Cliente: {confirmando.cliente}</p>
              <p>Servicio: {confirmando.servicio}</p>
            </div>
            <p className="gc-modal-warning">Esta acción no se puede deshacer.</p>
            <div className="gc-modal-btns">
              <button className="gc-modal-btn-secondary" onClick={() => setConfirmando(null)}>
                Volver
              </button>
              <button className="gc-modal-btn-danger" onClick={confirmarCancelacion}>
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

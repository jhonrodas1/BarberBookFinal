import { useState, useEffect } from 'react'
import './Servicios.css'
import './Home.css'
import { apiFetch } from '../api/client'

function Servicios({ navegarA, irAlInicio, origen = 'home' }) {
  const [servicios, setServicios] = useState([])

  const [formData, setFormData] = useState({
    serviceIds: []
  })

  useEffect(() => {
    apiFetch('/appointments/services')
      .then(data => setServicios(data))
      .catch(err => console.error(err))
  }, [])

  const toggleServicio = (id) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(s => s !== id)
        : [...prev.serviceIds, id]
    }))
  }

  return (
    <div className="sv-page">
      <header className="sv-header">
        <button className="bb-back" onClick={() => navegarA(origen)}>
          <span className="bb-back-icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </span>
          Volver
        </button>

        <span
          className="bb-logo"
          onClick={irAlInicio}
          style={{ cursor: 'pointer' }}
        >
          BARBERBOOK
        </span>

        <div style={{ width: '90px' }} />
      </header>

      <main className="sv-main">
        <div className="sv-ornament">— ✦ —</div>

        <h2 className="sv-titulo">Nuestros Servicios</h2>

        <div className="sv-divider" />

        <div className="form-grupo">
          <label>Servicios que ofrece:</label>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            {servicios.map(s => (
              <label
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#f5f0e8',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.serviceIds.includes(s.id)}
                  onChange={() => toggleServicio(s.id)}
                />

                {s.name} — ${s.price.toLocaleString('es-CO')}
              </label>
            ))}
          </div>
        </div>

        <button>
          Guardar
        </button>
      </main>
    </div>
  )
}

export default Servicios
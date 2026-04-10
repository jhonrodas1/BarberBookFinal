import { useEffect, useState } from 'react'
import './Barberos.css'

function Barberos({ navegarA, irAlInicio, origen = 'home' }) {
  const [listaBarberos, setListaBarberos] = useState([])

  useEffect(() => {
    // 1. Nuestros barberos iniciales
    const iniciales = [
      { inicial: 'C', nombre: 'Carlos Rodríguez', especialidad: 'Especialista en cortes', descripcion: '10 años de experiencia' },
      { inicial: 'M', nombre: 'Miguel Ángel Torres', especialidad: 'Experto en estilos modernos', descripcion: 'y diseño de barba' },
      { inicial: 'D', nombre: 'Diego Fernández', especialidad: 'Maestro barbero especializado', descripcion: 'en afeitado clásico' },
    ]

    // 2. Traer los barberos registrados por el Admin desde el almacenamiento
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []

    // 3. Unir ambos en una sola lista
    setListaBarberos([...iniciales, ...guardados])
  }, [])

  return (
    <div className="home-container">
      <div className="sv-header">
        <span className="sv-flecha" onClick={() => navegarA(origen)}>←</span>
        <h1 className="sv-logo" onClick={irAlInicio} style={{ cursor: 'pointer' }}>BARBERBOOK</h1>
      </div>

      <main className="sv-main">
        <div className="sv-titulo-box">
          <h2 className="sv-titulo" style={{ fontStyle: 'italic' }}>Barberos</h2>
        </div>

        <div className="sv-lista">
          {listaBarberos.map((b, i) => (
            <div className="bb-item" key={i}>
              {/* Usamos la inicial que viene del objeto o la primera letra del nombre */}
              <div className="bb-avatar">{b.inicial || b.nombre.charAt(0).toUpperCase()}</div>
              <div className="bb-info">
                <p className="bb-nombre">{b.nombre}</p>
                <p className="bb-esp"><em>{b.especialidad}</em></p>
                <p className="bb-esp">{b.descripcion || b.correo}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Barberos
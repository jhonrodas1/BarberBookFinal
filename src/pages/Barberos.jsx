import { useEffect, useState } from 'react'
import './Barberos.css'
import './Home.css'

function Barberos({ navegarA, irAlInicio, origen = 'home' }) {
  const [listaBarberos, setListaBarberos] = useState([])

  useEffect(() => {
    const iniciales = [
      { inicial: 'C', nombre: 'Carlos Rodríguez', especialidad: 'Especialista en cortes', descripcion: '10 años de experiencia' },
      { inicial: 'M', nombre: 'Miguel Ángel Torres', especialidad: 'Experto en estilos modernos', descripcion: 'y diseño de barba' },
      { inicial: 'D', nombre: 'Diego Fernández', especialidad: 'Maestro barbero especializado', descripcion: 'en afeitado clásico' },
    ]
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    setListaBarberos([...iniciales, ...guardados])
  }, [])

  return (
    <div className="bb-page">
      <header className="bb-page-header">
        <button className="bb-back" onClick={() => navegarA(origen)}>
          <span className="bb-back-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
          </span>
          Volver
        </button>
        <span className="bb-logo" onClick={irAlInicio} style={{cursor:'pointer'}}>BARBERBOOK</span>
        <div style={{width:'90px'}}/>
      </header>
      <main className="bb-page-main">
        <div className="bb-ornament">— ✦ —</div>
        <h2 className="bb-page-titulo">Nuestros Barberos</h2>
        <div className="bb-page-divider"/>
        <div className="bb-lista">
          {listaBarberos.map((b, i) => (
            <div className="bb-item" key={i}>
              <div className="bb-avatar">{b.inicial || b.nombre.charAt(0).toUpperCase()}</div>
              <div className="bb-info">
                <p className="bb-nombre">{b.nombre}</p>
                <p className="bb-esp">{b.especialidad}</p>
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

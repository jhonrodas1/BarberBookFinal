import './Servicios.css'
import './Home.css'

const servicios = [
  { nombre: 'Corte de cabello', precio: '$ 15.000' },
  { nombre: 'Corte de Barba',   precio: '$ 12.000' },
  { nombre: 'Afeitado',         precio: '$ 15.000' },
  { nombre: 'Corte y Barba',    precio: '$ 20.000' },
]

function Servicios({ navegarA, irAlInicio, origen = 'home' }) {
  return (
    <div className="sv-page">
      <header className="sv-header">
        <button className="bb-back" onClick={() => navegarA(origen)}>
          <span className="bb-back-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
          </span>
          Volver
        </button>
        <span className="bb-logo" onClick={irAlInicio} style={{cursor:'pointer'}}>BARBERBOOK</span>
        <div style={{width:'90px'}}/>
      </header>
      <main className="sv-main">
        <div className="sv-ornament">— ✦ —</div>
        <h2 className="sv-titulo">Nuestros Servicios</h2>
        <div className="sv-divider"/>
        <div className="sv-lista">
          {servicios.map((s, i) => (
            <div className="sv-item" key={i}>
              <span className="sv-icono">✂</span>
              <span className="sv-nombre">{s.nombre}</span>
              <span className="sv-precio">{s.precio}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
export default Servicios

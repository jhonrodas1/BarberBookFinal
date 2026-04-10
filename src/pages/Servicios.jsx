import './Servicios.css'

const servicios = [
  { nombre: 'Corte de cabello', precio: '$ 15.000' },
  { nombre: 'Corte de Barba',   precio: '$ 12.000' },
  { nombre: 'Afeitado',         precio: '$ 15.000' },
  { nombre: 'Corte y Barba',    precio: '$ 20.000' },
]

function Servicios({ navegarA, irAlInicio, origen = 'home' }) {
  return (
    <div className="home-container">

      <div className="sv-header">
        <span className="sv-flecha" onClick={() => navegarA(origen)}>←</span>
        <h1 className="sv-logo" onClick={irAlInicio} style={{ cursor: 'pointer' }}>BARBERBOOK</h1>
      </div>

      <main className="sv-main">
        <div className="sv-titulo-box">
          <h2 className="sv-titulo">Nuestros Servicios</h2>
        </div>

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
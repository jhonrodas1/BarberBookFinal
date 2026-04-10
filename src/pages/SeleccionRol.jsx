import './FormPage.css'
import './SeleccionRol.css'

function SeleccionRol({ navegarA, usuario, setUsuario }) {

  const elegirRol = (rol) => {
    // Guardamos el rol elegido en el usuario
    setUsuario({ ...usuario, rol })
    if (rol === 'cliente')  navegarA('menuCliente')
    if (rol === 'barbero')  navegarA('menuBarbero')
    if (rol === 'admin')    navegarA('menuAdmin')
  }

  return (
    <div className="home-container">
      <div className="form-logo-bar">
        <h1 className="form-logo" style={{ cursor: 'default' }}>BARBERBOOK</h1>
      </div>

      <main className="rol-main">
        <p className="rol-subtitulo">Ingresa qué tipo de usuario eres</p>
        <button className="home-btn" onClick={() => elegirRol('cliente')}>Cliente</button>
        <button className="home-btn" onClick={() => elegirRol('barbero')}>Barbero</button>
        <button className="home-btn" onClick={() => elegirRol('admin')}>Administrador</button>
      </main>
    </div>
  )
}

export default SeleccionRol
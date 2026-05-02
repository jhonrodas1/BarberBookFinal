import './FormPage.css'

function SeleccionRol({ navegarA, usuario, setUsuario }) {
  const elegirRol = (rol) => {
    setUsuario({ ...usuario, rol })
    if (rol === 'cliente') navegarA('menuCliente')
    if (rol === 'barbero') navegarA('menuBarbero')
    if (rol === 'admin')   navegarA('menuAdmin')
  }

  const roles = [
    { id: 'cliente', label: 'Cliente', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { id: 'barbero', label: 'Barbero', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3a3 3 0 0 1 6 0v2M6 3a3 3 0 0 0-3 3v1h18V6a3 3 0 0 0-3-3M3 9v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9"/><path d="M9 12h6"/></svg> },
    { id: 'admin',   label: 'Administrador', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg> },
  ]

  return (
    <div className="fp-page">
      <header className="form-logo-bar">
        <span className="bb-scissors">✂</span>&nbsp;
        <span className="form-logo">BARBERBOOK</span>
      </header>
      <main className="rol-main">
        <p className="rol-subtitulo">Selecciona tu perfil</p>
        {roles.map(r => (
          <div key={r.id} className="rol-card" onClick={() => elegirRol(r.id)}>
            <div className="rol-card-left">
              <div className="rol-icon">{r.icon}</div>
              <span className="rol-name">{r.label}</span>
            </div>
            <span className="rol-arrow">→</span>
          </div>
        ))}
      </main>
    </div>
  )
}
export default SeleccionRol

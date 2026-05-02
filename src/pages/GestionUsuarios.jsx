import './Home.css'

export default function GestionUsuarios({ navegarA }) {
  const citas = JSON.parse(localStorage.getItem('citas')) || []
  const clientes = [...new Set(citas.map(c => c.cliente).filter(Boolean))]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuAdmin')}>
          <span className="bb-back-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
          </span>
          Volver
        </button>
        <span className="bb-logo">BARBERBOOK</span>
        <div style={{ width: '90px' }} />
      </header>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 28px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Administración</p>
        <h2 style={{ fontSize: '26px', fontStyle: 'italic', color: '#f5f0e8', marginBottom: '4px', letterSpacing: '0.5px' }}>Gestión de Usuarios</h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom: '32px' }} />

        {clientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#444' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', color: '#222' }}>👤</div>
            <p style={{ fontStyle: 'italic', fontSize: '14px' }}>No hay usuarios registrados con citas aún.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientes.map((nombre, i) => {
              const citasCliente = citas.filter(c => c.cliente === nombre)
              const proxima = citasCliente
                .filter(c => new Date(c.fecha + 'T12:00:00') >= new Date())
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]

              return (
                <div key={i} style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderLeft: '3px solid #c9a84c40',
                  borderRadius: '8px',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Avatar inicial */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', flexShrink: 0,
                  }}>
                    {nombre.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 4px', letterSpacing: '0.3px' }}>{nombre}</p>
                    <p style={{ fontSize: '12px', color: '#555', margin: 0, fontStyle: 'italic' }}>
                      {citasCliente.length} cita{citasCliente.length !== 1 ? 's' : ''} agendada{citasCliente.length !== 1 ? 's' : ''}
                      {proxima ? ` · próxima: ${proxima.fecha}` : ''}
                    </p>
                  </div>

                  {/* Badge */}
                  <span style={{
                    fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: '20px',
                    background: '#0d2a1a', color: '#5cb85c', border: '1px solid #2d6a4f',
                    whiteSpace: 'nowrap',
                  }}>
                    Activo
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {clientes.length > 0 && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{clientes.length}</span> usuario{clientes.length !== 1 ? 's' : ''} con citas registradas
          </p>
        )}
      </div>
    </div>
  )
}

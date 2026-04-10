import './MenuCliente.css'

export default function GestionUsuarios({ navegarA }) {
  const citas = JSON.parse(localStorage.getItem('citas')) || []
  const clientes = [...new Set(citas.map(c => c.cliente).filter(Boolean))]

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 30px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }} onClick={() => navegarA('menuAdmin')}>←</span>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#800020', letterSpacing: '3px', fontSize: '22px', margin: 0 }}>BARBERBOOK</h1>
      </div>
      <div style={{ padding: '30px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '24px' }}>Gestión de Usuarios</h2>
        {clientes.length === 0
          ? <p style={{ fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic' }}>No hay usuarios registrados con citas.</p>
          : clientes.map((nombre, i) => {
            const citasCliente = citas.filter(c => c.cliente === nombre)
            return (
              <div key={i} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px 24px', marginBottom: '12px', background: '#fff', maxWidth: '600px' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{nombre}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#555' }}>{citasCliente.length} cita(s) agendada(s)</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

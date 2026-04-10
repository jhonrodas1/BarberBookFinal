import './MenuCliente.css'

export default function AgendaBarbero({ navegarA, usuario }) {
  const citas = JSON.parse(localStorage.getItem('citas')) || []
  const misCitas = citas.filter(c => c.barbero === usuario?.nombre)
  const ordenadas = [...misCitas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 30px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }} onClick={() => navegarA('menuBarbero')}>←</span>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#800020', letterSpacing: '3px', fontSize: '22px', margin: 0 }}>BARBERBOOK</h1>
      </div>
      <div style={{ padding: '30px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '24px' }}>Mi Agenda</h2>
        {ordenadas.length === 0
          ? <p style={{ fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic' }}>No tienes citas asignadas.</p>
          : ordenadas.map((c, i) => (
            <div key={i} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px 24px', marginBottom: '12px', background: '#fff', maxWidth: '500px', borderLeft: '4px solid #800020' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>{c.fecha} · {c.hora}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#555' }}>Cliente: {c.cliente}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#555' }}>Servicio: {c.servicio}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

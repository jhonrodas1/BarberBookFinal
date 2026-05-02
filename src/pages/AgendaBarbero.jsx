import './Home.css'

export default function AgendaBarbero({ navegarA, usuario }) {
  const citas = JSON.parse(localStorage.getItem('citas')) || []
  const misCitas = citas.filter(c => c.barbero === usuario?.nombre)
  const ordenadas = [...misCitas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', fontFamily:'Georgia, serif' }}>
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuBarbero')}>
          <span className="bb-back-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg></span>
          Volver
        </button>
        <span className="bb-logo">BARBERBOOK</span>
        <div style={{width:'90px'}}/>
      </header>

      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'40px 24px' }}>
        <p style={{ fontSize:'11px', letterSpacing:'3px', color:'#555', textTransform:'uppercase', marginBottom:'8px' }}>Mi panel</p>
        <h2 style={{ fontSize:'26px', fontStyle:'italic', color:'#f5f0e8', marginBottom:'4px' }}>Mi Agenda</h2>
        <div style={{ width:'40px', height:'1px', background:'linear-gradient(to right, transparent, #c9a84c, transparent)', marginBottom:'28px' }}/>

        {ordenadas.length === 0
          ? <p style={{ color:'#555', fontStyle:'italic', fontSize:'14px' }}>No tienes citas asignadas.</p>
          : ordenadas.map((c, i) => (
            <div key={i} style={{ background:'#111', border:'1px solid #1e1e1e', borderLeft:'3px solid #c9a84c', borderRadius:'6px', padding:'16px 22px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ color:'#c9a84c', fontSize:'13px', fontWeight:'bold', marginBottom:'4px' }}>{c.fecha} · {c.hora}</p>
                <p style={{ color:'#ccc', fontSize:'13px', margin:'2px 0' }}>Cliente: {c.cliente}</p>
                <p style={{ color:'#888', fontSize:'12px', fontStyle:'italic' }}>{c.servicio}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

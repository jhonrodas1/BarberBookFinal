import { useEffect, useState } from 'react'
import './MisCitas.css'
import './Home.css'

const barberos = ['Carlos Rodríguez','Miguel Ángel Torres','Diego Fernández']
const servicios = [
  { nombre: 'Corte de cabello', precio: '$15.000' },
  { nombre: 'Corte de Barba', precio: '$12.000' },
  { nombre: 'Afeitado', precio: '$15.000' },
  { nombre: 'Corte y Barba', precio: '$20.000' },
]
const horas = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

export default function MisCitas({ navegarA }) {
  const [citas, setCitas] = useState([])
  const [editandoIndex, setEditandoIndex] = useState(null)
  const [citaEditada, setCitaEditada] = useState({})

  useEffect(() => {
    setCitas(JSON.parse(localStorage.getItem('citas')) || [])
  }, [])

  function cancelarCita(index) {
    const nuevas = citas.filter((_, i) => i !== index)
    setCitas(nuevas)
    localStorage.setItem('citas', JSON.stringify(nuevas))
  }

  function abrirModificar(index) {
    setEditandoIndex(index)
    setCitaEditada({ ...citas[index] })
  }

  function guardarModificacion() {
    const nuevas = citas.map((c, i) => i === editandoIndex ? citaEditada : c)
    setCitas(nuevas)
    localStorage.setItem('citas', JSON.stringify(nuevas))
    setEditandoIndex(null)
  }

  return (
    <div className="mc2-page">
      <header className="bb-header">
        <button className="bb-back" onClick={() => navegarA('menuCliente')}>
          <span className="bb-back-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg></span>
          Volver
        </button>
        <span className="bb-logo">BARBERBOOK</span>
        <div style={{width:'90px'}}/>
      </header>

      <div className="mc2-body">
        <p className="mc2-eyebrow">Mi cuenta</p>
        <h2 className="mc2-title">Mis Citas</h2>
        <div className="mc2-divider"/>

        {citas.length === 0 ? (
          <p className="mc2-empty">No tienes citas agendadas.</p>
        ) : (
          citas.map((cita, index) => (
            <div key={index}>
              <div className="mc2-card">
                <div className="mc2-card-info">
                  <p><strong>Fecha</strong>&nbsp; {cita.fecha}</p>
                  <p><strong>Hora</strong>&nbsp; {cita.hora}</p>
                  <p><strong>Servicio</strong>&nbsp; {cita.servicio}</p>
                  <p><strong>Barbero</strong>&nbsp; {cita.barbero}</p>
                </div>
                <div className="mc2-acciones">
                  <button className="mc2-btn-mod" onClick={() => abrirModificar(index)}>Modificar</button>
                  <button className="mc2-btn-cancel" onClick={() => cancelarCita(index)}>Cancelar</button>
                </div>
              </div>

              {editandoIndex === index && (
                <div className="mc2-editar">
                  <label>Barbero</label>
                  <select value={citaEditada.barbero} onChange={e => setCitaEditada({...citaEditada, barbero: e.target.value})}>
                    {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <label>Servicio</label>
                  <select value={citaEditada.servicio} onChange={e => setCitaEditada({...citaEditada, servicio: e.target.value})}>
                    {servicios.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre} — {s.precio}</option>)}
                  </select>
                  <label>Fecha</label>
                  <input type="date" value={citaEditada.fecha} onChange={e => setCitaEditada({...citaEditada, fecha: e.target.value})}/>
                  <label>Hora</label>
                  <select value={citaEditada.hora} onChange={e => setCitaEditada({...citaEditada, hora: e.target.value})}>
                    {horas.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <div className="mc2-editar-btns">
                    <button className="bb-btn-gold" style={{fontSize:'13px',padding:'9px 18px'}} onClick={guardarModificacion}>Guardar</button>
                    <button className="mc2-btn-cancel" onClick={() => setEditandoIndex(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        <button className="bb-btn-outline mc2-btn-agendar" onClick={() => navegarA('citas')}>
          + Agendar nueva cita
        </button>
      </div>
    </div>
  )
}

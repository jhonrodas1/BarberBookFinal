import { useEffect, useState } from "react";
import "./MisCitas.css";

const barberos = [
  'Carlos Rodríguez',
  'Miguel Ángel Torres',
  'Diego Fernández',
];

const servicios = [
  { nombre: 'Corte de cabello', precio: '$15.000' },
  { nombre: 'Corte de Barba', precio: '$12.000' },
  { nombre: 'Afeitado', precio: '$15.000' },
  { nombre: 'Corte y Barba', precio: '$20.000' },
];

const horas = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function MisCitas({ navegarA }) {
  const [citas, setCitas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [citaEditada, setCitaEditada] = useState({});

  useEffect(() => {
    const citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    setCitas(citasGuardadas);
  }, []);

  function cancelarCita(index) {
    const nuevasCitas = citas.filter((_, i) => i !== index);
    setCitas(nuevasCitas);
    localStorage.setItem("citas", JSON.stringify(nuevasCitas));
  }

  function abrirModificar(index) {
    setEditandoIndex(index);
    setCitaEditada({ ...citas[index] });
  }

  function guardarModificacion() {
    const nuevasCitas = citas.map((c, i) => i === editandoIndex ? citaEditada : c);
    setCitas(nuevasCitas);
    localStorage.setItem("citas", JSON.stringify(nuevasCitas));
    setEditandoIndex(null);
  }

  return (
    <div className="misCitas-container">

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
        <span
          style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }}
          onClick={() => navegarA('menuCliente')}
        >←</span>
        <h1 className="titulo" style={{ margin: 0 }}>Mis Citas</h1>
      </div>

      {citas.length === 0 ? (
        <p className="sin-citas">No tienes citas agendadas</p>
      ) : (
        citas.map((cita, index) => (
          <div key={index}>
            <div className="cita-card">
              <div className="cita-info">
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Servicio:</strong> {cita.servicio}</p>
                <p><strong>Barbero:</strong> {cita.barbero}</p>
              </div>

              <div className="cita-acciones">
                <button className="btn-modificar" onClick={() => abrirModificar(index)}>
                  Modificar
                </button>
                <button className="btn-cancelar" onClick={() => cancelarCita(index)}>
                  Cancelar
                </button>
              </div>
            </div>

            {editandoIndex === index && (
              <div className="editar-panel">
                <h3 style={{ fontFamily: 'Georgia, serif', color: '#800020', marginBottom: '12px' }}>Editar Cita</h3>

                <label>Barbero</label>
                <select
                  value={citaEditada.barbero}
                  onChange={e => setCitaEditada({ ...citaEditada, barbero: e.target.value })}
                >
                  {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <label>Servicio</label>
                <select
                  value={citaEditada.servicio}
                  onChange={e => setCitaEditada({ ...citaEditada, servicio: e.target.value })}
                >
                  {servicios.map(s => (
                    <option key={s.nombre} value={s.nombre}>{s.nombre} — {s.precio}</option>
                  ))}
                </select>

                <label>Fecha</label>
                <input
                  type="date"
                  value={citaEditada.fecha}
                  onChange={e => setCitaEditada({ ...citaEditada, fecha: e.target.value })}
                />

                <label>Hora</label>
                <select
                  value={citaEditada.hora}
                  onChange={e => setCitaEditada({ ...citaEditada, hora: e.target.value })}
                >
                  {horas.map(h => <option key={h} value={h}>{h}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button className="btn-modificar" onClick={guardarModificacion}>Guardar</button>
                  <button className="btn-cancelar" onClick={() => setEditandoIndex(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <button className="btn-agendar" onClick={() => navegarA("citas")}>
        Agendar Cita
      </button>

    </div>
  );
}

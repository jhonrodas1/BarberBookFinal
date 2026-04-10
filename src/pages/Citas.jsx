import { useState, useEffect } from 'react';
import './Citas.css';

const BARBEROS_BASE = [
  'Carlos Rodríguez',
  'Miguel Ángel Torres',
  'Diego Fernández',
];

const servicios = [
  { nombre: 'Corte de cabello', precio: '$15.000' },
  { nombre: 'Corte de Barba',   precio: '$12.000' },
  { nombre: 'Afeitado',         precio: '$15.000' },
  { nombre: 'Corte y Barba',    precio: '$20.000' },
];

const HORAS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function Citas({ navegarA, origen = 'home' }) {
  const [forma, setForma] = useState({ nombre: '', barbero: '', servicio: '', fecha: '', hora: '' });
  const [enviado, setEnviado] = useState(false);
  const [barberos, setBarberos] = useState(BARBEROS_BASE);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  // Cargar barberos extra registrados por el admin
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || [];
    setBarberos([...BARBEROS_BASE, ...guardados.map(b => b.nombre)]);
  }, []);

  // Recalcular horas ocupadas cuando cambia barbero o fecha
  useEffect(() => {
    if (!forma.barbero || !forma.fecha) {
      setHorasOcupadas([]);
      return;
    }
    const todasLasCitas = JSON.parse(localStorage.getItem('citas')) || [];
    const ocupadas = todasLasCitas
      .filter(c => c.barbero === forma.barbero && c.fecha === forma.fecha)
      .map(c => c.hora);
    setHorasOcupadas(ocupadas);
  }, [forma.barbero, forma.fecha]);

  function manejarCambio(e) {
    const nuevo = { ...forma, [e.target.name]: e.target.value };
    // Si cambia barbero o fecha, resetear la hora
    if (e.target.name === 'barbero' || e.target.name === 'fecha') {
      nuevo.hora = '';
    }
    setForma(nuevo);
  }

  function elegirHora(hora) {
    if (horasOcupadas.includes(hora)) return; // bloqueada
    setForma({ ...forma, hora });
  }

  function manejarEnvio(e) {
    e.preventDefault();
    if (!forma.nombre || !forma.barbero || !forma.servicio || !forma.fecha || !forma.hora) {
      alert('Por favor completa todos los campos.');
      return;
    }
    const nuevaCita = { cliente: forma.nombre, barbero: forma.barbero, servicio: forma.servicio, fecha: forma.fecha, hora: forma.hora };
    const citasGuardadas = JSON.parse(localStorage.getItem('citas')) || [];
    localStorage.setItem('citas', JSON.stringify([...citasGuardadas, nuevaCita]));
    setEnviado(true);
    setTimeout(() => navegarA(origen), 2000);
  }

  const mostrarCalendario = forma.barbero && forma.fecha;

  return (
    <div className="citas-layout">

      {/* Columna izquierda */}
      <div className="citas-izq">
        <h1 className="citas-logo" onClick={() => navegarA('home')}>BARBERBOOK</h1>
        <button className="citas-btn-volver" onClick={() => navegarA(origen)}>← Volver</button>

        {/* Leyenda del calendario */}
        {mostrarCalendario && (
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Disponibilidad</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#e8f5e9', border: '1px solid #4caf50' }}></div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555' }}>Disponible</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#800020' }}></div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555' }}>Seleccionado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#f0f0f0', border: '1px solid #ccc' }}></div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555' }}>Ocupado</span>
            </div>
          </div>
        )}
      </div>

      {/* Columna derecha */}
      <div className="citas-der">
        <div className="citas-card" style={{ maxWidth: '500px' }}>
          <h2 className="citas-titulo">Reservar Cita</h2>

          {!enviado ? (
            <form className="citas-form" onSubmit={manejarEnvio}>

              <label>Nombre completo</label>
              <input type="text" name="nombre" placeholder="Tu nombre" value={forma.nombre} onChange={manejarCambio} />

              <label>Barbero</label>
              <select name="barbero" value={forma.barbero} onChange={manejarCambio}>
                <option value="">-- Selecciona un barbero --</option>
                {barberos.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <label>Servicio</label>
              <select name="servicio" value={forma.servicio} onChange={manejarCambio}>
                <option value="">-- Selecciona un servicio --</option>
                {servicios.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre} — {s.precio}</option>)}
              </select>

              <label>Fecha</label>
              <input type="date" name="fecha" value={forma.fecha} onChange={manejarCambio} min={new Date().toISOString().split('T')[0]} />

              {/* CALENDARIO DE HORAS */}
              {mostrarCalendario && (
                <div className="citas-horario">
                  <label style={{ marginBottom: '8px', display: 'block' }}>
                    Hora — <em style={{ color: '#800020', fontSize: '12px' }}>
                      {horasOcupadas.length === 0
                        ? 'Todas las horas disponibles'
                        : `${horasOcupadas.length} hora(s) ocupada(s)`}
                    </em>
                  </label>
                  <div className="citas-grid-horas">
                    {HORAS.map(h => {
                      const ocupada = horasOcupadas.includes(h);
                      const seleccionada = forma.hora === h;
                      return (
                        <div
                          key={h}
                          className={`hora-slot${ocupada ? ' hora-ocupada' : ' hora-libre'}${seleccionada ? ' hora-seleccionada' : ''}`}
                          onClick={() => elegirHora(h)}
                          title={ocupada ? `${h} — Ocupado` : `${h} — Disponible`}
                        >
                          {h}
                          {ocupada && <span className="hora-tag">Ocupado</span>}
                        </div>
                      );
                    })}
                  </div>
                  {forma.hora && (
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#800020', marginTop: '8px' }}>
                      ✓ Hora seleccionada: <strong>{forma.hora}</strong>
                    </p>
                  )}
                </div>
              )}

              {!mostrarCalendario && (
                <div style={{ background: '#f9f5f5', border: '1px dashed #ccc', borderRadius: '6px', padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    Selecciona un barbero y una fecha para ver la disponibilidad de horas
                  </p>
                </div>
              )}

              <button type="submit" className="citas-btn-reservar" style={{ marginTop: '10px' }}>
                Confirmar Cita
              </button>
            </form>
          ) : (
            <div className="citas-confirmacion">
              <div className="citas-check">✓</div>
              <h3>¡Cita reservada!</h3>
              <p><strong>Nombre:</strong> {forma.nombre}</p>
              <p><strong>Barbero:</strong> {forma.barbero}</p>
              <p><strong>Servicio:</strong> {forma.servicio}</p>
              <p><strong>Fecha:</strong> {forma.fecha}</p>
              <p><strong>Hora:</strong> {forma.hora}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

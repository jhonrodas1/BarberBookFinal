import { useState, useEffect } from 'react'
import './MenuCliente.css'

const barberosIniciales = [
  { nombre: 'Carlos Rodríguez', especialidad: 'Especialista en cortes', correo: 'carlos@barberbook.com' },
  { nombre: 'Miguel Ángel Torres', especialidad: 'Experto en estilos modernos', correo: 'miguel@barberbook.com' },
  { nombre: 'Diego Fernández', especialidad: 'Maestro barbero - afeitado clásico', correo: 'diego@barberbook.com' },
]

export default function GestionBarberos({ navegarA }) {
  const [barberos, setBarberos] = useState([])

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    setBarberos([...barberosIniciales, ...guardados])
  }, [])

  function eliminarBarbero(index) {
    const guardados = JSON.parse(localStorage.getItem('listaBarberos')) || []
    const indexEnGuardados = index - barberosIniciales.length
    if (indexEnGuardados >= 0) {
      const nuevos = guardados.filter((_, i) => i !== indexEnGuardados)
      localStorage.setItem('listaBarberos', JSON.stringify(nuevos))
      setBarberos([...barberosIniciales, ...nuevos])
    } else {
      alert('Los barberos base no se pueden eliminar.')
    }
  }

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 30px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#800020', fontWeight: 'bold' }} onClick={() => navegarA('menuAdmin')}>←</span>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#800020', letterSpacing: '3px', fontSize: '22px', margin: 0 }}>BARBERBOOK</h1>
      </div>
      <div style={{ padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', maxWidth: '600px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>Gestión de Barberos</h2>
          <button className="home-btn" style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }} onClick={() => navegarA('registrarBarbero')}>
            + Registrar
          </button>
        </div>
        {barberos.map((b, i) => (
          <div key={i} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px 24px', marginBottom: '12px', background: '#fff', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '15px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{b.nombre}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#555', fontStyle: 'italic' }}>{b.especialidad}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#888' }}>{b.correo}</p>
            </div>
            {i >= barberosIniciales.length && (
              <button onClick={() => eliminarBarbero(i)} style={{ background: '#800020', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

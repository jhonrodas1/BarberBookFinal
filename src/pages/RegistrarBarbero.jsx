import React, { useState } from 'react';
import './FormPage.css'; // Usamos tus estilos de formularios
import './Citas.css';    // Usamos esto para la flecha de retroceso

const RegistrarBarbero = ({ navegarA, irAlInicio }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    correo: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const barberosExistentes = JSON.parse(localStorage.getItem('listaBarberos')) || [];
    
    const nuevoBarbero = {
      ...formData,
      id: Date.now(),
      // Guardamos la inicial para que aparezca el círculo en la lista de Barberos
      inicial: formData.nombre.charAt(0).toUpperCase()
    };
    
    const nuevaLista = [...barberosExistentes, nuevoBarbero];
    localStorage.setItem('listaBarberos', JSON.stringify(nuevaLista));
    
    alert('¡Barbero registrado con éxito!');
    navegarA('menuAdmin'); 
  };

  return (
    <div className="home-container">
      {/* HEADER UNIFICADO CON FLECHA */}
      <div className="citas-header">
        <button className="back-btn" onClick={() => navegarA("menuAdmin")}>
          ←
        </button>
        <h1 onClick={irAlInicio} style={{ cursor: 'pointer', color: '#800020', marginLeft: '20px' }}>
          BARBERBOOK
        </h1>
      </div>

      <main className="form-main">
        <h2 className="form-titulo">Registrar Barbero</h2>

        <div className="form-card" style={{ border: '1.5 solid #800020' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div className="form-grupo">
              <label>Nombre completo:</label>
              <input type="text" name="nombre" required onChange={handleChange} />
            </div>

            <div className="form-grupo">
              <label>Especialidad:</label>
              <input type="text" name="especialidad" required onChange={handleChange} />
            </div>

            <div className="form-grupo">
              <label>Correo electrónico:</label>
              <input type="email" name="correo" required onChange={handleChange} />
            </div>

            <div className="form-grupo">
              <label>Contraseña provisional:</label>
              <input type="password" name="password" required onChange={handleChange} />
            </div>

            <button type="submit" className="form-btn">
              <em>Registrar</em>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrarBarbero;
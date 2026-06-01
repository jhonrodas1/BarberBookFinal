import { useState, useEffect } from 'react'
import './Home.css'
import { apiFetch } from '../api/client'

export default function GestionUsuarios({ navegarA, setClienteEditar }) {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await apiFetch('/admin/clients', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setClientes(data)
      } catch {
        setError('No se pudieron cargar los clientes.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const handleEditar = (cliente) => {
    setClienteEditar(cliente)
    navegarA('editarClienteAdmin')
  }

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

        {cargando && (
          <p style={{ color: '#555', fontStyle: 'italic', textAlign: 'center' }}>Cargando clientes...</p>
        )}

        {error && (
          <p style={{ color: '#f87171', fontStyle: 'italic', textAlign: 'center' }}>{error}</p>
        )}

        {!cargando && !error && clientes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#444' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', color: '#222' }}>👤</div>
            <p style={{ fontStyle: 'italic', fontSize: '14px' }}>No hay clientes registrados.</p>
          </div>
        )}

        {!cargando && clientes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientes.map((cliente, i) => (
              <div key={i} style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderLeft: '3px solid #c9a84c40',
                borderRadius: '8px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#1a1a1a', border: '1.5px solid #c9a84c35',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', flexShrink: 0,
                }}>
                  {cliente.names?.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: '#f5f0e8', margin: '0 0 4px', letterSpacing: '0.3px' }}>
                    {cliente.names} {cliente.lastNames}
                  </p>
                  <p style={{ fontSize: '12px', color: '#555', margin: 0, fontStyle: 'italic' }}>
                    {cliente.email} · {cliente.phone}
                  </p>
                </div>

                <button
                  onClick={() => handleEditar(cliente)}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a2a',
                    borderRadius: '7px',
                    color: '#c9a84c',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}

        {!cargando && clientes.length > 0 && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '20px', letterSpacing: '1px' }}>
            <span style={{ color: '#c9a84c', fontSize: '14px' }}>{clientes.length}</span> cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
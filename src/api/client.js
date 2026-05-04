const BASE = '/api'

export async function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${BASE}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opciones,
  })

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}))
    throw new Error(error.message || 'Error en la solicitud')
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}


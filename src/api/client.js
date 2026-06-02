const BASE = import.meta.env.VITE_API_URL ||'https://barbershop-mh6w.onrender.com/api'

export async function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  })

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}))
    const err = new Error(error.error || error.message || 'Error en la solicitud')
    err.status = respuesta.status
    throw err
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}
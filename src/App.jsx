import { useState } from 'react'

import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import SeleccionRol from './pages/SeleccionRol'
import MenuCliente from './pages/MenuCliente'
import MenuBarbero from './pages/MenuBarbero'
import MenuAdmin from './pages/MenuAdmin'
import Servicios from './pages/Servicios'
import Barberos from './pages/Barberos'
import Citas from "./pages/Citas"
import RegistrarBarbero from './pages/RegistrarBarbero'
import MisCitas from "./pages/MisCitas"
import CalendarioAdmin from './pages/CalendarioAdmin'
import CalendarioPublico from './pages/CalendarioPublico'
import GestionUsuarios from './pages/GestionUsuarios'
import GestionBarberos from './pages/GestionBarberos'
import HorarioBarbero from './pages/HorarioBarbero'
import AgendaBarbero from './pages/AgendaBarbero'
import GestionCitasBarbero from './pages/GestionCitasBarbero'
import CambiarContrasena from './pages/CambiarContrasena'
import GestionServicios from './pages/GestionServicios'

function App() {
  const [pantalla, setPantalla] = useState('home')
  const [usuario, setUsuario] = useState(null)
  const [origen, setOrigen] = useState('home')

  const navegarA = (destino) => {
    // Guardar desde dónde salimos antes de ir a páginas compartidas
    if (['servicios', 'barberos', 'citas'].includes(destino)) {
      setOrigen(pantalla)
    }
    setPantalla(destino)
  }

  const irAlInicio = () => {
    if (!usuario) {
      setPantalla('home')
    } else if (usuario.rol === 'cliente') {
      setPantalla('menuCliente')
    } else if (usuario.rol === 'barbero') {
      setPantalla('menuBarbero')
    } else if (usuario.rol === 'admin') {
      setPantalla('menuAdmin')
    }
  }

  const iniciarSesion = (datosUsuario) => setUsuario(datosUsuario)

  const cerrarSesion = () => {
    setUsuario(null)
    setPantalla('home')
  }

  if (pantalla === 'login')         return <Login navegarA={navegarA} iniciarSesion={iniciarSesion} />
  if (pantalla === 'registro')      return <Registro navegarA={navegarA} iniciarSesion={iniciarSesion} />
  if (pantalla === 'seleccionRol')  return <SeleccionRol navegarA={navegarA} usuario={usuario} setUsuario={setUsuario} />

  if (pantalla === 'menuCliente')   return <MenuCliente navegarA={navegarA} usuario={usuario} cerrarSesion={cerrarSesion} irAlInicio={irAlInicio} />
  if (pantalla === 'menuBarbero')   return <MenuBarbero navegarA={navegarA} usuario={usuario} cerrarSesion={cerrarSesion} irAlInicio={irAlInicio} />
  if (pantalla === 'menuAdmin')     return <MenuAdmin   navegarA={navegarA} usuario={usuario} cerrarSesion={cerrarSesion} irAlInicio={irAlInicio} />

  if (pantalla === 'servicios')     return <Servicios navegarA={navegarA} irAlInicio={irAlInicio} origen={origen} />
  if (pantalla === 'barberos')      return <Barberos  navegarA={navegarA} irAlInicio={irAlInicio} origen={origen} />
  if (pantalla === 'citas')         return <Citas     navegarA={navegarA} origen={origen} />
  if (pantalla === 'misCitas')      return <MisCitas  navegarA={navegarA} />

  if (pantalla === 'registrarBarbero') return <RegistrarBarbero navegarA={navegarA} irAlInicio={irAlInicio} />
  if (pantalla === 'calendarioAdmin')  return <CalendarioAdmin  navegarA={navegarA} usuario={usuario} />
  if (pantalla === 'calendarioPublico') return <CalendarioPublico navegarA={navegarA} />
  if (pantalla === 'gestionUsuarios')  return <GestionUsuarios  navegarA={navegarA} usuario={usuario} />
  if (pantalla === 'gestionBarberos')  return <GestionBarberos  navegarA={navegarA} />
  if (pantalla === 'horarioBarbero')   return <HorarioBarbero   navegarA={navegarA} usuario={usuario} />
  if (pantalla === 'agendaBarbero')    return <AgendaBarbero    navegarA={navegarA} usuario={usuario} />
  if (pantalla === 'gestionCitasBarbero') return <GestionCitasBarbero navegarA={navegarA} usuario={usuario} />
  if (pantalla === 'cambiarContrasena') return <CambiarContrasena navegarA={navegarA} usuario={usuario} iniciarSesion={iniciarSesion} />
  if (pantalla === 'gestionServicios') return <GestionServicios navegarA={navegarA} />

  return <Home navegarA={navegarA} />
}

export default App

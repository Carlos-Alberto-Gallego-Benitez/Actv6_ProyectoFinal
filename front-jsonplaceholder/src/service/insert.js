import axios from "axios";
import Swal from 'sweetalert2'
import decode64 from "../helpers/decode64"

let RUTA_API = null;
let parseSession;
if (localStorage.getItem("sessions_social_network")) {
  parseSession = JSON.parse(decode64(localStorage.getItem("sessions_social_network")));
}


async function insert(action, api, setLoad) {

  if (api === 1) { RUTA_API = `${process.env.REACT_APP_URL_API_USUARIOS}` }
  if (api === 2) { RUTA_API = `${process.env.REACT_APP_URL_API_PUBLICACIONES}` }
  if (api === 3) { RUTA_API = `${process.env.REACT_APP_URL_API_TRANSACCIONES}` }

  try {
    let auth = parseSession ? parseSession.token ? parseSession.token : '0' : '0';
    const { data } = await axios.post(
      RUTA_API + action + '&tokencopia=' + auth,
      {
        headers: { token: auth, "Content-Type": "application/json" },
        params: { token: auth },
      }
    );
    if (data === "Ok") {
      Swal.fire({
        icon: 'success',
        title: 'Registro guardado con éxito',
      })
      return "Ok";
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrió un error',
        text: data
      })
      setLoad(false)
      return "err";
    }
  } catch (error) {
    Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: error.response ? error.response.statusText : error.message
    })
    if (error.response) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed') {
        window.location.href = 'http://localhost:8340/jsonplaceholder/login'
        localStorage.removeItem('sessions_social_network');
      }
    }
    setLoad(false)
    throw error
  }
}

export default insert;

import { useEffect, useState } from 'react'
import Barratitulos from "../informativo/Barratitulos"
import select from '../../../service/select'
import decode64 from "../../../helpers/decode64";

export default function Home({ setLoad }) {

    //estados recolectores
    const [publicaciones, setPublicaciones] = useState([])
    const [users, setUsers] = useState([])

    let parseSession;
    if (localStorage.getItem("sessions_social_network")) {
        parseSession = JSON.parse(decode64(localStorage.getItem("sessions_social_network")));
    }

    //carga inicial de la grid o render
    useEffect(() => {
        async function aux() {
            setLoad(true)
            //peticiones para cargar los valores de las grid
            let { data } = await select('index', 2);
            let usr = await select('index', 1);
            setUsers(usr.data)
            setPublicaciones(data)
            setTimeout(() => {
                window.dataTable()
            }, 300)
            setLoad(false)
        }
        aux()
    }, [])

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid card-home ">
                        <h1 className="mt-4">¡Bienvenid@! {parseSession?.name?? ''}</h1>
                        <Barratitulos titulo={'Listado de publicaiones recientes'} key={Math.random()} />
                        <div className="row lise-card">
                            {
                                publicaciones && publicaciones.length > 0 ? publicaciones.map((e,i) => {
                                    return (
                                        <>
                                            <div className="col-xl-6" key={i}>
                                                <div className="card mb-4 hever-card">
                                                    <div className="card-header tl-card">
                                                        <i className="fas fa-chart-area mr-1"></i>
                                                        {e.title}
                                                    </div>
                                                    <div className="card-body">
                                                        {users.find(obj => obj.id === e.userId).name + ' Post: '}
                                                        {e.body}</div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }) : ''
                            }

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
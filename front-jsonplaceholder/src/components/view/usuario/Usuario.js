import { Container, Modal, Button, Col, Row, Form } from 'react-bootstrap'
import Barratitulos from '../informativo/Barratitulos'
import { useEffect, useState } from 'react'
import select from '../../../service/select'
import IconButton from '../../common/IconButton'
import { useParams } from "react-router-dom";
import exportDatos from '../../../service/exportDatos'
import encode64 from "../../../helpers/encode64"
import insert from "../../../service/insert"
import Swal from 'sweetalert2'

export default function Usuario({ setLoad }) {

    //estado principal que almacena los usuarios a listar
    const [users, setUsers] = useState([])

    //estados modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [elementConsulta, setElementConsulta] = useState({
        nombre : '',
        correo : '',
        celular : '',
        password : '',
    })

    const handleChange = (e, name) => {
        if (e.target.checked) {
            setElementConsulta(
                { ...elementConsulta, chkRadio: e.target.value }
            )
        } else {
            setElementConsulta(
                { ...elementConsulta, [e.target.name]: e.target.value, }
            )
        }
        if (name == 'paswordenntry') {
            setElementConsulta({
                ...elementConsulta, password: encode64(e.target.value)
            })
        }
    }

    const guardar = async () => {
        setLoad(true)
        if (elementConsulta.nombre !== '' && elementConsulta.celular !== '' && elementConsulta.correo !== '' && elementConsulta.password !== '') {
            let rspUpdate = await insert(`insertUser?query=${encode64(JSON.stringify(elementConsulta))}`, 1, setLoad);
            console.log(rspUpdate)
            if (rspUpdate === 'Ok') {
                setShow(false);
                setLoad(false)
            }
            setLoad(false)
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'Todos los campos son onligatorios'
            })
            setLoad(false)
        }

    }

    //carga inicial o render
    useEffect(() => {
        async function aux() {
            setLoad(true)
            try {
                let { data } = await select('index', 1);
                setUsers(data)
            } catch (error) {
                setLoad(false)
            }

            setTimeout(() => {
                window.dataTable()
            }, 300)
            setLoad(false)
        }
        aux()
    }, [])


    //exportar datos a excel
    const expoDatos = () => {
        setLoad(true)
        let arrayData = [];
        for (let i = 0; i < users.length; i++) {
            let encodeRow = encode64(JSON.stringify({ nombre: users[i].name, username: users[i].username, email: users[i].email, direccion: users[i].address.city + ' ' + users[i].address.street, cel: users[i].phone, web: users[i].website, empresa: users[i].company.name }));
            let row = { nombre: users[i].name, username: users[i].username, email: users[i].email, direccion: users[i].address.city + ' ' + users[i].address.street, cel: users[i].phone, web: users[i].website, empresa: users[i].company.name, encode: encodeRow };
            arrayData.push(row)
        }
        let columnsName = [
            "Nombre",
            "Identificador",
            "Correo",
            "Dirección",
            "Teléfono",
            "Sitio Web",
            "Empresa",
            "Encode64"
        ];
        let columnsFilter = [
            "nombre",
            "username",
            "email",
            "direccion",
            "cel",
            "web",
            "empresa",
            "encode"
        ];
        let tamanocolumns = [7, 7, 7, 7, 7, 7, 7, 55];
        exportDatos("Reporte_Usuarios", 1, columnsName, columnsFilter, arrayData, tamanocolumns)
        setLoad(false)
    }


    return (
        <>
            <Container className='mt-5'>
                <Barratitulos titulo={'Gestión de usuarios'} />
                <div className='flex-excel'>
                    <IconButton className='crear mr-2' title='Crear Usuaurio' onClick={() => { handleShow() }} />
                    <IconButton className='excel' title='Reporte excel' onClick={() => { expoDatos() }} />
                </div>
                <div className="card mt-3 scroll-card mb-3">
                    <div className="card-header">
                        <i className="fas fa-table mr-1"></i>
                        Listado de Usuarios
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Identificador</th>
                                        <th>Correo</th>
                                        <th>Dirección</th>
                                        <th>Teléfono</th>
                                        <th>Sitio Web</th>
                                        <th>Empresa</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Identificador</th>
                                        <th>Correo</th>
                                        <th>Dirección</th>
                                        <th>Teléfono</th>
                                        <th>Sitio Web</th>
                                        <th>Empresa</th>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    {
                                        users && users.length > 0 ? users.map((e) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>{e.name}</td>
                                                        <td>{e.username}</td>
                                                        <td>{e.email}</td>
                                                        <td>{e.address.city + ' ' + e.address.street}</td>
                                                        <td>{e.phone}</td>
                                                        <td>{e.website}</td>
                                                        <td>{e.company.name}</td>
                                                    </tr>
                                                </>
                                            )
                                        }) : ''
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Usuario</Modal.Title>
                    <IconButton
                        data-bs-dismiss="modal"
                        className={"icon-cancel icon-cerrar-modal"}
                        onClick={handleClose}
                        aria-label="Close"
                        title='Cerrar Formulario'
                    />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                        </Col>
                    </Row>
                    <Form.Group className="mb-2">
                        <Form.Label className="lbl mb-2">
                            Nombre *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="inputs-forms-admin focus-admin-register"
                            name={"nombre"}
                            onChange={(e) => { handleChange(e, 'nombre') }}
                            value={elementConsulta.nombre}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="lbl mb-2">
                            Correo *
                        </Form.Label>
                        <Form.Control
                            type="email"
                            className="inputs-forms-admin focus-admin-register"
                            name={"correo"}
                            onChange={(e) => { handleChange(e, 'correo') }}
                            value={elementConsulta.fecha}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="lbl mb-2">
                            Celular *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="inputs-forms-admin focus-admin-register"
                            name={"celular"}
                            onChange={(e) => { handleChange(e, 'celular') }}
                            value={elementConsulta.metodo}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="lbl mb-2">
                            Pasword *
                        </Form.Label>
                        <Form.Control
                            type="password"
                            className="inputs-forms-admin focus-admin-register"
                            name={"paswordenntry"}
                            onChange={(e) => { handleChange(e, 'paswordenntry') }}
                            value={elementConsulta.url}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="lbl mb-2">
                            Pasword Code
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="inputs-forms-admin focus-admin-register"
                            name={"password"}
                            onChange={(e) => { handleChange(e, 'password') }}
                            value={elementConsulta.password}
                            disabled={true}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className='btn-principales' onClick={() => {
                        guardar()
                    }}>
                        Guardar Cambios *
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
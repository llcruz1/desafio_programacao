import React, { useState, useEffect} from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const API = process.env.REACT_APP_API;

export const Celulares = () => {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [memoria, setMemoria] = useState("");
  const [lancamento, setLancamento] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  let [celulares, setCelulares] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let res = {}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      res = await fetch(`${API}/celulares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marca,
          modelo,
          memoria,
          lancamento
        }),
      });
    } else {
      res = await fetch(`${API}/celulares/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marca,
          modelo,
          memoria,
          lancamento
        }),
      });
      setEditing(false);
      setId("");
    }
    const data = await res.json();
    console.log(data);
    await getCelulares();

    setMarca("");
    setModelo("");
    setMemoria("");
    setLancamento("");
  };

  const getCelulares = async () => {
    const res = await fetch(`${API}/celulares`);
    const data = await res.json();
    setCelulares(data);
  };

  const deleteCelular = async (id) => {
    const celularResponse = window.confirm("Quer mesmo deletar esse item?");
    if (celularResponse) {
      const res = await fetch(`${API}/celulares/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getCelulares();
    }
  };

  const editCelular = async (id) => {
    const res = await fetch(`${API}/celular/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);
    
    // Reset
    setMarca(data.marca);
    setModelo(data.modelo);
    setMemoria(data.memoria);
    setLancamento(data.lancamento);
  };

  useEffect(() => {
    getCelulares();
  }, [celulares]);

  return ( 
    <>
    <Button variant="primary" 
            onClick = {(e) => {setEditing(false); 
              handleShow();
              setMarca("");
              setModelo("");
              setMemoria("");
              setLancamento("");
             }} 
    >
        Novo Celular
    </Button>
      <br/><br/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Alterar Celular" : "Novo Celular"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <form onSubmit={handleSubmit} className="card card-body">
              <div className="form-group">
                <input
                  type="text"
                  onChange={(e) => setMarca(e.target.value)}
                  value={marca}
                  className="form-control"
                  placeholder="Marca"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  onChange={(e) => setModelo(e.target.value)}
                  value={modelo}
                  className="form-control"
                  placeholder="Modelo"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  min="0"
                  onChange={(e) => setMemoria(e.target.value)}
                  value={memoria}
                  className="form-control"
                  placeholder="Memória (GB)"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  onChange={(e) => setLancamento(e.target.value)}
                  value={lancamento}
                  className="form-control"
                  placeholder="Memória (GB)"
                />
              </div>
                <Button
                        onClick={(e) => {setEditing(false);handleClose()}}
                        className = "btn btn-secondary btn-block">
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleClose} className="btn btn-primary btn-block">
                    {editing ? "Alterar" : "Salvar"}
                </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>

    <div className="row">
      <div className="col-md-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Capacidade de Memória (GB)</th>
              <th>Data de Lançamento</th>
            </tr>
          </thead>
          <tbody>
            {celulares.map((celular) => (
              <tr key={celular._id}>
                <td>{celular.marca}</td>
                <td>{celular.modelo}</td>
                <td>{celular.memoria}</td>
                <td>{new Date(celular.lancamento).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm btn-block"
                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                    onClick={(e) => {editCelular(celular._id);handleShow()}}
                  >
                    Alterar
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={(e) => deleteCelular(celular._id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Celulares = () => {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [memoria, setMemoria] = useState("");
  const [lancamento, setLancamento] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  let [celulares, setCelulares] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/celulares`, {
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
      await res.json();
    } else {
      const res = await fetch(`${API}/celulares/${id}`, {
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
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
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
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        onClick = {(e) => {setEditing(false); 
                           setMarca("");
                           setModelo("");
                           setMemoria("");
                           setLancamento("");
                          }}
      >
        Novo Celular
      </button>
      <br/><br/>
      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{editing ? "Alterar Celular" : "Novo Celular"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
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
                    <button
                            data-bs-dismiss="modal"
                            onClick={(e) => setEditing(false)}
                            className = "btn btn-secondary btn-block">
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary btn-block">
                        {editing ? "Alterar" : "Salvar"}
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                    onClick={(e) => editCelular(celular._id)}
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

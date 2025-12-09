import React from 'react';
import { Link } from 'react-router-dom';

function JSCourse() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '50px 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4">Curso de JavaScript Completo</h1>
          <p className="lead">Aprende JavaScript desde cero hasta nivel avanzado</p>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow mb-4">
              <div className="card-body">
                <h3>Contenido del Curso</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">✓ Fundamentos de JavaScript</li>
                  <li className="list-group-item">✓ Variables y Tipos de Datos</li>
                  <li className="list-group-item">✓ Funciones y Scope</li>
                  <li className="list-group-item">✓ Objetos y Arrays</li>
                  <li className="list-group-item">✓ DOM Manipulation</li>
                  <li className="list-group-item">✓ Eventos y Asincronía</li>
                  <li className="list-group-item">✓ ES6+ Features</li>
                  <li className="list-group-item">✓ Proyectos Prácticos</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link to="/" className="btn btn-primary btn-lg">Volver al Inicio</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JSCourse;

import React from 'react';
import { Link } from 'react-router-dom';

function Masthead() {
  const mastheadStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url(${process.env.PUBLIC_URL}/assets/img/bg-masthead.jpg)`
  };
  
  return (
    <header className="masthead" style={mastheadStyle}>
      <div className="container px-4 px-lg-5 h-100">
        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
          <div className="col-lg-8 align-self-end">
            <h1 className="text-white font-weight-bold">Bienvenido a EduConnect</h1>
            <hr className="divider" />
          </div>
          <div className="col-lg-8 align-self-baseline">
            <p className="text-white-75 mb-5">Plataforma educativa para conectar estudiantes y profesores. ¡Únete hoy y comienza tu experiencia de aprendizaje!</p>
            <Link className="btn btn-primary btn-xl" to="/register">Registrate</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Masthead;

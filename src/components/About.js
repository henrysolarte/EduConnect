import React from 'react';

function About() {
  return (
    <section className="page-section bg-primary" id="about">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="text-white mt-0">La investigación del mañana, hoy</h2>
            <hr className="divider divider-light" />
            <p className="text-white-75 mb-4">La misión de EduConnect es compartir rápidamente preprints y otras investigaciones en fase inicial, empoderando a investigadores de todo el mundo para contribuir a un futuro mejor. Nuestra plataforma de investigación abierta apoya la resolución de problemas complejos mediante la conexión de académicos a nivel global, abarcando una amplia diversidad de disciplinas académicas.</p>
            <a className="btn btn-light btn-xl" href="#services">Get Started!</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

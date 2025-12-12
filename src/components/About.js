import React from 'react';

function About() {
  return (
    <section className="page-section bg-primary" id="about">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="text-white mt-0">“Aprende Hoy, Impulsa Tu Futuro”</h2>
            <h2 className="text-white mt-0">Inscríbete en uno de nuestros cursos</h2>
            <hr className="divider divider-light" />
            <p className="text-white-75 mb-4">Descubre nuestros cursos virtuales diseñados para llevar tus habilidades al siguiente nivel. Accede de inmediato, aprende a tu ritmo y obtén certificación. Invierte en ti y abre nuevas oportunidades profesionales.</p>
            <a className="btn btn-light btn-xl" href="#portfolio">Get Started!</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

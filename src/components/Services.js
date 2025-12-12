import React from 'react';
import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className="page-section" id="cursos">
      <div className="container px-4 px-lg-5">
        <h2 className="text-center mt-0">Convocatoria de Publicación Académica

        </h2>
          <h2 className="text-center mt-0">Publica tus trabajos académicos y contribuye al conocimiento global

          </h2>
        <hr className="divider" />
        <div className="row gx-4 gx-lg-5">
          <div className="col-lg-3 col-md-6 text-center" onClick={() => handleNavigation('/papers')} style={{cursor: 'pointer'}}>
            <div className="mt-5">
              <div className="mb-2"><i className="bi-gem fs-1 text-primary"></i></div>
              <h3 className="h4 mb-2">Papers</h3>
              <p> Documentos académicos que presentan resultados de investigación, análisis y aportes científicos para la difusión del conocimiento universitario.</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center" onClick={() => handleNavigation('/articulos-cientificos')} style={{cursor: 'pointer'}}>
            <div className="mt-5">
              <div className="mb-2"><i className="bi-laptop fs-1 text-primary"></i></div>
              <h3 className="h4 mb-2">Artículos científicos</h3>
              <p className="text-muted mb-0">Textos académicos que comunican de manera clara y rigurosa los resultados de investigaciones, contribuyendo al avance del conocimiento científico.</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center" onClick={() => handleNavigation('/tesis')} style={{cursor: 'pointer'}}>
            <div className="mt-5">
              <div className="mb-2"><i className="bi-globe fs-1 text-primary"></i></div>
              <h3 className="h4 mb-2">Tesis</h3>
              <p className="text-muted mb-0">Trabajo académico de investigación que demuestra la capacidad del estudiante para analizar, aplicar conocimientos y aportar al desarrollo científico o profesional.</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center" onClick={() => handleNavigation('/editoriales')} style={{cursor: 'pointer'}}>
            <div className="mt-5">
              <div className="mb-2"><i className="bi-heart fs-1 text-primary"></i></div>
              <h3 className="h4 mb-2">Editoriales</h3>
              <p className="text-muted mb-0">Textos de opinión académica que analizan, interpretan o reflexionan sobre temas de interés científico, social o institucional desde una postura crítica y fundamentada.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;

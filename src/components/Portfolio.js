import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Portfolio() {
  const navigate = useNavigate();

  const portfolioItems = [
    { id: 1, category: '', name: '' },
    { id: 2, category: '', name: '' },
    { id: 3, category: '', name: '' },
    { id: 4, category: '', name: '' },
    { id: 5, category: '', name: '' },
    { id: 6, category: '', name: '' }
  ];

  const handleClick = (e, itemId) => {
    e.preventDefault();
    // Verificar si hay token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe estar registrado para ver la información');
      return;
    }
    // Aquí podrías navegar según el curso seleccionado
    switch (itemId) {
      case 1:
        navigate('/js');
        break;
      case 2:
        navigate('/python');
        break;
      case 3:
        navigate('/cursos-cpp');
        break;
      case 4:
        navigate('/java');
        break;
      case 5:
        navigate('/angular');
        break;
      case 6:
        navigate('/html5');
        break;
      default:
        break;
    }
  };

  return (
    <div id="portfolio">
      <div className="container-fluid p-0">
        <div className="row g-0">
          {portfolioItems.map(item => (
            <div key={item.id} className="col-lg-4 col-sm-6">
              <a 
                className="portfolio-box" 
                href={`assets/img/portfolio/fullsize/${item.id}.jpg`} 
                title={item.name}
                onClick={(e) => handleClick(e, item.id)}
              >
                <img className="img-fluid" src={`assets/img/portfolio/thumbnails/${item.id}.jpg`} alt="..." />
                <div className="portfolio-box-caption">
                  <div className="project-category text-white-50">{item.category}</div>
                  <div className="project-name">{item.name}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Portfolio;

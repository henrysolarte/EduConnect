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
    if (itemId === 1) {
      e.preventDefault();
      // Verificar si hay token de autenticación
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/js');
      } else {
        navigate('/register');
      }
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

      <section className="page-section bg-dark text-white">
        <div className="container px-4 px-lg-5 text-center">
          <h2 className="mb-4">Free Download at Start Bootstrap!</h2>
          <a className="btn btn-light btn-xl" href="https://startbootstrap.com/theme/creative/">Download Now!</a>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;

import React from 'react';

function Portfolio() {
  const portfolioItems = [
    { id: 1, category: 'Category', name: 'Project Name' },
    { id: 2, category: 'Category', name: 'Project Name' },
    { id: 3, category: 'Category', name: 'Project Name' },
    { id: 4, category: 'Category', name: 'Project Name' },
    { id: 5, category: 'Category', name: 'Project Name' },
    { id: 6, category: 'Category', name: 'Project Name' }
  ];

  return (
    <div id="portfolio">
      <div className="container-fluid p-0">
        <div className="row g-0">
          {portfolioItems.map(item => (
            <div key={item.id} className="col-lg-4 col-sm-6">
              <a className="portfolio-box" href={`assets/img/portfolio/fullsize/${item.id}.jpg`} title={item.name}>
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

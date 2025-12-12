import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ocultar navbar después de 100px de scroll
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Función para verificar el estado de autenticación
    const checkAuth = () => {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      } else {
        setUsuario(null);
      }
    };

    // Verificar al montar
    checkAuth();

    // Verificar cuando cambia el storage (por ejemplo, al cerrar sesión desde otra pestaña)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
      <div className="container px-4 px-lg-5">
        <Link className="navbar-brand" to="/">EduConnect</Link>
        <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto my-2 my-lg-0">
            {usuario && (
              <li className="nav-item">
                <span className="nav-link" style={{ color: '#fff', fontWeight: 'bold' }}>
                  Bienvenido, {usuario.nombre}
                </span>
              </li>
            )}
            {!usuario && (
              <li className="nav-item"><Link className="nav-link" to="/register">Registrate</Link></li>
            )}
            <li className="nav-item"><Link className="nav-link" to="/publicaciones">Publicaciones</Link></li>
            {usuario && usuario.rol_id === 1 && (
              <li className="nav-item">
                <Link className="nav-link" to="/aprobar-profesores" style={{ fontWeight: 'bold', color: '#dc3545' }}>
                  👥 Profesores
                </Link>
              </li>
            )}
            {usuario && usuario.rol_id === 3 && (
              <li className="nav-item">
                <Link className="nav-link" to="/aprobar-publicaciones" style={{ fontWeight: 'bold', color: '#ffc107' }}>
                  ✓ Aprobar
                </Link>
              </li>
            )}
            <li className="nav-item"><Link className="nav-link" to="/carrito">Carrito</Link></li>
            <li className="nav-item"><a className="nav-link" href="#portfolio">Portfolio</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            {usuario && (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={handleLogout}
                  style={{ color: '#fff', cursor: 'pointer' }}
                >
                  Salir
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

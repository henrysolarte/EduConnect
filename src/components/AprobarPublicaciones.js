import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function AprobarPublicaciones() {
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      
      // Verificar que sea profesor (rol_id = 3)
      if (user.rol_id !== 3) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        cargarPublicacionesPendientes();
      }
    } else {
      setTimeout(() => {
        navigate('/register');
      }, 2000);
    }
  }, [navigate]);

  const cargarPublicacionesPendientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/publicaciones/pendientes');
      const data = await response.json();

      if (data.success) {
        setPublicaciones(data.publicaciones);
      } else {
        setError(data.message || 'Error al cargar publicaciones');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const aprobarPublicacion = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de aprobar la publicación "${titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/publicaciones/aprobar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Publicación aprobada exitosamente');
        // Recargar la lista
        cargarPublicacionesPendientes();
      } else {
        alert('Error: ' + (data.message || 'No se pudo aprobar la publicación'));
      }
    } catch (error) {
      console.error('Error al aprobar publicación:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const getTipoColor = (tipo) => {
    const colores = {
      'Paper': '#e74c3c',
      'Artículo científico': '#3498db',
      'Tesis': '#9b59b6',
      'Editorial': '#27ae60'
    };
    return colores[tipo] || '#95a5a6';
  };

  // Verificar acceso
  if (!usuario) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-warning text-center">
                <h3>⚠️ Acceso Restringido</h3>
                <p className="mb-4">Debes iniciar sesión para acceder a esta sección.</p>
                <Link to="/register" className="btn btn-primary btn-lg">Ir a Registro</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (usuario.rol_id !== 3) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-danger text-center">
                <h3>🚫 Acceso Denegado</h3>
                <p className="mb-4">Solo los profesores pueden acceder a esta sección.</p>
                <Link to="/" className="btn btn-primary btn-lg">Volver al Inicio</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '150px 20px', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.2rem', color: '#6c757d' }}>
            Cargando publicaciones pendientes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '150px 20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={cargarPublicacionesPendientes}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '100px 20px 50px', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
            Aprobar Publicaciones
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
            Publicaciones pendientes de revisión: <strong>{publicaciones.length}</strong>
          </p>
        </div>

        {publicaciones.length === 0 ? (
          <div className="alert alert-info text-center">
            <h4>✓ No hay publicaciones pendientes</h4>
            <p>Todas las publicaciones han sido revisadas.</p>
            <Link to="/" className="btn btn-primary mt-3">Volver al Inicio</Link>
          </div>
        ) : (
          <div className="row">
            {publicaciones.map((pub) => (
              <div key={pub.id} className="col-lg-12 mb-4">
                <div className="card shadow-sm" style={{ border: '1px solid #e0e0e0' }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0" style={{ color: '#2c3e50', fontWeight: 'bold', flex: 1 }}>
                        {pub.titulo}
                      </h5>
                      <span 
                        className="badge ms-3" 
                        style={{ 
                          backgroundColor: getTipoColor(pub.tipo_documento),
                          fontSize: '0.9rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {pub.tipo_documento}
                      </span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="mb-2"><strong>Autor:</strong> {pub.autor_principal}</p>
                        <p className="mb-2"><strong>Email:</strong> {pub.correo_contacto}</p>
                        {pub.institucion && (
                          <p className="mb-2"><strong>Institución:</strong> {pub.institucion}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        {pub.pais && (
                          <p className="mb-2"><strong>País:</strong> {pub.pais}</p>
                        )}
                        {pub.area_conocimiento && (
                          <p className="mb-2"><strong>Área:</strong> {pub.area_conocimiento}</p>
                        )}
                        <p className="mb-2">
                          <strong>Fecha de envío:</strong> {new Date(pub.fecha_subida).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {pub.resumen && (
                      <div className="mb-3">
                        <strong>Resumen:</strong>
                        <p className="text-muted mt-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                          {pub.resumen}
                        </p>
                      </div>
                    )}

                    {pub.palabras_clave && (
                      <div className="mb-3">
                        <strong>Palabras clave:</strong>
                        <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
                          {pub.palabras_clave}
                        </p>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-success"
                        onClick={() => aprobarPublicacion(pub.id, pub.titulo)}
                        style={{ fontWeight: '500' }}
                      >
                        ✓ Aprobar Publicación
                      </button>
                      <a
                        href={`http://localhost:5000/api/publicaciones/descargar/${pub.id}`}
                        className="btn btn-outline-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📄 Ver Documento
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AprobarPublicaciones;

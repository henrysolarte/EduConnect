import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Publicaciones() {
    const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState({
    papers: [],
    articulos: [],
    tesis: [],
    editoriales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      setLoading(true);
      
      // Cargar publicaciones por tipo
      const [papers, articulos, tesis, editoriales] = await Promise.all([
        fetch('http://localhost:5000/api/publicaciones/tipo/1').then(res => res.json()),
        fetch('http://localhost:5000/api/publicaciones/tipo/2').then(res => res.json()),
        fetch('http://localhost:5000/api/publicaciones/tipo/3').then(res => res.json()),
        fetch('http://localhost:5000/api/publicaciones/tipo/4').then(res => res.json())
      ]);

      setPublicaciones({
        papers: papers.publicaciones || [],
        articulos: articulos.publicaciones || [],
        tesis: tesis.publicaciones || [],
        editoriales: editoriales.publicaciones || []
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('Error al cargar las publicaciones. Por favor, intenta más tarde.');
      setLoading(false);
    }
  };

  const descargarArchivo = async (id, titulo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/publicaciones/descargar/${id}`);
      
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${titulo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el archivo');
    }
  };

  const PublicacionCard = ({ publicacion, tipo }) => (
    <div className="card mb-4 shadow-sm" style={{ border: '1px solid #e0e0e0' }}>
      <div className="card-body">
        <h5 className="card-title" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          {publicacion.titulo}
        </h5>
        <div className="mb-3">
          <p className="mb-1"><strong>Autor:</strong> {publicacion.autor_principal}</p>
          
          {/* Información específica según el tipo */}
          {tipo === 'paper' && (
            <>
              <p className="mb-1"><strong>Universidad/Institución:</strong> {publicacion.institucion || 'No especificada'}</p>
              <p className="mb-1"><strong>País:</strong> {publicacion.pais || 'No especificado'}</p>
              {publicacion.area_conocimiento && (
                <p className="mb-1"><strong>Temática:</strong> {publicacion.area_conocimiento}</p>
              )}
            </>
          )}
          
          {tipo === 'articulo' && (
            <>
              <p className="mb-1"><strong>Institución:</strong> {publicacion.institucion || 'No especificada'}</p>
              <p className="mb-1"><strong>País:</strong> {publicacion.pais || 'No especificado'}</p>
              {publicacion.area_conocimiento && (
                <p className="mb-1"><strong>Área de conocimiento:</strong> {publicacion.area_conocimiento}</p>
              )}
            </>
          )}
          
          {tipo === 'tesis' && (
            <>
              <p className="mb-1"><strong>Universidad:</strong> {publicacion.institucion || 'No especificada'}</p>
              <p className="mb-1"><strong>País:</strong> {publicacion.pais || 'No especificado'}</p>
              {publicacion.area_conocimiento && (
                <p className="mb-1"><strong>Área:</strong> {publicacion.area_conocimiento}</p>
              )}
            </>
          )}
          
          {tipo === 'editorial' && (
            <>
              {publicacion.area_conocimiento && (
                <p className="mb-1"><strong>Tipo de Editorial:</strong> {publicacion.area_conocimiento}</p>
              )}
              <p className="mb-1"><strong>Institución:</strong> {publicacion.institucion || 'No especificada'}</p>
            </>
          )}
          
          <p className="mb-1">
            <strong>Fecha de publicación:</strong> {new Date(publicacion.fecha_subida).toLocaleDateString('es-ES')}
          </p>
        </div>
        
        {publicacion.resumen && (
          <div className="mb-3">
            <strong>Resumen:</strong>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              {publicacion.resumen}
            </p>
          </div>
        )}

        {publicacion.palabras_clave && (
          <div className="mb-3">
            <strong>Palabras clave:</strong>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              {publicacion.palabras_clave}
            </p>
          </div>
        )}

        <button 
          className="btn btn-primary"
          onClick={() => descargarArchivo(publicacion.id, publicacion.titulo)}
          style={{ 
            backgroundColor: '#3498db', 
            borderColor: '#3498db',
            fontWeight: '500'
          }}
        >
          <i className="bi bi-download"></i> Descargar Documento
        </button>
      </div>
    </div>
  );

  const SeccionPublicaciones = ({ titulo, publicaciones, color, tipo }) => (
    <div className="mb-5">
      <div 
        className="mb-4 p-3" 
        style={{ 
          backgroundColor: color, 
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 className="mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          {titulo}
        </h2>
        <p className="mb-0 mt-1" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
          {publicaciones.length} {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
        </p>
      </div>
      
      {publicaciones.length === 0 ? (
        <div className="alert alert-info">
          No hay publicaciones en esta categoría aún.
        </div>
      ) : (
        <div className="row">
          {publicaciones.map(pub => (
            <div key={pub.id} className="col-lg-6 mb-4">
              <PublicacionCard publicacion={pub} tipo={tipo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
            Cargando publicaciones...
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
            <button className="btn btn-primary" onClick={cargarPublicaciones}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

    // Fondo igual a JSCourse.js
    const publicacionesBgStyle = {
      minHeight: '100vh',
      backgroundImage: `linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url(${process.env.PUBLIC_URL}/assets/img/bg-masthead.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 0,
      width: '100%',
    };

    return (
      <div style={publicacionesBgStyle}>
        <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2.5rem 2rem', textAlign: 'center' }}>
          {/* Encabezado */}
          <div className="text-center mb-5">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '1rem' }}>
              Publicaciones Académicas
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#7f8c8d', maxWidth: '700px', margin: '0 auto' }}>
              Explora nuestra colección de trabajos académicos y científicos
            </p>
          </div>
          {/* Papers */}
          <SeccionPublicaciones 
            titulo="Papers" 
            publicaciones={publicaciones.papers}
            color="#3498db"
            tipo="paper"
          />
          {/* Artículos Científicos */}
          <SeccionPublicaciones 
            titulo="Artículos Científicos" 
            publicaciones={publicaciones.articulos}
            color="#3498db"
            tipo="articulo"
          />
          {/* Tesis */}
          <SeccionPublicaciones 
            titulo="Tesis" 
            publicaciones={publicaciones.tesis}
            color="#3498db"
            tipo="tesis"
          />
          {/* Editoriales */}
          <SeccionPublicaciones 
            titulo="Editoriales" 
            publicaciones={publicaciones.editoriales}
            color="#3498db"
            tipo="editorial"
          />
          {/* Botón Salir */}
          <div className="text-center mt-5">
            <a
              className="btn btn-secondary"
              style={{ fontSize: '1.1rem', padding: '10px 30px', fontWeight: 'bold', borderRadius: 8 }}
              href="/#masthead"
            >
              Salir
            </a>
          </div>
          <footer style={{ textAlign: 'center', color: '#888', fontSize: '0.95rem', marginTop: 32 }}>
            © {new Date().getFullYear()} EduConnect – Todos los derechos reservados.
          </footer>
        </div>
      </div>
    );
}

export default Publicaciones;

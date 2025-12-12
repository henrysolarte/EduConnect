import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AprobarProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar que el usuario sea administrador
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario || usuario.rol_id !== 1) {
      alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
      navigate('/');
      return;
    }

    cargarProfesoresPendientes();
  }, [navigate]);

  const cargarProfesoresPendientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/profesores/pendientes');
      const data = await response.json();

      if (data.success) {
        setProfesores(data.profesores);
      } else {
        setError('Error al cargar profesores pendientes');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const aprobarProfesor = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas aprobar al profesor ${nombre}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/profesores/aprobar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert(`Profesor ${nombre} aprobado exitosamente`);
        // Recargar la lista de profesores pendientes
        cargarProfesoresPendientes();
      } else {
        alert('Error al aprobar profesor: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-lg-12">
          <h2 className="text-center mb-4">
            <i className="fas fa-user-check me-2"></i>
            Aprobar Profesores
          </h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {profesores.length === 0 ? (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              No hay profesores pendientes de aprobación
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2"></i>
                  Profesores Pendientes ({profesores.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profesores.map((profesor) => (
                        <tr key={profesor.id}>
                          <td>{profesor.id}</td>
                          <td>
                            <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
                            {profesor.nombre}
                          </td>
                          <td>
                            <i className="fas fa-envelope me-2 text-muted"></i>
                            {profesor.email}
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {profesor.rol_nombre}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              <i className="fas fa-clock me-1"></i>
                              Pendiente
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => aprobarProfesor(profesor.id, profesor.nombre)}
                            >
                              <i className="fas fa-check me-1"></i>
                              Aprobar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .table-responsive {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .table thead th {
          position: sticky;
          top: 0;
          background-color: #f8f9fa;
          z-index: 10;
        }
        
        .btn-success {
          transition: all 0.3s ease;
        }
        
        .btn-success:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .card {
          border: none;
          border-radius: 10px;
        }
        
        .card-header {
          border-radius: 10px 10px 0 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AprobarProfesores;

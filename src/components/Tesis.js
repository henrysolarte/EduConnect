import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Tesis() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    nivelAcademico: '',
    areaConocimiento: '',
    autor: '',
    email: '',
    universidad: '',
    programaAcademico: '',
    directorTesis: '',
    anioPresentacion: '',
    resumen: '',
    palabrasClave: '',
    archivo: null,
    autorizacionPublicacion: false,
    declaracionOriginalidad: false
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      setTimeout(() => {
        navigate('/register');
      }, 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.autorizacionPublicacion || !formData.declaracionOriginalidad) {
      alert('Debes aceptar ambas declaraciones');
      return;
    }

    if (!formData.archivo) {
      alert('Debe seleccionar un archivo');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('usuario_id', usuario.id);
      formDataToSend.append('tipo_id', 3); // 3 = Tesis
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('autor_principal', formData.autor);
      formDataToSend.append('correo_contacto', formData.email);
      formDataToSend.append('institucion', formData.universidad);
      formDataToSend.append('pais', '');
      formDataToSend.append('area_conocimiento', formData.areaConocimiento);
      formDataToSend.append('resumen', formData.resumen);
      formDataToSend.append('palabras_clave', formData.palabrasClave);
      formDataToSend.append('archivo', formData.archivo);

      const response = await fetch('http://localhost:5000/api/publicaciones/crear', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Tesis registrada exitosamente! Será revisada por nuestro comité académico.');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
      } else {
        alert('Error: ' + (data.message || 'No se pudo registrar la tesis'));
      }
    } catch (error) {
      console.error('Error al enviar tesis:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleGuardarBorrador = () => {
    console.log('Guardando borrador:', formData);
    alert('Borrador guardado localmente');
  };

  if (!usuario) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-warning text-center">
                <h3>⚠️ Acceso Restringido</h3>
                <p className="mb-4">Debes registrarte para acceder a esta sección.</p>
                <Link to="/register" className="btn btn-primary btn-lg">Ir a Registro</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 20px', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '40px' }}>
          
          {/* Encabezado */}
          <header style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Registro de Tesis
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Complete el siguiente formulario para registrar su tesis de pregrado o posgrado.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              {/* Título de la tesis */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Título de la tesis
                </label>
                <input 
                  type="text" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Título completo de la tesis"
                  required 
                />
              </div>

              {/* Nivel académico */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Nivel académico
                </label>
                <select 
                  name="nivelAcademico"
                  value={formData.nivelAcademico}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione el nivel</option>
                  <option value="Pregrado">Pregrado</option>
                  <option value="Especialización">Especialización</option>
                  <option value="Maestría">Maestría</option>
                  <option value="Doctorado">Doctorado</option>
                </select>
              </div>

              {/* Área de conocimiento */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Área de conocimiento
                </label>
                <select 
                  name="areaConocimiento"
                  value={formData.areaConocimiento}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione un área</option>
                  <option value="Ciencias de la salud">Ciencias de la salud</option>
                  <option value="Ciencias sociales">Ciencias sociales</option>
                  <option value="Ingeniería y tecnología">Ingeniería y tecnología</option>
                  <option value="Educación">Educación</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Humanidades">Humanidades</option>
                </select>
              </div>

              {/* Autor */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Autor/a
                </label>
                <input 
                  type="text" 
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre completo del tesista"
                  required 
                />
              </div>

              {/* Correo */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="correo@universidad.edu"
                  required 
                />
              </div>

              {/* Universidad */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Universidad / Institución
                </label>
                <input 
                  type="text" 
                  name="universidad"
                  value={formData.universidad}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre de la institución"
                  required 
                />
              </div>

              {/* Programa académico */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Programa académico
                </label>
                <input 
                  type="text" 
                  name="programaAcademico"
                  value={formData.programaAcademico}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Carrera o programa"
                  required 
                />
              </div>

              {/* Director de tesis */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Director/a de tesis
                </label>
                <input 
                  type="text" 
                  name="directorTesis"
                  value={formData.directorTesis}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre del director"
                  required 
                />
              </div>

              {/* Año de presentación */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Año de presentación
                </label>
                <input 
                  type="number" 
                  name="anioPresentacion"
                  value={formData.anioPresentacion}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="2025"
                  required 
                />
              </div>

              {/* Resumen */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Resumen de la tesis
                </label>
                <textarea 
                  rows="4" 
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Resumen del problema, objetivos, metodología y conclusiones"
                  required
                ></textarea>
              </div>

              {/* Palabras clave */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Palabras clave
                </label>
                <input 
                  type="text" 
                  name="palabrasClave"
                  value={formData.palabrasClave}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Ej.: educación, tecnología, derecho, salud"
                  required 
                />
                <small className="text-muted">Separe las palabras clave con comas.</small>
              </div>

              {/* Subida de archivo */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Subir archivo de la tesis (PDF)
                </label>
                <input 
                  type="file" 
                  name="archivo"
                  onChange={handleChange}
                  className="form-control" 
                  accept=".pdf"
                  required 
                />
                <small className="text-muted">Formato PDF. Tamaño máximo sugerido: 15 MB.</small>
              </div>

              {/* Autorizaciones */}
              <div className="col-12">
                <div className="form-check mb-2">
                  <input 
                    type="checkbox" 
                    name="autorizacionPublicacion"
                    checked={formData.autorizacionPublicacion}
                    onChange={handleChange}
                    className="form-check-input" 
                    id="autorizacionPublicacion"
                    required
                  />
                  <label className="form-check-label" htmlFor="autorizacionPublicacion" style={{ fontSize: '0.875rem' }}>
                    Autorizo la difusión pública de esta tesis con fines académicos y de investigación.
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    name="declaracionOriginalidad"
                    checked={formData.declaracionOriginalidad}
                    onChange={handleChange}
                    className="form-check-input" 
                    id="declaracionOriginalidad"
                    required
                  />
                  <label className="form-check-label" htmlFor="declaracionOriginalidad" style={{ fontSize: '0.875rem' }}>
                    Declaro que el contenido es original y cumple con las normas de propiedad intelectual.
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-3" style={{ marginTop: '24px' }}>
                <button 
                  type="button"
                  onClick={handleGuardarBorrador}
                  className="btn btn-outline-secondary"
                  style={{ padding: '10px 24px' }}
                >
                  Guardar borrador
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '10px 32px', fontWeight: '600' }}
                >
                  Registrar tesis
                </button>
              </div>

              {/* Volver */}
              <div className="col-12 text-center">
                <Link to="/" className="btn btn-link">
                  Volver al Inicio
                </Link>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Tesis;

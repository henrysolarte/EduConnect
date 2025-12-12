import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ArticulosCientificos() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    tipoDocumento: '',
    areaConocimiento: '',
    autorPrincipal: '',
    email: '',
    institucion: '',
    pais: '',
    resumen: '',
    palabrasClave: '',
    coautores: '',
    archivo: null,
    materialComplementario: null,
    declaracionOriginalidad: false,
    declaracionEtica: false
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
    
    if (!formData.declaracionOriginalidad || !formData.declaracionEtica) {
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
      formDataToSend.append('tipo_id', 2); // 2 = Artículo científico
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('autor_principal', formData.autorPrincipal);
      formDataToSend.append('correo_contacto', formData.email);
      formDataToSend.append('institucion', formData.institucion);
      formDataToSend.append('pais', formData.pais);
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
        alert('¡Artículo enviado exitosamente! Será revisado por nuestro comité científico.');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
      } else {
        alert('Error: ' + (data.message || 'No se pudo enviar el artículo'));
      }
    } catch (error) {
      console.error('Error al enviar artículo:', error);
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
              Registro de Artículo Científico
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Complete el siguiente formulario para postular su artículo a evaluación y publicación.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              {/* Título del artículo */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Título del artículo
                </label>
                <input 
                  type="text" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Título completo del artículo"
                  required 
                />
              </div>

              {/* Tipo de documento */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Tipo de documento
                </label>
                <select 
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Artículo científico">Artículo científico</option>
                  <option value="Artículo de revisión">Artículo de revisión</option>
                  <option value="Reporte de caso">Reporte de caso</option>
                  <option value="Comunicación breve">Comunicación breve</option>
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
                  <option value="Ingenierías y tecnología">Ingenierías y tecnología</option>
                  <option value="Ciencias naturales">Ciencias naturales</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Educación">Educación</option>
                </select>
              </div>

              {/* Autor principal */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Autor/a principal
                </label>
                <input 
                  type="text" 
                  name="autorPrincipal"
                  value={formData.autorPrincipal}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre completo"
                  required 
                />
              </div>

              {/* Correo de contacto */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Correo de contacto
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="autor@correo.com"
                  required 
                />
              </div>

              {/* Institución */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Institución / Universidad
                </label>
                <input 
                  type="text" 
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre de la institución"
                  required 
                />
              </div>

              {/* País */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  País
                </label>
                <input 
                  type="text" 
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="País"
                  required 
                />
              </div>

              {/* Resumen */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Resumen
                </label>
                <textarea 
                  rows="4" 
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Resumen estructurado del artículo (objetivo, método, resultados, conclusiones)"
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
                  placeholder="Ej.: violencia de género, derecho penal, infancia"
                  required 
                />
                <small className="text-muted">Separe las palabras clave con comas.</small>
              </div>

              {/* Coautores */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Coautores (opcional)
                </label>
                <textarea 
                  rows="2" 
                  name="coautores"
                  value={formData.coautores}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Ingrese nombres completos y correos electrónicos de los coautores"
                ></textarea>
              </div>

              {/* Subida de archivo principal */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Subir artículo (formato PDF)
                </label>
                <input 
                  type="file" 
                  name="archivo"
                  onChange={handleChange}
                  className="form-control" 
                  accept=".pdf"
                  required 
                />
                <small className="text-muted">Formato requerido: PDF. Tamaño máximo sugerido: 10 MB.</small>
              </div>

              {/* Material complementario */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Material complementario (opcional)
                </label>
                <input 
                  type="file" 
                  name="materialComplementario"
                  onChange={handleChange}
                  className="form-control" 
                  multiple
                />
                <small className="text-muted">Tablas, anexos, bases de datos u otros materiales de apoyo.</small>
              </div>

              {/* Declaraciones */}
              <div className="col-12">
                <div className="form-check mb-2">
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
                    Declaro que el manuscrito es original, no ha sido publicado previamente y no está siendo evaluado simultáneamente en otra revista o plataforma.
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    name="declaracionEtica"
                    checked={formData.declaracionEtica}
                    onChange={handleChange}
                    className="form-check-input" 
                    id="declaracionEtica"
                    required
                  />
                  <label className="form-check-label" htmlFor="declaracionEtica" style={{ fontSize: '0.875rem' }}>
                    Confirmo que se han respetado las normas éticas de investigación y de protección de datos personales, cuando corresponda.
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
                  Enviar artículo
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

export default ArticulosCientificos;

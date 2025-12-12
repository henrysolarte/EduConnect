import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Editoriales() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    tipoEditorial: '',
    temaGeneral: '',
    autor: '',
    email: '',
    institucion: '',
    fecha: '',
    sintesis: '',
    palabrasClave: '',
    publicoObjetivo: '',
    archivo: null,
    declaracionOriginalidad: false,
    autorizacionEdicion: false
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
    
    if (!formData.declaracionOriginalidad || !formData.autorizacionEdicion) {
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
      formDataToSend.append('tipo_id', 4); // 4 = Editorial
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('autor_principal', formData.autor);
      formDataToSend.append('correo_contacto', formData.email);
      formDataToSend.append('institucion', formData.institucion);
      formDataToSend.append('pais', '');
      formDataToSend.append('area_conocimiento', formData.temaGeneral);
      formDataToSend.append('resumen', formData.sintesis);
      formDataToSend.append('palabras_clave', formData.palabrasClave);
      formDataToSend.append('archivo', formData.archivo);

      const response = await fetch('http://localhost:5000/api/publicaciones/crear', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Editorial registrado exitosamente! Será revisado por nuestro equipo editorial.');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
      } else {
        alert('Error: ' + (data.message || 'No se pudo registrar el editorial'));
      }
    } catch (error) {
      console.error('Error al enviar editorial:', error);
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
              Registro de Editorial
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Complete el formulario para registrar un editorial académico o de opinión.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              {/* Título del editorial */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Título del editorial
                </label>
                <input 
                  type="text" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Título completo del editorial"
                  required 
                />
              </div>

              {/* Tipo de editorial */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Tipo de editorial
                </label>
                <select 
                  name="tipoEditorial"
                  value={formData.tipoEditorial}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Editorial académico">Editorial académico</option>
                  <option value="Editorial de opinión">Editorial de opinión</option>
                  <option value="Editorial institucional">Editorial institucional</option>
                  <option value="Columna invitada">Columna invitada</option>
                </select>
              </div>

              {/* Sección / Tema general */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Sección o tema general
                </label>
                <input 
                  type="text" 
                  name="temaGeneral"
                  value={formData.temaGeneral}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Ej.: educación, justicia, política pública"
                  required 
                />
              </div>

              {/* Autor */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Autor/a del editorial
                </label>
                <input 
                  type="text" 
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Nombre completo"
                  required 
                />
              </div>

              {/* Correo */}
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

              {/* Institución / Medio */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Institución o medio
                </label>
                <input 
                  type="text" 
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Universidad, revista, portal, etc."
                  required 
                />
              </div>

              {/* Fecha del editorial */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Fecha del editorial
                </label>
                <input 
                  type="date" 
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="form-control"
                  required 
                />
              </div>

              {/* Síntesis / resumen breve */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Síntesis del editorial
                </label>
                <textarea 
                  rows="3" 
                  name="sintesis"
                  value={formData.sintesis}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Breve descripción del tema, enfoque y postura principal."
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
                  placeholder="Ej.: derechos humanos, niñez, política criminal"
                  required 
                />
                <small className="text-muted">Separe las palabras clave con comas.</small>
              </div>

              {/* Público objetivo */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Público objetivo
                </label>
                <input 
                  type="text" 
                  name="publicoObjetivo"
                  value={formData.publicoObjetivo}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Ej.: comunidad académica, operadores de justicia, público general"
                  required 
                />
              </div>

              {/* Subida de archivo */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Subir archivo del editorial (PDF o DOCX)
                </label>
                <input 
                  type="file" 
                  name="archivo"
                  onChange={handleChange}
                  className="form-control" 
                  accept=".pdf,.doc,.docx"
                  required 
                />
                <small className="text-muted">Formatos sugeridos: PDF, DOCX. Tamaño máximo: 10 MB.</small>
              </div>

              {/* Autorizaciones */}
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
                    Declaro que el contenido del editorial es original y que cuento con las autorizaciones necesarias para su publicación.
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    name="autorizacionEdicion"
                    checked={formData.autorizacionEdicion}
                    onChange={handleChange}
                    className="form-check-input" 
                    id="autorizacionEdicion"
                    required
                  />
                  <label className="form-check-label" htmlFor="autorizacionEdicion" style={{ fontSize: '0.875rem' }}>
                    Autorizo la edición de estilo y ajustes formales respetando el sentido y la autoría del texto.
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
                  className="btn btn-success"
                  style={{ padding: '10px 32px', fontWeight: '600' }}
                >
                  Registrar editorial
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

export default Editoriales;

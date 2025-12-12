import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Papers() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    email: '',
    institucion: '',
    pais: '',
    area: '',
    resumen: '',
    palabrasClave: '',
    archivo: null,
    declaracion: false
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      // Si no está autenticado, redirigir después de 2 segundos
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
    
    if (!formData.declaracion) {
      alert('Debes aceptar la declaración de originalidad');
      return;
    }

    if (!formData.archivo) {
      alert('Debe seleccionar un archivo');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('usuario_id', usuario.id);
      formDataToSend.append('tipo_id', 1); // 1 = Paper
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('autor_principal', formData.autor);
      formDataToSend.append('correo_contacto', formData.email);
      formDataToSend.append('institucion', formData.institucion);
      formDataToSend.append('pais', formData.pais);
      formDataToSend.append('area_conocimiento', formData.area);
      formDataToSend.append('resumen', formData.resumen);
      formDataToSend.append('palabras_clave', formData.palabrasClave);
      formDataToSend.append('archivo', formData.archivo);

      const response = await fetch('http://localhost:5000/api/publicaciones/crear', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Paper enviado exitosamente! Será revisado por nuestro equipo académico.');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
      } else {
        alert('Error: ' + (data.message || 'No se pudo enviar el paper'));
      }
    } catch (error) {
      console.error('Error al enviar paper:', error);
      alert('Error al conectar con el servidor');
    }
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
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '40px' }}>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
            Registro de Paper
          </h1>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '32px' }}>
            Complete los datos para postular su documento académico
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              {/* Título del paper */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Título del Paper
                </label>
                <input 
                  type="text" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Título completo del trabajo"
                  required 
                />
              </div>

              {/* Autor */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Autor principal
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
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="autor@email.com"
                  required 
                />
              </div>

              {/* Institución */}
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Universidad / Institución
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
                  placeholder="País de origen"
                  required 
                />
              </div>

              {/* Área temática */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Área temática
                </label>
                <select 
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione un área</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Ciencias Sociales">Ciencias Sociales</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Educación">Educación</option>
                  <option value="Salud">Salud</option>
                  <option value="Tecnología">Tecnología</option>
                </select>
              </div>

              {/* Resumen */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Resumen del Paper
                </label>
                <textarea 
                  rows="4" 
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Resumen académico del trabajo"
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
                  placeholder="Ej: educación, tecnología, investigación"
                  required 
                />
              </div>

              {/* Subir archivo */}
              <div className="col-12">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                  Subir archivo del Paper (PDF)
                </label>
                <input 
                  type="file" 
                  name="archivo"
                  onChange={handleChange}
                  className="form-control" 
                  accept=".pdf"
                  required 
                />
              </div>

              {/* Declaración */}
              <div className="col-12">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    name="declaracion"
                    checked={formData.declaracion}
                    onChange={handleChange}
                    className="form-check-input" 
                    id="declaracion"
                    required
                  />
                  <label className="form-check-label" htmlFor="declaracion" style={{ fontSize: '0.875rem' }}>
                    Declaro que este trabajo es original y no infringe derechos de autor.
                  </label>
                </div>
              </div>

              {/* Botón */}
              <div className="col-12 text-center" style={{ marginTop: '24px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '600' }}
                >
                  Enviar Paper
                </button>
              </div>

              {/* Volver */}
              <div className="col-12 text-center">
                <Link to="/" className="btn btn-outline-secondary">
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

export default Papers;

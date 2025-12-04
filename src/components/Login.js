import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Datos de login:', formData);
    
    // TODO: Aquí se conectará con la API para:
    // 1. Buscar usuario por email
    // 2. Verificar password_hash con bcrypt
    // 3. Obtener rol_id del usuario
    // 4. Si rol_id = 1 (admin): Redirigir a panel de administración
    // 5. Si rol_id = 2 (estudiante): Redirigir a área de estudiantes
    // 6. Guardar sesión/token JWT
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Iniciar Sesión
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
          <p><Link to="/">Volver al inicio</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

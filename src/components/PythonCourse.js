export default function PythonCourse() {
  const mastheadStyle = {
    minHeight: '100vh',
    backgroundImage: `linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url(${process.env.PUBLIC_URL}/assets/img/bg-masthead.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0',
  };

  return (
    <div style={mastheadStyle}>
      <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 }}>🐍 Curso: Python Desde Cero</h1>
        <p style={{ fontSize: '1.15rem', color: '#555', marginBottom: 32 }}>
          Aprende Python desde cero con ejemplos simples y ejercicios prácticos. Ideal para quienes quieren iniciar en la programación, automatizar tareas o dar sus primeros pasos en análisis de datos.
        </p>
        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 10 }}>¿Qué aprenderás?</h2>
          <ul style={{ marginLeft: 18, marginBottom: 18, color: '#333', fontSize: '1rem' }}>
            <li>Sintaxis básica de Python</li>
            <li>Variables, tipos de datos y operadores</li>
            <li>Condicionales y ciclos (if, for, while)</li>
            <li>Funciones y manejo de errores</li>
            <li>Listas, diccionarios y manejo de archivos</li>
            <li>Mini–proyecto final aplicando todo lo aprendido</li>
          </ul>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '24px 0 10px' }}>Estructura del curso (módulos)</h2>
          <ul style={{ marginLeft: 18, color: '#333', fontSize: '1rem' }}>
            <li>Introducción a Python – Instalación y tu primer programa.</li>
            <li>Fundamentos – Variables, tipos y operadores.</li>
            <li>Control de flujo – Condicionales y bucles.</li>
            <li>Funciones – Reutilización de código.</li>
            <li>Estructuras de datos – Listas, tuplas, diccionarios.</li>
            <li>Archivos y práctica – Leer/escribir archivos y mini–proyecto.</li>
          </ul>
        </div>
        <div style={{ background: '#f8f9fa', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.07)', padding: '2rem 1.5rem', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' }}>Inscríbete Ahora</h3>
          <p style={{ marginBottom: 18, color: '#555' }}>
            Acceso inmediato, certificación digital y soporte durante el aprendizaje.
          </p>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#2563eb' }}>$29.99</span>
            <div style={{ fontSize: '0.95rem', color: '#888' }}>Pago único – acceso de por vida</div>
          </div>
          <button
            style={{ display: 'inline-block', width: '100%', background: '#2563eb', color: '#fff', padding: '0.9rem 0', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s', textAlign: 'center' }}
            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
            onClick={() => {
              // Agregar curso al carrito en localStorage
              const curso = {
                id: 'python',
                nombre: 'Curso de Python Desde Cero',
                precio: 29.99
              };
              let carrito = [];
              try {
                carrito = JSON.parse(localStorage.getItem('carrito')) || [];
              } catch (e) { carrito = []; }
              if (!carrito.some(item => item.id === curso.id)) {
                carrito.push(curso);
                localStorage.setItem('carrito', JSON.stringify(carrito));
              }
              window.location.href = '/carrito';
            }}
          >
            Agregar al carrito
          </button>
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 12 }}>*Garantía de satisfacción de 7 días*</div>
        </div>
        <footer style={{ textAlign: 'center', color: '#888', fontSize: '0.95rem', marginTop: 16 }}>
          © {new Date().getFullYear()} Plataforma de Cursos – Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}

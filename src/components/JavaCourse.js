const javaTemario = [
  'Sintaxis básica de Java',
  'Variables, tipos de datos y operadores',
  'Estructuras de control (if, switch, for, while)',
  'Métodos y funciones',
  'Arreglos y colecciones',
  'Programación Orientada a Objetos (POO)',
  'Manejo básico de archivos',
  'Mini–proyecto final',
];

const javaModulos = [
  'Introducción a Java – Instalación del JDK y primer programa.',
  'Fundamentos del lenguaje – Tipos, operadores y entrada/salida.',
  'Control de flujo – Condicionales y bucles.',
  'Métodos y modularización – Buenas prácticas.',
  'Arreglos y colecciones – Listas, mapas y estructuras útiles.',
  'POO Básica – Clases, objetos, atributos, métodos y herencia.',
  'Proyecto final – Aplicación simple integrando todo lo aprendido.'
];

export default function JavaCourse() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 }}>☕ Curso: Java Desde Cero</h1>
        <p style={{ fontSize: '1.15rem', color: '#555', marginBottom: 32 }}>
          Aprende Java desde cero con un enfoque práctico y sencillo. Java es uno de los lenguajes más utilizados en aplicaciones empresariales, móviles (Android) y sistemas de gran escala. Este curso te dará las bases necesarias para comenzar a programar de forma sólida y profesional.
        </p>
        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 10 }}>¿Qué aprenderás?</h2>
          <ul style={{ marginLeft: 18, marginBottom: 0, color: '#333', fontSize: '1rem' }}>
            {javaTemario.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '24px 0 10px' }}>Estructura del curso (módulos)</h2>
          <ol style={{ marginLeft: 18, color: '#333', fontSize: '1rem' }}>
            {javaModulos.map((mod, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{mod}</li>
            ))}
          </ol>
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
                id: 'java',
                nombre: 'Curso de Java Desde Cero',
                precio: 29.99
              };
              let carrito = [];
              try {
                carrito = JSON.parse(localStorage.getItem('carrito')) || [];
              } catch (e) { carrito = []; }
              // Evitar duplicados
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

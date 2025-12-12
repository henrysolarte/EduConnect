import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem('carrito')) || [];
    } catch (e) { items = []; }
    setCarrito(items);
    const sub = items.reduce((acc, cur) => acc + Number(cur.precio), 0);
    setSubtotal(sub);
    setIva(sub * 0.19);
    setTotal(sub * 1.19);
  }, []);

  const eliminar = (id) => {
    const nuevo = carrito.filter(c => c.id !== id);
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
    const sub = nuevo.reduce((acc, cur) => acc + Number(cur.precio), 0);
    setSubtotal(sub);
    setIva(sub * 0.19);
    setTotal(sub * 1.19);
  };

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
    <>
      <Navbar />
      <div style={mastheadStyle}>
        <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 }}>Tu Carrito</h1>
          {carrito.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>No hay cursos en el carrito.</div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                {carrito.map(curso => (
                  <div key={curso.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>{curso.nombre}</span>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>${Number(curso.precio).toFixed(2)}</span>
                    <button onClick={() => eliminar(curso.id)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.9rem', fontWeight: 600, marginLeft: 8 }}>Eliminar</button>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8f9fa', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.07)', padding: '2rem 1.5rem', marginBottom: 24, textAlign: 'left', maxWidth: 400, margin: '0 auto 24px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>IVA (19%):</span><span>${iva.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem', marginTop: 10 }}><span>Total:</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'center' }}>
                <button onClick={() => window.location.href = '/'} style={{ background: '#223', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem 0', fontWeight: 600, width: '100%', fontSize: '1.1rem' }}>Seguir comprando</button>
                <button onClick={() => window.location.href = '/pagos'} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem 0', fontWeight: 600, width: '100%', fontSize: '1.1rem', marginTop: 12 }}>Ir a pagar</button>
              </div>
            </>
          )}
          <footer style={{ textAlign: 'center', color: '#888', fontSize: '0.95rem', marginTop: 24 }}>
            © {new Date().getFullYear()} EduConnect. Todos los derechos reservados.<br />
            Proyecto realizado con: <strong>HTML, CSS, JavaScript</strong>
          </footer>
        </div>
      </div>
    </>
  );
}

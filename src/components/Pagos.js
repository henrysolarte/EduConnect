import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function Pagos() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [pagado, setPagado] = useState(false);
  const [form, setForm] = useState({ nombre: '', numero: '', vencimiento: '', cvc: '' });
  const [error, setError] = useState('');

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

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePagar = e => {
    e.preventDefault();
    setError('');
    // Validación simple
    if (!form.nombre || !form.numero || !form.vencimiento || !form.cvc) {
      setError('Por favor completa todos los campos de la tarjeta.');
      return;
    }
    if (!/^\d{16}$/.test(form.numero.replace(/\s/g, ''))) {
      setError('El número de tarjeta debe tener 16 dígitos.');
      return;
    }
    if (!/^\d{3,4}$/.test(form.cvc)) {
      setError('El CVC debe tener 3 o 4 dígitos.');
      return;
    }
    // Simular pago exitoso
    localStorage.removeItem('carrito');
    setCarrito([]);
    setSubtotal(0);
    setIva(0);
    setTotal(0);
    setPagado(true);
    setTimeout(() => navigate('/'), 2000);
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 }}>Pago de Cursos</h1>
          {pagado ? (
            <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '1.3rem', margin: '2rem 0' }}>¡Pago realizado con éxito! Redirigiendo...</div>
          ) : carrito.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>No hay cursos para pagar.</div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                {carrito.map(curso => (
                  <div key={curso.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>{curso.nombre}</span>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>${Number(curso.precio).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8f9fa', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.07)', padding: '2rem 1.5rem', marginBottom: 24, textAlign: 'left', maxWidth: 400, margin: '0 auto 24px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>IVA (19%):</span><span>${iva.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem', marginTop: 10 }}><span>Total:</span><span>${total.toFixed(2)}</span></div>
              </div>
              <form onSubmit={handlePagar} style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontWeight: 500 }}>Nombre en la tarjeta</label>
                  <input name="nombre" value={form.nombre} onChange={handleInput} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontWeight: 500 }}>Número de tarjeta</label>
                  <input name="numero" value={form.numero} onChange={handleInput} maxLength={16} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500 }}>Vencimiento</label>
                    <input name="vencimiento" value={form.vencimiento} onChange={handleInput} placeholder="MM/AA" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500 }}>CVC</label>
                    <input name="cvc" value={form.cvc} onChange={handleInput} maxLength={4} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                  </div>
                </div>
                {error && <div style={{ color: '#e57373', marginBottom: 10 }}>{error}</div>}
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem 0', fontWeight: 600, width: '100%', fontSize: '1.1rem', marginTop: 10 }}>Confirmar y Pagar</button>
              </form>
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

import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: '¡Mensaje enviado correctamente!' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'No se pudo enviar el mensaje.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error de red. Intenta más tarde.' });
    } finally {
      setSending(false);
    }
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
    <div style={mastheadStyle}>
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: 18, fontSize: '2rem' }}>Deja tus comentarios o inquietudes</h2>
        <p style={{ color: '#555', marginBottom: 32 }}>
          Te invitamos a dejar tus comentarios o inquietudes, los cuales serán de gran ayuda para resolver dudas y mejorar el proceso.
        </p>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {feedback && (
            <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'}`} role="alert">
              {feedback.message}
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label>Full name</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email address</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Phone number</label>
            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Message</label>
            <textarea id="message" value={formData.message} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4, minHeight: 120 }} />
          </div>
          <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '0.9rem 0', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', marginBottom: 10 }} disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        <div style={{ fontSize: '0.95rem', color: '#888', marginTop: 24 }}>
          <i className="bi-phone fs-2 mb-3 text-muted"></i>
          <div style={{ fontWeight: 500, marginTop: 4 }}>3186866521</div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

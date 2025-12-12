// pagos.js para EduConnect - Cursos

document.addEventListener('DOMContentLoaded', function () {
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  } catch (e) { carrito = []; }

  const productosDiv = document.getElementById('pagos-productos');
  const resumenDiv = document.getElementById('pagos-resumen');

  if (!carrito.length) {
    productosDiv.innerHTML = '<div style="color:#888;">No hay cursos para pagar.</div>';
    resumenDiv.innerHTML = '';
    return;
  }

  let subtotal = 0;
  productosDiv.innerHTML = '';
  carrito.forEach((curso) => {
    subtotal += Number(curso.precio);
    const item = document.createElement('div');
    item.style = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;';
    item.innerHTML = `
      <span style="font-weight:600;">${curso.nombre}</span>
      <span style="color:#2563eb;font-weight:600;">$${curso.precio.toFixed(2)}</span>
    `;
    productosDiv.appendChild(item);
  });

  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  resumenDiv.innerHTML = `
    <div style="background:#f8f9fa;border-radius:12px;color:#2c3e50;padding:1.2rem 1rem;margin:18px 0 0 0;box-shadow:0 2px 8px rgba(44,62,80,0.07);">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>IVA (19%):</span><span>$${iva.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:1.15rem;margin-top:10px;"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
    </div>
  `;
});

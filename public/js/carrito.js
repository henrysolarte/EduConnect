// carrito.js para EduConnect - Cursos

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el carrito de localStorage
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  } catch (e) { carrito = []; }

  // Mostrar los cursos en el carrito
  const carritoLista = document.getElementById('carrito-lista');
  const subtotalSpan = document.getElementById('subtotal');
  const ivaSpan = document.getElementById('iva');
  const totalSpan = document.getElementById('total');

  if (!carrito.length) {
    carritoLista.innerHTML = '<div style="color:#888;">No hay cursos en el carrito.</div>';
    subtotalSpan.textContent = '$0';
    ivaSpan.textContent = '$0';
    totalSpan.textContent = '$0';
    return;
  }

  let subtotal = 0;
  carritoLista.innerHTML = '';
  carrito.forEach((curso, idx) => {
    subtotal += Number(curso.precio);
    const item = document.createElement('div');
    item.style = 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #eee;';
    item.innerHTML = `
      <span style="font-weight:600;">${curso.nombre}</span>
      <span style="color:#2563eb;font-weight:600;">$${curso.precio.toFixed(2)}</span>
      <button style="background:#ce5050b8;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-weight:bold;" onclick="eliminarCurso(${idx})">Eliminar</button>
    `;
    carritoLista.appendChild(item);
  });

  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  ivaSpan.textContent = `$${iva.toFixed(2)}`;
  totalSpan.textContent = `$${total.toFixed(2)}`;
});

window.eliminarCurso = function(idx) {
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  } catch (e) { carrito = []; }
  carrito.splice(idx, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  location.reload();
};

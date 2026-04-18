const API_URL = '/api/jugadores';

document.addEventListener('DOMContentLoaded', () => {
  loadJugadores();
  setupForm();
});

async function loadJugadores() {
  try {
    const response = await fetch(API_URL);
    const jugadores = await response.json();
    renderJugadores(jugadores);
  } catch (error) {
    console.error('Error al cargar jugadores:', error);
    showError('Error al cargar los jugadores');
  }
}

function renderJugadores(jugadores) {
  const tbody = document.getElementById('jugadoresBody');
  tbody.innerHTML = '';

  if (jugadores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay jugadores registrados</td></tr>';
    return;
  }

  jugadores.forEach(jugador => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${jugador.id}</td>
      <td>${jugador.nombre}</td>
      <td>${jugador.avg.toFixed(3)}</td>
      <td>${jugador.hr}</td>
      <td>${jugador.rbi}</td>
      <td><span class="${jugador.activo ? 'activo' : 'inactivo'}">${jugador.activo ? 'Sí' : 'No'}</span></td>
      <td>
        <button class="btn-edit" onclick="editJugador(${jugador.id}, '${jugador.nombre}', ${jugador.avg}, ${jugador.hr}, ${jugador.rbi}, ${jugador.activo})">Editar</button>
        <button class="btn-delete" onclick="deleteJugador(${jugador.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setupForm() {
  const form = document.getElementById('jugadorForm');
  const cancelBtn = document.getElementById('cancelBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveJugador();
  });

  cancelBtn.addEventListener('click', resetForm);
}

async function saveJugador() {
  const id = document.getElementById('jugadorId').value;
  const nombre = document.getElementById('nombre').value;
  const avg = parseFloat(document.getElementById('avg').value);
  const hr = parseInt(document.getElementById('hr').value);
  const rbi = parseInt(document.getElementById('rbi').value);
  const activo = document.getElementById('activo').checked;

  const data = { nombre, avg, hr, rbi, activo };

  try {
    let response;
    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (response.ok) {
      resetForm();
      loadJugadores();
    } else {
      const error = await response.json();
      showError(error.error || 'Error al guardar el jugador');
    }
  } catch (error) {
    console.error('Error al guardar:', error);
    showError('Error al guardar el jugador');
  }
}

window.editJugador = function(id, nombre, avg, hr, rbi, activo) {
  document.getElementById('jugadorId').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('avg').value = avg;
  document.getElementById('hr').value = hr;
  document.getElementById('rbi').value = rbi;
  document.getElementById('activo').checked = activo;

  document.getElementById('formTitle').textContent = 'Editar Jugador';
  document.getElementById('submitBtn').textContent = 'Actualizar';
  document.getElementById('cancelBtn').style.display = 'inline-block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteJugador = async function(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadJugadores();
    } else {
      const error = await response.json();
      showError(error.error || 'Error al eliminar el jugador');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    showError('Error al eliminar el jugador');
  }
};

function resetForm() {
  document.getElementById('jugadorForm').reset();
  document.getElementById('jugadorId').value = '';
  document.getElementById('formTitle').textContent = 'Agregar Jugador';
  document.getElementById('submitBtn').textContent = 'Agregar';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('activo').checked = true;
}

function showError(message) {
  alert(message);
}
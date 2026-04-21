const API_URL = '/api/jugadores';

let currentPage = 1;
let currentLimit = 10;
let currentSortBy = 'nombre';
let currentSortOrder = 'asc';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('jugadorForm')) {
    setupForm();
  }
  if (document.getElementById('jugadoresBody')) {
    loadJugadores();
  }
});

async function loadJugadores() {
  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: currentLimit,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder
    });

    const response = await fetch(`${API_URL}?${params}`);
    const result = await response.json();

    renderJugadores(result.data);
    renderPagination(result.pagination);
  } catch (error) {
    console.error('Error al cargar jugadores:', error);
    showError('Error al cargar los jugadores');
  }
}

function renderJugadores(jugadores) {
  const tbody = document.getElementById('jugadoresBody');
  tbody.innerHTML = '';

  if (jugadores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay joueurs registrados</td></tr>';
    return;
  }

  jugadores.forEach(jugador => {
    const tr = document.createElement('tr');
    // <td>${jugador.id}</td>
    tr.innerHTML = `
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

function renderPagination(pagination) {
  const { page, limit, total, totalPages } = pagination;

  let perPage = document.getElementById('perPage');
  if (!perPage) return;
  perPage.value = limit;

  let paginationDiv = document.getElementById('pagination');
  if (!paginationDiv) return;

  let html = `<span class="page-info">Página ${page} de ${totalPages} (${total} total)</span>`;

  if (page > 1) {
    html += `<button class="btn-page" onclick="changePage(${page - 1})">&laquo; Anterior</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      html += `<button class="btn-page ${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === page - 2 || i === page + 2) {
      html += `<span class="page-ellipsis">...</span>`;
    }
  }

  if (page < totalPages) {
    html += `<button class="btn-page" onclick="changePage(${page + 1})">Siguiente &raquo;</button>`;
  }

  paginationDiv.innerHTML = html;
}

window.changePage = function(page) {
  currentPage = page;
  loadJugadores();
};

window.changeLimit = function(limit) {
  currentLimit = parseInt(limit);
  currentPage = 1;
  loadJugadores();
};

window.changeSort = function(sortBy) {
  if (currentSortBy === sortBy) {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortBy = sortBy;
    currentSortOrder = 'asc';
  }
  loadJugadores();
};

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
      showSuccess('Jugador guardado correctamente');
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
  const params = new URLSearchParams({
    id: id,
    nombre: nombre,
    avg: avg,
    hr: hr,
    rbi: rbi,
    activo: activo
  });
  window.location.href = `/agregar.html?${params.toString()}`;
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

function showSuccess(message) {
  alert(message);
}
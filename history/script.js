const getTranslation = async (translationId) => {
  window.location.href = `/?translationId=${translationId}`;
};

const deleteTranslation = async (translationId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/translations/${translationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    window.location.reload();
  }
};

const getHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const { translations } = await response.json();
  const tableBody = document.querySelector('#history-container > tbody');
  translations.forEach((translation) => {
    const { id, data, targetLang, date } = translation;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <th scope="row">${id}</th>
        <td>
            <img src="data:image/gif;base64,${data}" class="img-thumbnail">
        </td>
        <td>${targetLang}</td>
        <td>${new Date(date).toLocaleString()}</td>
        <td>
            <div class="d-flex flex-column">
              <button id="show-${id}" class="btn" title="Show"><i class="bi bi-arrow-right"></i></button>
              <button id="delete-${id}" class="btn delete" title="Delete"><i class="bi bi-trash-fill"></i></button>
            </div>
        </td>
        `;
    tr.querySelector(`#show-${id}`).addEventListener('click', () =>
      getTranslation(id)
    );
    tr.querySelector(`#delete-${id}`).addEventListener('click', () =>
      deleteTranslation(id)
    );
    tableBody.appendChild(tr);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/signin';
  } else {
    getHistory();
  }
});

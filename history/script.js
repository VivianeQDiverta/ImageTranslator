const getTranslation = async (translationId) => {
  window.location.href = `/?translationId=${translationId}`;
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
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <th scope="row">${translation.id}</th>
        <td>
            <img src="data:image/gif;base64,${
              translation.data
            }" class="img-thumbnail">
        </td>
        <td>${translation.targetLang}</td>
        <td>${new Date(translation.date).toLocaleString()}</td>
        `;
    tr.addEventListener('click', () => getTranslation(translation.id));
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

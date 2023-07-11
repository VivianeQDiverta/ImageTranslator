const getHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { translations } = await response.json();
  const tableBody = document.querySelector('#history-container > tbody');
  translations.forEach((translation, i) => {
    tableBody.innerHTML += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${translation.imageId}</td>
            <td>${translation.targetLang}</td>
            <td>${translation.date}</td>
        </tr>
        `;
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

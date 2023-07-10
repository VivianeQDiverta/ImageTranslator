const signupBtn = document.querySelector('#signup-btn');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (username.value === '' || password.value === null) {
    alert('Please enter an username and a password');
    return;
  }

  const res = await fetch(`/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const data = await res.json();

  if (data.success) {
    alert('Signup successful');
    window.location.href = '/';
    return;
  }
  alert(data.error);
});

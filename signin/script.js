const signinBtn = document.querySelector('#signin-btn');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

signinBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (username.value === '' || password.value === '') {
    alert('Please enter an username and a password');
    return;
  }

  const res = await fetch('/signin', {
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
    const token = data.token;
    localStorage.setItem('token', token);
    alert('Sign in successful');
    window.location.href = '/';
    return;
  }
  alert(data.error);
});

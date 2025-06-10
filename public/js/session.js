document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/session-username')
    .then(res => res.json())
    .then(data => {
      const welcomeMsg = document.getElementById('welcome-message');
      if (!welcomeMsg) return;
      if (data.loggedIn) {
        welcomeMsg.textContent = `Welcome, ${data.username}!`;
      } else {
        welcomeMsg.textContent = `Welcome, guest!`;
      }
    })
    .catch(err => console.error('Session check failed:', err));
});

// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Get references to nav buttons (if present)
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    // Get references to forms (if present)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');


    // NAV BUTTON VISIBILITY LOGIC
    // Show/hide nav buttons based on login status
    async function updateButtonVisibility() {
        try {
            const res = await fetch('/api/session');
            const data = await res.json();
            if (data.loggedIn) {
                if (logoutBtn) logoutBtn.style.display = 'inline-block';
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
            } else {
                if (logoutBtn) logoutBtn.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'inline-block';
                if (registerBtn) registerBtn.style.display = 'inline-block';
            }
        } catch (err) {
            console.error('Error checking session:', err);
        }
    }
    updateButtonVisibility();


    // LOGOUT BUTTON HANDLER
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            updateButtonVisibility();
            window.location.href = '/';
        });
    }

    // NAVIGATION BUTTONS HANDLER
    if (loginBtn) loginBtn.addEventListener('click', () => window.location.href = '/login.html');
    if (registerBtn) registerBtn.addEventListener('click', () => window.location.href = '/register.html');

    // LOGIN FORM HANDLING
    if (loginForm) {
        // Get the message display div
        const loginMessage = document.getElementById('loginMessage');
        // Listen for form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission (no page reload)
            // Get form values
            const { username, password } = e.target;
            // Optional: Add loading state to button
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Signing In...';
            }
            try {
                // Send login data to server
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.value, password: password.value })
                });
                const data = await res.json();
                // Show feedback message
                if (data.success) {
                    loginMessage.textContent = 'Login successful! Redirecting...';
                    loginMessage.className = 'success show';
                    updateButtonVisibility();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    loginMessage.textContent = data.error || 'Login failed';
                    loginMessage.className = 'error show';
                }
            } catch (err) {
                loginMessage.textContent = 'Error connecting to server';
                loginMessage.className = 'error show';
            } finally {
                // Remove loading state from button
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Sign In';
                }
            }
        });
    }


    // REGISTER FORM HANDLING
    if (registerForm) {
        // Get the message display div
        const messageDiv = document.getElementById('registerMessage');
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const inputs = registerForm.querySelectorAll('input');
        const passwordInput = registerForm.querySelector('input[name="password"]');
        const confirmPasswordInput = registerForm.querySelector('input[name="confirmPassword"]');

        // Add focus/blur styles for input groups
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
            input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
        });

        // Live password match validation
        function validatePasswords() {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        }
        passwordInput.addEventListener('input', validatePasswords);
        confirmPasswordInput.addEventListener('input', validatePasswords);

        // Helper to show feedback messages
        function showMessage(message, type) {
            messageDiv.textContent = message;
            messageDiv.className = `show ${type}`;
            if (type === 'success') {
                setTimeout(() => messageDiv.classList.remove('show'), 3000);
            }
        }

        // Listen for form submission
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            // Get form values
            const form = e.target;
            const username = form.username.value;
            const email = form.email.value;
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;

            // Check if passwords match before sending to server
            if (password !== confirmPassword) {
                showMessage('Passwords do not match. Please try again.', 'error');
                return;
            }

            // Add loading state to button
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Creating Account...';

            try {
                // Send registration data to server
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, confirmPassword })
                });
                const data = await res.json();

                if (data.success) {
                    showMessage('Account created successfully! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    showMessage(data.error || 'Registration failed', 'error');
                }
            } catch (err) {
                showMessage('Error connecting to server', 'error');
            } finally {
                // Remove loading state from button
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Create Account';
            }
        });
    }
});



// This script handles the login and registration functionality for a web application.
// It includes:
// - Navigation button visibility based on login status
// - Logout functionality
// - Login form submission with feedback
// - Registration form submission with password validation and feedback
// - Live password match validation during registration
// - Loading states for buttons during async operations
// - Focus styles for input fields
// - Error handling for server communication
// - Feedback messages for users during login and registration processes
// - All logic is wrapped in DOMContentLoaded to ensure it runs after the page loads.
// - Uses async/await for cleaner asynchronous code handling.
// - Uses fetch API for server communication.
// - Uses class names for showing/hiding messages and loading states.
// - Uses JSON for data exchange with the server.
// - Uses setTimeout for delayed actions like redirects.
// - Uses custom validity for password match validation.
// - Uses event listeners for form submission and input focus/blur events.
// - Uses template literals for dynamic message content.
// - Uses querySelector for selecting elements.
// - Uses classList for adding/removing classes for styles.
// - Uses error handling to catch and display errors during server communication.
// - Uses modern JavaScript features like arrow functions, async/await, and template literals.
// - Uses best practices for user experience, such as showing loading states and feedback messages.
const API_URL = 'http://localhost:3000/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    try {
        const res = await fetch(`${API_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone }),
        });
        const data = await res.json();
        alert(data.message || 'User registered successfully.');
    } catch (err) {
        alert('Error registering user.');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login successful.');
        } else {
            alert(data.message || 'Error logging in.');
        }
    } catch (err) {
        alert('Error logging in.');
    }
});

document.getElementById('viewProfile').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first.');

    try {
        const res = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: { 'Authorization': token },
        });
        const data = await res.json();
        document.getElementById('profileData').innerText = JSON.stringify(data, null, 2);
    } catch (err) {
        alert('Error fetching profile.');
    }
});

document.getElementById('deactivateAccount').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first.');

    try {
        const res = await fetch(`${API_URL}/user/deactivate`, {
            method: 'DELETE',
            headers: { 'Authorization': token },
        });
        const data = await res.json();
        alert(data.message || 'Account deactivated.');
    } catch (err) {
        alert('Error deactivating account.');
    }
});

// Auth Page Scripts

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = storage.getUser();
    if (user) {
        redirectToDashboard(user.role);
    }
});

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await api.login(email, password);
            
            if (response.success) {
                storage.setUser(response.user);
                showToast('Login successful!');
                
                setTimeout(() => {
                    redirectToDashboard(response.user.role);
                }, 500);
            }
        } catch (error) {
            showToast(error.message || 'Login failed', 'error');
        }
    });
}

// Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };
        
        if (!userData.role) {
            showToast('Please select a role', 'error');
            return;
        }
        
        try {
            const response = await api.register(userData);
            
            if (response.success) {
                showToast('Account created successfully!');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        } catch (error) {
            showToast(error.message || 'Registration failed', 'error');
        }
    });
}

// Logout function
function logout() {
    storage.clearUser();
    window.location.href = '../index.html';
}

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API Helper Functions
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Auth
    async login(email, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    async register(userData) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    // User
    async getUser(userId) {
        return this.request(`/user/${userId}`);
    },
    
    // Resume
    async uploadResume(file, userId) {
        const formData = new FormData();
        formData.append('file', file);
        
        const url = `${API_BASE_URL}/upload-resume?user_id=${userId}`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    },
    
    async saveSkills(userId, skills) {
        return this.request('/save-skills', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, skills })
        });
    },
    
    // Quiz
    async generateQuiz(skills) {
        return this.request('/generate-quiz', {
            method: 'POST',
            body: JSON.stringify({ skills })
        });
    },
    
    async saveQuizResult(studentId, skillsTested, score, totalQuestions) {
        return this.request('/save-quiz-result', {
            method: 'POST',
            body: JSON.stringify({
                student_id: studentId,
                skills_tested: skillsTested,
                score,
                total_questions: totalQuestions
            })
        });
    },
    
    async getQuizResults(studentId) {
        return this.request(`/quiz-results/${studentId}`);
    },
    
    // Jobs
    async getJobs(recruiterId = null) {
        const url = recruiterId ? `/jobs?recruiter_id=${recruiterId}` : '/jobs';
        return this.request(url);
    },
    
    async getJobRecommendations(studentId) {
        return this.request(`/jobs/recommendations/${studentId}`);
    },
    
    async createJob(jobData, recruiterId) {
        return this.request(`/jobs?recruiter_id=${recruiterId}`, {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
    },
    
    // Applications
    async applyForJob(studentId, jobId) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ student_id: studentId, job_id: jobId })
        });
    },
    
    async getStudentApplications(studentId) {
        return this.request(`/applications/student/${studentId}`);
    },
    
    async getJobApplications(jobId) {
        return this.request(`/applications/job/${jobId}`);
    },
    
    async getRecruiterApplications(recruiterId) {
        return this.request(`/applications/recruiter/${recruiterId}`);
    },
    
    async updateApplication(applicationId, status) {
        return this.request(`/applications/${applicationId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },
    
    // Admin
    async getAdminStats() {
        return this.request('/admin/stats');
    },
    
    async getAllUsers() {
        return this.request('/admin/users');
    },
    
    // Courses
    async getCourseRecommendations(studentId) {
        return this.request(`/courses/${studentId}`);
    }
};

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '&#10003;' : '&#10005;'}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Storage Helpers
const storage = {
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    clearUser() {
        localStorage.removeItem('user');
    }
};

// Auth Check
function checkAuth() {
    const user = storage.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Redirect based on role
function redirectToDashboard(role) {
    switch (role) {
        case 'student':
            window.location.href = 'student/dashboard.html';
            break;
        case 'recruiter':
            window.location.href = 'recruiter/dashboard.html';
            break;
        case 'admin':
            window.location.href = 'admin/dashboard.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

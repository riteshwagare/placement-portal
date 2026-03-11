# NextGen AI Placement Portal

A simple AI-powered placement portal for college projects built with HTML, CSS, JavaScript and Python FastAPI backend with SQLite database.

## Features

### Student Features
- Upload Resume and extract skills automatically
- Enter skills manually (if no resume)
- Take AI-generated quiz (10 MCQ questions based on skills)
- View quiz scores and history
- Browse job recommendations (matched to skills)
- Apply for jobs
- View skill improvement courses
- Profile management

### Recruiter Features
- Post new jobs
- View posted jobs
- Review applicants
- Accept/Reject applications

### Admin Features
- View system statistics (Total Students, Recruiters, Active Jobs, Successful Placements)
- View all users

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (No frameworks)
- **Backend**: Python FastAPI
- **Database**: SQLite
- **AI Quiz**: Grok API (with fallback sample questions)

## Project Structure

```
/
├── backend/
│   ├── main.py              # FastAPI backend server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── api.js           # API helper functions
│   │   └── auth.js          # Authentication handlers
│   ├── student/             # Student dashboard pages
│   │   ├── dashboard.html
│   │   ├── upload.html
│   │   ├── skills.html
│   │   ├── quiz.html
│   │   ├── jobs.html
│   │   ├── applications.html
│   │   ├── courses.html
│   │   └── profile.html
│   ├── recruiter/           # Recruiter dashboard pages
│   │   ├── dashboard.html
│   │   ├── post-job.html
│   │   ├── jobs.html
│   │   └── applicants.html
│   ├── admin/               # Admin dashboard pages
│   │   ├── dashboard.html
│   │   └── users.html
│   ├── index.html           # Login page
│   └── signup.html          # Registration page
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Set Grok API key for AI quiz generation:
```bash
export GROK_API_KEY=your_grok_api_key
```

5. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Open the `frontend/index.html` file directly in a browser, or
2. Use a simple HTTP server:
```bash
cd frontend
python -m http.server 3000
```

3. Open `http://localhost:3000` in your browser

## Default Admin Account

- Email: `admin@portal.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Resume & Skills
- `POST /api/upload-resume` - Upload and parse resume
- `POST /api/save-skills` - Save manual skills

### Quiz
- `POST /api/generate-quiz` - Generate AI quiz (10 questions)
- `POST /api/save-quiz-result` - Save quiz result
- `GET /api/quiz-results/{student_id}` - Get quiz history

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/recommendations/{student_id}` - Get job recommendations

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/student/{student_id}` - Get student applications
- `GET /api/applications/recruiter/{recruiter_id}` - Get recruiter applications
- `PUT /api/applications/{application_id}` - Update application status

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users

## Database Tables (SQLite)

1. **users** - User accounts (students, recruiters, admin)
2. **jobs** - Job listings posted by recruiters
3. **applications** - Job applications from students
4. **quiz_results** - Student quiz scores

## Notes

- This is a college project - not for production use
- AI quiz uses Grok API when available, with fallback to sample questions
- Resume parsing is simplified for demo purposes

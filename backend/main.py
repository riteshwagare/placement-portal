from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
import json
import re
import hashlib
import secrets
from datetime import datetime
import httpx

app = FastAPI(title="NextGen AI Placement Portal")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE = "placement_portal.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('student', 'recruiter', 'admin')),
            phone TEXT,
            skills TEXT,
            resume_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Jobs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recruiter_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            description TEXT,
            skills_required TEXT NOT NULL,
            salary TEXT,
            location TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (recruiter_id) REFERENCES users(id)
        )
    ''')
    
    # Applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            job_id INTEGER NOT NULL,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id),
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        )
    ''')
    
    # Quiz results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            skills_tested TEXT NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id)
        )
    ''')
    
    # Create default admin
    cursor.execute("SELECT * FROM users WHERE role = 'admin'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        ''', ('Admin', 'admin@portal.com', hash_password('admin123'), 'admin'))
    
    conn.commit()
    conn.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Pydantic models
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    skills_required: str
    salary: Optional[str] = None
    location: Optional[str] = None

class ApplicationCreate(BaseModel):
    job_id: int
    student_id: int

class ApplicationUpdate(BaseModel):
    status: str

class QuizResult(BaseModel):
    student_id: int
    skills_tested: str
    score: int
    total_questions: int

class SkillsInput(BaseModel):
    skills: List[str]

class ManualSkills(BaseModel):
    user_id: int
    skills: List[str]

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()

# Auth endpoints
@app.post("/api/register")
def register(user: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (name, email, password, role, phone)
            VALUES (?, ?, ?, ?, ?)
        ''', (user.name, user.email, hash_password(user.password), user.role, user.phone))
        conn.commit()
        user_id = cursor.lastrowid
        
        return {"success": True, "user_id": user_id, "message": "Registration successful"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    finally:
        conn.close()

@app.post("/api/login")
def login(user: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, name, email, role, skills FROM users 
        WHERE email = ? AND password = ?
    ''', (user.email, hash_password(user.password)))
    
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return {
            "success": True,
            "user": {
                "id": result["id"],
                "name": result["name"],
                "email": result["email"],
                "role": result["role"],
                "skills": json.loads(result["skills"]) if result["skills"] else []
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Resume upload and parsing
@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), user_id: int = None):
    if not file.filename.endswith(('.pdf', '.docx', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    # Save file
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{user_id}_{file.filename}")
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Extract text (simple extraction for txt files)
    text = ""
    if file.filename.endswith('.txt'):
        text = content.decode('utf-8', errors='ignore')
    else:
        # For PDF/DOCX, we'll use simple text extraction
        text = content.decode('utf-8', errors='ignore')
    
    # Extract skills using pattern matching
    skills = extract_skills(text)
    
    # Extract email and phone
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    phone_match = re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', text)
    
    email = email_match.group() if email_match else ""
    phone = phone_match.group() if phone_match else ""
    
    # Update user skills in database
    if user_id:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE users SET skills = ?, resume_path = ? WHERE id = ?
        ''', (json.dumps(skills), file_path, user_id))
        conn.commit()
        conn.close()
    
    return {
        "success": True,
        "email": email,
        "phone": phone,
        "skills": skills,
        "file_path": file_path
    }

def extract_skills(text: str) -> List[str]:
    # Common tech skills to look for
    skill_keywords = [
        'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'spring', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'aws', 'azure', 'gcp',
        'docker', 'kubernetes', 'git', 'linux', 'machine learning', 'deep learning',
        'tensorflow', 'pytorch', 'pandas', 'numpy', 'data analysis', 'data science',
        'artificial intelligence', 'natural language processing', 'computer vision',
        'blockchain', 'cybersecurity', 'devops', 'agile', 'scrum', 'rest api',
        'graphql', 'microservices', 'cloud computing', 'big data', 'hadoop', 'spark'
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in skill_keywords:
        if skill in text_lower:
            found_skills.append(skill.title())
    
    return list(set(found_skills)) if found_skills else ['General Programming']

@app.post("/api/save-skills")
def save_skills(data: ManualSkills):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE users SET skills = ? WHERE id = ?
    ''', (json.dumps(data.skills), data.user_id))
    conn.commit()
    conn.close()
    
    return {"success": True, "skills": data.skills}

# Quiz endpoints
GROK_API_KEY = os.getenv("GROK_API_KEY", "")

@app.post("/api/generate-quiz")
async def generate_quiz(data: SkillsInput):
    skills_text = ", ".join(data.skills)
    
    prompt = f"""Generate exactly 10 multiple choice questions to test knowledge in these skills: {skills_text}. 
    
    Format the response as a JSON array with this structure:
    [
        {{
            "question": "Question text?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct_answer": "Correct option text"
        }}
    ]
    
    Respond ONLY with valid JSON array, no other text."""
    
    # Try Grok API
    if GROK_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROK_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "grok-beta",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    content = response.json()["choices"][0]["message"]["content"]
                    # Clean and parse JSON
                    content = content.strip()
                    if content.startswith("```"):
                        content = re.sub(r'^```json?\n?', '', content)
                        content = re.sub(r'\n?```$', '', content)
                    
                    questions = json.loads(content)
                    if len(questions) >= 10:
                        return {"success": True, "questions": questions[:10]}
        except Exception as e:
            print(f"Grok API error: {e}")
    
    # Fallback to sample questions
    return {"success": True, "questions": generate_sample_quiz(data.skills)}

def generate_sample_quiz(skills: List[str]) -> List[dict]:
    sample_questions = {
        "python": [
            {"question": "What is the correct way to create a list in Python?", "options": ["my_list = [1, 2, 3]", "my_list = (1, 2, 3)", "my_list = {1, 2, 3}", "my_list = <1, 2, 3>"], "correct_answer": "my_list = [1, 2, 3]"},
            {"question": "Which keyword is used to define a function in Python?", "options": ["func", "def", "define", "function"], "correct_answer": "def"},
            {"question": "What does the len() function return?", "options": ["The type of object", "The length of an object", "The memory size", "The class name"], "correct_answer": "The length of an object"},
            {"question": "How do you create a comment in Python?", "options": ["// comment", "/* comment */", "# comment", "-- comment"], "correct_answer": "# comment"},
            {"question": "Which of these is a valid Python variable name?", "options": ["1variable", "_variable", "variable-1", "variable 1"], "correct_answer": "_variable"},
            {"question": "What is the output of print(type([]))?", "options": ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"], "correct_answer": "<class 'list'>"},
            {"question": "Which method adds an element to the end of a list?", "options": ["add()", "append()", "insert()", "extend()"], "correct_answer": "append()"},
            {"question": "What is the correct file extension for Python files?", "options": [".py", ".python", ".pyt", ".pt"], "correct_answer": ".py"},
            {"question": "Which operator is used for floor division?", "options": ["/", "//", "%", "**"], "correct_answer": "//"},
            {"question": "What does 'pip' stand for in Python?", "options": ["Python Install Package", "Pip Installs Packages", "Python Index Package", "Package Installer for Python"], "correct_answer": "Pip Installs Packages"},
        ],
        "javascript": [
            {"question": "What is the correct way to declare a variable in JavaScript?", "options": ["var x = 5", "let x = 5", "const x = 5", "All of the above"], "correct_answer": "All of the above"},
            {"question": "Which method is used to parse JSON?", "options": ["JSON.parse()", "JSON.stringify()", "parseJSON()", "JSON.load()"], "correct_answer": "JSON.parse()"},
            {"question": "What does === do in JavaScript?", "options": ["Assignment", "Loose equality", "Strict equality", "Not equal"], "correct_answer": "Strict equality"},
            {"question": "How do you call a function in JavaScript?", "options": ["call functionName()", "functionName()", "run functionName()", "execute functionName()"], "correct_answer": "functionName()"},
            {"question": "Which keyword creates an asynchronous function?", "options": ["async", "await", "promise", "sync"], "correct_answer": "async"},
            {"question": "What is the result of typeof null?", "options": ["'null'", "'undefined'", "'object'", "'boolean'"], "correct_answer": "'object'"},
            {"question": "Which method removes the last element from an array?", "options": ["pop()", "push()", "shift()", "unshift()"], "correct_answer": "pop()"},
            {"question": "What is closure in JavaScript?", "options": ["A function with no parameters", "A function that returns another function", "A function that has access to outer scope variables", "A function that closes the program"], "correct_answer": "A function that has access to outer scope variables"},
            {"question": "Which event occurs when the user clicks on an element?", "options": ["onmouseover", "onclick", "onchange", "onmouseclick"], "correct_answer": "onclick"},
            {"question": "How do you write an IF statement in JavaScript?", "options": ["if i = 5 then", "if (i == 5)", "if i == 5", "if i = 5"], "correct_answer": "if (i == 5)"},
        ]
    }
    
    # Check if any skill matches our sample categories
    for skill in skills:
        skill_lower = skill.lower()
        if skill_lower in sample_questions:
            return sample_questions[skill_lower]
    
    # Default to general programming questions
    return sample_questions["python"]

@app.post("/api/save-quiz-result")
def save_quiz_result(result: QuizResult):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO quiz_results (student_id, skills_tested, score, total_questions)
        VALUES (?, ?, ?, ?)
    ''', (result.student_id, result.skills_tested, result.score, result.total_questions))
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Quiz result saved"}

@app.get("/api/quiz-results/{student_id}")
def get_quiz_results(student_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM quiz_results WHERE student_id = ? ORDER BY taken_at DESC
    ''', (student_id,))
    
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "results": results}

# Job endpoints
@app.post("/api/jobs")
def create_job(job: JobCreate, recruiter_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO jobs (recruiter_id, title, company, description, skills_required, salary, location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (recruiter_id, job.title, job.company, job.description, job.skills_required, job.salary, job.location))
    conn.commit()
    job_id = cursor.lastrowid
    conn.close()
    
    return {"success": True, "job_id": job_id}

@app.get("/api/jobs")
def get_jobs(recruiter_id: Optional[int] = None):
    conn = get_db()
    cursor = conn.cursor()
    
    if recruiter_id:
        cursor.execute('''
            SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY created_at DESC
        ''', (recruiter_id,))
    else:
        cursor.execute('''
            SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC
        ''')
    
    jobs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "jobs": jobs}

@app.get("/api/jobs/recommendations/{student_id}")
def get_job_recommendations(student_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get student skills
    cursor.execute('SELECT skills FROM users WHERE id = ?', (student_id,))
    result = cursor.fetchone()
    
    if not result or not result["skills"]:
        cursor.execute('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC', ('active',))
        jobs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"success": True, "jobs": jobs}
    
    student_skills = json.loads(result["skills"])
    
    # Get all active jobs
    cursor.execute('SELECT * FROM jobs WHERE status = ?', ('active',))
    jobs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    # Calculate match scores
    recommendations = []
    for job in jobs:
        job_skills = [s.strip().lower() for s in job["skills_required"].split(",")]
        student_skills_lower = [s.lower() for s in student_skills]
        
        matched = sum(1 for js in job_skills if any(ss in js or js in ss for ss in student_skills_lower))
        match_score = (matched / len(job_skills) * 100) if job_skills else 0
        
        job["match_score"] = round(match_score, 1)
        recommendations.append(job)
    
    # Sort by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {"success": True, "jobs": recommendations}

# Application endpoints
@app.post("/api/applications")
def create_application(application: ApplicationCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if already applied
    cursor.execute('''
        SELECT * FROM applications WHERE student_id = ? AND job_id = ?
    ''', (application.student_id, application.job_id))
    
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    cursor.execute('''
        INSERT INTO applications (student_id, job_id)
        VALUES (?, ?)
    ''', (application.student_id, application.job_id))
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Application submitted"}

@app.get("/api/applications/student/{student_id}")
def get_student_applications(student_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT a.*, j.title, j.company, j.salary, j.location
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
    ''', (student_id,))
    
    applications = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "applications": applications}

@app.get("/api/applications/job/{job_id}")
def get_job_applications(job_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT a.*, u.name, u.email, u.phone, u.skills
        FROM applications a
        JOIN users u ON a.student_id = u.id
        WHERE a.job_id = ?
        ORDER BY a.applied_at DESC
    ''', (job_id,))
    
    applications = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "applications": applications}

@app.get("/api/applications/recruiter/{recruiter_id}")
def get_recruiter_applications(recruiter_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT a.*, u.name as student_name, u.email as student_email, u.skills,
               j.title as job_title, j.company
        FROM applications a
        JOIN users u ON a.student_id = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE j.recruiter_id = ?
        ORDER BY a.applied_at DESC
    ''', (recruiter_id,))
    
    applications = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "applications": applications}

@app.put("/api/applications/{application_id}")
def update_application(application_id: int, update: ApplicationUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE applications SET status = ? WHERE id = ?
    ''', (update.status, application_id))
    conn.commit()
    conn.close()
    
    return {"success": True, "message": f"Application {update.status}"}

# Admin endpoints
@app.get("/api/admin/stats")
def get_admin_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'student'")
    total_students = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'recruiter'")
    total_recruiters = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'")
    active_jobs = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'")
    successful_placements = cursor.fetchone()["count"]
    
    conn.close()
    
    return {
        "success": True,
        "stats": {
            "total_students": total_students,
            "total_recruiters": total_recruiters,
            "active_jobs": active_jobs,
            "successful_placements": successful_placements
        }
    }

@app.get("/api/admin/users")
def get_all_users():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC')
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"success": True, "users": users}

@app.get("/api/user/{user_id}")
def get_user(user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, email, role, phone, skills FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            "success": True,
            "user": {
                **dict(user),
                "skills": json.loads(user["skills"]) if user["skills"] else []
            }
        }
    raise HTTPException(status_code=404, detail="User not found")

# Course recommendations endpoint
@app.get("/api/courses/{student_id}")
def get_course_recommendations(student_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT skills FROM users WHERE id = ?', (student_id,))
    result = cursor.fetchone()
    conn.close()
    
    skills = json.loads(result["skills"]) if result and result["skills"] else []
    
    # Course recommendations based on skills
    course_database = {
        "python": [
            {"title": "Advanced Python Programming", "platform": "Coursera", "url": "https://coursera.org"},
            {"title": "Python for Data Science", "platform": "edX", "url": "https://edx.org"}
        ],
        "javascript": [
            {"title": "Modern JavaScript", "platform": "Udemy", "url": "https://udemy.com"},
            {"title": "React Complete Guide", "platform": "Coursera", "url": "https://coursera.org"}
        ],
        "machine learning": [
            {"title": "Machine Learning by Andrew Ng", "platform": "Coursera", "url": "https://coursera.org"},
            {"title": "Deep Learning Specialization", "platform": "Coursera", "url": "https://coursera.org"}
        ],
        "default": [
            {"title": "CS50 Introduction to Computer Science", "platform": "edX", "url": "https://edx.org"},
            {"title": "Software Engineering Fundamentals", "platform": "Coursera", "url": "https://coursera.org"}
        ]
    }
    
    courses = []
    for skill in skills:
        skill_lower = skill.lower()
        if skill_lower in course_database:
            courses.extend(course_database[skill_lower])
    
    if not courses:
        courses = course_database["default"]
    
    return {"success": True, "courses": courses}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

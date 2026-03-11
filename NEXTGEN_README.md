# NextGen AI Placement Portal 🚀

A modern, AI-powered placement portal built with **Next.js**, **Tailwind CSS**, **Framer Motion**, and **FastAPI**. The platform enables students to upload resumes, extract skills using NLP, take quizzes, and receive intelligent job recommendations.

## 🎯 Key Features

### For Students
- ✅ **Resume Upload & Parsing** - Upload PDF/DOCX resumes
- ✅ **AI Skill Extraction** - NLP-powered skill identification
- ✅ **Skill Display** - Beautiful skill cards
- ✅ **Personalized Quizzes** - Test knowledge on extracted skills
- ✅ **Job Recommendations** - Intelligent job matching
- ✅ **Profile Management** - Complete student profiles

### For Recruiters
- ✅ **Job Posting** - Post job openings
- ✅ **Applicant Management** - Review candidates
- ✅ **Skill Filtering** - Filter by skills
- ✅ **Application Tracking** - Track all applications

### For Admins
- ✅ **System Analytics** - Monitor placements
- ✅ **Student Management** - Manage accounts
- ✅ **Company Management** - Manage companies
- ✅ **System Settings** - Configure platform

## 🛠️ Tech Stack

**Frontend**: Next.js 14 • React • TypeScript • Tailwind CSS • Framer Motion • Zustand • Axios

**Backend**: FastAPI • Python • spaCy NLP

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── signup/page.tsx             # Signup
│   └── dashboard/
│       ├── student/                # Student pages
│       ├── recruiter/              # Recruiter pages
│       └── admin/                  # Admin pages
├── components/
│   ├── Navbar.tsx                  # Navigation
│   ├── Sidebar.tsx                 # Dashboard sidebar
│   └── Button.tsx                  # Reusable button
└── lib/
    ├── store.ts                    # Zustand state
    └── api.ts                      # API integration
```

## 🔗 Backend Integration

Connect to your FastAPI backend at: `http://localhost:8000`

**Required Endpoint**:
```
POST /upload-resume
- Body: FormData with 'file' field
- Response: { email, phone, skills[], name, experience }
```

## 👥 User Roles

1. **Student** - Upload resumes, take quizzes, get job recommendations
2. **Recruiter** - Post jobs, view applicants, manage placements
3. **Admin** - View analytics, manage users, configure system

## 🎨 UI Highlights

- 🎭 **Glassmorphism** - Modern glass effects
- 🌈 **Gradients** - Beautiful color gradients
- ⚡ **Animations** - Smooth Framer Motion animations
- 📱 **Responsive** - Fully mobile-responsive
- 🌙 **Dark Theme** - Professional dark UI

## 🧪 Testing

1. Signup with any email/password
2. Select your role (Student/Recruiter/Admin)
3. Explore the dashboard
4. Upload resume to extract skills
5. Take quizzes and view job recommendations

## 📊 State Management

Using **Zustand** for global state:
- `useAuthStore` - Authentication state
- `useSkillStore` - Extracted skills
- `useQuizStore` - Quiz data
- `useJobStore` - Job recommendations

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel
```

### Backend (Any platform)
- Deploy FastAPI server
- Update `NEXT_PUBLIC_API_BASE_URL` to backend URL

## 🔐 Authentication

Mock authentication for demo (integrate with real backend):
- Email/Password login
- Role-based access
- JWT tokens (production)

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=NextGen AI Placement Portal
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🐛 Troubleshooting

**Resume Upload Not Working?**
- Ensure backend is running on http://localhost:8000
- Check CORS configuration on backend
- Verify `/upload-resume` endpoint exists

**Quiz Not Generating?**
- Extract skills from resume first
- Check browser console for errors
- App has fallback sample questions

**Styling Issues?**
- Clear browser cache
- Run `npm run build`
- Verify Tailwind CSS config

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [FastAPI](https://fastapi.tiangolo.com)

## 🎓 Features Overview

### Resume Parsing
Students upload resumes → Backend extracts skills using NLP → Skills displayed beautifully

### AI Quizzes
Quizzes generated based on extracted skills → 5 multiple-choice questions → Real-time scoring

### Job Matching
Student skills matched with job requirements → Match score calculated → Jobs sorted by relevance

---

**Built with ❤️ for modern recruitment**

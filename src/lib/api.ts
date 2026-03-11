// API helpers for the placement portal

// Backend URL - change this to your deployed backend URL in production
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface UploadResumeResponse {
  email: string;
  phone: string;
  skills: string[];
  name?: string;
  experience?: string;
}

export const resumeAPI = {
  uploadResume: async (file: File): Promise<UploadResumeResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // Send resume to external FastAPI backend for parsing
    const response = await fetch(`${BACKEND_URL}/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to upload resume' }));
      throw new Error(error.error || error.detail || 'Failed to upload resume');
    }
    
    return response.json();
  },
};

export const quizAPI = {
  generateQuiz: async (skills: string[]): Promise<any> => {
    // Always use sample quiz for reliability
    return generateSampleQuiz(skills);
  },
};

function generateSampleQuiz(skills: string[]) {
  const sampleQuestions: Record<string, any[]> = {
    python: [
      {
        question: 'What is the correct way to create a list in Python?',
        options: ['my_list = [1, 2, 3]', 'my_list = (1, 2, 3)', 'my_list = {1, 2, 3}', 'my_list = <1, 2, 3>'],
        correctAnswer: 'my_list = [1, 2, 3]',
      },
      {
        question: 'Which keyword is used to define a function in Python?',
        options: ['func', 'def', 'define', 'function'],
        correctAnswer: 'def',
      },
      {
        question: 'What does the `len()` function return?',
        options: ['The type of object', 'The length of an object', 'The memory size', 'The class name'],
        correctAnswer: 'The length of an object',
      },
      {
        question: 'How do you create a comment in Python?',
        options: ['// comment', '/* comment */', '# comment', '-- comment'],
        correctAnswer: '# comment',
      },
      {
        question: 'Which of these is a valid Python variable name?',
        options: ['1variable', '_variable', 'variable-1', 'variable 1'],
        correctAnswer: '_variable',
      },
    ],
    javascript: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5', 'let x = 5', 'const x = 5', 'All of the above'],
        correctAnswer: 'All of the above',
      },
      {
        question: 'Which method is used to parse JSON?',
        options: ['JSON.parse()', 'JSON.stringify()', 'parseJSON()', 'JSON.load()'],
        correctAnswer: 'JSON.parse()',
      },
      {
        question: 'What does `==` do in JavaScript?',
        options: ['Strict equality check', 'Loose equality check', 'Assignment', 'Comparison'],
        correctAnswer: 'Loose equality check',
      },
      {
        question: 'How do you call a function in JavaScript?',
        options: ['call functionName()', 'functionName()', 'run functionName()', 'execute functionName()'],
        correctAnswer: 'functionName()',
      },
      {
        question: 'Which keyword creates an asynchronous function?',
        options: ['async', 'await', 'promise', 'sync'],
        correctAnswer: 'async',
      },
    ],
  };

  const selectedSkill = skills.find(s => Object.keys(sampleQuestions).includes(s.toLowerCase())) || 'javascript';
  return sampleQuestions[selectedSkill.toLowerCase()] || sampleQuestions.javascript;
}

export const jobAPI = {
  getJobRecommendations: async (skills: string[]) => {
    // Sample jobs database
    const allJobs = [
      {
        id: '1',
        role: 'Python Developer',
        company: 'TechCorp',
        skills: ['python', 'django', 'postgresql'],
        description: 'Build scalable Python applications',
        salary: '$80,000 - $120,000',
      },
      {
        id: '2',
        role: 'Machine Learning Engineer',
        company: 'AI Innovations',
        skills: ['python', 'machine learning', 'tensorflow', 'pandas'],
        description: 'Develop cutting-edge ML models',
        salary: '$100,000 - $150,000',
      },
      {
        id: '3',
        role: 'Frontend Developer',
        company: 'WebStudio',
        skills: ['javascript', 'react', 'html', 'css'],
        description: 'Build modern web interfaces',
        salary: '$70,000 - $110,000',
      },
      {
        id: '4',
        role: 'Full Stack Developer',
        company: 'DevSolutions',
        skills: ['javascript', 'react', 'node.js', 'mongodb'],
        description: 'Develop end-to-end web applications',
        salary: '$90,000 - $140,000',
      },
      {
        id: '5',
        role: 'Data Scientist',
        company: 'DataTech',
        skills: ['python', 'sql', 'machine learning', 'pandas', 'statistics'],
        description: 'Extract insights from big data',
        salary: '$95,000 - $145,000',
      },
      {
        id: '6',
        role: 'AWS Solutions Architect',
        company: 'CloudExperts',
        skills: ['aws', 'python', 'docker', 'kubernetes'],
        description: 'Design cloud infrastructure solutions',
        salary: '$110,000 - $160,000',
      },
    ];

    // Calculate match scores
    const recommendations = allJobs.map((job) => {
      const matchedSkills = job.skills.filter((s) =>
        skills.some((skill) => skill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(skill.toLowerCase()))
      );
      const matchScore = (matchedSkills.length / job.skills.length) * 100;
      return { ...job, matchScore };
    });

    // Sort by match score and return top 5
    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  },
};

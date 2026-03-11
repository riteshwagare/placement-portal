import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

    const response = await apiClient.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  parseResume: async (filePath: string): Promise<UploadResumeResponse> => {
    const response = await apiClient.post('/parse-resume', { file_path: filePath });
    return response.data;
  },
};

export const quizAPI = {
  generateQuiz: async (skills: string[]): Promise<any> => {
    try {
      const skillsText = skills.join(', ');
      const response = await axios.post(
        'https://api.x.ai/openai/',
        {
          model: 'grok-2',
          messages: [
            {
              role: 'user',
              content: `Generate exactly 5 multiple choice questions to test knowledge in these skills: ${skillsText}. 
              
              Format the response as a JSON array with this structure:
              [
                {
                  "question": "Question text?",
                  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                  "correctAnswer": "Correct option text"
                }
              ]
              
              Respond ONLY with valid JSON array, no other text.`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY || 'YOUR_GROK_API_KEY'}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Fallback: Return sample quiz
      return generateSampleQuiz(skills);
    }
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

export default apiClient;

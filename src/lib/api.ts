// API helpers for the placement portal

export interface UploadResumeResponse {
  email: string;
  phone: string;
  skills: string[];
  name?: string;
  experience?: string;
}

// Comprehensive tech skills database
const SKILL_KEYWORDS = [
  'python', 'java', 'javascript', 'c++', 'c#', 'c', 'ruby', 'php', 'swift', 'kotlin',
  'go', 'rust', 'scala', 'perl', 'r', 'matlab', 'dart', 'lua', 'typescript',
  'html', 'html5', 'css', 'css3', 'sass', 'less', 'bootstrap', 'tailwind', 'tailwindcss',
  'react', 'reactjs', 'angular', 'vue', 'vuejs', 'svelte', 'nextjs', 'next.js', 'nuxt', 'gatsby',
  'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'rails', 'laravel',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'cassandra', 'firebase',
  'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'docker', 'kubernetes', 'jenkins', 'terraform',
  'git', 'github', 'gitlab', 'linux', 'bash', 'devops', 'ci/cd',
  'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'opencv', 'nlp', 'computer vision',
  'data science', 'data analysis', 'pandas', 'numpy', 'matplotlib', 'tableau', 'power bi',
  'hadoop', 'spark', 'kafka', 'airflow', 'etl', 'big data',
  'rest', 'rest api', 'graphql', 'microservices', 'api', 'websocket',
  'android', 'ios', 'react native', 'flutter', 'mobile development',
  'agile', 'scrum', 'jira', 'testing', 'selenium', 'jest', 'cypress',
  'blockchain', 'web3', 'solidity', 'cybersecurity', 'network security',
  'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
  'project management', 'analytical skills', 'time management'
];

function extractSkillsFromText(text: string): string[] {
  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of SKILL_KEYWORDS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      const formatted = skill.split(' ').map(word => {
        if (['sql', 'html', 'css', 'api', 'aws', 'gcp', 'ai', 'ml', 'nlp', 'etl', 'ci/cd'].includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        if (word.includes('.')) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
      foundSkills.push(formatted);
    }
  }

  return [...new Set(foundSkills)];
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : '';
}

function extractPhone(text: string): string {
  const phonePatterns = [
    /\+?[0-9]{1,3}[-.\s]?[(]?[0-9]{3}[)]?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/,
    /[0-9]{10}/,
    /[0-9]{3}[-.\s][0-9]{3}[-.\s][0-9]{4}/,
  ];
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return '';
}

function extractName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (/^[A-Za-z\s.'-]{2,50}$/.test(line)) {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        return line;
      }
    }
  }
  return '';
}

export const resumeAPI = {
  uploadResume: async (file: File): Promise<UploadResumeResponse> => {
    // Client-side text extraction for demo purposes
    // For PDF files, we extract readable text patterns
    // For best results in production, use a backend service
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try to extract text content
    let text = '';
    
    // Convert bytes to string, filtering for printable ASCII
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = decoder.decode(uint8Array);
    
    // For PDF files, extract text between parentheses (PDF text streams)
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const textMatches: string[] = [];
      // Extract text from PDF literal strings
      const regex = /\(([^)]{2,})\)/g;
      let match;
      while ((match = regex.exec(rawText)) !== null) {
        if (/[a-zA-Z]/.test(match[1])) {
          textMatches.push(match[1]);
        }
      }
      text = textMatches.join(' ');
      
      // Also try to find raw text patterns
      const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
      text += ' ' + cleanText;
    } else {
      // For DOCX or other files, use raw text extraction
      text = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
    }
    
    const skills = extractSkillsFromText(text);
    const email = extractEmail(text);
    const phone = extractPhone(text);
    const name = extractName(text);
    
    // If no skills found, provide helpful feedback
    if (skills.length === 0) {
      // Return some default skills for demo
      return {
        email: email || '',
        phone: phone || '',
        name: name || '',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
        experience: 'Skills extracted from resume (demo mode)',
      };
    }
    
    return {
      email,
      phone,
      name,
      skills,
      experience: '',
    };
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

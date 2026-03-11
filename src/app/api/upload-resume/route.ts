import { NextRequest, NextResponse } from 'next/server';

// Comprehensive tech skills database
const SKILL_KEYWORDS = [
  // Programming Languages
  'python', 'java', 'javascript', 'c++', 'c#', 'c', 'ruby', 'php', 'swift', 'kotlin',
  'go', 'rust', 'scala', 'perl', 'r', 'matlab', 'objective-c', 'dart', 'lua',
  // Web Technologies
  'html', 'html5', 'css', 'css3', 'sass', 'less', 'bootstrap', 'tailwind', 'tailwindcss',
  // Frontend Frameworks
  'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
  'svelte', 'nextjs', 'next.js', 'nuxt', 'gatsby', 'ember',
  // Backend Frameworks
  'node.js', 'nodejs', 'express', 'expressjs', 'django', 'flask', 'fastapi',
  'spring', 'spring boot', 'springboot', 'rails', 'ruby on rails', 'laravel', 'asp.net',
  // Databases
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'oracle', 'sqlite',
  'cassandra', 'dynamodb', 'firebase', 'supabase', 'mariadb', 'neo4j', 'elasticsearch',
  // Cloud & DevOps
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean',
  'docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'puppet',
  'nginx', 'apache', 'linux', 'unix', 'bash', 'shell scripting',
  // AI & ML
  'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'opencv',
  'natural language processing', 'nlp', 'computer vision', 'neural networks',
  'data science', 'data analysis', 'data mining', 'big data',
  // Data Tools
  'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'tableau', 'power bi',
  'hadoop', 'spark', 'apache spark', 'kafka', 'airflow', 'etl',
  // Version Control & Tools
  'git', 'github', 'gitlab', 'bitbucket', 'svn', 'jira', 'confluence',
  // Testing
  'jest', 'mocha', 'chai', 'cypress', 'selenium', 'pytest', 'junit', 'testing',
  // APIs & Protocols
  'rest', 'rest api', 'restful', 'graphql', 'soap', 'websocket', 'grpc',
  // Mobile
  'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
  // Other
  'typescript', 'webpack', 'babel', 'npm', 'yarn', 'agile', 'scrum', 'kanban',
  'microservices', 'api development', 'blockchain', 'web3', 'solidity',
  'cybersecurity', 'network security', 'penetration testing',
  'oop', 'object oriented programming', 'design patterns', 'solid principles',
  'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking'
];

function extractSkills(text: string): string[] {
  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of SKILL_KEYWORDS) {
    // Use word boundary matching for better accuracy
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      // Capitalize properly
      const formatted = skill.split(' ').map(word => {
        // Handle special cases
        if (['sql', 'html', 'css', 'api', 'aws', 'gcp', 'ai', 'ml', 'nlp', 'etl', 'ci/cd', 'oop'].includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        if (word.includes('.')) {
          return word; // Keep as-is for things like Node.js
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
      foundSkills.push(formatted);
    }
  }

  return foundSkills.length > 0 ? [...new Set(foundSkills)] : [];
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : '';
}

function extractPhone(text: string): string {
  // Match various phone formats
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
  // Try to extract name from first few lines
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // If line looks like a name (2-4 words, primarily letters)
    if (/^[A-Za-z\s.'-]{2,50}$/.test(line)) {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        // Check if words look like names (start with capital)
        const looksLikeName = words.every(w => /^[A-Z][a-z]*\.?$/.test(w) || w.length <= 2);
        if (looksLikeName || i === 0) {
          return line;
        }
      }
    }
  }
  return '';
}

// Simple text extraction - for binary files, try to extract readable text
function extractTextFromBinary(buffer: Buffer): string {
  // Try UTF-8 first
  let text = buffer.toString('utf-8');
  
  // For PDF files, extract text between stream markers
  if (text.includes('%PDF')) {
    const textMatches: string[] = [];
    // Extract text from PDF streams (simplified)
    const regex = /\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1].length > 2 && /[a-zA-Z]/.test(match[1])) {
        textMatches.push(match[1]);
      }
    }
    // Also try BT...ET blocks
    const btBlocks = text.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
      const tj = block.match(/\[([^\]]+)\]TJ/g) || [];
      for (const t of tj) {
        const inner = t.match(/\(([^)]+)\)/g) || [];
        textMatches.push(...inner.map(s => s.slice(1, -1)));
      }
    }
    if (textMatches.length > 0) {
      text = textMatches.join(' ');
    }
  }
  
  // Clean up non-printable characters
  text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    const isPDF = fileName.endsWith('.pdf');
    const isDOCX = fileName.endsWith('.docx');
    const isTXT = fileName.endsWith('.txt');

    if (!isPDF && !isDOCX && !isTXT) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload PDF, DOCX, or TXT file.' },
        { status: 400 }
      );
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let content = '';
    
    if (isTXT) {
      content = new TextDecoder('utf-8').decode(buffer);
    } else {
      // For PDF and DOCX, use simplified text extraction
      content = extractTextFromBinary(buffer);
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. Please ensure the file is not empty or corrupted.' },
        { status: 400 }
      );
    }

    // Extract information
    const skills = extractSkills(content);
    const email = extractEmail(content);
    const phone = extractPhone(content);
    const name = extractName(content);

    return NextResponse.json({
      success: true,
      email,
      phone,
      name,
      skills,
      experience: '',
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume. Please try again.' },
      { status: 500 }
    );
  }
}

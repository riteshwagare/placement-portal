import { NextRequest, NextResponse } from 'next/server';

// Common tech skills to look for
const SKILL_KEYWORDS = [
  'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
  'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
  'spring', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'git', 'linux', 'machine learning', 'deep learning',
  'tensorflow', 'pytorch', 'pandas', 'numpy', 'data analysis', 'data science',
  'artificial intelligence', 'natural language processing', 'computer vision',
  'blockchain', 'cybersecurity', 'devops', 'agile', 'scrum', 'rest api',
  'graphql', 'microservices', 'cloud computing', 'big data', 'hadoop', 'spark',
  'typescript', 'nextjs', 'next.js', 'tailwind', 'sass', 'less', 'webpack',
  'babel', 'jest', 'mocha', 'selenium', 'jenkins', 'ci/cd', 'terraform'
];

function extractSkills(text: string): string[] {
  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of SKILL_KEYWORDS) {
    if (textLower.includes(skill)) {
      // Capitalize properly
      foundSkills.push(skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '));
    }
  }

  return foundSkills.length > 0 ? [...new Set(foundSkills)] : ['General Programming'];
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : '';
}

function extractPhone(text: string): string {
  const phoneMatch = text.match(/[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/);
  return phoneMatch ? phoneMatch[0] : '';
}

function extractName(text: string): string {
  // Try to extract name from first few lines
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If first line looks like a name (2-4 words, no special chars except spaces)
    if (/^[A-Za-z\s]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 4) {
      return firstLine;
    }
  }
  return '';
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
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload PDF, DOCX, or TXT file.' },
        { status: 400 }
      );
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const content = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);

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
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}

export interface CvExperience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface CvSkillGroup {
  category: string;
  items: string[];
}

export interface CvEducation {
  year: string;
  title: string;
  institution: string;
}

export interface Cv {
  name: string;
  title: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
  };
  summary: string;
  experience: CvExperience[];
  skills: CvSkillGroup[];
  education: CvEducation[];
  languages: { language: string; level: string }[];
}

export const cv: Cv = {
  name: 'Esteban Acuña Cerdas',
  title: 'Full-Stack Developer & AI Engineer',
  location: 'Costa Rica',
  contact: {
    email: 'etb811@gmail.com',
    phone: '+506 8643 2927',
    website: 'https://estebanacuna.dev',
    github: 'github.com/etb811ac',
    linkedin: 'linkedin.com/in/esteban-acuña',
  },
  summary:
    'Senior software engineer with over 10 years of experience building high-performance web applications, from front-end architecture to AI-powered product features. Specialized in React, Next.js, and TypeScript, with hands-on experience integrating LLM APIs into production products and building interactive 3D experiences with Three.js. Proven record of shipping reliable, production-grade solutions for global brands while collaborating closely with cross-functional teams.',
  experience: [
    {
      company: 'Skillful AI',
      role: 'Software Engineer',
      period: '2024 – 2026',
      bullets: [
        'Built core features of a production Web3 platform for creating and orchestrating custom AI agents.',
        'Designed and implemented AI-driven product features by integrating LLM APIs into a React/Next.js frontend.',
        'Partnered with AI engineers and product teams to turn model capabilities into intuitive, usable product experiences.',
      ],
    },
    {
      company: 'SweetRush Inc',
      role: 'Software Engineer',
      period: 'Oct 2018 – 2024',
      bullets: [
        'Developed custom eLearning courses and interactive training experiences in React and Backbone.js for clients including Facebook, Uber Eats, Hilton, and Bridgestone.',
        'Integrated course front-ends with client APIs and back-end services, delivering through LMS platforms.',
        'Translated instructional designs into polished, cross-browser interactive experiences.',
      ],
    },
    {
      company: 'Critical Mass LATAM (Hangar)',
      role: 'Front-End Developer',
      period: 'Feb 2015 – Oct 2018',
      bullets: [
        'Developed and maintained marketing and product websites for Citi Bank, Omnicom Health Group, BMW, and Britt.',
        'Integrated front-end interfaces with back-end systems and services.',
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS (LESS / SASS)'],
    },
    {
      category: 'Front-End',
      items: ['React', 'Next.js', 'Tailwind CSS', 'GSAP', 'Three.js / React Three Fiber'],
    },
    {
      category: 'Back-End & Data',
      items: ['Node.js', 'REST APIs', 'MySQL', 'MongoDB'],
    },
    {
      category: 'AI Engineering',
      items: ['LLM API integration (Anthropic, OpenAI)', 'AI agents & agentic tooling', 'Prompt engineering'],
    },
    {
      category: 'Tools',
      items: ['Git', 'SCORM / LMS delivery'],
    },
  ],
  education: [
    { year: '2024', title: 'Three.js Journey', institution: 'Bruno Simon' },
    { year: '2021', title: 'Full-Stack Development with Django and React', institution: 'Udemy' },
    { year: '2016', title: 'Business Computing', institution: 'Universidad de Costa Rica' },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Advanced' },
  ],
};

export function cvPlainText(opts?: { includeContact?: boolean }): string {
  const lines: string[] = [];
  lines.push(`NAME: ${cv.name}`);
  lines.push(`TITLE: ${cv.title}`);
  lines.push(`LOCATION: ${cv.location}`);
  if (opts?.includeContact) {
    lines.push(
      `CONTACT: ${cv.contact.email} | ${cv.contact.phone} | ${cv.contact.website}`
    );
  }
  lines.push('', 'SUMMARY:', cv.summary, '', 'EXPERIENCE:');
  for (const job of cv.experience) {
    lines.push('', `${job.company} — ${job.role} (${job.period})`);
    for (const b of job.bullets) lines.push(`- ${b}`);
  }
  lines.push('', 'SKILLS:');
  for (const group of cv.skills) {
    lines.push(`- ${group.category}: ${group.items.join(', ')}`);
  }
  lines.push('', 'EDUCATION:');
  for (const e of cv.education) {
    lines.push(`- ${e.year}: ${e.title} — ${e.institution}`);
  }
  lines.push('', 'LANGUAGES:');
  for (const l of cv.languages) {
    lines.push(`- ${l.language}: ${l.level}`);
  }
  lines.push('', 'LINKS:', `- GitHub: ${cv.contact.github}`, `- LinkedIn: ${cv.contact.linkedin}`);
  return lines.join('\n');
}

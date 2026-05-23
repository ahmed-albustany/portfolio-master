import {
  FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaLinux,
  FaHtml5, FaCss3Alt, FaAws, FaDatabase, FaNetworkWired,
  FaLock, FaCubes, FaProjectDiagram, FaSitemap,
} from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiTailwindcss, SiMongodb,
  SiFirebase, SiPostgresql, SiExpress, SiNextdotjs,
  SiVite, SiGithubactions,
} from 'react-icons/si';
import {
  HiServer, HiDesktopComputer, HiShieldCheck, HiCog,
  HiCode, HiSupport, HiChip,
} from 'react-icons/hi';

/* ================================================================
   PERSONAL INFO
   ================================================================ */

export const personalInfo = {
  name: '[YOUR NAME]',
  title: '[YOUR TITLE]',
  subtitle: 'Full-Stack Developer & IT Systems Engineer',
  email: 'your@email.com',
  location: 'Your City, Country',
  yearsOfExperience: 3,
  bio: `Passionate developer with expertise in building modern web applications,
    managing IT infrastructure, and solving complex technical challenges.
    Committed to writing clean, efficient, and scalable code.`,
  socialLinks: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
  resumeUrl: '/resume.pdf',
};

/* ================================================================
   STATS
   ================================================================ */

export const stats = [
  { label: 'Years Experience', value: 3, suffix: '+' },
  { label: 'Projects Completed', value: 15, suffix: '+' },
  { label: 'Users Managed', value: 500, suffix: '+' },
  { label: 'Certifications', value: 6, suffix: '' },
];

/* ================================================================
   SKILLS — 3 lanes with icon, level (0-100), accent colour
   ================================================================ */

export const skills = {
  development: {
    title: 'Development',
    shortTitle: 'Dev',
    icon: HiCode,
    accent: '#00D4FF',
    description: 'Front-end frameworks, languages, and tools I build with daily.',
    items: [
      { name: 'React', icon: FaReact, level: 90, color: '#61DAFB' },
      { name: 'JavaScript', icon: SiJavascript, level: 90, color: '#F7DF1E' },
      { name: 'HTML / CSS', icon: FaHtml5, level: 95, color: '#E34F26' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 90, color: '#06B6D4' },
      { name: 'Firebase', icon: SiFirebase, level: 85, color: '#FFCA28' },
      { name: 'REST APIs', icon: FaDatabase, level: 90, color: '#00D4FF' },
      { name: 'Git', icon: FaGitAlt, level: 90, color: '#F05032' },
    ],
  },
  engineering: {
    title: 'Engineering',
    shortTitle: 'Eng',
    icon: HiServer,
    accent: '#A855F7',
    description: 'Back-end architecture, design patterns, and engineering fundamentals.',
    items: [
      { name: 'OOP', icon: FaCubes, level: 85, color: '#A855F7' },
      { name: 'System Design', icon: FaProjectDiagram, level: 75, color: '#EC4899' },
      { name: 'CI / CD', icon: SiGithubactions, level: 75, color: '#2088FF' },
      { name: 'Architecture', icon: FaSitemap, level: 70, color: '#F59E0B' },
      { name: 'Python', icon: FaPython, level: 80, color: '#3776AB' },
      { name: 'Data Structures', icon: HiChip, level: 80, color: '#10B981' },
    ],
  },
  itSystems: {
    title: 'IT & Systems',
    shortTitle: 'IT',
    icon: HiDesktopComputer,
    accent: '#10B981',
    description: 'Enterprise infrastructure, identity management, and end-user support.',
    items: [
      { name: 'Domain Admin', icon: HiShieldCheck, level: 85, color: '#0078D6' },
      { name: 'Active Directory', icon: FaNetworkWired, level: 80, color: '#0078D6' },
      { name: 'Helpdesk', icon: HiSupport, level: 95, color: '#10B981' },
      { name: 'OS Management', icon: HiDesktopComputer, level: 85, color: '#F59E0B' },
      { name: 'Networking', icon: HiServer, level: 75, color: '#00D4FF' },
      { name: 'Security', icon: FaLock, level: 70, color: '#EF4444' },
    ],
  },
};

/* ================================================================
   PROJECTS — 6 entries with complete data
   ================================================================ */

export const projects = [
  {
    id: 'proj-1',
    title: 'CloudSync Dashboard',
    description: 'A full-stack SaaS dashboard with real-time data sync and auth.',
    longDescription:
      'End-to-end SaaS platform with authentication, role-based dashboards, real-time Firestore data sync, and a fully responsive UI. Handles thousands of concurrent users with optimised database queries and edge caching.',
    image: '/projects/project1.png',
    tags: ['React', 'Firebase', 'Tailwind', 'Framer Motion'],
    category: 'web-apps',
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'DevFlow CLI',
    description: 'An automation toolkit for developer workflow and deployment.',
    longDescription:
      'CLI toolkit that automates boilerplate generation, linting, testing pipelines, and deployment workflows. Reduced setup time by 60% across the engineering team with configurable templates and plugin support.',
    image: '/projects/project2.png',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    category: 'tools',
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'TeamSpace',
    description: 'A real-time collaborative platform with channels and file sharing.',
    longDescription:
      'WebSocket-driven collaboration suite with channels, threaded conversations, file sharing, presence indicators, and end-to-end encryption. Supports 50+ concurrent users per workspace.',
    image: '/projects/project3.png',
    tags: ['React', 'Firebase', 'Tailwind', 'WebSocket'],
    category: 'web-apps',
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'InfraWatch',
    description: 'IT asset management and network monitoring dashboard.',
    longDescription:
      'Centralised inventory of hardware, software licences, and network devices with real-time alerting, SLA reporting, and Active Directory integration. Reduced ticket resolution time by 35%.',
    image: '/projects/project4.png',
    tags: ['Python', 'PowerShell', 'Active Directory', 'SCCM'],
    category: 'systems',
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'ScaffoldX',
    description: 'VS Code extension for rapid React component scaffolding.',
    longDescription:
      'One-click file generation for React components, hooks, tests, and Storybook stories. Configurable templates with team-wide consistency, supporting TypeScript and JavaScript projects.',
    image: '/projects/project5.png',
    tags: ['TypeScript', 'VS Code API', 'Node.js'],
    category: 'tools',
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
  },
  {
    id: 'proj-6',
    title: 'NetDesk',
    description: 'Network monitoring and helpdesk ticketing system.',
    longDescription:
      'Custom-built ticketing portal with SLA tracking, network uptime dashboards, automated escalation workflows, and SNMP polling for real-time device health monitoring.',
    image: '/projects/project6.png',
    tags: ['React', 'Express', 'Socket.io', 'SNMP'],
    category: 'systems',
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
  },
];

/* ================================================================
   EXPERIENCE — 4 entries with full data
   ================================================================ */

export const experience = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: 'Company One',
    period: '2024 – Present',
    type: 'dev',
    description: 'Leading front-end architecture and building scalable web applications for enterprise clients.',
    achievements: [
      'Led front-end architecture migration to React 18 with code-splitting and lazy loading',
      'Reduced page load time by 45% through performance optimisation and edge caching',
      'Mentored 3 junior developers and established code review standards',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind', 'AWS'],
  },
  {
    id: 'exp-2',
    role: 'Software Engineer',
    company: 'Company Two',
    period: '2023 – 2024',
    type: 'eng',
    description: 'Designed and deployed microservices and CI/CD pipelines for high-traffic applications.',
    achievements: [
      'Designed and deployed microservices handling 10k+ requests per minute',
      'Built CI/CD pipelines that cut deployment time from hours to minutes',
      'Implemented automated testing suite with 92% code coverage',
    ],
    technologies: ['Node.js', 'Docker', 'PostgreSQL', 'GitHub Actions'],
  },
  {
    id: 'exp-3',
    role: 'IT Systems Administrator',
    company: 'Company Three',
    period: '2022 – 2023',
    type: 'it',
    description: 'Managed enterprise IT infrastructure, Active Directory, and end-user support.',
    achievements: [
      'Managed Active Directory for 500+ users across multiple OUs',
      'Resolved 50+ helpdesk tickets weekly with 98% satisfaction rating',
      'Automated user onboarding/offboarding with PowerShell scripts',
    ],
    technologies: ['Active Directory', 'PowerShell', 'SCCM', 'Windows Server'],
  },
  {
    id: 'exp-4',
    role: 'Junior Developer',
    company: 'Company Four',
    period: '2021 – 2022',
    type: 'dev',
    description: 'Built responsive web applications and integrated third-party services.',
    achievements: [
      'Built responsive web applications for 3 client-facing products',
      'Integrated third-party APIs including Stripe, Twilio, and SendGrid',
      'Collaborated with UX team to implement design system from scratch',
    ],
    technologies: ['React', 'Firebase', 'Tailwind', 'Figma'],
  },
];

/* ================================================================
   CERTIFICATIONS — 6 entries with complete data
   ================================================================ */

export const certifications = [
  {
    id: 'cert-1',
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'AWS-CP-2024',
    credentialUrl: '#',
    badgeImage: '/certs/cert1.png',
    category: 'cloud',
  },
  {
    id: 'cert-2',
    name: 'Meta Front-End Developer',
    issuer: 'Meta (Coursera)',
    date: '2023',
    credentialId: 'META-FE-2023',
    credentialUrl: '#',
    badgeImage: '/certs/cert2.png',
    category: 'dev',
  },
  {
    id: 'cert-3',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: '2023',
    credentialId: 'COMP-SEC-2023',
    credentialUrl: '#',
    badgeImage: '/certs/cert3.png',
    category: 'security',
  },
  {
    id: 'cert-4',
    name: 'CompTIA A+',
    issuer: 'CompTIA',
    date: '2022',
    credentialId: 'COMP-A-2022',
    credentialUrl: '#',
    badgeImage: '/certs/cert4.png',
    category: 'it',
  },
  {
    id: 'cert-5',
    name: 'Google IT Support',
    issuer: 'Google (Coursera)',
    date: '2022',
    credentialId: 'GOOG-IT-2022',
    credentialUrl: '#',
    badgeImage: '/certs/cert5.png',
    category: 'it',
  },
  {
    id: 'cert-6',
    name: 'Azure Fundamentals',
    issuer: 'Microsoft',
    date: '2021',
    credentialId: 'AZ-900-2021',
    credentialUrl: '#',
    badgeImage: '/certs/cert6.png',
    category: 'cloud',
  },
];

/* ================================================================
   NAV LINKS
   ================================================================ */

export const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

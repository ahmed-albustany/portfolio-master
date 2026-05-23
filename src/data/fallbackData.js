/* ================================================================
   FALLBACK DATA
   Used when Firestore is unavailable or empty.
   personalInfo contains Ahmed's real details.
   Other collections have one sample entry each to show structure.
   Add your real data from the admin panel.
   ================================================================ */

export const fallbackPersonalInfo = {
  name: 'Ahmed Albustany',
  title: 'IT Officer',
  subtitle: 'Full-Stack Developer & IT Systems Engineer',
  email: 'ahmed.albustany@outlook.com',
  location: 'Amman, Jordan',
  availability: 'Available for opportunities',
  bio: 'IT professional with expertise in systems administration, network engineering, full-stack development, and security operations. Building reliable infrastructure and modern web applications.',
  socialLinks: {
    github: 'https://github.com/ahmed-albustany',
    linkedin: 'https://linkedin.com/in/ahmed-albustany-65a66027b',
  },
  resumeUrl: '/resume.pdf',
};

export const fallbackStats = {
  projects: 0,
  years: 0,
  users: 0,
  certifications: 0,
  systems: 0,
  tickets: 0,
};

export const fallbackProjects = [
  {
    id: 'demo-project',
    title: 'Sample Project',
    category: 'web',
    status: 'completed',
    description: 'Demo entry — add your real projects from the admin panel.',
    fullDescription: '',
    imageURL: '',
    techStack: ['React', 'Node.js', 'Firebase'],
    liveDemo: '',
    github: '',
    impact: '',
    missionNumber: 'MSN-000',
    problemSolved: '',
    featured: false,
    order: 0,
  },
];

export const fallbackExperience = [
  {
    id: 'demo-exp',
    title: 'IT Officer',
    organization: 'Your Organization',
    duration: '2023 - Present',
    type: 'Full-time',
    department: 'it',
    description: 'Demo entry — add your real experience from the admin panel.',
    achievements: ['Managed IT infrastructure'],
    technologies: ['Windows Server', 'Active Directory'],
  },
];

export const fallbackSkills = [
  {
    id: 'demo-skill-1',
    name: 'JavaScript',
    level: 85,
    category: 'development',
    icon: 'SiJavascript',
    yearsUsed: '3',
  },
  {
    id: 'demo-skill-2',
    name: 'React',
    level: 80,
    category: 'development',
    icon: 'SiReact',
    yearsUsed: '2',
  },
  {
    id: 'demo-skill-3',
    name: 'Linux',
    level: 75,
    category: 'infrastructure',
    icon: 'SiLinux',
    yearsUsed: '3',
  },
];

export const fallbackSysAdmin = [
  {
    id: 'demo-sysadmin',
    title: 'Server Administration',
    organization: 'Your Organization',
    role: 'System Administrator',
    duration: '2023 - Present',
    scope: '50+ endpoints',
    description: 'Demo entry — add your real sysadmin data from the admin panel.',
    tools: ['Windows Server', 'Active Directory', 'VMware'],
    tasks: ['Server maintenance', 'User management'],
    achievements: ['Improved uptime to 99.9%'],
  },
];

export const fallbackNetwork = [
  {
    id: 'demo-network',
    title: 'Enterprise Network',
    organization: 'Your Organization',
    networkType: 'LAN',
    scale: '200+ nodes',
    duration: '2023 - Present',
    description: 'Demo entry — add your real network data from the admin panel.',
    protocols: ['TCP/IP', 'DHCP', 'DNS'],
    equipment: ['Cisco Switch', 'MikroTik Router'],
    responsibilities: ['Network monitoring', 'Troubleshooting'],
  },
];

export const fallbackDatabase = [
  {
    id: 'demo-database',
    title: 'Production Database',
    organization: 'Your Organization',
    dbSystem: 'MySQL',
    scale: '10GB+',
    duration: '2023 - Present',
    description: 'Demo entry — add your real database data from the admin panel.',
    queryTypes: ['CRUD', 'Joins', 'Stored Procedures'],
    tools: ['phpMyAdmin', 'MySQL Workbench'],
    tasks: ['Backup management', 'Query optimization'],
    achievements: ['Reduced query time by 40%'],
  },
];

export const fallbackSecurity = [
  {
    id: 'demo-security',
    title: 'CCTV Surveillance',
    organization: 'Your Organization',
    systemType: 'CCTV',
    scale: '32 cameras',
    duration: '2023 - Present',
    software: 'Hikvision iVMS',
    hardware: 'Hikvision NVR',
    coverageAreas: ['Entrance', 'Parking', 'Hallways'],
    responsibilities: ['System installation', 'Monitoring'],
    improvements: ['Upgraded to 4K cameras'],
  },
];

export const fallbackHelpdesk = [
  {
    id: 'demo-helpdesk',
    title: 'IT Support',
    organization: 'Your Organization',
    duration: '2023 - Present',
    avgTicketsResolved: '500+',
    supportScope: '200+ employees',
    hardwareSupported: ['Laptops', 'Printers', 'Phones'],
    softwareSupported: ['Office 365', 'ERP System'],
    osSupported: ['Windows 11', 'macOS'],
    tools: ['TeamViewer', 'JIRA'],
    achievements: ['Reduced avg resolution time by 30%'],
  },
];

export const fallbackCertifications = [
  {
    id: 'demo-cert',
    name: 'Sample Certification',
    issuer: 'Certification Provider',
    date: '2024',
    credentialID: 'DEMO-001',
    verifyURL: '',
    category: 'it',
    imageURL: '',
  },
];

/* ================================================================
   NAV LINKS — ordered to match Home.jsx section rendering
   ================================================================ */

export const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'sysadmin', label: 'SysAdmin' },
  { id: 'network', label: 'Network' },
  { id: 'database', label: 'Database' },
  { id: 'security', label: 'Security' },
  { id: 'helpdesk', label: 'Helpdesk' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

/* ================================================================
   DEPARTMENT DEFINITIONS
   ================================================================ */

export const departments = [
  { key: 'dev', label: 'DEV', fullLabel: 'Development', color: '#0066FF', collection: 'projects' },
  { key: 'sysadmin', label: 'SYSADMIN', fullLabel: 'Systems Administration', color: '#00D4FF', collection: 'sysadmin' },
  { key: 'network', label: 'NETWORK', fullLabel: 'Network Administration', color: '#00FF88', collection: 'network' },
  { key: 'database', label: 'DATABASE', fullLabel: 'Database Administration', color: '#FFB800', collection: 'database' },
  { key: 'security', label: 'SECURITY', fullLabel: 'Security & CCTV', color: '#FF3B3B', collection: 'security' },
  { key: 'helpdesk', label: 'HELPDESK', fullLabel: 'IT Support', color: '#FF6B35', collection: 'helpdesk' },
  { key: 'certs', label: 'CERTS', fullLabel: 'Certifications & Clearances', color: '#A855F7', collection: 'certifications' },
];

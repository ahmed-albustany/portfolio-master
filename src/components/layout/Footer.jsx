import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '@/data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-200 dark:bg-dark-100 border-t border-light-300 dark:border-dark-50">
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-light-600 dark:text-light-400">
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-600 dark:text-light-400 hover:text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={personalInfo.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-600 dark:text-light-400 hover:text-primary transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

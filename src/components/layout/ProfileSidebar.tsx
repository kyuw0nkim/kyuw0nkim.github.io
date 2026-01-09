import { Mail, Github } from "lucide-react";

// Custom icons for social platforms
function GoogleScholarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  );
}

function ResearchGateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.586 0c-2.123 0-3.87 1.746-3.87 3.87 0 .678.178 1.314.487 1.866l-2.456 2.456a6.45 6.45 0 0 0-3.747-1.192c-3.582 0-6.5 2.918-6.5 6.5s2.918 6.5 6.5 6.5 6.5-2.918 6.5-6.5a6.45 6.45 0 0 0-1.192-3.747l2.456-2.456c.552.309 1.188.487 1.866.487 2.123 0 3.87-1.746 3.87-3.87S21.71 0 19.587 0zM10 17c-2.485 0-4.5-2.015-4.5-4.5S7.515 8 10 8s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm9.586-11.13c-1.02 0-1.87-.85-1.87-1.87s.85-1.87 1.87-1.87 1.87.85 1.87 1.87-.85 1.87-1.87 1.87z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0">
      <div className="sticky-profile">
        {/* Profile Image */}
        <div className="w-48 h-48 mx-auto lg:mx-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
          <span className="text-lg">image</span>
        </div>

        {/* Affiliation */}
        <div className="text-center lg:text-left space-y-1 mb-6">
          <p className="text-muted-foreground">Master's student</p>
          <p className="text-primary font-medium">Interaction Design for Learning Lab</p>
          <p className="text-primary font-medium">Deparment of Educational Technology</p>
          <p className="text-primary font-medium">Ewha Womans University</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center lg:justify-start gap-4">
          <a href="mailto:kyuwonkim95@ewha.ac.kr" aria-label="Email" className="social-icon">
            <Mail className="w-6 h-6" />
          </a>
          <a href="https://scholar.google.com/citations?user=oYoOlXgAAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" className="social-icon">
            <GoogleScholarIcon className="w-6 h-6" />
          </a>
          <a href="https://www.researchgate.net/profile/Kyuwon-Kim-5" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate" className="social-icon">
            <ResearchGateIcon className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/kyuwon-kim-23168a209" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
            <LinkedInIcon className="w-6 h-6" />
          </a>
          <a href="https://github.com/kyuw0nkim" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-icon">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </aside>
  );
}

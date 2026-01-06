import { Mail, Github } from "lucide-react";

// Custom icons for Twitter/X and Google Scholar
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GoogleScholarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
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
          <p className="text-muted-foreground">PhD student</p>
          <p className="text-primary font-medium">German Primate Center</p>
          <p className="text-primary font-medium">IMPRS for Neurosciences</p>
          <p className="text-primary font-medium">University of Göttingen</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center lg:justify-start gap-4">
          <a href="mailto:kyuwon@example.com" aria-label="Email" className="social-icon">
            <Mail className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">
            <TwitterIcon className="w-6 h-6" />
          </a>
          <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" className="social-icon">
            <GoogleScholarIcon className="w-6 h-6" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-icon">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </aside>
  );
}

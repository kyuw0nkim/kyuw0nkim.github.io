import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { ProfileSidebar } from "./ProfileSidebar";

interface MainLayoutProps {
  children: ReactNode;
  showProfile?: boolean;
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="container-academic">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Kyuwon Kim. All rights reserved.</p>
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

export function MainLayout({ children, showProfile = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <main className="flex-1 pt-[60px]">
        {showProfile ? (
          <div className="container-academic py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <ProfileSidebar />
              <div className="flex-1 min-w-0 w-full lg:max-w-[800px]">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="container-academic py-12">
            <div className="max-w-[800px] mx-auto">
              {children}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

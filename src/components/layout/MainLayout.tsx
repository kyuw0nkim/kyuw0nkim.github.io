import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { ProfileSidebar } from "./ProfileSidebar";

interface MainLayoutProps {
  children: ReactNode;
  showProfile?: boolean;
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
            <div className="max-w-[900px] mx-auto">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

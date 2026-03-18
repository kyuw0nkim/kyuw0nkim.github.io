import { MainLayout } from "@/components/layout";
import { Download } from "lucide-react";
import { siteData } from "@/data/siteData";

const CV = () => {
  const { cv } = siteData;

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Curriculum Vitae</h1>

      {/* PDF Download */}
      <div className="flex justify-center mb-12">
        <a
          href={cv.cvUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sub text-sub-foreground rounded-md hover:bg-sub/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          View Full CV
        </a>
      </div>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Education</h2>
        <div className="space-y-4">
          {cv.education.map((item) => (
            <div key={item.degree} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
              <div>
                <h3 className="font-medium text-foreground">{item.degree}</h3>
                <p className="text-sm text-muted-foreground">{item.institution}</p>
              </div>
              <span className="text-sm text-muted-foreground shrink-0 sm:ml-4">{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Research Experience */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Research Experience</h2>
        <div className="space-y-4">
          {cv.experience.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
              <div>
                <h3 className="font-medium text-foreground">{item.role}</h3>
                <p className="text-sm text-muted-foreground">{item.lab}</p>
              </div>
              <span className="text-sm text-muted-foreground shrink-0 sm:ml-4">{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Awards & Honors</h2>
        <div className="space-y-4">
          {cv.awards.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                {item.organization && (
                  <p className="text-sm text-muted-foreground">{item.organization}</p>
                )}
              </div>
              <span className="text-sm text-muted-foreground shrink-0 sm:ml-4">{item.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Academic Service */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Academic Service</h2>
        <div className="space-y-4">
          {cv.service.map((item, i) => (
            <div key={i}>
              <h3 className="font-medium text-foreground">{item.role}</h3>
              <p className="text-sm text-muted-foreground">{item.details.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default CV;
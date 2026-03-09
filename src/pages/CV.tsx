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
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
            <div key={item.degree}>
              <h3 className="font-medium text-foreground">{item.degree}</h3>
              <p className="text-sm text-muted-foreground">{item.institution}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.period}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Experience */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Research Experience</h2>
        <div className="space-y-4">
          {cv.experience.map((item, i) => (
            <div key={i}>
              <h3 className="font-medium text-foreground">{item.role}</h3>
              <p className="text-sm text-muted-foreground">{item.lab}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.period}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Awards & Honors</h2>
        <div className="space-y-4">
          {cv.awards.map((item, i) => (
            <div key={i}>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.year}</p>
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
        <div className="space-y-2">
          {cv.service.map((item, i) => (
            <p key={i} className="text-foreground">{item}</p>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default CV;
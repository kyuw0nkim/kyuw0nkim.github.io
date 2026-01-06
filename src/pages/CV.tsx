import { MainLayout } from "@/components/layout";
import { FileText, Download } from "lucide-react";

const CV = () => {
  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Curriculum Vitae</h1>

      {/* PDF Download */}
      <div className="flex justify-center mb-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download CV (PDF)
        </a>
      </div>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Education</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">Ph.D. in Neurosciences</h3>
              <p className="text-sm text-muted-foreground">German Primate Center, University of Göttingen</p>
            </div>
            <span className="text-sm text-muted-foreground">2024 - Present</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">M.S. in Human-Computer Interaction</h3>
              <p className="text-sm text-muted-foreground">KAIST</p>
            </div>
            <span className="text-sm text-muted-foreground">2022 - 2024</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">B.S. in Computer Science</h3>
              <p className="text-sm text-muted-foreground">Seoul National University</p>
            </div>
            <span className="text-sm text-muted-foreground">2018 - 2022</span>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Research Experience</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">Graduate Research Assistant</h3>
              <p className="text-sm text-muted-foreground">German Primate Center</p>
            </div>
            <span className="text-sm text-muted-foreground">2024 - Present</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">Research Intern</h3>
              <p className="text-sm text-muted-foreground">Microsoft Research Asia</p>
            </div>
            <span className="text-sm text-muted-foreground">Summer 2023</span>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Awards & Honors</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <p className="text-foreground">Best Poster Design Award, UIST 2025</p>
            <span className="text-sm text-muted-foreground">2025</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">IMPRS Scholarship</p>
            <span className="text-sm text-muted-foreground">2024</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">Dean's List, Seoul National University</p>
            <span className="text-sm text-muted-foreground">2020, 2021</span>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["Python", "JavaScript/TypeScript", "React", "User Studies", "Statistical Analysis", "Machine Learning", "Figma", "LaTeX"].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Service */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Academic Service</h2>
        <div className="space-y-2">
          <p className="text-foreground">Reviewer: CHI 2025, CSCW 2025</p>
          <p className="text-foreground">Student Volunteer: UIST 2024</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default CV;

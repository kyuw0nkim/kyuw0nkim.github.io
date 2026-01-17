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
          View Full CV
        </a>
      </div>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Education</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">M.A. in Educational Technology</h3>
              <p className="text-sm text-muted-foreground">Ewha Womans University</p>
            </div>
            <span className="text-sm text-muted-foreground">Mar 2025 - Aug 2026 (Expected)</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">B.A. in Educational Technology & B.E. in Software</h3>
              <p className="text-sm text-muted-foreground">Ewha Womans University</p>
            </div>
            <span className="text-sm text-muted-foreground">Mar 2021 - Feb 2025</span>
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
              <p className="text-sm text-muted-foreground">Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So</p>
            </div>
            <span className="text-sm text-muted-foreground">Mar 2025 - Present</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">Undergraduate Research Assistant</h3>
              <p className="text-sm text-muted-foreground">Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So</p>
            </div>
            <span className="text-sm text-muted-foreground">Jan 2024 - Feb 2025</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">Undergraduate Research Assistant</h3>
              <p className="text-sm text-muted-foreground">Learning Analytics for Prediction & Action Lab, Research Advisor: Il-Hyun Jo</p>
            </div>
            <span className="text-sm text-muted-foreground">Summer 2021, Winter 2021, Summer 2023</span>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Awards & Honors</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <p className="text-foreground">Best Poster Design Award, APSCE</p>
            <span className="text-sm text-muted-foreground">2024</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">Excellence Award in Youth Idea Contest on African Educational Development Cooperation, Korean National Commission for UNESCO</p>
            <span className="text-sm text-muted-foreground">2024</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">Outstanding Paper Award, orean Association for Educational Information and Media</p>
            <span className="text-sm text-muted-foreground">2024</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">Honorable Mention, The Koreans Society for Educational Technology</p>
            <span className="text-sm text-muted-foreground">2023</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-foreground">Grand Award in Upcoming Life in Space SW Challenge, Future & Software Foundation</p>
            <span className="text-sm text-muted-foreground">2022</span>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["Python", "R", "MySQL", "JavaScript/TypeScript", "React", "Machine Learning", "Figma", "LaTeX"].map((skill) => (
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
          <p className="text-foreground">Ad hoc Reviewer: Journal of Research, Innovation and Technologies (JoRIT)</p>
          <p className="text-foreground">Student Volunteer: KAIEM&KSET 2023 Fall, KAIEM 2025 Spring, ICoME 2025, KAIEM&KSET 2025 Fall</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default CV;

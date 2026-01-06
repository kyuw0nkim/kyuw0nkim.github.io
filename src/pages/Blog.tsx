import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "first-post",
    title: "Getting Started with HCI Research",
    date: "2026-09-15",
    excerpt: "Reflections on my first year as a PhD student in Human-Computer Interaction research.",
    content: `# Getting Started with HCI Research

Starting a PhD in Human-Computer Interaction has been an incredible journey. In this post, I want to share some thoughts and lessons learned during my first year.

## Finding Your Research Direction

One of the biggest challenges for new PhD students is identifying a research direction that is both personally meaningful and academically valuable. 

## Building a Research Practice

- **Read widely**: Don't limit yourself to your immediate field
- **Write regularly**: Keep a research journal
- **Collaborate**: Work with others whenever possible

## Looking Forward

I'm excited to continue exploring the intersection of AI and human cognition in my research.`,
    tags: ["PhD", "Research", "HCI"]
  },
  {
    id: "ai-interaction",
    title: "Thoughts on Human-AI Collaboration",
    date: "2026-10-01",
    excerpt: "Exploring the nuances of how humans and AI systems can work together effectively.",
    content: `# Thoughts on Human-AI Collaboration

As AI systems become more capable, understanding how humans can effectively collaborate with them becomes increasingly important.

## Key Considerations

1. Trust calibration
2. Transparency in AI decision-making
3. Maintaining human agency

## Future Directions

The field of Human-AI interaction is rapidly evolving...`,
    tags: ["AI", "Collaboration", "HCI"]
  }
];

const BlogList = () => {
  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Blog</h1>

      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="border-b border-border pb-8 last:border-b-0">
            <Link to={`/blog/${post.id}`}>
              <h2 className="text-xl font-heading font-semibold text-foreground hover:text-primary transition-colors mb-2">
                {post.title}
              </h2>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-muted-foreground mb-3">{post.excerpt}</p>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </MainLayout>
  );
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-heading font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-link hover:underline">
            ← Back to blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Simple markdown rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-heading font-bold mb-6">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-heading font-semibold mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 text-foreground">{line.replace('- ', '')}</li>;
      }
      if (/^\d+\. /.test(line)) {
        return <li key={index} className="ml-6 text-foreground list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.trim()) {
        return <p key={index} className="text-foreground mb-4">{line}</p>;
      }
      return null;
    });
  };

  return (
    <MainLayout>
      <Link to="/blog" className="inline-flex items-center gap-2 text-link hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-primary">#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {renderContent(post.content)}
        </div>
      </article>
    </MainLayout>
  );
};

export { BlogList, BlogPost };

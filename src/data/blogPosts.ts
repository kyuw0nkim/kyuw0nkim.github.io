export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
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
    tags: ["PhD", "Research", "HCI"],
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
    tags: ["AI", "Collaboration", "HCI"],
  },
];

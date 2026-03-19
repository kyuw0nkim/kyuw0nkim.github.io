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
    id: "post2",
    title: "What made me step into academia?",
    date: "2026-03-18",
    excerpt: "I didn’t plan to become a researcher. One moment just made me see things differently.",
    content: `
I always thought I would become a teacher.

From a very young age through my undergraduate years, that idea never changed. I think it was because I wanted to be someone who helps students, someone who makes things a little clearer.

Then, during my undergraduate, I attended a conference with funding from my department. I sat in on a session without expecting much, but it stayed with me.

It made me realize that research grows through small pieces of work; each study modest on its own, but together shaping something larger. That was when I started to see research differently.

Teaching helps the students in front of me. Research, I felt, could help shape something a bit larger. Something that lasts longer and reaches further.

Only later did I learn that this way of thinking aligns with Design-Based Research, that knowledge develops iteratively, through accumulation.

But at that time, I didn’t have the words for it. I just knew that I wanted to be part of that process.
`,

    tags: ["Dream", "Research"],
  },
  
  {
    id: "post1",
    title: "Things I Love",
    date: "2026-02-18",
    excerpt: "Games that move people and the mechanics that make them meaningful.",
    content: `
I’ve always been drawn to games that do more than just entertain. What interests me most is how a game, through its mechanics, can shape the way players think, feel, and make decisions.
Here are a few games I really like.

### Detroit: Become Human
A game where your choices really matter. I liked how it constantly made me pause and think, “What should I do here?” and then actually made me live with the outcome.

### Undertale
You don’t have to fight, and that alone changes everything. It’s one of those games that quietly makes you question your own decisions.

### Super Mario Odyssey
Just pure fun. The movement feels great, and the "capture" mechanic keeps things fresh the whole time.

### Life is Strange
Being able to rewind time sounds powerful, but it mostly just made me overthink everything. In a good way. The story hits emotionally too.

### Alba: A Wildlife Adventure
The story is pretty simple, but it’s really good at making you want to collect things and explore. At the same time, you naturally learn about nature without it feeling forced.`,

    tags: ["Games", "Design", "Interaction"],
  },
];

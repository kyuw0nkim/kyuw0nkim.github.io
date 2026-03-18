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

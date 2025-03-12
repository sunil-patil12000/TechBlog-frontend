import { LoremIpsum } from 'lorem-ipsum';

// Helper to generate lorem ipsum text
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

// Generate random date in the past year
const randomDate = () => {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const timestamp = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
  return new Date(timestamp).toISOString();
};

// Mock categories
const categories = [
  'javascript',
  'typescript',
  'react',
  'vue',
  'angular',
  'node',
  'python',
  'aws',
  'devops',
  'algorithms',
  'backend',
  'frontend',
  'mobile',
  'ux',
  'security',
  'databases',
  'architecture',
  'career',
  'testing',
];

// Mock authors
const authors = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Senior Frontend Developer specializing in React and TypeScript. Passionate about user experience and performance optimization.',
    role: 'Senior Developer',
    social: {
      twitter: 'https://twitter.com/alexjohnson',
      github: 'https://github.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson',
    },
  },
  {
    id: '2',
    name: 'Samantha Park',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Full-stack developer with a focus on Node.js and cloud architecture. Writer and speaker on modern web technologies.',
    role: 'Tech Lead',
    social: {
      twitter: 'https://twitter.com/sampark',
      github: 'https://github.com/sampark',
      linkedin: 'https://linkedin.com/in/sampark',
    },
  },
  {
    id: '3',
    name: 'Miguel Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    bio: 'DevOps engineer and cloud architect. Expert in containerization, orchestration, and CI/CD pipelines.',
    role: 'DevOps Engineer',
    social: {
      twitter: 'https://twitter.com/miguelrodriguez',
      github: 'https://github.com/miguelrodriguez',
      linkedin: 'https://linkedin.com/in/miguelrodriguez',
    },
  },
  {
    id: '4',
    name: 'Leila Ahmed',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Data scientist and machine learning specialist. Writes about AI applications in web development and practical ML implementation.',
    role: 'Data Scientist',
    social: {
      twitter: 'https://twitter.com/leilaahmed',
      github: 'https://github.com/leilaahmed',
      linkedin: 'https://linkedin.com/in/leilaahmed',
    },
  },
];

// Function to generate a random integer within a range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get random items from an array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a post slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Generate mock blog posts
export const mockBlogPosts = Array.from({ length: 20 }).map((_, index) => {
  const title = lorem.generateWords(getRandomInt(4, 8));
  const slug = generateSlug(title);
  const date = randomDate();
  const updateDate = Math.random() > 0.7 ? randomDate() : date;
  const postCategories = getRandomItems(categories, getRandomInt(1, 3));
  const author = authors[getRandomInt(0, authors.length - 1)];
  const readTime = getRandomInt(3, 15);
  const likes = getRandomInt(5, 120);
  const comments = getRandomInt(0, 25);
  
  return {
    id: `post-${index + 1}`,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    slug,
    excerpt: lorem.generateSentences(2),
    content: lorem.generateParagraphs(5),
    coverImage: `https://picsum.photos/seed/${slug}/800/600`,
    date,
    updateDate,
    categories: postCategories,
    author,
    readTime,
    likes,
    comments,
    isFeatured: index < 3, // First 3 posts are featured
  };
});

// Mock table of contents
export const mockTableOfContents = [
  { id: 'introduction', text: 'Introduction', level: 2 },
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'configuration', text: 'Configuration', level: 3 },
  { id: 'advanced-usage', text: 'Advanced Usage', level: 2 },
  { id: 'best-practices', text: 'Best Practices', level: 2 },
  { id: 'common-patterns', text: 'Common Patterns', level: 3 },
  { id: 'antipatterns', text: 'Anti-patterns to Avoid', level: 3 },
  { id: 'performance', text: 'Performance Considerations', level: 2 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]; 
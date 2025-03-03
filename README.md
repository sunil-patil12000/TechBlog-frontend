# Modern Tech Blog

A modern tech blog website built with React.js and TypeScript, featuring a clean and responsive design with dark mode support.

## Features

### Core Features

- **Home Page**
  - Hero section with featured blog post
  - Grid layout for recent blog posts
  - Search bar to filter posts by keywords
  - Sidebar with categories and popular tags

- **Blog Post Page**
  - Dynamic routing for individual posts
  - Syntax highlighting for code snippets
  - Author bio section
  - Social sharing buttons
  - Comments section
  - Table of Contents for long posts

- **Additional Pages**
  - About page with team/contributor bios
  - Archives page to filter posts by date/category
  - Projects page to showcase open-source tools
  - Newsletter subscription form

### Technical Features

- React Router v6 for navigation and dynamic routing
- Blog content from static JSON data (can be replaced with a headless CMS)
- Responsive design with Tailwind CSS
- Dark/light mode toggle (stored in localStorage)
- Loading skeletons for async content
- SEO-friendly meta tags using react-helmet-async

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/modern-tech-blog.git
   cd modern-tech-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
/src
  /components
    /blog         # Blog-specific components
    /layout       # Layout components (Header, Footer)
    /utils        # Utility components
  /context        # React context providers
  /data           # Static data for blog posts
  /pages          # Page components
  App.tsx         # Main application component
  main.tsx        # Entry point
```

## Customization

### Adding New Blog Posts

To add new blog posts, edit the `src/data/posts.ts` file and add a new entry to the `posts` array.

### Changing Theme Colors

The theme colors can be customized in the `tailwind.config.js` file.

### Adding New Pages

1. Create a new page component in the `src/pages` directory
2. Add a new route in `App.tsx`

## Deployment

This project can be deployed to any static site hosting service like Vercel, Netlify, or GitHub Pages.

### Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React.js
- TypeScript
- React Router
- Tailwind CSS
- React Markdown
- React Syntax Highlighter
- Lucide React (for icons)
- React Helmet Async
- Date-fns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
# Modern Tech Blog (2024)

A modern, performant tech blog built with React and TypeScript featuring neo-minimalist design, AI-powered recommendations, and advanced animation systems.

## Design Philosophy

### Visual Language
- **Neo-Minimalist Tech Theme**
  - Clean geometric shapes with gradient overlays
  - Dynamic grid layouts with calculated whitespace
  - Cyber-accent color palette (#00E0FF, #1A1A1A)
  - Micro-interactions and scroll-driven animations

### Typography System
- Primary: Inter (UI) - `.font-sans`
- Monospace: JetBrains Mono (Code) - `.font-mono`
- Fluid type scale (clamp-based responsive sizing)

### Color System
- Background: Dark (#1A1A1A) / Light (#FFFFFF)
- Primary: Cyber Cyan (#00E0FF)
- Accent: Electric Purple (#9D00FF)
- Semantic colors for statuses and interactions

## Features

### Enhanced Core Features
- **Intelligent Search**
  - Real-time type-ahead suggestions
  - Search history and trending queries
  - Keyboard navigation support

- **Content Discovery**
  - AI-powered article recommendations
  - Interactive topic exploration
  - Dynamic content filtering

- **Visual Enhancements**
  - 3D card transformations
  - Parallax scrolling effects
  - Progressive image loading
  - WebGL background particles

### Performance Metrics
- Lighthouse Score: 95+ across all categories
- Core Web Vitals
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

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

3. Set up environment variables:
   Create a `.env` file in the root of the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5001/api
   VITE_UPLOADS_URL=http://localhost:5001/uploads
   
   # Optional: Unsplash API key for fetching random images
   # Without this key, the app will use a fallback method to generate placeholder images
   # Get a free API key at https://unsplash.com/developers
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Architecture

```
/src
  /design-system      # Shared design tokens and components
    /foundations      # Colors, typography, spacing
    /components      # Base UI components
    /animations      # Animation utilities
  /features          # Feature-based modules
    /blog
    /search
    /auth
  /lib               # Shared utilities
    /hooks
    /helpers
    /animations
  /pages             # Page components
  /services          # API and external services
```

## Design System

### Component Architecture
- Atomic Design methodology
- Compound components for complex UI
- Reusable animation hooks
- Responsive mixins

### Animation System
- Scroll-driven animations
- Micro-interactions
- Page transitions
- Reduced motion support

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader optimized
- Reduced motion support

## Performance Optimization

### Implementation
- Dynamic imports for route splitting
- Image optimization pipeline
- Critical CSS extraction
- Service Worker caching

### Monitoring
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error boundary logging
- Performance budgets

## SEO Strategy

### Technical Implementation
- Server-side rendering support
- Structured data (JSON-LD)
- Dynamic meta tags
- XML sitemap generation

### Content Strategy
- Rich snippets optimization
- Social media preview cards
- Content hierarchies
- URL structure optimization

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
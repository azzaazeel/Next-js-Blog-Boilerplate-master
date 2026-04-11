# Project Analysis Report: Next.js Blog Boilerplate

## 1. Project Overview
This is a **Next.js Blog Boilerplate** developed to provide a fast, SEO-friendly Static Site Generator (SSG) platform. It follows strict optimization rules to ensure maximum performance (Lighthouse scores). The project is pre-configured with TypeScript, Tailwind CSS, and rigorous linting tools.

## 2. Core Tech Stack
The project is built on a modern stack focused on Developer Experience (DX) and publishing performance:
- **Main Framework:** Next.js (v12.0.10) using the traditional Pages Router model.
- **Language:** TypeScript.
- **Content Processing (Markdown):** 
  - `gray-matter`: Parses front-matter variables.
  - `remark`: Handles Markdown structure parsing.
  - `rehype`: Converts Markdown to HTML with Prism syntax highlighting.
- **SEO & Analytics:** `next-seo` for Open Graph and JSON-LD metadata.
- **Development Tools:** ESLint (Airbnb config), Prettier, Husky.

## 3. Directory Structure
- `_posts/`: Markdown content for blog posts.
- `public/`: Static assets (images, favicons, data).
- `src/`: Main source code.
  - `blog/`: UI components for post lists.
  - `content/`: Layout logic for blog content.
  - `layout/`: Global header, footer, and meta SEO.
  - `navigation/`: Navigation components.
  - `pages/`: Static and dynamic routes.
  - `styles/`: Base CSS and Tailwind integrations.
  - `templates/`: Global layout wrappers.
  - `utils/`: Helpers for app config, content fetching, and charts.

## 4. Key Design Patterns
### 4.1. CMS-less Architecture
Follows a "Static First" philosophy. Content is stored as system files, requiring no external database or API calls at runtime.
- **Build-time SSG:** Combines `getStaticProps` with local file system access.
- **Unified Ecosystem:** Converts Markdown AST to optimized HTML.

### 4.2. Automation & Standards
- **Production Build:** Standardized process for cleaning cache, analyzing bundles, and exporting static HTML.
- **Git Hooks:** Enforces formatting and type-checking before commits.

## 5. Summary
The architecture is designed for speed and maintainability, providing a solid foundation for data-heavy financial blogs like **Kanocs**.

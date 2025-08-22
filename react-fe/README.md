# Personal Portfolio Website

A clean, minimal, and modern personal portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- **Clean & Modern Design**: Whitespace-rich layout with excellent typography and visual hierarchy
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Smooth Navigation**: Sticky header with smooth scrolling between sections
- **Interactive Contact Form**: Form validation with console logging (ready for backend integration)
- **Easy Customization**: Well-structured components with placeholder data
- **Performance Optimized**: Built with Vite for fast development and production builds

## Sections

- **About**: Introduction, skills, and professional background
- **Projects**: Showcase of selected work with descriptions and links
- **Contact**: Contact form and social media links

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Customization

### Personal Information

Update the following files with your information:

1. **Header Component** (`src/components/Header.tsx`):
   - Change "John Doe" to your name

2. **About Section** (`src/components/About.tsx`):
   - Update name, title, and description
   - Modify skills array
   - Edit personal bio

3. **Projects Section** (`src/components/Projects.tsx`):
   - Replace projects array with your own projects
   - Update titles, descriptions, links, and tags

4. **Contact Section** (`src/components/Contact.tsx`):
   - Update email address and social media links

### Styling

The website uses Tailwind CSS for styling. To modify the design:

- Colors can be adjusted in the Tailwind classes
- Spacing and typography can be modified in individual components
- The main color scheme uses neutral grays for a professional look

### Content Structure

```
src/
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── About.tsx       # About section
│   ├── Projects.tsx    # Projects showcase
│   └── Contact.tsx     # Contact form and info
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build and deploy:
```bash
npm run build
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to [Netlify's deploy page](https://app.netlify.com/drop)

Or use Netlify CLI:
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

---

Feel free to customize this portfolio to match your personal brand and showcase your unique skills and projects!
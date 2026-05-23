<p align="center">
  <img src="public/favicon.svg" alt="Portfolio Logo" width="60" height="60" />
</p>

<h1 align="center">Ahmed's Portfolio</h1>

<p align="center">
  <strong>Full-Stack Developer & IT Systems Engineer</strong>
</p>

<p align="center">
  A dual-mode portfolio that transforms between a clean professional experience and an immersive science-themed universe — built to make an unforgettable impression.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <a href="https://your-domain.com">
    <img src="https://img.shields.io/badge/Live_Demo-00D4FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<br />

---

<br />

## Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/professional-mode.png" alt="Professional Mode" />
      <br />
      <strong>Professional Mode</strong>
      <br />
      <sub>Clean, recruiter-ready design with dark/light theme</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/immersive-mode.png" alt="Immersive SINGULARITY Mode" />
      <br />
      <strong>Immersive SINGULARITY Mode</strong>
      <br />
      <sub>Science-themed universe with particles, DNA helix, orbital projects</sub>
    </td>
  </tr>
</table>

> **Note:** To add screenshots, create a `docs/screenshots/` folder and place `professional-mode.png` and `immersive-mode.png` images there. Recommended size: 1280x800.

<br />

## About the Project

This portfolio is not just another developer portfolio — it is a **dual-mode experience** packaged inside a single React application.

**Mode 1 — Professional:** A polished, premium design with dark/light theme toggle, smooth scroll animations, and a clean layout that puts content first. This is what recruiters, hiring managers, and clients see when they land on the site.

**Mode 2 — Immersive SINGULARITY:** A science-fiction-themed experience activated by clicking "Enter the Universe." A full-screen transition animation launches the user into a cosmos where skills become periodic table elements, projects orbit as planets, experience unfolds as a spacetime timeline, and certifications form constellations in a star field. All heavy assets (particles, canvas animations, GSAP timelines) are lazy-loaded — zero cost until activated.

**Built for:** Developers, engineers, and IT professionals who want a portfolio that demonstrates technical depth while remaining accessible and professional. The dual-mode concept itself is a portfolio piece — it shows architectural thinking, performance awareness, and creative execution.

<br />

## Features

### Professional Mode

- Dark / light theme toggle with system preference detection
- Smooth scroll-based entrance animations on every section
- Animated SVG timeline with scroll-driven line drawing
- Skill cards with animated progress bars and category grouping
- Project grid with category filters and hover overlays
- Flip-card certifications with front/back design
- Floating-label contact form with Firebase message storage
- Animated success state with SVG checkmark
- Availability badge, social links, and CV download
- Magnetic hover effect on interactive elements
- Fully responsive from 320px to 4K

### Immersive SINGULARITY Mode

- Full-screen Big Bang transition animation (void > loading > reveal)
- tsparticles neural network background with grab/repulse interactivity
- Letter-by-letter name assembly with GSAP stagger
- Quantum state typewriter with role labels (|dev>, |eng>, |sys>)
- Animated DNA double helix (Canvas 2D) with scroll-driven rotation
- Word-by-word bio reveal on scroll
- Genomic data readout stat cards
- Periodic table skills with electron shell flip animations
- Orbital project system with CSS orbit animations
- Click-to-expand project modals
- Spacetime fabric background with CSS perspective grid warp
- GSAP ScrollTrigger curved light-speed travel path
- Space station cards with light-year date formatting
- Star constellation certifications with scroll-revealed connection lines
- Star twinkle animations (pure CSS, zero runtime cost)
- "Exit Universe" button always accessible (fixed, z-100)
- Mobile fallbacks: card grids replace orbit/constellation views

### Admin Panel

- Firebase Auth email/password protection
- Dashboard with live Firestore stats (projects, certs, messages, unread)
- Project CRUD with image upload to Firebase Storage (5MB limit)
- Certification CRUD with badge image upload
- Message viewer with split-pane layout and read/unread tracking
- Auto mark-as-read, reply via mailto, delete with confirmation
- Terminal/dark aesthetic — always dark, never follows theme toggle
- Responsive sidebar with mobile overlay

<br />

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | [React 19](https://react.dev) | Component architecture, hooks, lazy loading |
| Build Tool | [Vite 8](https://vite.dev) | Dev server, HMR, production bundling |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com) | Utility-first CSS, responsive design, dark mode |
| Animation | [Framer Motion 12](https://www.framer.com/motion/) | Entrance animations, layout transitions, gestures |
| Animation | [GSAP 3.15](https://gsap.com) + ScrollTrigger | Scroll-driven timelines, SVG path drawing |
| Backend | [Firebase 12](https://firebase.google.com) | Firestore (data), Auth (admin), Storage (images) |
| Routing | [React Router 7](https://reactrouter.com) | Client-side routing, protected routes |
| Particles | [tsparticles 2.12](https://particles.js.org) | Neural network particle background (lazy loaded) |
| Forms | [React Hook Form 7](https://react-hook-form.com) | Form state, validation, submission |
| Icons | [React Icons 5](https://react-icons.github.io/react-icons/) | Icon library (Font Awesome, Heroicons, Simple Icons) |
| Scroll | [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer) | Viewport detection, triggerOnce animations |
| Numbers | [React CountUp](https://github.com/glennreyes/react-countup) | Animated number counting |
| CSS Processing | [PostCSS](https://postcss.org) + [Autoprefixer](https://github.com/postcss/autoprefixer) | CSS transforms, vendor prefixes |
| Linting | [ESLint 10](https://eslint.org) | Code quality, React hooks rules |
| Fonts | Google Fonts | Syne (headings), Inter (body), JetBrains Mono (code) |

<br />

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.0 or higher |
| npm | 9.0 or higher |
| Firebase Account | Free tier (Spark plan) works |

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase credentials (see [Environment Variables](#environment-variables) below).

### 4. Start Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

<br />

## Environment Variables

Create a `.env` file in the project root with the following keys:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console > Project Settings > General > Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | Firebase Console > Project Settings > General > `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Project ID | Firebase Console > Project Settings > General > Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | Firebase Console > Project Settings > General > `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Console > Project Settings > Cloud Messaging > Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID | Firebase Console > Project Settings > General > App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics ID (optional) | Firebase Console > Project Settings > General > Measurement ID |

```env
# .env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Important:** Never commit your `.env` file. It is already included in `.gitignore`.

<br />

## Firebase Setup Guide

### Step 1: Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name your project (e.g., `my-portfolio`)
4. Disable Google Analytics if you don't need it (or enable for tracking)
5. Click **Create project**

### Step 2: Register a Web App

1. In the Firebase Console, click the **Web** icon (`</>`)
2. Register your app with a nickname (e.g., `portfolio-web`)
3. Copy the `firebaseConfig` object — these are your environment variables

### Step 3: Enable Firestore

1. Go to **Build > Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose a region closest to your audience
5. Apply these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to projects and certifications
    match /projects/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /certifications/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Messages: anyone can create, only admin can read/update/delete
    match /messages/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### Step 4: Enable Authentication

1. Go to **Build > Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider
4. Go to the **Users** tab
5. Click **Add user** and create your admin account (e.g., `admin@yourdomain.com`)

### Step 5: Enable Storage

1. Go to **Build > Storage**
2. Click **Get started**
3. Select **Start in production mode**
4. Apply these security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read, authenticated write
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

<br />

## Deployment

### Build for Production

```bash
npm run build
```

This generates an optimised `dist/` folder ready for deployment.

### Preview Locally

```bash
npm run preview
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set the **Framework Preset** to `Vite`
4. Add all environment variables from your `.env` file:
   - Go to **Settings > Environment Variables**
   - Add each `VITE_FIREBASE_*` key-value pair
5. Click **Deploy**
6. After deployment, update `index.html` OG meta tags with your live URL

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialise hosting
firebase init hosting
# - Select your Firebase project
# - Set public directory to: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: No (or Yes for CI/CD)

# Deploy
firebase deploy --only hosting
```

### Connect Firebase to Production

After deploying, add your production domain to Firebase:

1. **Authentication:** Go to **Authentication > Settings > Authorized domains** and add your domain
2. **Firestore:** No changes needed (rules are domain-agnostic)
3. **Storage:** CORS is handled automatically by Firebase

<br />

## Admin Panel

### Accessing the Panel

Navigate to `https://your-domain.com/admin` and log in with the Firebase Auth credentials you created during setup.

### Creating an Admin Account

1. Go to **Firebase Console > Authentication > Users**
2. Click **Add user**
3. Enter an email and a strong password
4. This account will have full CRUD access to the admin panel

### Managing Content

| Section | Capabilities |
|---------|-------------|
| **Dashboard** | View live counts of projects, certifications, messages, and unread messages |
| **Projects** | Create, edit, and delete projects. Upload project images (max 5MB). Manage tags, URLs, and featured status |
| **Certifications** | Create, edit, and delete certifications. Upload badge images. Assign categories (cloud, dev, security, IT) |
| **Messages** | View contact form submissions. Messages auto-mark as read when opened. Reply via email, toggle read status, or delete |

<br />

## Folder Structure

```
portfolio/
├── public/                          # Static assets served at root
│   ├── favicon.svg                  # SVG favicon
│   ├── icons.svg                    # SVG icon sprite
│   └── site.webmanifest             # PWA manifest
│
├── docs/
│   └── screenshots/                 # README screenshot images
│
├── src/
│   ├── main.jsx                     # App entry point, BrowserRouter wrapper
│   ├── App.jsx                      # Root component, route definitions, provider nesting
│   │
│   ├── assets/                      # Bundled static assets (images, SVGs)
│   │   └── hero.png
│   │
│   ├── context/                     # React Context providers
│   │   ├── ThemeContext.jsx          # Dark/light theme with localStorage persistence
│   │   └── ModeContext.jsx           # Professional/Immersive mode with transition state machine
│   │
│   ├── data/
│   │   └── portfolioData.js         # Static fallback data (projects, skills, experience, certs)
│   │
│   ├── firebase/                    # Firebase service layer
│   │   ├── config.js                # Firebase app initialisation from env vars
│   │   ├── firestore.js             # Firestore CRUD + domain helpers (all try/catch wrapped)
│   │   ├── auth.js                  # Firebase Auth login/logout/listener
│   │   └── storage.js               # Firebase Storage upload/delete
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useTheme.js              # Theme context consumer hook
│   │   ├── useScrollSpy.js          # Active section detection for navbar
│   │   └── useCountUp.js            # Animated number counting hook
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── Home.jsx                 # Renders Professional or Immersive mode based on context
│   │   ├── Admin.jsx                # Protected admin shell with sidebar navigation
│   │   └── NotFound.jsx             # Cosmic-themed 404 page
│   │
│   ├── styles/
│   │   └── globals.css              # Tailwind directives, CSS custom properties, global utilities
│   │
│   └── components/
│       ├── layout/                  # App-wide layout components
│       │   ├── Navbar.jsx           # Responsive navbar with theme toggle, mode switch, scroll spy
│       │   └── Footer.jsx           # Site footer with social links
│       │
│       ├── ui/                      # Shared UI components
│       │   ├── ParticleBackground.jsx  # CSS particle background (professional mode)
│       │   └── NeuralParticles.jsx     # tsparticles neural network (immersive mode, lazy)
│       │
│       ├── sections/
│       │   ├── professional/        # Professional mode sections
│       │   │   ├── Hero.jsx         # Landing hero with typewriter, stats, magnetic buttons
│       │   │   ├── About.jsx        # Bio, profile image, discipline cards
│       │   │   ├── Skills.jsx       # Categorised skill cards with progress bars
│       │   │   ├── Projects.jsx     # Filterable project grid with hover overlays
│       │   │   ├── Experience.jsx   # Animated SVG timeline with scroll-drawn line
│       │   │   ├── Certifications.jsx  # Flip-card certifications with Firebase data
│       │   │   └── Contact.jsx      # Contact form + info panel with floating labels
│       │   │
│       │   └── immersive/           # Immersive SINGULARITY mode sections
│       │       ├── ImmersiveHero.jsx          # Big Bang entrance, particles, quantum typewriter
│       │       ├── ImmersiveAbout.jsx         # DNA double helix canvas, word-by-word bio reveal
│       │       ├── ImmersiveSkills.jsx        # Periodic table element cards with electron shells
│       │       ├── ImmersiveProjects.jsx      # Orbital planet system, click-to-expand modals
│       │       ├── ImmersiveExperience.jsx    # Spacetime timeline, GSAP scroll-drawn path
│       │       ├── ImmersiveCertifications.jsx  # Star constellation with scroll-revealed connections
│       │       └── ImmersiveContact.jsx       # Immersive-styled contact form
│       │
│       ├── immersive/               # Immersive mode infrastructure
│       │   ├── ImmersiveShell.jsx   # Cosmic background, exit button, Suspense wrapper
│       │   └── TransitionOverlay.jsx  # 3-phase mode transition (void > loading > reveal)
│       │
│       └── admin/                   # Admin panel components
│           ├── Login.jsx            # Terminal-styled login with Firebase Auth
│           ├── Dashboard.jsx        # Live stat cards from Firestore
│           ├── ProjectManager.jsx   # Project CRUD with image upload
│           ├── CertManager.jsx      # Certification CRUD with badge upload
│           └── MessageViewer.jsx    # Split-pane message reader with read tracking
│
├── index.html                       # HTML entry point with SEO meta, OG tags, font preconnects
├── vite.config.js                   # Vite config with path aliases, manual chunks, dev server
├── tailwind.config.js               # Tailwind config with custom theme, fonts, colors, screens
├── postcss.config.js                # PostCSS config (Tailwind + Autoprefixer)
├── eslint.config.js                 # ESLint config with React hooks plugin
├── package.json                     # Dependencies, scripts, project metadata
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

<br />

## Performance

### Lazy Loading Strategy

| Asset | Strategy | Initial Cost |
|-------|----------|-------------|
| Professional sections (7) | `React.lazy()` with Suspense | Loaded on first paint (code-split per section) |
| Immersive Shell + sections (7) | `React.lazy()` with Suspense | Zero — only loaded when "Enter the Universe" is clicked |
| tsparticles (neural network) | Lazy import inside ImmersiveHero | Zero — never touches the main bundle |
| Admin panel (5 components) | `React.lazy()` via `/admin` route | Zero — only loaded when navigating to `/admin` |
| Firebase Storage images | Browser-native lazy loading | Loaded on demand |

### Bundle Analysis

| Chunk | Size (gzip) | Contents |
|-------|-------------|----------|
| `vendor` | ~71 KB | React, React DOM, React Router |
| `animations` | ~91 KB | Framer Motion, GSAP, ScrollTrigger |
| `firebase` | ~113 KB | Firebase Firestore, Auth, Storage |
| `index` (app shell) | ~18 KB | App, contexts, navbar, footer |
| Section chunks | 1.5–4.1 KB each | Individual page sections |

### Lighthouse Score Targets

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

> Run `npx lighthouse https://your-domain.com --view` after deployment to verify.

<br />

## Customisation

| What to Change | File to Edit |
|----------------|-------------|
| Name, bio, email, social links, stats | `src/data/portfolioData.js` > `personalInfo` and `stats` |
| Projects | `src/data/portfolioData.js` > `projects` |
| Work experience | `src/data/portfolioData.js` > `experience` |
| Certifications | `src/data/portfolioData.js` > `certifications` |
| Skills and proficiency levels | `src/data/portfolioData.js` > `skills` |
| Theme colours (primary, accents, backgrounds) | `src/styles/globals.css` > CSS custom properties |
| Favicon and app icons | `public/` directory |
| OG image for social sharing | `public/og-image.png` (1200x630 recommended) |
| SEO meta tags and page title | `index.html` |
| Domain URLs in OG tags | `index.html` > `og:url`, `twitter:url` |

<br />

## License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it.

<br />

## Author

**Ahmed**

Full-Stack Developer & IT Systems Engineer

<p>
  <a href="https://github.com/yourusername">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/yourusername">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://your-domain.com">
    <img src="https://img.shields.io/badge/Portfolio-00D4FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
</p>

---

<p align="center">
  <sub>Built with precision and deployed with confidence.</sub>
</p>

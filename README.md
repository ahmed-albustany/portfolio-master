# :shield: Ahmed Albustany — Command Center Portfolio

> A military-grade IT command center portfolio built with React, Firebase, and Framer Motion. Dark mode only. No compromises.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12.13-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40-0055FF?style=flat-square&logo=framer&logoColor=white)](https://motion.dev)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://portfolio-master-kohl.vercel.app)

<p align="center">
  <img src="docs/screenshots/hero-preview.png" alt="Command Center Preview" width="800" />
</p>

---

## About The Project

This is not a typical developer portfolio. It's a fully operational **Command Center** — a dark, immersive interface inspired by military operations dashboards and sci-fi terminals.

Every section is designed as a department within a command center: Systems Administration, Network Operations, Database Management, Security & Surveillance, and IT Helpdesk. Content is structured as mission logs, deployment histories, and clearance files — not generic cards and timelines.

### What Makes It Unique

- **7 IT department sections** — each with its own data model and visual identity
- **Dual mode experience** — Professional mode for recruiters, Deep System mode for the curious
- **Full CMS admin panel** — manage all content from a protected dashboard, zero code changes needed
- **100% dynamic content** — every piece of text, stat, and project comes from Firebase Firestore
- **Dark mode only** — a deliberate design decision for a consistent, premium command center aesthetic

---

## Features

### Professional Mode

| Feature | Description |
|---------|-------------|
| Boot Sequence Hero | Animated typing effect with operator status readout and live metrics |
| Operator Profile | ID card-style about section with personal data and availability badge |
| Tech Arsenal | Skills displayed as proficiency bars with category grouping |
| Mission Log | Projects rendered as classified mission entries with status indicators |
| Deployment History | Experience shown as a scroll-animated timeline |
| Systems Administration | Server infrastructure, endpoint management, and tooling records |
| Network Administration | LAN/WAN configurations, protocols, and equipment inventories |
| Database Administration | Database systems, query operations, and scaling achievements |
| Security & Surveillance | CCTV systems, access control, and monitoring infrastructure |
| IT Helpdesk & Support | Ticket resolution stats, hardware/software support scope |
| Clearances & Credentials | Certifications displayed as flip cards with verification links |
| Open Channel | Contact form with Firebase message storage and admin inbox |

### Deep System Mode

| Feature | Description |
|---------|-------------|
| Activation Sequence | Boot animation with glitch effects, access text, and "ACCESS GRANTED" flash |
| Matrix Rain | Canvas-rendered digital rain with Japanese characters and hex codes |
| RGB Glitch Name | Animated text with cyan-green and blue chromatic aberration shifts |
| Terminal Window UI | All sections wrapped in terminal-style containers with traffic light dots |
| Skill Scan | Skills rendered as `LOADING...` progress bars with color-coded levels |
| Deployment Listing | Experience as `ls -la ./deployments` with Unix directory permissions |
| Clearance Files | Certifications as `cat ./clearances.txt` file readout with VERIFIED status |
| Mission Log | Projects as expandable terminal entries with status badges |
| CRT Effects | Scanline overlay and circuit grid for authentic terminal feel |

### Admin Panel

| Manager | Collection | Capabilities |
|---------|-----------|--------------|
| Dashboard | — | Overview hub with navigation to all managers |
| Personal Info | `personalInfo` | Name, title, bio, social links, resume URL |
| Stats | `stats` | Projects count, years, users, certifications, systems, tickets |
| Projects | `projects` | Full CRUD with tech stack, links, status, mission numbers |
| Experience | `experience` | Roles, achievements, technologies, department tagging |
| Skills | `skills` | Name, proficiency level (0-100), category, years of experience |
| SysAdmin | `sysadmin` | Infrastructure scope, tools, tasks, achievements |
| Network | `network` | Network type, scale, protocols, equipment |
| Database | `database` | DB systems, query types, tools, scale |
| Security | `security` | System type, camera count, coverage areas, improvements |
| Helpdesk | `helpdesk` | Ticket volume, support scope, OS/hardware/software lists |
| Certifications | `certifications` | Issuer, credential ID, verification URL, category |
| Messages | `messages` | Inbox with read/unread status, reply via email |

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 19.2 | Component-based UI with hooks and lazy loading |
| **Build Tool** | Vite 8.0 | Lightning-fast dev server and optimized bundler |
| **Backend** | Firebase 12.13 | Firestore database, Authentication, Storage |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Animation** | Framer Motion 12.40 | Declarative animations, layout transitions, gestures |
| **Animation** | GSAP 3.15 | High-performance scroll-driven animations |
| **Routing** | React Router 7.15 | Client-side routing with protected routes |
| **Forms** | React Hook Form 7.76 | Performant form state and validation |
| **Icons** | React Icons 5.6 | Font Awesome, Heroicons, Simple Icons |
| **Counters** | React CountUp 6.5 | Animated number counting for statistics |
| **Observers** | React Intersection Observer 10.0 | Viewport-triggered scroll animations |
| **Particles** | tsParticles 2.12 | Neural network particle background |
| **Linting** | ESLint 10.3 | Code quality with React hooks rules |
| **CSS** | PostCSS + Autoprefixer | CSS processing and vendor prefixes |
| **Fonts** | Google Fonts | Syne (headings), Inter (body), JetBrains Mono (code) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** or **yarn**
- **Firebase account** ([console](https://console.firebase.google.com))
- **Git**

### Installation

```bash
git clone https://github.com/ahmed-albustany/portfolio-master.git
cd portfolio-master
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Important:** Never commit your `.env` file. It is already included in `.gitignore`.

### Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Firebase Setup Guide

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** and name it (e.g., `command-center-portfolio`)
3. Disable Google Analytics unless needed
4. Click **Create project**

### Step 2: Register a Web App

1. In the Firebase Console, click the **Web** icon (`</>`)
2. Register with a nickname (e.g., `portfolio-web`)
3. Copy the config values into your `.env` file

### Step 3: Enable Firestore Database

1. Go to **Build > Firestore Database**
2. Click **Create database** in production mode
3. Choose a region closest to your audience

### Step 4: Enable Authentication

1. Go to **Build > Authentication > Sign-in method**
2. Enable **Email/Password**
3. Go to **Users** tab and click **Add user** to create your admin account

### Step 5: Copy Config to `.env`

Go to **Project Settings > General > Your apps > Web app** and copy each config value to the matching `VITE_FIREBASE_*` variable.

### Step 6: Deploy Security Rules

In **Firestore Database > Rules**, paste the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Public read access for portfolio content
    match /personalInfo/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /stats/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /projects/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /experience/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /skills/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /sysadmin/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /network/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /database/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /security/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /helpdesk/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /certifications/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Messages: anyone can create, only admin can read/update/delete
    match /messages/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

---

## Firestore Collections

### Singletons

<details>
<summary><code>personalInfo/main</code> — Operator profile data</summary>

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name |
| `title` | string | Job title |
| `subtitle` | string | Extended title |
| `email` | string | Contact email |
| `location` | string | City, Country |
| `availability` | string | Availability status text |
| `bio` | string | Bio paragraph |
| `socialLinks` | map | `{ github, linkedin }` |
| `resumeUrl` | string | Resume file path or URL |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>stats/main</code> — Dashboard metrics</summary>

| Field | Type | Description |
|-------|------|-------------|
| `projects` | number | Total projects completed |
| `years` | number | Years active |
| `users` | number | Users managed |
| `certifications` | number | Total certifications |
| `systems` | number | Systems deployed |
| `tickets` | number | Tickets resolved |
| `updatedAt` | timestamp | Last update |

</details>

### Collections

<details>
<summary><code>projects</code> — Mission log entries</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project name |
| `category` | string | Type (web, mobile, etc.) |
| `status` | string | completed / in-progress / pending |
| `description` | string | Short description |
| `fullDescription` | string | Detailed description |
| `imageURL` | string | Preview image URL |
| `techStack` | array | Technologies used |
| `liveDemo` | string | Live demo URL |
| `github` | string | Repository URL |
| `impact` | string | Impact statement |
| `missionNumber` | string | Mission ID (e.g., MSN-001) |
| `problemSolved` | string | Problem description |
| `featured` | boolean | Featured flag |
| `order` | number | Sort order |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>experience</code> — Deployment history</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Role / position |
| `organization` | string | Company name |
| `duration` | string | Date range (e.g., "2023 - Present") |
| `type` | string | Full-time / Part-time / Contract |
| `department` | string | Department category |
| `description` | string | Role description |
| `achievements` | array | Key achievements |
| `technologies` | array | Technologies used |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>skills</code> — Tech arsenal</summary>

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill name |
| `level` | number | Proficiency 0-100 |
| `category` | string | Category (development, infrastructure, etc.) |
| `icon` | string | React icon component name |
| `yearsUsed` | string | Years of experience |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>sysadmin</code> — Systems administration</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | System / project name |
| `organization` | string | Company |
| `role` | string | Position held |
| `duration` | string | Time period |
| `scope` | string | Scale (e.g., "50+ endpoints") |
| `description` | string | Overview |
| `tools` | array | Tools and platforms |
| `tasks` | array | Regular tasks |
| `achievements` | array | Key results |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>network</code> — Network administration</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Network / project name |
| `organization` | string | Company |
| `networkType` | string | LAN / WAN / etc. |
| `scale` | string | Size (e.g., "200+ nodes") |
| `duration` | string | Time period |
| `description` | string | Overview |
| `protocols` | array | Protocols used |
| `equipment` | array | Hardware deployed |
| `responsibilities` | array | Key duties |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>database</code> — Database administration</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Database / project name |
| `organization` | string | Company |
| `dbSystem` | string | MySQL, PostgreSQL, etc. |
| `scale` | string | Data size (e.g., "10GB+") |
| `duration` | string | Time period |
| `description` | string | Overview |
| `queryTypes` | array | CRUD, Joins, Aggregation, etc. |
| `tools` | array | Management tools |
| `tasks` | array | Regular operations |
| `achievements` | array | Key results |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>security</code> — Security & surveillance</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | System name |
| `organization` | string | Company |
| `systemType` | string | CCTV / Access Control / etc. |
| `scale` | string | Camera / device count |
| `duration` | string | Time period |
| `software` | string | Monitoring software |
| `hardware` | string | Hardware platform |
| `coverageAreas` | array | Monitored zones |
| `responsibilities` | array | Key duties |
| `improvements` | array | Upgrades made |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>helpdesk</code> — IT helpdesk & support</summary>

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Role / service name |
| `organization` | string | Company |
| `duration` | string | Time period |
| `avgTicketsResolved` | string | Monthly ticket volume |
| `supportScope` | string | User base size |
| `hardwareSupported` | array | Hardware types |
| `softwareSupported` | array | Software platforms |
| `osSupported` | array | Operating systems |
| `tools` | array | Support tools |
| `achievements` | array | Key results |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>certifications</code> — Clearances & credentials</summary>

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Certification name |
| `issuer` | string | Issuing organization |
| `date` | string | Date issued |
| `credentialID` | string | Credential identifier |
| `verifyURL` | string | Verification link |
| `category` | string | it / cloud / security / development |
| `imageURL` | string | Badge image URL |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update |

</details>

<details>
<summary><code>messages</code> — Contact form inbox</summary>

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Sender name |
| `email` | string | Sender email |
| `subject` | string | Message subject |
| `message` | string | Message body |
| `read` | boolean | Read status |
| `createdAt` | timestamp | Submission time |

</details>

---

## Admin Panel Guide

### Access

Navigate to `https://your-domain.com/admin` and sign in with your Firebase Auth credentials.

### Creating an Admin Account

1. Go to **Firebase Console > Authentication > Users**
2. Click **Add user**
3. Enter an email and a strong password
4. This account will have full CRUD access to the admin panel

### Managing Content

Every section of the portfolio is managed through its own dedicated panel:

1. **Dashboard** — Quick overview and navigation to all managers
2. **Personal Info** — Update name, title, bio, social links, and resume URL
3. **Stats** — Set metrics displayed on the hero section
4. **Projects** — Create, edit, and delete projects with tech stacks, links, and status
5. **Experience** — Manage work history entries with achievements and technologies
6. **Skills** — Add skills with proficiency levels (0-100) and categories
7. **Department Sections** — SysAdmin, Network, Database, Security, and Helpdesk each have dedicated CRUD managers
8. **Certifications** — Add certifications with credential IDs and verification links
9. **Messages** — Read contact form submissions, mark as read, or delete

All changes are reflected on the live site immediately — no code changes or redeployments needed.

---

## Deployment Guide

### Deploy to Vercel

1. Push your repository to GitHub:

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and click **Import Project**

3. Select your GitHub repository

4. Add environment variables in **Settings > Environment Variables**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

5. Click **Deploy**

### Auto-Deploy

Every push to the `main` branch automatically triggers a new deployment on Vercel. No manual steps required.

---

## Folder Structure

```
src/
├── App.jsx                           # Root component with routing
├── main.jsx                          # Entry point with providers
│
├── components/
│   ├── admin/                        # Admin panel components
│   │   ├── Dashboard.jsx             # Admin overview hub
│   │   ├── Login.jsx                 # Firebase auth login
│   │   ├── PersonalInfoManager.jsx   # Profile editor
│   │   ├── StatsManager.jsx          # Metrics editor
│   │   ├── ProjectManager.jsx        # Projects CRUD
│   │   ├── ExperienceManager.jsx     # Experience CRUD
│   │   ├── SkillsManager.jsx         # Skills CRUD
│   │   ├── SysAdminManager.jsx       # SysAdmin CRUD
│   │   ├── NetworkManager.jsx        # Network CRUD
│   │   ├── DatabaseManager.jsx       # Database CRUD
│   │   ├── SecurityManager.jsx       # Security CRUD
│   │   ├── HelpdeskManager.jsx       # Helpdesk CRUD
│   │   ├── CertManager.jsx           # Certifications CRUD
│   │   └── MessageViewer.jsx         # Messages inbox
│   │
│   ├── layout/                       # Layout components
│   │   ├── Navbar.jsx                # Navigation with systems dropdown
│   │   ├── Footer.jsx                # Site footer
│   │   └── PageLoader.jsx            # Full-page loading state
│   │
│   ├── sections/
│   │   ├── professional/             # Professional mode sections
│   │   │   ├── Hero.jsx              # Boot sequence hero
│   │   │   ├── About.jsx             # Operator profile
│   │   │   ├── Skills.jsx            # Tech arsenal
│   │   │   ├── Projects.jsx          # Mission log
│   │   │   ├── Experience.jsx        # Deployment history
│   │   │   ├── SysAdmin.jsx          # Systems administration
│   │   │   ├── Network.jsx           # Network administration
│   │   │   ├── Database.jsx          # Database administration
│   │   │   ├── Security.jsx          # Security & surveillance
│   │   │   ├── Helpdesk.jsx          # IT helpdesk & support
│   │   │   ├── Certifications.jsx    # Clearances & credentials
│   │   │   └── Contact.jsx           # Contact form
│   │   │
│   │   └── deepsystem/               # Deep System mode sections
│   │       ├── DeepSystemShell.jsx    # Shell with matrix rain & scanlines
│   │       ├── DeepHero.jsx           # Terminal-style profile
│   │       ├── DeepSkills.jsx         # Loading bar skill readouts
│   │       ├── DeepExperience.jsx     # Directory listing experience
│   │       ├── DeepCertifications.jsx # File readout certifications
│   │       └── DeepProjects.jsx       # Mission log terminal
│   │
│   └── ui/                           # Reusable UI components
│       ├── CircuitBackground.jsx      # Circuit board SVG pattern
│       ├── DepartmentCard.jsx         # Department section card
│       ├── EmptyState.jsx             # Empty data placeholder
│       ├── SkeletonLoader.jsx         # Loading skeleton
│       ├── StatCard.jsx               # Metric display card
│       └── StatusBadge.jsx            # Status indicator badge
│
├── context/
│   ├── ModeContext.jsx               # Professional / Deep System mode state
│   └── ThemeContext.jsx              # Dark theme provider
│
├── hooks/
│   ├── useFirestore.js               # Firestore data fetching with fallbacks
│   ├── useScrollSpy.js               # Intersection Observer scroll tracking
│   ├── useCountUp.js                 # Animated counter hook
│   └── useTheme.js                   # Theme context consumer
│
├── pages/
│   ├── Home.jsx                      # Main portfolio page
│   ├── Admin.jsx                     # Admin panel with sidebar nav
│   └── NotFound.jsx                  # 404 page
│
├── data/
│   ├── fallbackData.js               # Offline fallback data for all collections
│   └── portfolioData.js              # Static portfolio configuration
│
├── firebase/
│   ├── config.js                     # Firebase initialization from env vars
│   ├── auth.js                       # Authentication helpers
│   ├── firestore.js                  # Firestore CRUD for all 12 collections
│   └── storage.js                    # Firebase Storage helpers
│
└── styles/
    └── globals.css                   # CSS variables, components, animations
```

---

## Portfolio Sections

| # | Section | ID | Data Source | Description |
|---|---------|-----|-----------|-------------|
| 1 | Hero | `hero` | `personalInfo`, `stats` | Boot sequence with typing animation and live metrics |
| 2 | Operator Profile | `about` | `personalInfo` | ID card-style about section |
| 3 | Tech Arsenal | `skills` | `skills` | Proficiency bars with category grouping |
| 4 | Mission Log | `projects` | `projects` | Classified mission entries with status indicators |
| 5 | Deployment History | `experience` | `experience` | Scroll-animated timeline |
| 6 | Systems Administration | `sysadmin` | `sysadmin` | Server infrastructure records |
| 7 | Network Administration | `network` | `network` | Network infrastructure entries |
| 8 | Database Administration | `database` | `database` | Database management records |
| 9 | Security & Surveillance | `security` | `security` | CCTV and monitoring systems |
| 10 | IT Helpdesk & Support | `helpdesk` | `helpdesk` | Ticket operations and support scope |
| 11 | Clearances & Credentials | `certifications` | `certifications` | Flip-card certifications with verification |
| 12 | Open Channel | `contact` | `messages` | Contact form with Firebase storage |

---

## Performance

| Optimization | Implementation |
|-------------|---------------|
| **Code Splitting** | `React.lazy()` on all sections and admin components |
| **Route Splitting** | Admin panel loaded only on `/admin` route |
| **Deep System Lazy Loading** | Entire Deep System shell and 5 sections loaded on demand |
| **Vendor Chunking** | Vite splits React, Framer Motion/GSAP, and Firebase into separate chunks |
| **Intersection Observer** | Animations trigger only when sections enter viewport |
| **Firestore Caching** | `useFirestore` hook with fallback data for instant rendering |
| **Single Theme** | Dark mode only — no runtime style recalculation or theme switching |
| **Target Lighthouse** | 90+ Performance, 95+ Accessibility, 95+ Best Practices, 100 SEO |

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/professional-hero.png" alt="Professional Mode — Hero" width="700" />
  <br/><em>Professional Mode — Boot Sequence Hero</em>
</p>

<p align="center">
  <img src="docs/screenshots/deep-system.png" alt="Deep System Mode" width="700" />
  <br/><em>Deep System Mode — Matrix Terminal</em>
</p>

<p align="center">
  <img src="docs/screenshots/admin-panel.png" alt="Admin Panel" width="700" />
  <br/><em>Admin Panel — Content Management</em>
</p>

<p align="center">
  <img src="docs/screenshots/mobile-view.png" alt="Mobile View" width="350" />
  <br/><em>Mobile Responsive View</em>
</p>

> **Note:** To add screenshots, create a `docs/screenshots/` folder and place your images there. Recommended size: 1280x800.

---

## Author

**Ahmed Albustany**
IT Officer & Full-Stack Developer | Amman, Jordan

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-master-kohl.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ahmed-albustany-65a66027b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ahmed-albustany)
[![Email](https://img.shields.io/badge/Email-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)](mailto:ahmed.albustany@outlook.com)

---

## License

Distributed under the MIT License.

```
MIT License

Copyright (c) 2025 Ahmed Albustany

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Built with precision. Deployed with confidence.<br/>
  <strong>Command Center Portfolio</strong> — Ahmed Albustany
</p>

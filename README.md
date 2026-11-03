<div align="center">

# 📷 DS Photography & Films

### *Luxury Editorial Photography, Fine Art Cinematography & Studio Portfolio Platform*

[![Live Website](https://img.shields.io/badge/Live_Website-dishantshelarphotography.in-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://www.dishantshelarphotography.in/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<p align="center">
  A bespoke, high-performance full-stack web application and content management ecosystem engineered for <strong>DS Photography & Films</strong> — led by Mumbai-based photographer <strong>Dishant Shelar</strong>. Blends editorial aesthetics, cinematic micro-interactions, and 100/100 Core Web Vitals performance with an enterprise administrative console.
</p>

[Live Website](https://www.dishantshelarphotography.in/) •
[Key Features](#-key-features) •
[Performance & Core Web Vitals](#-performance--core-web-vitals) •
[Technology Stack](#-technology-stack) •
[Project Architecture](#-project-architecture) •
[Quick Start](#-quick-start-guide) •
[Environment Configuration](#-environment-configuration) •
[API Reference](#-api-endpoints-reference)

---

</div>

## 🌟 Executive Overview

**DS Photography & Films** is a modern full-stack web platform built for lead photographer **Dishant Shelar**, capturing weddings, editorial portraits, pre-wedding films, milestone events, and commercial brand commissions across **Mumbai, Thane, Navi Mumbai, Pune, Nashik, Alibaug, Lonavala, and throughout Maharashtra**.

Unlike static portfolios, this production system integrates:
1. **Cinematic Public Experience**: Responsive editorial showcase featuring Lenis smooth inertial scrolling, accessible letter-assembly typography animations, 3D hero carousel, interactive commission brief builder, and SEO landing architecture.
2. **Robust Backend API**: Secure Node.js/Express 5 RESTful API backed by MongoDB Atlas, Cloudinary CDN, Nodemailer email notifications, and dynamic Maharashtra geocoding.
3. **Admin Management Console (`/admin`)**: Real-time content control to upload high-resolution media, organize categories, adjust service packages, and manage client inquiries without touching code.

---

## ✨ Key Features

### 🎨 Public Editorial Experience
* **Cinematic First Impression**: Editorial splash screen and fluid entrance transitions orchestrated with Framer Motion and GSAP.
* **Hero Spotlight Showcase**: Interactive multi-slide reel with smooth pagination, responsive WebP delivery, and deterministic preloading for near-instant Largest Contentful Paint (LCP).
* **Accessible Letter-Assembly Typography**: Elegant split-text typography animations built with complete screen-reader compatibility (semantic HTML, `.sr-only` text preservation, and `aria-hidden` decorative spans).
* **Lenis Smooth Inertial Scrolling**: Fluid smooth scrolling integrated directly with GSAP ScrollTrigger for frictionless reading and parallax transitions.
* **Curated Collections Gallery**: Multi-category portfolio browsing (Weddings, Pre-Weddings, Portraits, Events, Commercial) with high-resolution lightbox preview.
* **Interactive Commission & Booking Brief**: Dynamic multi-stage client inquiry flow:
  * Stage 1: Collection & Package selection with feature comparison modal.
  * Stage 2: Client contact details (`AboutYouStep`).
  * Stage 3: Event details, date picker, and duration (`YourEventStep`).
  * Stage 4: Interactive budget selector and vision specification (`YourVisionStep`).
  * Location Search: Dynamic Maharashtra location search and geocoding recommendation engine.
  * Real-Time Dispatch: Dual submission options via instant WhatsApp dispatch or direct database inquiry pipeline with Nodemailer alerts.
* **Dedicated Regional SEO Architecture**: Targeted landing page (`/photographer-in-mumbai`) optimized for local search intent across Mumbai and Maharashtra, complete with Schema.org JSON-LD microdata, Open Graph tags, and structured FAQs.
* **Brand Values & Atelier Disciplines**: 5-point studio philosophy showcase featuring hover-expanded narratives, off-white/ivory editorial styling, and photographer reservation card.

### 🛡️ Admin Management Console (`/admin`)
* **Secure Session-Based Authentication**: Strict JWT-signed HTTP-only cookie authentication with bcrypt password hashing and automatic environment synchronization.
* **Cloudinary Media Vault**: Upload, tag, categorize, inspect, and delete high-resolution photography and video assets directly synced to Cloudinary CDN.
* **Category Architecture**: Dynamic portfolio category management with custom slugs, descriptions, and cover imagery.
* **Service Tier Customizer**: Modify studio pricing, deliverables, turnaround times, and drag-and-drop sequence order in real time.
* **Client Inquiries Pipeline**: Centralized administrative dashboard to review inbound client leads, event dates, requested budgets, and contact records.
* **Automated Startup Verification**: On server start, automatically validates the database connection and securely provisions the admin credentials from environment variables.

### 🔒 Enterprise Security Hardening
* **Helmet Security Headers**: Strict HTTP headers including HSTS, X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), and Referrer-Policy.
* **Input Sanitization & NoSQL Defense**: Custom middleware stripping malicious HTML/script tags (XSS protection) and blocking MongoDB operator injection (`$gt`, `$ne`, `$regex`).
* **Layered Rate Limiting**:
  * Global API Limiter: 100 requests per 15-minute window per IP.
  * Strict Authentication Limiter: 5 attempts per 15-minute window to eliminate brute-force attack vectors.
* **Malformed JSON Trapping**: Body-parser interceptor returning clean 400 Bad Request responses on invalid JSON syntax.
* **Strict CORS Whitelist**: Fine-grained cross-origin access control validating against production domains (`dishantshelarphotography.in`, Vercel previews, and local dev).

---

## ⚡ Performance & Core Web Vitals

The application is engineered to achieve optimal Google PageSpeed Insights benchmarks across both desktop and mobile:

| Metric | Target | Optimization Strategy |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | `< 2.5s` | Critical hero image preloaded via `<link rel="preload">` using deterministic static WebP matching exact viewport breakpoints; below-the-fold assets deferred. |
| **FCP** (First Contentful Paint) | `< 1.2s` | Non-blocking CSS injection (`media="print" onload="this.media='all'"`), system font fallbacks, and compressed splash screen. |
| **CLS** (Cumulative Layout Shift) | `0.000` | Explicit aspect ratios and dimensions reserved for all images, banners, and typography containers. |
| **TBT / INP** (Total Blocking Time / INP) | `< 100ms` | Granular vendor chunk splitting in Vite (`vendor-react`, `vendor-motion`, `vendor-gsap`, `vendor-lenis`), slashing initial JavaScript payload by over 66%. |
| **Accessibility** | `100 / 100` | Full compliance with WCAG standards; letter assembly animations preserve continuous screen-reader text via `.sr-only` and isolate decorative letters with `aria-hidden="true"`. |
| **Asset Caching** | `1 Year` | Static assets, media, and fonts served with `Cache-Control: public, max-age=31536000, immutable` via Vercel edge configuration. |

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19.2, Vite 8.3 | High-performance client SPA with instant Hot Module Replacement (HMR) |
| **Styling & Design** | Tailwind CSS v4.3, Lucide React | Modern utility-first styling with typography styling and iconography |
| **Animations & Smooth Scroll** | Framer Motion 13, GSAP 3, Lenis 1.3 | Inertial smooth scrolling, timeline transitions, and split-text reveals |
| **Routing & Architecture** | React Router DOM v7, React Context | Declarative client routing and lightweight authentication state |
| **Backend API** | Node.js, Express 5.2 | Scalable RESTful API with modular MVC architecture |
| **Database & ODM** | MongoDB Atlas, Mongoose 9.1 | Schematized data storage with automated indexing and validation hooks |
| **Cloud Media Storage** | Cloudinary, Multer, Sharp | Asset storage, WebP compression, transformations, and global CDN delivery |
| **Email Dispatch** | Nodemailer | Automated transactional email notifications on inbound inquiries |
| **Security & Auth** | JWT, Bcrypt.js, Helmet, Express Rate Limit | Cookie authentication, password hashing, and attack mitigation |
| **Edge Deployment** | Vercel Edge Network | Global edge delivery, immutable static caching, and rewrite routing |

---

## 📂 Project Architecture

```plaintext
DS PORTFOLIO/
├── backend/                        # Express 5 RESTful API
│   ├── config/                     # Database & Admin startup configuration
│   │   ├── db.js                   # Mongoose MongoDB Atlas connection
│   │   └── initAdmin.js            # Automated admin user sync & bcrypt hashing
│   ├── controllers/                # Request handling business logic
│   │   ├── admin.controller.js     # Auth, JWT session, and credential verification
│   │   ├── category.controller.js  # Category CRUD & cover images
│   │   ├── inquiry.controller.js   # Inquiry pipeline & Nodemailer dispatch
│   │   ├── location.controller.js  # Dynamic Maharashtra location suggestions
│   │   ├── media.controller.js     # Cloudinary media lifecycle
│   │   ├── service.controller.js   # Service packages, inclusions, & reordering
│   │   └── upload.controller.js    # Single/batch file upload processing
│   ├── middlewares/                # Custom Express middlewares
│   │   ├── auth.middleware.js      # JWT verification & protected route guard
│   │   ├── error.middleware.js     # Centralized error handler & status mapper
│   │   ├── multer.middleware.js    # Multer multipart file upload handling
│   │   ├── rateLimiter.middleware.js # Global & Auth brute-force rate limiters
│   │   └── sanitize.middleware.js  # NoSQL injection & XSS defense
│   ├── models/                     # Mongoose Schemas
│   │   ├── admin.model.js          # Admin credentials & metadata
│   │   ├── category.model.js       # Portfolio category definitions
│   │   ├── inquiry.model.js        # Inbound client leads & booking briefs
│   │   ├── media.model.js          # Image/video assets & Cloudinary metadata
│   │   └── service.model.js        # Service tiers, pricing, & deliverables
│   ├── routes/                     # Modular API route definitions
│   │   ├── admin.route.js
│   │   ├── category.route.js
│   │   ├── health.route.js
│   │   ├── inquiry.route.js
│   │   ├── location.route.js
│   │   ├── media.route.js
│   │   ├── service.route.js
│   │   └── upload.route.js
│   ├── utils/                      # Helper classes (ApiError, ApiResponse, Cloudinary, Email)
│   ├── server.js                   # Express application entrypoint
│   └── package.json
│
├── frontend/                       # React 19 + Vite Single Page Application
│   ├── public/                     # Static WebP imagery, logos, and SEO robots.txt
│   ├── src/
│   │   ├── assets/                 # Brand assets & static imagery
│   │   ├── components/             # Reusable modular UI components
│   │   │   ├── common/             # LetterAssembly, RandomReveal, SplashScreen, ErrorBoundary
│   │   │   ├── home/               # HeroCarousel, EditorialShowcase, BrandPhilosophy, FAQ
│   │   │   ├── layout/             # Navigation Bar & Studio Footer
│   │   │   └── modals/             # Client Inquiry & Booking Modal
│   │   ├── pages/                  # Page Views & Routes
│   │   │   ├── about/              # Lead Photographer Bio & Artistic Vision
│   │   │   ├── admin/              # Complete Admin Portal (Login, Dashboard, Media, Services)
│   │   │   ├── collections/        # Categorized Portfolio Gallery with Lightbox
│   │   │   ├── error/              # 404 Not Found & Centralized Error Views
│   │   │   ├── home/               # Studio Landing Page
│   │   │   ├── landing/            # Targeted SEO Landing (/photographer-in-mumbai)
│   │   │   ├── services/           # Interactive Booking Brief & Package Comparison
│   │   │   └── terms/              # Studio Terms & Privacy Policies
│   │   ├── utils/                  # SEO config, image helpers, and location services
│   │   ├── App.jsx                 # Route composition, Lenis smooth scrolling, & layouts
│   │   ├── main.jsx                # React DOM root entrypoint
│   │   └── index.css               # Tailwind CSS v4 styling & typography
│   ├── vite.config.js              # Vite server, chunk splitting, & non-blocking CSS
│   ├── vercel.json                 # Frontend deployment configuration
│   └── package.json
│
├── vercel.json                     # Root Vercel Edge configuration (redirects, rewrites, headers)
├── .gitignore                      # Git ignore rules
└── README.md                       # Studio documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher (`Node 20+` LTS recommended)
* **npm**: `v9.0.0` or higher
* **MongoDB**: A free MongoDB Atlas cluster connection string or local MongoDB instance
* **Cloudinary Account**: Cloud name, API Key, and API Secret for media asset hosting

---

### 1. Clone the Repository
```bash
git clone https://github.com/ashutosh607/DS-PORTFOLIO.git
cd DS-PORTFOLIO
```

---

### 2. Configure Backend Environment
Navigate to the `backend` directory and create a `.env` file:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development

# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net
DB_NAME=ds_portfolio

# Security & Authentication (minimum 32 random characters)
JWT_SECRET=your_super_secret_jwt_random_key_min_32_chars

# Administrator Initial Credentials (synced to MongoDB on startup)
ADMIN_EMAIL=admin@dishantshelarphotography.in
ADMIN_PASSWORD=YourSecureAdminPassword123!

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS & Frontend Origins
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Optional: Automated Email Notifications (Nodemailer)
STUDIO_RECIPIENT_EMAIL=dishantshelar59@gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
```

Install backend dependencies and start the development server:
```bash
npm install
npm run dev
```
> The API will be available at: `http://localhost:5000`  
> Health check endpoint: `http://localhost:5000/api/v1/health`

---

### 3. Configure Frontend Environment
In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` as needed:
```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000

# Optional: Google Maps JavaScript API Key (for Location Picker)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Public Contact Details
VITE_STUDIO_EMAIL=dishantshelar59@gmail.com
VITE_WHATSAPP_PHONE=919082378510

# Production Canonical Site Domain
VITE_SITE_URL=https://www.dishantshelarphotography.in
```

Install frontend dependencies and start the Vite development server:
```bash
npm install
npm run dev
```
> The application will launch at: `http://localhost:5173`  
> Requests to `/api/*` and `/uploads/*` are automatically proxied to `http://localhost:5000` via Vite.

---

## ⚙️ Environment Configuration

### Backend Variables (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `production` |
| `MONGODB_URI` | MongoDB Atlas or local MongoDB connection URI | `mongodb+srv://user:pass@cluster.net` |
| `DB_NAME` | Target database collection name | `ds_portfolio` |
| `JWT_SECRET` | Secret key for signing JWT auth tokens | `random_32_char_secret_key` |
| `ADMIN_EMAIL` | Default administrator account email | `admin@dishantshelarphotography.in` |
| `ADMIN_PASSWORD` | Administrator initial password (auto-hashed with bcrypt) | `StrongPassword@2026` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud instance identifier | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret | `abcdef123456...` |
| `FRONTEND_URL` | Canonical frontend domain for CORS | `https://www.dishantshelarphotography.in` |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins | `http://localhost:5173,https://...` |
| `STUDIO_RECIPIENT_EMAIL`| Destination inbox for new booking briefs | `dishantshelar59@gmail.com` |
| `EMAIL_USER` | Gmail / SMTP sender email address | `sender@gmail.com` |
| `EMAIL_PASS` | Gmail 16-character App Password | `xxxx xxxx xxxx xxxx` |
| `GLOBAL_RATE_LIMIT_MAX`| Max requests per 15 min per IP | `100` |
| `AUTH_RATE_LIMIT_MAX` | Max login attempts per 15 min per IP | `5` |

### Frontend Variables (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API URL (proxied locally, direct in production) | `http://localhost:5000` |
| `VITE_GOOGLE_MAPS_API_KEY` | API key for Google Maps integration (optional) | *Studio API Key* |
| `VITE_STUDIO_EMAIL` | Public studio inquiry email address | `dishantshelar59@gmail.com` |
| `VITE_WHATSAPP_PHONE` | Studio WhatsApp number for direct booking chat | `919082378510` |
| `VITE_SITE_URL` | Canonical production website URL for SEO & Open Graph | `https://www.dishantshelarphotography.in` |

---

## 📡 API Endpoints Reference

### 🏥 Health & System
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Welcome banner and API index |
| `GET` | `/api/v1/health` | Public | System uptime, timestamp, and health verification |

### 🔐 Admin Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Public (Rate Limited) | Authenticate admin, sets secure HTTP-only JWT cookie |
| `POST` | `/api/admin/logout` | Public | Clear admin session cookie |
| `GET` | `/api/admin/me` | Protected | Verify active admin session & return admin profile |

### 🖼️ Media Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/media` | Public | Retrieve all published media items |
| `GET` | `/api/media/:category`| Public | Retrieve media items filtered by category slug |
| `POST` | `/api/media` | Protected (Admin) | Upload new media asset with metadata to Cloudinary |
| `PUT` | `/api/media/:id` | Protected (Admin) | Update media item title, description, or file |
| `DELETE`| `/api/media/:id` | Protected (Admin) | Delete media asset from MongoDB and Cloudinary |

### 📁 Category Architecture
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Fetch all available portfolio categories |
| `POST` | `/api/categories` | Protected (Admin) | Create a new gallery category with cover photo |
| `PUT` | `/api/categories/:id`| Protected (Admin) | Update category details or cover photo |
| `DELETE`| `/api/categories/:id`| Protected (Admin) | Remove a portfolio category |

### 💼 Services & Tiers
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | Fetch all service tiers (supports `?category=` filter) |
| `GET` | `/api/services/:id` | Public | Get detailed service tier information |
| `POST` | `/api/services` | Protected (Admin) | Add a new studio service package |
| `PUT` | `/api/services/:id` | Protected (Admin) | Update pricing, inclusions, or package cover |
| `PATCH`| `/api/services/reorder`| Protected (Admin)| Reorder display sequence of services |
| `DELETE`| `/api/services/:id` | Protected (Admin) | Delete a service tier |

### 📬 Client Inquiries & Booking Briefs
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/inquiries` | Public | Submit new booking inquiry & dispatch email notification |
| `GET` | `/api/inquiries` | Protected (Admin) | Review all client leads and consultation briefs |

### 📍 Maharashtra Location Search
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/locations/search?q=:query` | Public | Search locations across Mumbai & Maharashtra with suggestions |

---

## 📜 Available NPM Scripts

### Backend (`/backend`)
```bash
npm run dev      # Start backend in development mode with nodemon hot-reload
npm start        # Launch production Node.js server (node server.js)
```

### Frontend (`/frontend`)
```bash
npm run dev      # Start Vite development server with HMR
npm run build    # Compile optimized production bundle to /dist
npm run preview  # Locally preview the production build
npm run lint     # Run Oxlint high-performance linter
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
The project includes a root `vercel.json` and a `frontend/vercel.json` preconfigured for Vercel:
1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Root Directory: `frontend` (or project root with automated build command `cd frontend && npm install && npm run build`).
3. Output Directory: `dist` (or `frontend/dist`).
4. Set Environment Variables in Vercel Dashboard:
   - `VITE_API_URL` (points to your deployed backend, e.g., `https://ds-portfolio-api.onrender.com`)
   - `VITE_SITE_URL`: `https://www.dishantshelarphotography.in`
   - `VITE_WHATSAPP_PHONE`: `919082378510`
   - `VITE_STUDIO_EMAIL`: `dishantshelar59@gmail.com`
   - `VITE_GOOGLE_MAPS_API_KEY`: *(your Google Maps API key)*

### Backend Deployment (Render, Railway, or VPS)
1. Set the root directory to `backend`.
2. Build Command: `npm install`.
3. Start Command: `npm start`.
4. Configure all environment variables from `backend/.env` into your hosting dashboard.
5. Ensure `FRONTEND_URL` and `CORS_ORIGIN` include `https://www.dishantshelarphotography.in` and your Vercel preview domains.

---

## 📄 License & Attribution

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).  
Crafted with passion for **DS Photography & Films** by **Dishant Shelar**.

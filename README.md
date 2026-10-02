<div align="center">

# 📷 DS Photography & Films

### *Luxury Editorial Photography, Fine Art Cinematography & Portfolio Management System*

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<p align="center">
  A bespoke, full-stack digital showcase and content management platform tailored for high-end photography studios, cinematographers, and visual artists. Combines cinematic client presentation with an enterprise-grade administrative suite.
</p>

[Explore Features](#-key-features) •
[Tech Stack](#-technology-stack) •
[Architecture](#-project-architecture) •
[Quick Start](#-quick-start-guide) •
[Environment Variables](#-environment-configuration) •
[API Reference](#-api-endpoints-reference)

---

</div>

## 🌟 Executive Overview

**DS Photography & Films** is a modern full-stack web application designed to present fine art editorial photography, commercial cinematography monographs, and architectural spatial documentation with uncompromising visual aesthetics. 

Unlike basic static portfolios, this system is backed by a secure **Node.js/Express REST API**, **MongoDB Atlas**, and a dedicated **Admin Management Console**. Studio owners can effortlessly upload high-resolution media, curate categorized collections, adjust service tiers, and manage inbound client inquiries in real time without touching source code.

---

## ✨ Key Features

### 🎨 Public Editorial Experience
* **Cinematic First Impression**: Editorial splash introduction screen and seamless page transition orchestration built with **Framer Motion** and **GSAP**.
* **Curated Collections Gallery**: Dynamic category browsing (Editorial, Portraits, Commercial, Cinematic Monograph) with responsive grid layouts and image focus modal view.
* **Hero Spotlight Showcase**: Interactive spotlight reel spotlighting select works with smooth pagination and caption animations.
* **Beskpoke Service Offerings**: Interactive pricing and service tier breakdowns with direct call-to-action booking prompts.
* **Client Inquiry Modal**: Direct client booking and consultation form that immediately transmits leads into the database.
* **Typography & Aesthetics**: Thoughtfully paired typography (*Cormorant Garamond*, *Plus Jakarta Sans*, and *Caveat* cursive accents) complemented by glassmorphism and dark editorial themes.
* **Mobile-First Responsiveness**: Handcrafted layouts optimized across mobile, tablet, widescreen desktop displays, and high-DPI screens.

### 🛡️ Admin Management Console (`/admin`)
* **Secure Session-Based Authentication**: Strict JWT-signed HTTP-only cookie authentication with bcrypt password hashing and automatic environment synchronization.
* **Media Vault Management**: Upload, update, categorize, tag, and purge high-resolution photography and video assets directly integrated with Cloudinary CDN.
* **Category Architecture**: Create and maintain custom gallery portfolios with custom slugs, descriptions, and cover imagery.
* **Service Tier Customizer**: Dynamically modify studio pricing tiers, deliverables, turnaround times, and order positioning.
* **Client Inquiries Pipeline**: Centralized dashboard to view incoming client consultation requests, contact information, project details, and timestamps.
* **Automated Admin Initialization**: Automatic database verification and password synchronization on server startup from environment variables.

### 🔒 Enterprise Security Hardening
* **Helmet Protection**: Automatic HTTP security headers (HSTS, X-Content-Type-Options, Frameguard).
* **Cross-Site Scripting (XSS) Sanitization**: Input sanitization striping malicious HTML/script tags from payloads.
* **NoSQL Injection Defense**: Sanitization middleware rejecting structured MongoDB operator injections (`$gt`, `$ne`, etc.).
* **Layered Rate Limiting**:
  * Global API Limiter: 100 requests / 15-minute window.
  * Strict Authentication Limiter: 5 attempts / 15-minute window to eliminate brute-force attack vectors.
* **Strict Payload Throttling**: Strict 100 KB payload limit to mitigate denial-of-service (DoS) memory floods.
* **CORS Origin Whitelist**: Fine-grained cross-origin access control with whitelist validation.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite 8 | Fast React client with Hot Module Replacement (HMR) |
| **Styling & Design** | Tailwind CSS v4, Lucide React | Modern utility-first styling and iconography |
| **Animations** | Framer Motion 13, GSAP 3 | Cinematic page transitions, micro-interactions, and carousels |
| **State & Routing** | React Router DOM v7, Redux Toolkit | Client-side routing and unified state management |
| **Backend API** | Node.js, Express 5.x | RESTful API with modular MVC architecture |
| **Database & ODM** | MongoDB Atlas, Mongoose 9.x | Schematized data storage with validation hooks |
| **Cloud Media Storage** | Cloudinary, Multer | Media upload processing, optimization, and global CDN delivery |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Rate Limit | Cookie authentication, password hashing, and attack mitigation |
| **Network & Utilities** | Axios, Cookie-Parser, Dotenv | Client HTTP requests, cookie parsing, and environment loading |

---

## 📂 Project Architecture

```plaintext
DS PORTFOLIO/
├── backend/                        # Express 5 RESTful API
│   ├── config/                     # Database & Admin startup configuration
│   │   ├── db.js                   # Mongoose MongoDB connection
│   │   └── initAdmin.js            # Automated admin user sync & hashing
│   ├── controllers/                # Request handling business logic
│   │   ├── admin.controller.js     # Auth & session logic
│   │   ├── category.controller.js  # Category CRUD operations
│   │   ├── inquiry.controller.js   # Inquiry pipeline
│   │   ├── media.controller.js     # Media asset lifecycle
│   │   ├── service.controller.js   # Service packages & reordering
│   │   └── upload.controller.js    # Direct image upload pipelines
│   ├── middlewares/                # Custom Express middlewares
│   │   ├── auth.middleware.js      # JWT authentication guard
│   │   ├── error.middleware.js     # Centralized error handler
│   │   ├── multer.middleware.js    # File upload handling
│   │   ├── rateLimiter.middleware.js # Global & Auth rate limiters
│   │   └── sanitize.middleware.js  # NoSQL injection & XSS defense
│   ├── models/                     # Mongoose Schemas
│   │   ├── admin.model.js
│   │   ├── category.model.js
│   │   ├── inquiry.model.js
│   │   ├── media.model.js
│   │   └── service.model.js
│   ├── routes/                     # Modular API Route definitions
│   ├── utils/                      # Helper classes (ApiError, ApiResponse, Cloudinary)
│   ├── server.js                   # Express application entrypoint
│   └── package.json
│
├── frontend/                       # React 19 + Vite Single Page Application
│   ├── public/                     # Static assets, logos, and favicon
│   ├── src/
│   │   ├── assets/                 # Brand assets & images
│   │   ├── components/             # Reusable modular UI components
│   │   │   ├── common/             # Error Boundary, Splash Screen, Page Transitions
│   │   │   ├── home/               # Hero Carousel, Editorial Showcase, About section
│   │   │   ├── layout/             # Navigation Bar & Studio Footer
│   │   │   └── modals/             # Client Inquiry & Booking Modal
│   │   ├── pages/                  # Page Views & Routes
│   │   │   ├── admin/              # Complete Admin Portal (Login, Dashboard, Media, Services)
│   │   │   ├── collections/        # Portfolio Gallery by category
│   │   │   ├── error/              # 404 Not Found & Error pages
│   │   │   ├── home/               # Studio Landing Page
│   │   │   ├── services/           # Studio Services & Packages
│   │   │   └── terms/              # Studio Terms & Policies
│   │   ├── App.jsx                 # Route composition & global providers
│   │   ├── main.jsx                # React DOM root entrypoint
│   │   └── index.css               # Global theme & typography rules
│   ├── vite.config.js              # Vite server & API proxy configuration
│   └── package.json
│
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
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
Navigate to the `backend` folder and create a `.env` file from the example:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
DB_NAME=ds_portfolio

# Security
JWT_SECRET=your_super_secret_jwt_random_key_min_32_chars

# Admin Initialization Credentials
ADMIN_EMAIL=admin@dsphotography.com
ADMIN_PASSWORD=YourSecureAdminPassword123!

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

Install backend dependencies and run the server:
```bash
npm install
npm run dev
```
> The API will be available at: `http://localhost:5000`  
> Health check endpoint: `http://localhost:5000/api/v1/health`

---

### 3. Configure Frontend Environment
In a new terminal window, navigate to the `frontend` folder:
```bash
cd ../frontend
```

Ensure `frontend/.env` is configured (optional Google Maps API key if required):
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Install frontend dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
> The application will launch at: `http://localhost:5173`  
> Requests to `/api/*` are automatically proxied to `http://localhost:5000` via Vite.

---

## ⚙️ Environment Configuration

### Backend Variables (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB Atlas or local MongoDB connection URI | `mongodb+srv://user:pass@cluster.net` |
| `DB_NAME` | Target database collection name | `ds_portfolio` |
| `JWT_SECRET` | Secret key for signing JWT auth tokens | `random_32_char_secret_key` |
| `ADMIN_EMAIL` | Default administrator account email | `admin@dsphotography.com` |
| `ADMIN_PASSWORD` | Administrator initial password (auto-hashed) | `StrongPassword@2026` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud instance identifier | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret | `abcdef123456...` |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins | `http://localhost:5173` |
| `GLOBAL_RATE_LIMIT_MAX`| Max requests per 15 min per IP | `100` |
| `AUTH_RATE_LIMIT_MAX` | Max login attempts per 15 min per IP | `5` |

### Frontend Variables (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_GOOGLE_MAPS_API_KEY` | API key for Google Maps integration (optional) | *Studio API Key* |

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
| `POST` | `/api/admin/login` | Public (Rate Limited) | Authenticate admin, sets HTTP-only JWT cookie |
| `POST` | `/api/admin/logout` | Public | Clear admin session cookie |
| `GET` | `/api/admin/me` | Protected | Verify active admin session & return admin profile |

### 🖼️ Media Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/media` | Public | Retrieve all published media items |
| `GET` | `/api/media/:category`| Public | Retrieve media items by category slug |
| `POST` | `/api/media` | Protected (Admin) | Upload new image/video asset with metadata |
| `PUT` | `/api/media/:id` | Protected (Admin) | Update media item title, description, or file |
| `DELETE`| `/api/media/:id` | Protected (Admin) | Delete media item from DB and Cloudinary |

### 📁 Category Architecture
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Fetch all available portfolio categories |
| `POST` | `/api/categories` | Protected (Admin) | Create a new gallery category with cover image |
| `PUT` | `/api/categories/:id`| Protected (Admin) | Update category details or cover photo |
| `DELETE`| `/api/categories/:id`| Protected (Admin) | Remove a portfolio category |

### 💼 Services & Tiers
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | Fetch all service tiers (supports `?category=` filter) |
| `GET` | `/api/services/:id` | Public | Get detailed service tier information |
| `POST` | `/api/services` | Protected (Admin) | Add a new studio service package |
| `PUT` | `/api/services/:id` | Protected (Admin) | Update pricing, features, or package cover |
| `PATCH`| `/api/services/reorder`| Protected (Admin)| Reorder display sequence of services |
| `DELETE`| `/api/services/:id` | Protected (Admin) | Delete a service tier |

### 📬 Client Inquiries
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/inquiries` | Public | Submit new booking / consultation inquiry |
| `GET` | `/api/inquiries` | Protected (Admin) | Review all customer inquiries and leads |

---

## 📜 Available NPM Scripts

### Backend (`/backend`)
```bash
npm run dev      # Start backend in development mode with nodemon hot-reload
npm start        # Launch production Node server (node server.js)
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

### Backend Deployment (Render, Railway, or VPS)
1. Set the root directory to `backend`.
2. Set Build Command: `npm install`.
3. Set Start Command: `npm start`.
4. Add all environment variables from `backend/.env` into your hosting provider's dashboard.
5. Ensure `CORS_ORIGIN` matches your production frontend URL (e.g. `https://your-portfolio.vercel.app`).

### Frontend Deployment (Vercel, Netlify, or Cloudflare Pages)
1. Set the root directory to `frontend`.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. If deploying independently of Vite's proxy, ensure your production API base URL points to your deployed backend URL.

---

## 📄 License & Attribution

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).  
Crafted with passion for editorial visual storytellers and fine art photographers.

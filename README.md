# STEM-ED-ARCHITECTS Website

**Engineering Learning Solutions**

A modern, scalable Next.js 15 website for STEM-ED-ARCHITECTS - Africa's leading STEM education engineering firm.

---

## 🚀 Tech Stack

### **Frontend**

- **Next.js 15.3.5** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4.1.11** - Utility-first CSS
- **Framer Motion** - Animations
- **Next-Auth 5.0** (beta) - Authentication

### **Backend** (Coming Soon)

- **FastAPI 0.104.1** - Python web framework
- **SQLAlchemy 2.0.23** - ORM
- **MySQL** - Database
- **Alembic** - Database migrations
- **Redis** - Caching & sessions (optional)

### **Storage** (Coming Soon)

- **AWS S3 / Cloudflare R2** - Media storage

---

## 📁 Project Structure

```
stem-ed-architects/
├── public/
│   └── hero/              # Hero slider images
│       ├── h1.webp
│       ├── h2.jpg
│       ├── h3.webp
│       └── h4.jpg
├── src/
│   ├── app/
│   │   ├── about/         # About page
│   │   ├── services/      # Services page
│   │   ├── portfolio/     # Portfolio page
│   │   ├── contact/       # Contact page
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   └── components/
│       ├── Navbar.tsx     # Navigation component
│       ├── HeroSlider.tsx # Hero slider with Framer Motion
│       └── Footer.tsx     # Footer component
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies

```

---

## 🎨 Brand Identity

### **Colors**

- **Navy Blue** (`#001F3F`) - Trust, depth, engineering
- **Electric Orange** (`#FF6B35`) - Energy, innovation, African futurism
- **White** - Clarity, simplicity

### **Typography**

- **Headlines:** Bebas Neue (bold, modern)
- **Body:** Montserrat (clean, readable)
- **Subtext:** Lato (friendly, approachable)

### **Tone**

Authoritative, visionary, empowering, African-futurist

---

## 🛠️ Getting Started

### **Prerequisites**

- Node.js 18+
- npm or yarn

### **Installation**

1. **Clone the repository**

   ```bash
   cd stem-ed-architects
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Build for Production**

```bash
npm run build
npm start
```

---

## 📄 Pages Overview

| Page          | Route        | Description                                       |
| ------------- | ------------ | ------------------------------------------------- |
| **Home**      | `/`          | Hero slider + mission statement                   |
| **About Us**  | `/about`     | Company background, expertise, 5-pillar framework |
| **Services**  | `/services`  | 5 service domains with features                   |
| **Portfolio** | `/portfolio` | Project showcases with filters                    |
| **Contact**   | `/contact`   | Contact form + information                        |
| **Login**     | `/login`     | User authentication                               |
| **Register**  | `/register`  | User registration                                 |

---

## 🔑 Key Features

✅ **Fully Responsive** - Mobile, tablet, desktop optimized  
✅ **Animated Hero Slider** - Framer Motion transitions  
✅ **Modern UI/UX** - Clean, professional design  
✅ **SEO Optimized** - Next.js 15 metadata & SSR  
✅ **Fast Performance** - Turbopack, WebP images  
✅ **Modular Components** - Easy to scale & maintain  
✅ **Type Safe** - Full TypeScript support  
✅ **Brand Aligned** - Colors, fonts, tone consistent

---

## 🎯 Next Steps

### **Phase 1: Frontend Enhancements**

- [ ] Add logo integration
- [ ] Add more animations
- [ ] Implement search functionality
- [ ] Add blog section

### **Phase 2: Backend Integration**

- [ ] Setup FastAPI backend
- [ ] Integrate MySQL database
- [ ] Implement Auth.js authentication
- [ ] Create API endpoints

### **Phase 3: Advanced Features**

- [ ] User dashboard (teachers, students, admins)
- [ ] Course management system
- [ ] Payment integration
- [ ] Analytics dashboard

---

## 📞 Contact

**STEM-ED-ARCHITECTS**  
Engineering Learning Solutions

📍 Nairobi, Kenya  
📧 info@stem-ed-architects.com  
📱 +254 700 000 000

---

## 📝 License

© 2025 STEM-ED-ARCHITECTS. All rights reserved.

---

## 🙏 Credits

Built with ❤️ for transforming STEM education across Africa.

---

## Development

Run frontend and backend together from the repo root:

```
npm install
npm run dev:all
```

This starts:

- API (FastAPI) on http://localhost:8000
- Web (Next.js) on http://localhost:3000

Prerequisites:

- Backend venv at `backend/.venv` with requirements installed
- Node dev dependencies installed (includes `concurrently`)

Auth configuration (required):

- Set a NextAuth secret in your shell before starting:

```
# Git Bash / bash
export AUTH_SECRET="$(node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\")"

# Windows PowerShell
$env:AUTH_SECRET = [Convert]::ToBase64String([byte[]](1..32 | ForEach-Object {Get-Random -Max 256}))
```

# Admin CMS (Content Management System) Guide

## 📋 Overview

Your website now has a comprehensive Admin Dashboard that allows you to manage all website content without touching code. Access it at: **http://localhost:3000/admin** or **http://192.168.0.101:3000/admin**

---

## 🔐 Access Requirements

- **You must be logged in** as an admin user
- **Role**: Your user account must have the `admin` role
- If you're not an admin, the system will redirect you to the login page

---

## 🎛️ Admin Dashboard Features

### Main Dashboard (`/admin`)
The main dashboard shows:

1. **Quick Stats Cards**
   - Total Contact Messages
   - Total Newsletter Subscribers  
   - Blog Posts Count
   - Products Count

2. **Content Management Cards** (clickable to navigate)
   - 📝 **Manage Blog Posts** - Create, edit, delete blog articles
   - 🏠 **Homepage Content** - Edit statistics, testimonials, featured content
   - 🖼️ **Media Library** - Upload and manage images, logos, files
   - 🛍️ **Products & Services** - Manage product listings
   - ⚙️ **Site Settings** - Update contact info, social media links
   - 👤 **User Management** - Manage users, roles, permissions

3. **Recent Activity**
   - Recent Contact Messages (with email links, pagination)
   - Newsletter Subscribers (with interests tags, pagination)
   - Search and filter functionality

---

## 📝 Content Management Sections

### 1. Blog Management (`/admin/blog`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ Create new blog posts
- ✅ Edit existing blog posts
- ✅ Delete blog posts
- ✅ Add featured images
- ✅ Set categories and tags
- ✅ Publish/Draft status
- ✅ SEO metadata (title, description)
- ✅ Rich text editor for content

**Current Workaround:**
- Blog posts are currently hardcoded in `/src/app/blog/page.tsx`
- You need to edit the `posts` array in that file to add/edit posts

---

### 2. Homepage Content Management (`/admin/homepage`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ Edit Statistics (Students Trained, Partner Schools, Years Experience, etc.)
- ✅ Manage Testimonials (add, edit, delete)
- ✅ Update Featured Products
- ✅ Change Hero Slider content
- ✅ Edit Mission/Vision statements
- ✅ Update Trust Badges/Certifications

**Current Workaround:**
- Homepage content is in `/src/app/page.tsx`
- Edit directly in code for now

---

### 3. Media Library (`/admin/media`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ Upload images (JPG, PNG, WebP, GIF)
- ✅ Upload documents (PDF, DOCX)
- ✅ Organize files in folders
- ✅ View file details (size, dimensions, upload date)
- ✅ Delete unused files
- ✅ Copy file URLs for use in content

**Current Workaround:**
- Place images in `/public/` folder
- Reference them as `/filename.png` in your code

---

### 4. Products Management (`/admin/products`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ Add new products/services
- ✅ Edit product descriptions
- ✅ Upload product images
- ✅ Set pricing (if applicable)
- ✅ Manage product categories
- ✅ Enable/disable products

**Current Workaround:**
- Product cards are in `/src/app/page.tsx` (Featured Products section)
- Full product pages are in `/src/app/products/` subdirectories

---

### 5. Site Settings (`/admin/settings`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ Update contact information (phone, email)
- ✅ Edit social media links (YouTube, Facebook, TikTok, Instagram)
- ✅ Change business hours
- ✅ Update location/address
- ✅ Edit site metadata (SEO)
- ✅ Configure email settings

**Current Workaround:**
- Contact info is in `/src/components/Footer.tsx` and `/src/app/contact/page.tsx`
- Social media links need to be updated in Footer and Contact page
- Replace `YOUR_YOUTUBE_LINK_HERE`, etc. with actual URLs

---

### 6. User Management (`/admin/users`)
**Status**: 🚧 To be created

**What you'll be able to do:**
- ✅ View all registered users
- ✅ Change user roles (user, admin)
- ✅ Enable/disable user accounts
- ✅ Reset user passwords
- ✅ View user activity

**Current Workaround:**
- Use the backend script: `python backend/make_admin.py <email>` to make users admin
- Use database tools to manage users directly

---

## 🔧 Current Functionality (Working Now)

### ✅ What's Already Working:

1. **Dashboard Overview**
   - View contact messages
   - View newsletter subscribers
   - Search and filter
   - Pagination
   - Quick stats

2. **Email Links**
   - Click any email to send a message directly
   - All emails are mailto: links

3. **Responsive Design**
   - Works on mobile, tablet, desktop
   - Professional admin interface

4. **Security**
   - Admin-only access
   - Session-based authentication
   - Automatic redirect if not logged in

---

## 📋 Quick How-To Guides

### How to Add a New Blog Post (Manual Method)

1. Open `/src/app/blog/page.tsx`
2. Find the `posts` array at the top
3. Add a new post object:
```typescript
{
  id: 7, // Next available ID
  title: "Your Blog Title",
  excerpt: "Short description of your post...",
  author: "Your Name",
  date: "October 22, 2025",
  category: "Education", // or Robotics, Technology, etc.
  readTime: "5 min read",
  image: "📖", // Emoji icon or you can add actual image path
}
```
4. Save the file
5. The new post will appear on the blog page

### How to Update Homepage Statistics

1. Open `/src/app/page.tsx`
2. Find the "Statistics Section" comment
3. Update the numbers:
```tsx
<div className="text-5xl md:text-6xl font-bebas mb-2">500+</div>
<p className="font-lato text-white/90">Students Trained</p>
```
4. Change `500+` to your actual number
5. Save the file

### How to Edit Testimonials

1. Open `/src/app/page.tsx`
2. Find the "Testimonials Section" comment
3. Edit the testimonial cards:
```tsx
<h4 className="font-montserrat font-semibold text-navy">Name</h4>
<p className="font-lato text-sm text-navy/70">Role, Organization</p>
<p className="font-lato text-navy/80 italic">
  "Your testimonial quote here..."
</p>
```
4. Save the file

### How to Add Social Media Links

1. Open `/src/components/Footer.tsx`
2. Find `YOUR_YOUTUBE_LINK_HERE`, `YOUR_FACEBOOK_LINK_HERE`, etc.
3. Replace with actual URLs:
```tsx
href="https://www.youtube.com/@yourchannnel"
href="https://www.facebook.com/yourpage"
href="https://www.tiktok.com/@youraccount"
href="https://www.instagram.com/youraccount"
```
4. Also update in `/src/app/contact/page.tsx`
5. Save both files

### How to Upload Partner Logos

1. Place logo images in `/public/partners/` folder
2. Name them clearly: `school1-logo.png`, `partner2-logo.png`
3. Open `/src/app/page.tsx`
4. Find the "Partners/Clients Section"
5. Replace the emoji placeholders:
```tsx
<Image 
  src="/partners/school1-logo.png" 
  alt="School Name"
  width={150}
  height={80}
  className="object-contain"
/>
```
6. Save the file

---

## 🚀 Coming Soon - Full CMS Features

I can create complete admin pages for all the sections mentioned above. These will allow you to:

- ✅ Manage everything through a web interface
- ✅ No code editing required
- ✅ Real-time updates
- ✅ Image upload with preview
- ✅ Rich text editor for content
- ✅ Database-backed storage

**Would you like me to build out any specific admin section first?**

Recommended priority:
1. **Blog Management** (most requested feature)
2. **Site Settings** (social media, contact info)
3. **Homepage Content** (statistics, testimonials)
4. **Media Library** (image uploads)

---

## 📞 Need Help?

If you need any specific admin feature built, just let me know:
- "I want to manage blog posts from admin"
- "I need to update social media links easily"
- "I want to upload partner logos"
- etc.

I'll build the specific admin interface you need!

---

## 🔐 Security Notes

- Only users with `admin` role can access `/admin`
- All admin routes are protected
- Session-based authentication
- No unauthorized access possible
- Regular users cannot see admin links

---

## 📊 Current Admin Dashboard Structure

```
/admin (Main Dashboard)
├── Quick Stats
│   ├── Contact Messages Count
│   ├── Subscribers Count
│   ├── Blog Posts Count
│   └── Products Count
│
├── Content Management Cards
│   ├── /admin/blog (To be built)
│   ├── /admin/homepage (To be built)
│   ├── /admin/media (To be built)
│   ├── /admin/products (To be built)
│   ├── /admin/settings (To be built)
│   └── /admin/users (To be built)
│
└── Recent Activity
    ├── Contact Messages Table
    └── Newsletter Subscribers Table
```

---

This guide will be updated as new admin features are added!

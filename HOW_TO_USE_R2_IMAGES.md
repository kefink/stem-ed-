# 🖼️ HOW TO USE CLOUDFLARE R2 IMAGES

## Quick Start Guide for STEM-ED-ARCHITECTS Platform

---

## 📸 STEP 1: UPLOAD IMAGES TO R2

1. **Navigate to Media Library:**

   - Go to: `http://192.168.0.102:3001/admin/media`
   - Login as admin if needed

2. **Upload Files:**

   - Click **"📤 Upload Files"** button
   - Select one or more images from your computer
   - Wait for upload to complete (you'll see a success message)

3. **Copy Image URL:**
   - Click on the uploaded image thumbnail
   - In the details modal, find the **URL field**
   - Click **"Copy"** button
   - Your URL will look like: `https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/abc123.jpg`

---

## 🛍️ STEP 2: USE IMAGES IN PRODUCTS

### Add Featured Image to Product:

1. **Go to Products Page:**

   - Navigate to: `http://192.168.0.102:3001/admin/products`

2. **Edit a Product:**

   - Click **"Edit"** on any product (e.g., "STEM Curriculum Kit")

3. **Go to Content Tab:**

   - Click on the **"Content"** tab in the modal

4. **Paste Image URL:**

   - In **"Featured Image URL"** field:
   - Paste: `https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/your-image.jpg`

5. **Save Changes:**
   - Click **"Update Product"**
   - Your product now has an image from R2!

### Add Gallery Images:

1. In the **Content** tab
2. In **"Gallery Images"** field, add multiple URLs as JSON array:
   ```json
   [
     "https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image1.jpg",
     "https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image2.jpg",
     "https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image3.jpg"
   ]
   ```
3. Click **"Update Product"**

---

## 📝 STEP 3: USE IMAGES IN BLOG POSTS

1. **Create or Edit Blog Post:**

   - Go to: `http://192.168.0.102:3001/admin/blog`
   - Click **"Create New Post"** or edit existing post

2. **Add Featured Image:**

   - In **"Featured Image"** field
   - Paste your R2 image URL: `https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/blog-image.jpg`

3. **Embed Images in Content:**

   - In the content editor, use markdown or HTML:

   **Markdown:**

   ```markdown
   ![Image description](https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image.jpg)
   ```

   **HTML:**

   ```html
   <img
     src="https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image.jpg"
     alt="Description"
   />
   ```

4. **Save Post**

---

## 🏠 STEP 4: USE IMAGES IN HOMEPAGE

### Add Hero Slide Background:

1. **Go to Homepage Content:**

   - Navigate to: `http://192.168.0.102:3001/admin/homepage`

2. **Edit Hero Slides:**

   - Click on **"Hero Slides"** section
   - Add or edit a slide

3. **Add Background Image:**

   - In **"Image URL"** field
   - Paste: `https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/hero-bg.jpg`

4. **Save Changes**

### Add Testimonial Photos:

1. In **Homepage Content** → **"Testimonials"**
2. Add or edit testimonial
3. In **"Image URL"** field, paste R2 URL
4. Save

---

## 📁 ORGANIZING YOUR MEDIA LIBRARY

### Create Folders:

1. **In Media Library:**

   - Click **"📁 New Folder"**

2. **Create Organization Structure:**

   ```
   📁 products/
      ├── stem-curriculum/
      ├── robotics-kits/
      ├── vr-lab/
      └── ai-platform/

   📁 blog/
      ├── tutorials/
      └── news/

   📁 homepage/
      ├── heroes/
      └── testimonials/

   📁 misc/
   ```

3. **Upload to Folders:**
   - Click on a folder to open it
   - Upload files into that folder
   - Files will have organized URLs like: `...r2.dev/products/stem-curriculum/image.jpg`

---

## 🎯 RECOMMENDED IMAGE SIZES

| **Use Case**     | **Recommended Size** | **Format** |
| ---------------- | -------------------- | ---------- |
| Product Featured | 1200 x 800 px        | JPEG/WebP  |
| Product Gallery  | 800 x 600 px         | JPEG/WebP  |
| Blog Featured    | 1600 x 900 px        | JPEG/WebP  |
| Homepage Hero    | 1920 x 1080 px       | JPEG/WebP  |
| Testimonials     | 200 x 200 px         | JPEG/PNG   |
| Thumbnails       | 300 x 300 px         | JPEG/WebP  |

---

## ✅ BENEFITS OF R2 STORAGE

### What You Get:

✅ **10 GB Free Storage** per month  
✅ **Unlimited Bandwidth** (zero egress fees!)  
✅ **Global CDN** - Images load fast worldwide  
✅ **99.999999999% Durability** - Your files are safe  
✅ **Automatic Backups** - No data loss  
✅ **Scalable** - Can handle millions of files

### Performance:

- **Kenya users:** Load time ~50ms ⚡
- **US users:** Load time ~50ms ⚡
- **Europe users:** Load time ~50ms ⚡
- **Asia users:** Load time ~50ms ⚡

**vs. Local storage:** 300-800ms for international users

---

## 🔄 SWITCHING BETWEEN LOCAL AND R2

### Current Setup:

Your system is configured to use **R2 storage** (set in `backend/.env`):

```env
STORAGE_MODE=r2
```

### To Switch Back to Local Storage:

1. Edit `backend/.env`
2. Change to:
   ```env
   STORAGE_MODE=local
   ```
3. Restart backend server
4. New uploads will save to `backend/uploads/media/`

### Mixed Mode:

- **Old local files:** Continue to work with `/uploads/media/...` URLs
- **New R2 files:** Use `https://pub-xxx.r2.dev/...` URLs
- **Both work together!** No migration needed

---

## 🆘 TROUBLESHOOTING

### Image Not Displaying?

1. **Check URL format:**

   - ✅ Correct: `https://pub-e07658d03da647958f837b377c12402f.r2.dev/media/image.jpg`
   - ❌ Wrong: `http://localhost:8000/uploads/...` (old local format)

2. **Check R2 Dashboard:**

   - Go to Cloudflare Dashboard
   - Navigate to R2 → Your bucket
   - Verify file exists

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for CORS or 404 errors

### Upload Fails?

1. **Check file size:** Max 10MB per file
2. **Check file type:** Images (JPG, PNG, GIF, WebP) and PDFs allowed
3. **Check R2 credentials:** Verify in `backend/.env`
4. **Check backend logs:** Look for error messages in terminal

---

## 📞 QUICK REFERENCE

| **Task**             | **URL**                                     |
| -------------------- | ------------------------------------------- |
| Media Library        | `http://192.168.0.102:3001/admin/media`     |
| Manage Products      | `http://192.168.0.102:3001/admin/products`  |
| Blog Posts           | `http://192.168.0.102:3001/admin/blog`      |
| Homepage Content     | `http://192.168.0.102:3001/admin/homepage`  |
| Cloudflare Dashboard | `https://dash.cloudflare.com`               |
| R2 Bucket            | Cloudflare → R2 → `stemed-media-production` |

---

## 🎓 EXAMPLE WORKFLOW

### Complete Example: Add Product with Images

1. **Upload Product Images:**

   - Media Library → Upload 4 images:
     - Main product photo
     - 3 detail/angle photos

2. **Copy URLs:**

   - Click each image → Copy URL
   - Save URLs in notepad

3. **Edit Product:**

   - Go to Manage Products
   - Edit "STEM Curriculum Kit"
   - Go to Content tab

4. **Add Images:**

   - **Featured Image:** Paste main photo URL
   - **Gallery Images:**
     ```json
     [
       "https://pub-xxx.r2.dev/media/detail1.jpg",
       "https://pub-xxx.r2.dev/media/detail2.jpg",
       "https://pub-xxx.r2.dev/media/detail3.jpg"
     ]
     ```

5. **Save & View:**
   - Click "Update Product"
   - Visit `/products` page
   - Your images are now live on CDN! 🎉

---

**🎉 You're now using enterprise-grade cloud storage with global CDN delivery!**

**Need help?** Check the terminal logs or browser console for detailed error messages.

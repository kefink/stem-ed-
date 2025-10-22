# Media Library Enhancements - Quick Start Guide

## 🚀 Getting Started

All enhancements are now live! Here's how to use each feature:

---

## 1️⃣ Drag & Drop Upload

### How to Use:
1. Open **Media Library** at `/admin/media`
2. Open your file explorer (Windows Explorer, Finder, etc.)
3. Select one or more image files
4. **Drag** them into the browser window
5. **Drop** them anywhere in the files area
6. Watch the orange overlay appear during drag
7. Files upload automatically!

### What You'll See:
```
┌─────────────────────────────────────────┐
│  📤                                      │
│  Drop files here to upload              │
│                                         │
│  (Orange dashed border overlay)        │
└─────────────────────────────────────────┘
```

### Tips:
- ✅ Upload multiple files at once
- ✅ Goes to current folder automatically
- ✅ Same 10MB limit applies
- ✅ Only images and PDFs accepted

---

## 2️⃣ Image Editing (Crop, Rotate, Resize)

### How to Use:
1. Go to **Media Library** at `/admin/media`
2. **Click** on any image thumbnail
3. File details modal opens
4. Click the **"✂️ Edit"** button
5. Image editor opens with your photo

### Available Tools:

#### 🔲 **Crop**
- Click and drag on the image to select area
- Resize selection by dragging corners
- Click "Clear Crop" to reset
- Dimensions shown below slider

#### 🔄 **Rotation**
- Drag slider: 0° to 360°
- Click "90°" button for quick rotate
- Real-time preview

#### 📏 **Scale/Resize**
- Drag slider: 0.5x to 2.0x
- Click "Reset" to go back to 1.0x
- Zoom in to see details or zoom out

#### 💾 **Save**
- Click "Save Changes" button
- New edited file is created
- Original file is preserved
- New file appears in your media library

### Example Workflow:
```
1. Upload landscape photo (4000x3000)
2. Open in editor
3. Crop to 1:1 square
4. Rotate 90° for portrait
5. Scale to 0.8x
6. Save → Creates edited-123456789.jpg
```

### Tips:
- ✅ Original is never modified
- ✅ Can edit the same image multiple times
- ✅ Each save creates a new file
- ✅ Output is high-quality JPEG (95%)

---

## 3️⃣ Media Picker in Blog Editor

### How to Use:

#### For New Blog Posts:
1. Go to **Admin** → **Blog** → **"Create New Post"**
2. Write your blog content
3. Scroll to **"Featured Image"** section
4. Click **"📁 Browse"** button
5. Media Picker modal opens

#### In Media Picker:
1. **Navigate folders** by clicking folder icons
2. **Search** using search bar at top
3. **View** image thumbnails in grid
4. **Click** on any image to select it
5. Modal closes automatically
6. URL is inserted into field
7. Preview appears below input

#### For Editing Posts:
- Same process, same button
- Works in `/admin/blog/[id]/edit` page

### Visual Guide:
```
Featured Image Field:
┌────────────────────────────┬─────────┐
│ https://...image.jpg       │ 📁 Browse│
└────────────────────────────┴─────────┘
        ↓ (after selection)
┌──────────────────────────────────────┐
│ [Preview of selected image]          │
└──────────────────────────────────────┘
```

### Media Picker Layout:
```
┌─────────────────────────────────────────┐
│ Select Media                          X │
│                                         │
│ [Search...]              [← Back]       │
├─────────────────────────────────────────┤
│ Folders:                                │
│ 📁 Blog     📁 Products    📁 Team      │
│                                         │
│ Files:                                  │
│ [img] [img] [img] [img] [img]          │
│ [img] [img] [img] [img] [img]          │
│                                         │
│ ← Previous    Page 1 of 3    Next →    │
└─────────────────────────────────────────┘
```

### Tips:
- ✅ Only shows images (not documents)
- ✅ Can search by filename
- ✅ Navigate folders easily
- ✅ Click "Back" to go to root folder
- ✅ URL is automatically formatted
- ✅ Works for both new and edit pages

---

## 🎯 Common Use Cases

### Use Case 1: Batch Upload Product Images
```
1. Open Media Library
2. Create folder "Products"
3. Open "Products" folder
4. Drag & drop 20 product images from desktop
5. All upload to "Products" folder
6. Done in seconds!
```

### Use Case 2: Edit Hero Image
```
1. Upload large photo (5000x3000)
2. Click to open details
3. Click "Edit"
4. Crop to 16:9 ratio
5. Scale down to 0.7x
6. Save as optimized version
7. Use in homepage
```

### Use Case 3: Blog Post with Featured Image
```
1. Create new blog post
2. Write content
3. Click "Browse" for featured image
4. Navigate to "Blog Images" folder
5. Search "robotics"
6. Click on perfect image
7. Preview shows automatically
8. Publish post
```

---

## ⚡ Quick Reference

### Keyboard Shortcuts:
- **ESC** - Close any modal (Media Picker, Image Editor)

### File Limits:
- **Max Size:** 10MB per file
- **Allowed Types:** Images (JPG, PNG, GIF, WebP, SVG), PDFs

### Browser Support:
- ✅ Chrome, Edge (Chromium)
- ✅ Firefox
- ✅ Safari

---

## 🐛 Troubleshooting

### Drag & Drop Not Working?
- Check file size (< 10MB)
- Verify file type is image or PDF
- Make sure you're dropping in the files area
- Try refreshing the page

### Image Editor Save Fails?
- Check internet connection
- Verify you're still logged in
- Check browser console for errors
- Try again with smaller image

### Media Picker Not Opening?
- Clear browser cache
- Check if popup blocker is active
- Refresh the page
- Verify admin authentication

---

## 📞 Need Help?

### Check These First:
1. Browser console (F12) for errors
2. File size and type
3. Admin login status
4. Internet connection

### Common Solutions:
- **Refresh the page** - Fixes most issues
- **Clear cache** - Ctrl+Shift+Del
- **Try different browser** - Chrome recommended
- **Check file permissions** - Media folder writable

---

## ✨ Best Practices

### Organizing Media:
- Create folders by category (Blog, Products, Team, etc.)
- Use descriptive filenames
- Edit images before using in production
- Keep originals in "Originals" folder

### Image Editing:
- Crop first, then rotate, then scale
- Use 0.8x scale for web optimization
- Keep aspect ratios in mind
- Test in blog preview before publishing

### Blog Featured Images:
- Use landscape images (16:9 or 4:3)
- Minimum 1200px width recommended
- Optimize with image editor first
- Test how it looks on mobile

---

## 🎉 You're Ready!

All three enhancements are production-ready. Start using them to:
- ⚡ Upload faster with drag & drop
- ✂️ Edit images professionally
- 📝 Pick media easily in blog posts

**Enjoy your enhanced Media Library! 🚀**

# Curriculum Page Admin Guide

## How to Edit the Curriculum Page Content

The `/products/curriculum` page can now be edited through the **Product Pages** admin panel without changing the layout.

## Step-by-Step Instructions

### 1. Access Product Pages Admin
- Go to: `http://192.168.1.101:3000/admin/product-pages`
- Click **"+ New Product Page"** button

### 2. Fill Basic Information
- **Title**: `STEM Curriculum Kits` (or your preferred page title)
- **Slug**: `curriculum` ⚠️ **MUST be exactly "curriculum"**
- **Subtitle**: Your hero tagline (optional - can also use hero_content.description)
- **Is Active**: ✅ Check this box
- **Display Order**: `0`

### 3. Configure Hero Content (JSON)
Click on "Hero Content (JSON)" section and paste:

```json
{
  "description": "Industry-aligned, SEO-optimized, and globally competitive STEM curriculum packages designed for 21st-century learners. From robotics to AI, game development to digital design.",
  "badges": [
    "✓ CBC/Cambridge/IB Aligned",
    "✓ 300+ Lesson Plans",
    "✓ Industry-Standard Tools",
    "✓ Teacher Training Included"
  ]
}
```

### 4. Configure Curriculum Cards (Products JSON Array)
Click on "Products List (JSON Array)" section and paste:

```json
[
  {
    "id": "robotics",
    "name": "Robotics Curriculum",
    "icon": "🤖",
    "color": "from-blue-500 to-blue-700",
    "description": "Comprehensive robotics education program covering mechanical design, electronics, programming, and AI integration. Students learn to build, program, and deploy autonomous robots while developing critical thinking and problem-solving skills.",
    "topics": [
      "Robot mechanics and kinematics",
      "Sensor integration and data processing",
      "Motor control and actuators",
      "Autonomous navigation systems",
      "Computer vision for robotics",
      "Robot operating systems (ROS)",
      "Competition preparation (FLL, WRO)",
      "Industry 4.0 applications"
    ],
    "outcomes": "Students gain hands-on experience in robotics engineering, preparing them for careers in automation, AI, and advanced manufacturing."
  },
  {
    "id": "coding",
    "name": "Coding & Programming Curriculum",
    "icon": "💻",
    "color": "from-green-500 to-green-700",
    "description": "Progressive coding curriculum from visual block-based programming to advanced text-based languages. Covers computational thinking, algorithms, data structures, and software development best practices.",
    "topics": [
      "Computational thinking foundations",
      "Algorithm design and analysis",
      "Data structures and organization",
      "Object-oriented programming",
      "Functional programming concepts",
      "Software development lifecycle",
      "Debugging and testing strategies",
      "Version control with Git"
    ],
    "outcomes": "Learners develop strong programming foundations applicable to web development, app creation, game design, and software engineering careers.",
    "subtypes": [
      {
        "id": "block-based",
        "name": "Block-Based Coding",
        "description": "Visual programming using Scratch, Blockly, and Code.org for beginners",
        "topics": [
          "Scratch programming",
          "MIT App Inventor",
          "Code.org courses",
          "Visual logic building"
        ]
      },
      {
        "id": "text-based",
        "name": "Text-Based Coding",
        "description": "Python, JavaScript, Java, and C++ for intermediate to advanced learners",
        "topics": [
          "Python fundamentals",
          "JavaScript & web development",
          "Java & object-oriented programming",
          "C++ and embedded systems"
        ]
      }
    ]
  },
  {
    "id": "gameDev",
    "name": "Game Development Curriculum",
    "icon": "🎮",
    "color": "from-purple-500 to-purple-700",
    "description": "Complete game development program covering game design principles, programming, graphics, physics engines, and monetization strategies. Students create 2D and 3D games using industry-standard tools.",
    "topics": [
      "Game design fundamentals",
      "Unity 3D game engine",
      "Unreal Engine basics",
      "2D game development with Godot",
      "Game physics and mathematics",
      "Character animation and rigging",
      "Level design and storytelling",
      "Multiplayer game architecture",
      "Game monetization strategies",
      "Publishing on app stores"
    ],
    "outcomes": "Students build a portfolio of games while learning skills applicable to gaming industry, simulation development, and interactive media."
  },
  {
    "id": "pcb",
    "name": "PCB Design & Electronics Curriculum",
    "icon": "⚡",
    "color": "from-yellow-500 to-orange-600",
    "description": "Printed Circuit Board design curriculum teaching electronics fundamentals, circuit design, PCB layout, manufacturing processes, and IoT device creation.",
    "topics": [
      "Electronic components and theory",
      "Circuit analysis and design",
      "Schematic capture techniques",
      "PCB layout with KiCad/Eagle",
      "Signal integrity and EMI",
      "Power supply design",
      "Microcontroller integration",
      "Prototyping and testing",
      "Manufacturing for production",
      "IoT hardware development"
    ],
    "outcomes": "Learners gain practical electronics skills for creating custom hardware, IoT devices, and embedded systems for Industry 4.0 applications."
  },
  {
    "id": "dataScience",
    "name": "Data Science & Analytics Curriculum",
    "icon": "📊",
    "color": "from-indigo-500 to-indigo-700",
    "description": "Comprehensive data science program covering statistics, data visualization, machine learning, big data technologies, and real-world analytics projects.",
    "topics": [
      "Statistics and probability",
      "Data cleaning and preprocessing",
      "Exploratory data analysis",
      "Data visualization with Python",
      "Machine learning algorithms",
      "Deep learning fundamentals",
      "Natural language processing",
      "Big data with Spark",
      "SQL and database management",
      "Business intelligence tools",
      "Predictive analytics",
      "Data ethics and privacy"
    ],
    "outcomes": "Students develop in-demand skills for careers in data science, business analytics, machine learning engineering, and AI research."
  },
  {
    "id": "ai",
    "name": "Artificial Intelligence Curriculum",
    "icon": "🧠",
    "color": "from-pink-500 to-rose-700",
    "description": "Cutting-edge AI curriculum covering machine learning, neural networks, computer vision, NLP, and ethical AI development. Aligned with global AI education standards.",
    "topics": [
      "AI fundamentals and history",
      "Machine learning algorithms",
      "Neural networks and deep learning",
      "Computer vision applications",
      "Natural language processing",
      "Reinforcement learning",
      "Generative AI and LLMs",
      "AI ethics and bias",
      "AI model deployment",
      "Edge AI and optimization",
      "AI in robotics",
      "Future of AI technology"
    ],
    "outcomes": "Learners gain expertise in AI development, preparing them for careers in machine learning, AI research, and emerging technology fields."
  },
  {
    "id": "vr",
    "name": "Virtual Reality Curriculum",
    "icon": "🥽",
    "color": "from-cyan-500 to-blue-600",
    "description": "Immersive VR curriculum teaching 3D modeling, VR programming, spatial computing, and creating educational and entertainment VR experiences.",
    "topics": [
      "VR fundamentals and hardware",
      "3D modeling for VR",
      "Unity VR development",
      "Unreal Engine VR",
      "Spatial audio design",
      "User interaction in VR",
      "Metaverse concepts",
      "AR/VR hybrid applications",
      "VR accessibility design",
      "Performance optimization",
      "Educational VR experiences"
    ],
    "outcomes": "Students create immersive VR applications, gaining skills for careers in VR development, metaverse creation, and spatial computing."
  },
  {
    "id": "appDev",
    "name": "App Development Curriculum",
    "icon": "📱",
    "color": "from-teal-500 to-green-600",
    "description": "Mobile and web app development curriculum covering iOS, Android, cross-platform frameworks, UI/UX design, and app monetization strategies.",
    "topics": [
      "Mobile app fundamentals",
      "iOS development with Swift",
      "Android development with Kotlin",
      "React Native cross-platform",
      "Flutter development",
      "UI/UX design principles",
      "API integration and backend",
      "Firebase and cloud services",
      "App security best practices",
      "App store optimization",
      "Monetization strategies",
      "Progressive web apps"
    ],
    "outcomes": "Learners build real-world apps for iOS and Android, preparing for careers in mobile development and software entrepreneurship."
  },
  {
    "id": "drone",
    "name": "Drone Technology Curriculum",
    "icon": "🚁",
    "color": "from-slate-500 to-gray-700",
    "description": "Comprehensive drone curriculum covering aerodynamics, flight controllers, autonomous navigation, aerial photography, and commercial drone applications.",
    "topics": [
      "Drone mechanics and aerodynamics",
      "Flight controller programming",
      "Autonomous flight systems",
      "GPS and navigation",
      "Aerial photography/videography",
      "Drone regulations and safety",
      "Agricultural applications",
      "Search and rescue operations",
      "Delivery drone systems",
      "Drone racing techniques",
      "Swarm robotics",
      "Commercial drone operations"
    ],
    "outcomes": "Students gain expertise in UAV technology, preparing for careers in commercial drone operations, aerial surveying, and autonomous systems."
  },
  {
    "id": "webDev",
    "name": "Web Development Curriculum",
    "icon": "🌐",
    "color": "from-orange-500 to-red-600",
    "description": "Full-stack web development curriculum from HTML/CSS basics to advanced frameworks, databases, cloud deployment, and modern web technologies.",
    "topics": [
      "HTML5 and semantic markup",
      "CSS3 and responsive design",
      "JavaScript fundamentals",
      "React and modern frameworks",
      "Backend with Node.js/Python",
      "Database design (SQL/NoSQL)",
      "RESTful API development",
      "Authentication and security",
      "Cloud deployment (AWS/Azure)",
      "DevOps basics",
      "Web performance optimization",
      "SEO best practices"
    ],
    "outcomes": "Learners become full-stack developers capable of building modern web applications, e-commerce sites, and SaaS platforms."
  },
  {
    "id": "digitalDesign",
    "name": "Digital Design Curriculum",
    "icon": "🎨",
    "color": "from-fuchsia-500 to-purple-600",
    "description": "Comprehensive digital design curriculum covering graphic design, UI/UX, 3D modeling, animation, and design thinking for technology products.",
    "topics": [
      "Design thinking methodology",
      "Color theory and typography",
      "Layout and composition",
      "3D modeling and rendering",
      "Animation principles",
      "Motion graphics",
      "Design for accessibility",
      "Portfolio development"
    ],
    "outcomes": "Students develop a professional design portfolio and skills for careers in UI/UX design, graphic design, product design, and digital media.",
    "subtypes": [
      {
        "id": "graphic-art",
        "name": "Graphic Art & Illustration",
        "description": "Visual arts using Adobe Creative Suite, Procreate, and digital illustration tools",
        "topics": [
          "Digital illustration",
          "Adobe Photoshop mastery",
          "Vector graphics with Illustrator",
          "Brand identity design"
        ]
      },
      {
        "id": "product-design",
        "name": "Product Design",
        "description": "UI/UX design for digital products, user research, and prototyping",
        "topics": [
          "User research methods",
          "Wireframing and prototyping",
          "Figma and design tools",
          "Design systems"
        ]
      },
      {
        "id": "technical-design",
        "name": "Technical Design",
        "description": "CAD design, 3D modeling for engineering and architecture",
        "topics": [
          "AutoCAD fundamentals",
          "SolidWorks 3D CAD",
          "Fusion 360 modeling",
          "Technical drawing standards"
        ]
      },
      {
        "id": "canva-design",
        "name": "Canva Design",
        "description": "Accessible design using Canva for marketing, education, and social media",
        "topics": [
          "Canva fundamentals",
          "Social media graphics",
          "Presentation design",
          "Marketing materials"
        ]
      },
      {
        "id": "pcb-design",
        "name": "PCB Design",
        "description": "Electronic circuit board design with KiCad, Eagle, and Altium",
        "topics": [
          "Schematic design",
          "PCB layout techniques",
          "Component libraries",
          "Design for manufacturing"
        ]
      }
    ]
  }
]
```

### 5. Optional: Add SEO Settings
- **SEO Title**: `STEM Curriculum Kits - Industry-Aligned Education`
- **SEO Description**: `Comprehensive STEM curriculum packages covering robotics, coding, AI, game development, and more. CBC/Cambridge/IB aligned with 300+ lesson plans.`
- **SEO Keywords**: `STEM curriculum, robotics education, coding programs, AI learning, Kenya education`

### 6. Save
- Click **"Create Product Page"**
- Refresh `/products/curriculum` to see your changes

---

## What Can You Edit?

### ✅ Page Hero Section
- **Title**: Main heading (default: "STEM Curriculum Kits")
- **Subtitle**: Hero description paragraph
- **Badges**: The four feature chips (CBC/Cambridge, 300+ Lessons, etc.)

### ✅ Curriculum Cards (11 cards)
For each curriculum card, you can edit:
- **Icon**: Emoji or text (🤖, 💻, 🎮, etc.)
- **Name**: Curriculum title
- **Color**: Tailwind gradient classes (e.g., `from-blue-500 to-blue-700`)
- **Description**: Card description paragraph
- **Topics**: Array of topic strings shown in detail view
- **Outcomes**: Learning outcomes text
- **Subtypes** (optional): Array of sub-categories (like "Block-Based Coding" under "Coding")

---

## JSON Structure Reference

### Curriculum Card Template
```json
{
  "id": "unique-slug",
  "name": "Curriculum Name",
  "icon": "🎓",
  "color": "from-blue-500 to-blue-700",
  "description": "Brief description shown on card",
  "topics": [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ],
  "outcomes": "Learning outcomes paragraph",
  "subtypes": [
    {
      "id": "sub-slug",
      "name": "Subtype Name",
      "description": "Subtype description",
      "topics": ["Sub topic 1", "Sub topic 2"]
    }
  ]
}
```

### Available Tailwind Color Gradients
- `from-blue-500 to-blue-700` (Blue)
- `from-green-500 to-green-700` (Green)
- `from-purple-500 to-purple-700` (Purple)
- `from-yellow-500 to-orange-600` (Yellow-Orange)
- `from-indigo-500 to-indigo-700` (Indigo)
- `from-pink-500 to-rose-700` (Pink-Rose)
- `from-cyan-500 to-blue-600` (Cyan-Blue)
- `from-teal-500 to-green-600` (Teal-Green)
- `from-slate-500 to-gray-700` (Gray)
- `from-orange-500 to-red-600` (Orange-Red)
- `from-fuchsia-500 to-purple-600` (Fuchsia-Purple)

---

## Important Notes

⚠️ **Required Fields:**
- `slug` must be exactly `"curriculum"` (lowercase, no spaces)
- `products` array must have valid JSON syntax
- Each curriculum item needs an `id` field

✅ **Fallback Behavior:**
- If no Product-Page exists with slug "curriculum", the page shows the original hardcoded content
- Layout never changes - only the content source switches between database and static

🎨 **Layout Preserved:**
- All existing styles, animations, filters, and interactions remain unchanged
- The visual design stays exactly the same

---

## Testing

1. **Without Product-Page**: Page shows original static content
2. **With Product-Page**: Page shows your admin-configured content
3. **Invalid JSON**: Page falls back to static content (check browser console for errors)

---

## Future Enhancements

You can later add to each curriculum item:
- `image_url`: Featured image from R2 storage
- `video_url`: Intro video
- `pricing`: Pricing information
- `duration`: Course duration
- `level`: Difficulty level

These fields will be ignored for now but can be displayed when you're ready to enhance the layout.

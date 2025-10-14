export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "STEM Curriculum Kit",
      category: "Curriculum",
      description:
        "Complete CBC/Cambridge/IB-aligned robotics curriculum for K-12",
      features: [
        "300+ lesson plans",
        "Teacher guides & resources",
        "Student workbooks",
        "Assessment tools",
        "Digital resources",
      ],
      price: "Contact for pricing",
      icon: "📚",
    },
    {
      id: 2,
      name: "Robotics Starter Kit",
      category: "Hardware",
      description:
        "Complete robotics kit for beginners with sensors and components",
      features: [
        "Arduino-compatible board",
        "10+ sensors & actuators",
        "Building components",
        "Project guidebook",
        "Online tutorials",
      ],
      price: "KES 45,000",
      icon: "🤖",
    },
    {
      id: 3,
      name: "AI Learning Platform",
      category: "Software",
      description: "AI-powered LMS for personalized STEM learning experiences",
      features: [
        "Adaptive learning paths",
        "Real-time progress tracking",
        "Interactive simulations",
        "Teacher dashboard",
        "Parent portal",
      ],
      price: "From KES 5,000/month",
      icon: "💻",
    },
    {
      id: 4,
      name: "VR Lab Experience",
      category: "Software",
      description: "Immersive VR modules for science and engineering concepts",
      features: [
        "20+ VR experiments",
        "Physics & chemistry simulations",
        "Multi-user collaboration",
        "Progress analytics",
        "Cross-platform support",
      ],
      price: "Contact for pricing",
      icon: "🥽",
    },
    {
      id: 5,
      name: "STEM Lab Setup Package",
      category: "Infrastructure",
      description: "Complete lab infrastructure design and equipment",
      features: [
        "Lab design consultation",
        "Equipment procurement",
        "Installation & setup",
        "Staff training",
        "1-year support",
      ],
      price: "From KES 500,000",
      icon: "🏗️",
    },
    {
      id: 6,
      name: "Competition Prep Kit",
      category: "Training",
      description: "Resources for FLL, WRO, and national STEM competitions",
      features: [
        "Practice challenges",
        "Competition strategies",
        "Video tutorials",
        "Mentorship access",
        "Mock competitions",
      ],
      price: "KES 25,000",
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Complete STEM education solutions - from curriculum to lab equipment
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-orange to-orange-dark text-white p-6 text-center">
                  <div className="text-6xl mb-4">{product.icon}</div>
                  <span className="text-sm font-montserrat bg-white/20 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="text-2xl font-bebas mt-4">{product.name}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="font-lato text-gray-700 mb-4">
                    {product.description}
                  </p>

                  <h4 className="font-montserrat font-semibold text-navy mb-3">
                    Features:
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-orange mr-2">✓</span>
                        <span className="font-lato text-gray-600 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-4">
                    <p className="text-2xl font-bebas text-navy mb-4">
                      {product.price}
                    </p>
                    <a
                      href="/contact"
                      className="block w-full bg-navy hover:bg-navy-light text-white text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300"
                    >
                      Request Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-orange to-orange-dark text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            We can design products tailored to your specific needs
          </p>
          <a
            href="/contact"
            className="btn-primary bg-navy hover:bg-navy-light"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  price: string;
  icon: string;
  link?: string;
  slug?: string;
  has_detail_page?: boolean;
  featured_image?: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:8000${url}`;
  };

  useEffect(() => {
    // Fetch products from database
    fetch("/api/v1/public/products")
      .then((res) => res.json())
      .then((data) => {
        // API returns paginated response with items array
        const items = data.items || [];
        // Transform database products to match interface
        const transformedProducts = items.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.short_description || p.description,
          features: p.features
            ? typeof p.features === "string"
              ? JSON.parse(p.features)
              : p.features
            : [],
          price: p.price,
          icon: p.icon || "📦",
          slug: p.slug,
          has_detail_page: p.has_detail_page,
          link: p.has_detail_page ? `/products/${p.slug}` : undefined,
          featured_image: p.featured_image ?? null,
        }));
        setProducts(transformedProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // Fallback to hardcoded products on error
        setProducts(fallbackProducts);
        setLoading(false);
      });
  }, []);

  // Fallback products in case API fails
  const fallbackProducts: Product[] = [
    {
      id: 1,
      name: "STEM Curriculum Kit",
      category: "Curriculum",
      description:
        "Complete CBC/Cambridge/IB-aligned STEM curriculum for K-12. Includes Robotics, Coding, AI, Game Dev, Web Dev, App Dev, Drone Tech, VR/AR, Data Science, PCB Design, and Digital Design.",
      features: [
        "11+ specialized curriculum tracks",
        "300+ lesson plans per track",
        "Block-based & text-based coding",
        "Beginner to expert levels",
        "Ages 5-18+ customizable content",
        "Teacher training included",
      ],
      price: "Contact for pricing",
      icon: "📚",
      link: "/products/curriculum",
    },
    {
      id: 2,
      name: "Robotics Kits & Components",
      category: "Hardware",
      description:
        "Educational robotics kits, competition-grade equipment, and individual electronic components. Includes RCUs, sensors, actuators, cables, and mechanical structures.",
      features: [
        "Educational kits (ages 5-18+)",
        "Competition kits (FLL, WRO)",
        "Robot control units (Arduino, RPi)",
        "Sensors & actuators library",
        "Custom mechanical parts",
        "AI-integrated options available",
      ],
      price: "From KES 350",
      icon: "🤖",
      link: "/products/robotics-kits",
    },
    {
      id: 3,
      name: "AI Learning Platform",
      category: "Software",
      description:
        "Revolutionary AI-powered learning management system with personalized education, intelligent 24/7 tutoring, and comprehensive analytics for students, teachers, schools, and admins.",
      features: [
        "AI tutor available 24/7",
        "Personalized adaptive learning paths",
        "Real-time progress analytics",
        "Interactive STEM simulations",
        "Teacher & admin dashboards",
        "Role-based features & pricing",
      ],
      price: "From KES 1,500/month",
      icon: "💻",
      link: "/products/ai-platform",
    },
    {
      id: 4,
      name: "VR Lab Experience",
      category: "Software",
      description:
        "Immersive VR learning with 150+ experiments across 9 subjects including Kenya CBC Pre-Technical, Integrated Science, and Agriculture. Works on VR headsets or desktop - no VR required!",
      features: [
        "150+ VR experiments across 9 subjects",
        "Kenya CBC: Pre-Technical, Integrated Science, Agriculture",
        "Grade 7-9 filtering for CBC subjects",
        "Multi-platform: VR headsets & desktop mode",
        "30 students collaborate in virtual labs",
        "Hardware bundles available",
      ],
      price: "From KES 2,000/year",
      icon: "🥽",
      link: "/products/vr-lab",
    },
    {
      id: 5,
      name: "STEM Lab Setup Package",
      category: "Infrastructure",
      description:
        "Complete turnkey STEM lab solutions - from consultation to installation. Professional setup of robotics, 3D printing, electronics, science equipment, and more. 50+ labs built across Kenya!",
      features: [
        "4 package tiers: Starter to Innovation Hub",
        "9 equipment categories (robotics, 3D printing, etc.)",
        "Turnkey solution: design, procurement, installation",
        "Comprehensive teacher training included",
        "CBC-aligned equipment & curriculum",
        "Ongoing support & maintenance",
      ],
      price: "From KES 500,000",
      icon: "🏗️",
      link: "/products/stem-lab",
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
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide animate-fade-in">
            Our Products
          </h1>
          <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl lg:text-3xl font-lato max-w-4xl mx-auto text-white/95 leading-relaxed">
            Complete STEM education solutions - from industry-aligned curriculum
            to cutting-edge lab equipment
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
              Comprehensive STEM Solutions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Everything you need to build a world-class STEM education program
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange"></div>
              <p className="mt-4 text-xl font-lato text-gray-600">
                Loading products...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden hover:border-orange/30"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-orange to-orange-dark text-white p-8 text-center">
                    {product.featured_image ? (
                      <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
                        <Image
                          src={getImageUrl(product.featured_image)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {product.icon}
                      </div>
                    )}
                    <span className="text-sm font-montserrat bg-white/20 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="text-2xl font-bebas mt-4 tracking-wide">
                      {product.name}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="font-lato text-gray-700 mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    <h4 className="font-montserrat font-semibold text-navy mb-4 text-lg">
                      Key Features:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange mr-2 text-lg flex-shrink-0">
                            ✓
                          </span>
                          <span className="font-lato text-gray-600 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t pt-4">
                      <p className="text-2xl font-bebas text-navy mb-4">
                        {product.price}
                      </p>
                      {product.link ? (
                        <a
                          href={product.link}
                          className="block w-full bg-orange hover:bg-orange-dark text-white text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300 mb-2"
                        >
                          {product.id === 1
                            ? "Explore Curriculum"
                            : "Browse Products"}
                        </a>
                      ) : (
                        <a
                          href="/contact"
                          className="block w-full bg-navy hover:bg-navy-light text-white text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300"
                        >
                          Request Quote
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-orange via-orange-dark to-orange text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Need a Custom Solution?
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
            We can design products and curriculum tailored to your institution's
            specific needs and goals
          </p>
          <a
            href="/contact"
            className="inline-block btn-primary bg-navy hover:bg-navy-light text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-navy/50 transition-all duration-300"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}

"use client";

import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        alert("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        throw new Error("Subscription failed");
      }
    } catch (err) {
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroSlider />

      {/* Statistics Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-orange to-orange-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bebas mb-2">500+</div>
              <p className="font-lato text-white/90">Students Trained</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bebas mb-2">50+</div>
              <p className="font-lato text-white/90">Partner Schools</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bebas mb-2">10+</div>
              <p className="font-lato text-white/90">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bebas mb-2">100+</div>
              <p className="font-lato text-white/90">Certified Teachers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title">We Engineer Learning Systems</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              We architect sustainable STEM ecosystems that transform vision
              into measurable impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-navy to-navy-light text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-cyan-500/20">
              <div className="text-6xl mb-4 animate-bounce">🎯</div>
              <h3 className="text-3xl font-bebas mb-4 text-orange">
                Our Mission
              </h3>
              <p className="font-lato text-white/90 leading-relaxed">
                Making high-quality, AI-integrated STEM education accessible to
                every child — regardless of background or resources
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-orange to-orange-dark text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bebas mb-4">Our Vision</h3>
              <p className="font-lato text-white/90 leading-relaxed">
                To become the definitive leader in African STEM transformation
                by engineering plug-and-play, nationally scalable learning
                ecosystems
              </p>
            </div>

            {/* Identity Card */}
            <div className="bg-gradient-to-br from-navy-light to-navy text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-cyan-500/20">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-3xl font-bebas mb-4 text-orange">
                Who We Are
              </h3>
              <p className="font-lato text-white/90 leading-relaxed">
                Architects of educational systems — from curriculum design to
                teacher certification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose STEM-ED-ARCHITECTS</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              We don't just deliver training—we build complete learning
              ecosystems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                Complete Curricula
              </h3>
              <p className="font-lato text-navy/70 text-sm">
                CBC, Cambridge & IB-aligned programs
              </p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                AI Integration
              </h3>
              <p className="font-lato text-navy/70 text-sm">
                Next-generation learning tools
              </p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                Teacher Training
              </h3>
              <p className="font-lato text-navy/70 text-sm">
                Comprehensive certification programs
              </p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                Full Support
              </h3>
              <p className="font-lato text-navy/70 text-sm">
                Strategy to student capstone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products/Services Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Featured Solutions</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Comprehensive STEM education products designed for real-world
              impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Robotics Kits */}
            <Link href="/products/robotics-kits" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                  <div className="text-8xl">🤖</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    Robotics Kits
                  </h3>
                  <p className="font-lato text-navy/70 mb-4">
                    Complete robotics kits with AI integration for hands-on
                    learning
                  </p>
                  <span className="text-orange font-montserrat font-semibold inline-flex items-center">
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* VR Lab Solutions */}
            <Link href="/products/vr-lab" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
                  <div className="text-8xl">🥽</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    VR Lab Solutions
                  </h3>
                  <p className="font-lato text-navy/70 mb-4">
                    Immersive virtual reality labs for advanced STEM exploration
                  </p>
                  <span className="text-orange font-montserrat font-semibold inline-flex items-center">
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* AI Learning Platform */}
            <Link href="/products/ai-platform" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 bg-gradient-to-br from-navy-light to-cyan-600 flex items-center justify-center">
                  <div className="text-8xl">🧠</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    AI Learning Platform
                  </h3>
                  <p className="font-lato text-navy/70 mb-4">
                    Intelligent platform for personalized STEM education
                    experiences
                  </p>
                  <span className="text-orange font-montserrat font-semibold inline-flex items-center">
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Partners Say</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Real stories from schools, teachers, and students we've empowered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center text-white text-xl font-bebas mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold text-navy">
                    Sarah Mwangi
                  </h4>
                  <p className="font-lato text-sm text-navy/70">
                    Principal, Greenfield Academy
                  </p>
                </div>
              </div>
              <div className="text-orange mb-3">⭐⭐⭐⭐⭐</div>
              <p className="font-lato text-navy/80 italic">
                "STEM-ED-ARCHITECTS transformed our school's approach to STEM
                education. The comprehensive curriculum and teacher training
                have been exceptional."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white text-xl font-bebas mr-4">
                  JK
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold text-navy">
                    John Kamau
                  </h4>
                  <p className="font-lato text-sm text-navy/70">
                    ICT Teacher, Vista International
                  </p>
                </div>
              </div>
              <div className="text-orange mb-3">⭐⭐⭐⭐⭐</div>
              <p className="font-lato text-navy/80 italic">
                "The robotics certification program equipped me with skills I
                never thought possible. My students are now competing at
                national levels!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center text-white text-xl font-bebas mr-4">
                  AO
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold text-navy">
                    Amina Omondi
                  </h4>
                  <p className="font-lato text-sm text-navy/70">
                    Student, St. Mary's School
                  </p>
                </div>
              </div>
              <div className="text-orange mb-3">⭐⭐⭐⭐⭐</div>
              <p className="font-lato text-navy/80 italic">
                "Learning robotics opened my eyes to engineering. I'm now
                pursuing Computer Science thanks to this program!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Clients Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Trusted By Leading Institutions</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Partnering with schools and organizations across Africa
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* Placeholder for partner logos - You'll replace these with actual logos */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">🏫</div>
                <p className="font-montserrat text-sm text-navy/70">
                  School Partner 1
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">🏫</div>
                <p className="font-montserrat text-sm text-navy/70">
                  School Partner 2
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">🏫</div>
                <p className="font-montserrat text-sm text-navy/70">
                  School Partner 3
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">🏫</div>
                <p className="font-montserrat text-sm text-navy/70">
                  School Partner 4
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges/Certifications Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bebas text-navy mb-4">
              Certified & Accredited
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-3">🏆</div>
              <p className="font-montserrat text-sm text-center text-navy font-semibold">
                ISO Certified
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-montserrat text-sm text-center text-navy font-semibold">
                CBC Aligned
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-3">🎓</div>
              <p className="font-montserrat text-sm text-center text-navy font-semibold">
                Cambridge Certified
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-3">🌟</div>
              <p className="font-montserrat text-sm text-center text-navy font-semibold">
                Award Winning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bebas mb-4">
            Stay Updated with STEM Insights
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Get the latest news, resources, and exclusive offers delivered to
            your inbox
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-lg text-navy font-lato focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange hover:bg-orange-dark px-8 py-4 rounded-lg font-montserrat font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Latest Insights & Resources</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Stay informed with our latest articles on STEM education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <Link href="/blog" className="group">
              <article className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="bg-gradient-to-br from-navy to-navy-light text-white h-48 flex items-center justify-center">
                  <span className="text-8xl">📖</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-montserrat font-semibold bg-orange/10 text-orange px-3 py-1 rounded-full">
                      Education
                    </span>
                    <span className="text-xs font-lato text-gray-500">
                      5 min read
                    </span>
                  </div>
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    The Future of STEM Education in Africa
                  </h3>
                  <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                    Exploring how AI and robotics are transforming education
                    across the continent...
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-montserrat font-semibold text-sm text-navy">
                        Dr. James Mwangi
                      </p>
                      <p className="font-lato text-xs text-gray-500">
                        October 10, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>

            {/* Blog Post 2 */}
            <Link href="/blog" className="group">
              <article className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="bg-gradient-to-br from-orange to-orange-dark text-white h-48 flex items-center justify-center">
                  <span className="text-8xl">🤖</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-montserrat font-semibold bg-orange/10 text-orange px-3 py-1 rounded-full">
                      Robotics
                    </span>
                    <span className="text-xs font-lato text-gray-500">
                      7 min read
                    </span>
                  </div>
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    Building a Successful Robotics Program
                  </h3>
                  <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                    A step-by-step guide for schools starting their first
                    robotics program...
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-montserrat font-semibold text-sm text-navy">
                        Sarah Kimani
                      </p>
                      <p className="font-lato text-xs text-gray-500">
                        October 8, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>

            {/* Blog Post 3 */}
            <Link href="/blog" className="group">
              <article className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="bg-gradient-to-br from-navy-light to-cyan-600 text-white h-48 flex items-center justify-center">
                  <span className="text-8xl">🧠</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-montserrat font-semibold bg-orange/10 text-orange px-3 py-1 rounded-full">
                      Technology
                    </span>
                    <span className="text-xs font-lato text-gray-500">
                      6 min read
                    </span>
                  </div>
                  <h3 className="text-2xl font-bebas text-navy mb-3 group-hover:text-orange transition-colors">
                    AI Integration in the Classroom
                  </h3>
                  <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                    Practical strategies for incorporating AI tools into daily
                    teaching...
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-montserrat font-semibold text-sm text-navy">
                        Prof. Alice Omondi
                      </p>
                      <p className="font-lato text-xs text-gray-500">
                        October 5, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-light to-navy text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6 animate-slide-up">
            Ready to Transform STEM Education?
          </h2>
          <p className="text-xl md:text-2xl font-lato mb-8 text-white/90">
            Partner with Africa's leading STEM education engineering firm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Get Started Today
            </Link>
            <Link
              href="/services"
              className="btn-outline border-2 border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

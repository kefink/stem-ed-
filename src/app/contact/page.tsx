"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || "Failed to submit contact message");
      }
      alert("Thank you! We'll be in touch soon.");
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err: any) {
      alert(err?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Let's engineer the future of STEM education together
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bebas text-navy mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="Your School/Organization"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Service Interest *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                >
                  <option value="">Select a service</option>
                  <option value="consulting">Institutional Consulting</option>
                  <option value="training">Teacher Training</option>
                  <option value="students">Student Programs</option>
                  <option value="edtech">EdTech Development</option>
                  <option value="competitions">Competition Readiness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-navy text-white p-8 rounded-2xl">
            <h2 className="text-4xl font-bebas mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">📍</span>
                  <h3 className="text-2xl font-bebas">Location</h3>
                </div>
                <p className="font-lato text-white/90 ml-12">
                  Nairobi, Kenya
                  <br />
                  Serving East Africa & Beyond
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">📧</span>
                  <h3 className="text-2xl font-bebas">Email</h3>
                </div>
                <p className="font-lato text-white/90 ml-12">
                  <a
                    href="mailto:info@stem-ed-architects.com"
                    className="hover:text-orange transition-colors"
                  >
                    info@stem-ed-architects.com
                  </a>
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">📱</span>
                  <h3 className="text-2xl font-bebas">Phone</h3>
                </div>
                <p className="font-lato text-white/90 ml-12">
                  <a
                    href="tel:+254705204870"
                    className="hover:text-orange transition-colors"
                  >
                    0705204870
                  </a>
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">🕐</span>
                  <h3 className="text-2xl font-bebas">Business Hours</h3>
                </div>
                <p className="font-lato text-white/90 ml-12">
                  Monday - Friday: 8:00 AM - 6:00 PM (EAT)
                  <br />
                  Saturday: 9:00 AM - 1:00 PM
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-2xl font-bebas mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.youtube.com/@Stem-ed-Architects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/Stem-Ed-Architects/61550350587197/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@stemedarchitects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/stemedarchitects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="bg-navy/10 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-2xl font-bebas text-navy">
              📍 Map Integration Coming Soon
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

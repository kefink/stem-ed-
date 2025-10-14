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
    // TODO: Connect to FastAPI backend
    console.log("Form submitted:", formData);
    setTimeout(() => {
      alert("Thank you! We'll be in touch soon.");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 1000);
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
                    href="tel:+254700000000"
                    className="hover:text-orange transition-colors"
                  >
                    +254 700 000 000
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
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-2xl">🔗</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-2xl">📘</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-orange rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-2xl">🐦</span>
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

"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    interests: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const interestOptions = [
    "Robotics Education",
    "AI Integration",
    "Teacher Training",
    "Curriculum Development",
    "STEM Competitions",
    "EdTech Solutions",
    "Policy & Strategy",
    "Success Stories",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          organization: formData.organization,
          role: formData.role,
          interests: formData.interests,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || "Subscription failed");
      }
      setIsSubscribed(true);
    } catch (err: any) {
      alert(err?.message || "Subscription failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bebas text-navy mb-4">
            You're Subscribed!
          </h1>
          <p className="text-lg font-lato text-gray-700 mb-8">
            Thank you for joining our community! Check your email for a
            confirmation message.
          </p>
          <div className="space-y-4">
            <a
              href="/blog"
              className="block w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Explore Our Blog
            </a>
            <a
              href="/"
              className="block w-full bg-navy hover:bg-navy-light text-white font-montserrat font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange via-orange-dark to-orange text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">Newsletter</h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Stay informed about the latest in STEM education, robotics, and AI
            integration
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bebas text-navy text-center mb-8">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Weekly Insights
              </h3>
              <p className="font-lato text-gray-600">
                Expert articles and resources delivered to your inbox
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Exclusive Content
              </h3>
              <p className="font-lato text-gray-600">
                Access to webinars, guides, and training materials
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Early Access
              </h3>
              <p className="font-lato text-gray-600">
                Be first to know about new products and programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-4xl font-bebas text-navy mb-6 text-center">
            Subscribe Now
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Organization & Role */}
            <div className="grid md:grid-cols-2 gap-4">
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
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                >
                  <option value="">Select your role</option>
                  <option value="teacher">Teacher/Educator</option>
                  <option value="administrator">School Administrator</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="government">Government Official</option>
                  <option value="ngo">NGO/Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block font-montserrat font-semibold text-navy mb-3">
                Topics of Interest
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
                    />
                    <span className="font-lato text-gray-700 text-sm">
                      {interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
            </button>

            <p className="text-center font-lato text-sm text-gray-500">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

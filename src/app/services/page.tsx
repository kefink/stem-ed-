export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: "🏛️",
      title: "Institutional STEM Consulting",
      description:
        "Full ecosystem design for schools, governments, and organizations",
      features: [
        "Curriculum design & alignment (CBC/Cambridge/IB)",
        "STEM lab setup & infrastructure planning",
        "Program evaluation & quality assurance",
        "Strategic roadmap development",
        "National scalability frameworks",
      ],
    },
    {
      id: 2,
      icon: "👨‍🏫",
      title: "Teacher Training & Certification",
      description: "Building educator capacity for sustainable STEM delivery",
      features: [
        "Robotics & AI pedagogy workshops",
        "Professional certification programs",
        "Train-the-trainer models",
        "Continuous professional development",
        "Assessment & mentorship systems",
      ],
    },
    {
      id: 3,
      icon: "🎓",
      title: "Student Programs",
      description: "Innovation pathways from foundation to capstone",
      features: [
        "Age-appropriate robotics curricula (K-12)",
        "Project-based learning modules",
        "STEM clubs & innovation hubs",
        "Coding & computational thinking",
        "Maker spaces & prototyping labs",
      ],
    },
    {
      id: 4,
      icon: "💻",
      title: "EdTech Development",
      description: "Custom learning platforms and digital solutions",
      features: [
        "Learning Management Systems (LMS)",
        "AI-integrated teaching tools",
        "VR/AR educational experiences",
        "Student assessment platforms",
        "Parent & teacher dashboards",
      ],
    },
    {
      id: 5,
      icon: "🏆",
      title: "Competition Readiness",
      description: "Preparing students for national & international challenges",
      features: [
        "FLL (First Lego League) training",
        "WRO (World Robot Olympiad) prep",
        "National STEM Olympiads",
        "Innovation competitions",
        "Portfolio development for university",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange via-orange-dark to-orange text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Complete STEM ecosystem engineering — from strategic consulting to
            student capstone delivery
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">The 5-Pillar Service Framework</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Comprehensive solutions engineered for scalability,
              sustainability, and measurable impact
            </p>
          </div>

          <div className="space-y-12">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center bg-gradient-to-br ${
                  index % 2 === 0
                    ? "from-navy/5 to-navy/10"
                    : "from-orange/5 to-orange/10"
                } p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className="md:w-1/3 text-center">
                  <div className="text-8xl mb-4">{service.icon}</div>
                  <h3 className="text-3xl font-bebas text-navy mb-2">
                    {service.title}
                  </h3>
                  <p className="font-lato text-gray-600">
                    {service.description}
                  </p>
                </div>
                <div className="md:w-2/3">
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start bg-white p-4 rounded-lg shadow-sm"
                      >
                        <span className="text-orange text-xl mr-3">✓</span>
                        <span className="font-lato text-gray-800">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Why Choose STEM-ED-ARCHITECTS?
          </h2>
          <p className="text-2xl font-lato mb-8 text-orange">
            "The only East African firm engineering complete, AI-integrated,
            CBC/Cambridge/IB-aligned robotics curricula — from strategy to
            student capstone."
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bebas mb-2">Systems Thinking</h3>
              <p className="font-lato text-white/90">
                Not piecemeal solutions — complete ecosystem design
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bebas mb-2">African Context</h3>
              <p className="font-lato text-white/90">
                Built for African schools, governments, and institutions
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bebas mb-2">Future-Ready</h3>
              <p className="font-lato text-white/90">
                AI-integrated, VR-enabled, competition-aligned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-orange to-orange-dark text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Let's Build Your STEM Ecosystem
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Schedule a consultation to discuss your institution's needs
          </p>
          <a
            href="/contact"
            className="btn-primary bg-navy hover:bg-navy-light"
          >
            Request Consultation
          </a>
        </div>
      </section>
    </div>
  );
}

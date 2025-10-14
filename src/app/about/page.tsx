import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">
            About STEM-ED-ARCHITECTS
          </h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            We don't just deliver training. We architect sustainable systems
            that turn vision into impact.
          </p>
        </div>
      </section>

      {/* What We Are Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title text-left">
                What Is STEM-ED-ARCHITECTS?
              </h2>
              <p className="text-lg font-lato text-gray-700 mb-6">
                STEM Ed Architects is a{" "}
                <strong>future-ready education engineering firm</strong> that
                designs, builds, and scales integrated STEM programs for
                schools, governments, NGOs, and private institutions across
                Africa.
              </p>
              <p className="text-lg font-lato text-gray-700 mb-6">
                We architect sustainable systems from curriculum design to
                teacher certification, AI integration, robotics labs, and
                student innovation pathways.
              </p>
              <div className="bg-orange/10 border-l-4 border-orange p-6 rounded-r-lg">
                <p className="text-xl font-bebas text-navy">Our Mission:</p>
                <p className="text-lg font-lato text-gray-800">
                  To make high-quality, structured, AI-integrated STEM education
                  accessible to every child — regardless of background or
                  resources.
                </p>
              </div>
            </div>
            <div className="bg-navy/5 p-8 rounded-2xl">
              <h3 className="text-3xl font-bebas text-navy mb-6">
                🏗️ The 5-Pillar Framework
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-orange text-2xl mr-3">1.</span>
                  <div>
                    <strong className="font-montserrat text-navy">
                      Vision:
                    </strong>
                    <p className="font-lato text-gray-700">
                      To become the definitive leader in African STEM
                      transformation
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange text-2xl mr-3">2.</span>
                  <div>
                    <strong className="font-montserrat text-navy">
                      Core Identity:
                    </strong>
                    <p className="font-lato text-gray-700">
                      Not a vendor. Not a trainer. An architect of educational
                      systems.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange text-2xl mr-3">3.</span>
                  <div>
                    <strong className="font-montserrat text-navy">
                      Unique Value:
                    </strong>
                    <p className="font-lato text-gray-700">
                      The only East African firm engineering complete,
                      AI-integrated curricula
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange text-2xl mr-3">4.</span>
                  <div>
                    <strong className="font-montserrat text-navy">
                      Service Domains:
                    </strong>
                    <p className="font-lato text-gray-700">
                      Consulting, Training, Student Programs, EdTech,
                      Competitions
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange text-2xl mr-3">5.</span>
                  <div>
                    <strong className="font-montserrat text-navy">
                      Brand Tone:
                    </strong>
                    <p className="font-lato text-gray-700">
                      Authoritative, visionary, empowering, African-futurist
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-16">
            30+ Years of Expertise
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Software Engineering
              </h3>
              <p className="font-lato text-gray-600">
                System design & architecture
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Systems Architecture
              </h3>
              <p className="font-lato text-gray-600">
                Scalable learning platforms
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                EdTech Development
              </h3>
              <p className="font-lato text-gray-600">
                Custom learning solutions
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Robotics Education
              </h3>
              <p className="font-lato text-gray-600">Hands-on STEM programs</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🥽</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                VR/AR Integration
              </h3>
              <p className="font-lato text-gray-600">
                Immersive learning experiences
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                AI Consultation
              </h3>
              <p className="font-lato text-gray-600">AI-integrated pedagogy</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Teacher Training
              </h3>
              <p className="font-lato text-gray-600">
                Professional certification
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bebas text-navy mb-2">
                Brand Strategy
              </h3>
              <p className="font-lato text-gray-600">Educational positioning</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Ready to Engineer Learning Solutions?
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Let's transform STEM education together
          </p>
          <a
            href="/contact"
            className="btn-primary bg-orange hover:bg-orange-dark"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}

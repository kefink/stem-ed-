import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide animate-fade-in">
            About STEM-ED-ARCHITECTS
          </h1>
          <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl lg:text-3xl font-lato max-w-4xl mx-auto text-white/95 leading-relaxed animate-slide-up">
            We don't just deliver training. We architect sustainable systems
            that turn vision into impact.
          </p>
        </div>
      </section>

      {/* What We Are Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="section-title text-left mb-4">
                What Is STEM-ED-ARCHITECTS?
              </h2>
              <div className="w-20 h-1 bg-orange mb-6"></div>
              <p className="text-lg md:text-xl font-lato text-gray-700 leading-relaxed">
                STEM Ed Architects is a{" "}
                <strong className="text-navy">
                  future-ready education engineering firm
                </strong>{" "}
                that designs, builds, and scales integrated STEM programs for
                schools, governments, NGOs, and private institutions across
                Africa.
              </p>
              <p className="text-lg md:text-xl font-lato text-gray-700 leading-relaxed">
                We architect sustainable systems from curriculum design to
                teacher certification, AI integration, robotics labs, and
                student innovation pathways.
              </p>
              <div className="bg-gradient-to-r from-orange/10 to-orange/5 border-l-4 border-orange p-8 rounded-r-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <p className="text-2xl font-bebas text-navy mb-3 tracking-wide">
                  Our Mission:
                </p>
                <p className="text-lg md:text-xl font-lato text-gray-800 leading-relaxed">
                  To make high-quality, structured, AI-integrated STEM education
                  accessible to every child — regardless of background or
                  resources.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-navy/10 via-navy/5 to-transparent p-10 rounded-3xl shadow-xl border border-navy/10">
              <h3 className="text-4xl font-bebas text-navy mb-4 tracking-wide">
                Who We Serve
              </h3>
              <div className="w-16 h-1 bg-orange mb-6"></div>
              <p className="font-lato text-gray-700 mb-8 text-lg leading-relaxed">
                We partner with schools, governments, NGOs, and private
                institutions to design and deploy scalable, AI-integrated STEM
                learning ecosystems—end to end.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="group p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-orange/30">
                  <div className="text-3xl mb-2">🏫</div>
                  <p className="font-montserrat font-semibold text-navy">
                    K-12 Schools
                  </p>
                </div>
                <div className="group p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-orange/30">
                  <div className="text-3xl mb-2">👨‍🏫</div>
                  <p className="font-montserrat font-semibold text-navy">
                    Teacher Colleges
                  </p>
                </div>
                <div className="group p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-orange/30">
                  <div className="text-3xl mb-2">💻</div>
                  <p className="font-montserrat font-semibold text-navy">
                    EdTech Programs
                  </p>
                </div>
                <div className="group p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-orange/30">
                  <div className="text-3xl mb-2">🏛️</div>
                  <p className="font-montserrat font-semibold text-navy">
                    Govt & NGOs
                  </p>
                </div>
                <div className="group p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-orange/30">
                  <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                  <p className="font-montserrat font-semibold text-navy">
                    Parents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">30+ Years of Expertise</h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Decades of experience in engineering education solutions that
              deliver real impact
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💻
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                Software Engineering
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                System design & architecture
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🏗️
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                Systems Architecture
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Scalable learning platforms
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎓
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                EdTech Development
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Custom learning solutions
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                Robotics Education
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Hands-on STEM programs
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🥽
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                VR/AR Integration
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Immersive learning experiences
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                �
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                AI Consultation
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                AI-integrated pedagogy
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                Teacher Training
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Professional certification
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange/30">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎨
              </div>
              <h3 className="text-xl font-bebas text-navy mb-3 tracking-wide">
                Brand Strategy
              </h3>
              <p className="font-lato text-gray-600 text-sm leading-relaxed">
                Educational positioning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.15),transparent_70%)]"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange/5 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Ready to Engineer Learning Solutions?
          </h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
            Let's transform STEM education together and build the future of
            learning
          </p>
          <a
            href="/contact"
            className="inline-block btn-primary bg-orange hover:bg-orange-dark text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-orange/50 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}

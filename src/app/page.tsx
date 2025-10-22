import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title">We Engineer Learning Systems</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              We architect sustainable STEM ecosystems that transform vision into measurable impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-navy to-navy-light text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-cyan-500/20">
              <div className="text-6xl mb-4 animate-bounce">🎯</div>
              <h3 className="text-3xl font-bebas mb-4 text-orange">Our Mission</h3>
              <p className="font-lato text-white/90 leading-relaxed">
                Making high-quality, AI-integrated STEM education accessible to every child — regardless of background or resources
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-orange to-orange-dark text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bebas mb-4">Our Vision</h3>
              <p className="font-lato text-white/90 leading-relaxed">
                To become the definitive leader in African STEM transformation by engineering plug-and-play, nationally scalable learning ecosystems
              </p>
            </div>

            {/* Identity Card */}
            <div className="bg-gradient-to-br from-navy-light to-navy text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-cyan-500/20">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-3xl font-bebas mb-4 text-orange">Who We Are</h3>
              <p className="font-lato text-white/90 leading-relaxed">
                Architects of educational systems — from curriculum design to teacher certification
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
              We don't just deliver training—we build complete learning ecosystems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">Complete Curricula</h3>
              <p className="font-lato text-navy/70 text-sm">CBC, Cambridge & IB-aligned programs</p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">AI Integration</h3>
              <p className="font-lato text-navy/70 text-sm">Next-generation learning tools</p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">Teacher Training</h3>
              <p className="font-lato text-navy/70 text-sm">Comprehensive certification programs</p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-xl hover:bg-orange/10 transition-all duration-300 border border-transparent hover:border-orange">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">Full Support</h3>
              <p className="font-lato text-navy/70 text-sm">Strategy to student capstone</p>
            </div>
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

import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">We Engineer Learning Systems</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Not just training delivery. We architect sustainable STEM
              ecosystems that transform vision into measurable impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-navy text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bebas mb-3">Our Mission</h3>
              <p className="font-lato text-white/90">
                To make high-quality, structured, AI-integrated STEM education
                accessible to every child — regardless of background or
                resources.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-orange text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bebas mb-3">Our Vision</h3>
              <p className="font-lato text-white/90">
                To become the definitive leader in African STEM transformation
                by engineering plug-and-play, nationally scalable learning
                ecosystems.
              </p>
            </div>

            {/* Identity Card */}
            <div className="bg-navy-light text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bebas mb-3">Who We Are</h3>
              <p className="font-lato text-white/90">
                Not a vendor. Not a trainer. We are architects of educational
                systems — from curriculum design to teacher certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Ready to Transform STEM Education?
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Partner with Africa's leading STEM education engineering firm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary">
              Get Started
            </a>
            <a
              href="/services"
              className="btn-outline border-white text-white hover:bg-white hover:text-navy"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

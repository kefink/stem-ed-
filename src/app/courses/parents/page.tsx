import Breadcrumbs from "@/components/Breadcrumbs";

export default function ParentsCoursesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/parents" },
            { label: "Parents" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">Courses for Parents</h1>
        <p className="mt-2 font-lato text-white/80">
          Guides, home STEM, and support for your child’s learning journey.
        </p>
      </section>
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl space-y-10">
          <div>
            <h2 className="section-title text-left mb-4">Home STEM Kits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {["Starter Kit", "Robotics Mini", "Science Lab at Home"].map(
                (t) => (
                  <div
                    key={t}
                    className="p-6 rounded-xl bg-white shadow border border-navy/10"
                  >
                    <div className="h-36 bg-navy/10 rounded-lg mb-4 flex items-center justify-center text-navy/60 font-montserrat">
                      Placeholder Image
                    </div>
                    <h3 className="font-montserrat text-lg text-navy mb-2">
                      {t}
                    </h3>
                    <p className="font-lato text-gray-600 text-sm">
                      Curated activities with video guides.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange/20 to-orange/10 border border-orange/30">
            <h3 className="font-bebas text-2xl text-navy mb-2">
              Join a Parent Info Session
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              Learn how to support STEM at home with our kits and guides.
            </p>
            <a
              href="/contact"
              className="btn-primary bg-orange hover:bg-orange-dark"
            >
              Register Interest
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

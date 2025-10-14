import Breadcrumbs from "@/components/Breadcrumbs";

export default function AdminsCoursesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/admins" },
            { label: "Admins" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">
          Courses for School Admins
        </h1>
        <p className="mt-2 font-lato text-white/80">
          Leadership, strategy, policy, and whole-school STEM integration.
        </p>
      </section>
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl space-y-10">
          <div>
            <h2 className="section-title text-left mb-4">Programs</h2>
            <ul className="grid md:grid-cols-2 gap-4 font-lato text-gray-700">
              {[
                "STEM Strategy & Policy",
                "Budgeting & Procurement",
                "Infrastructure & Labs",
                "Monitoring & Evaluation",
              ].map((m) => (
                <li
                  key={m}
                  className="p-4 rounded-lg bg-navy/5 border border-navy/10"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange/20 to-orange/10 border border-orange/30">
            <h3 className="font-bebas text-2xl text-navy mb-2">
              Plan a School-Wide Rollout
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              We’ll co-design implementation and success metrics.
            </p>
            <a
              href="/contact"
              className="btn-primary bg-orange hover:bg-orange-dark"
            >
              Book a Consult
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

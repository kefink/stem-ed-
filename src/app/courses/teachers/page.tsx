import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function TeachersCoursesPage() {
  const levels = [
    { name: "Elementary Level", href: "/courses/teachers/elementary" },
    { name: "Middle School", href: "/courses/teachers/middle-school" },
    { name: "Junior School", href: "/courses/teachers/junior-school" },
    { name: "Senior School", href: "/courses/teachers/senior-school" },
    { name: "K-12 Schools", href: "/courses/teachers/k12" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/teachers" },
            { label: "Teachers" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">
          Courses for Teachers
        </h1>
        <p className="mt-2 font-lato text-white/80">
          Certification, pedagogy, and classroom implementation.
        </p>
      </section>

      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl space-y-10">
          <p className="font-lato text-gray-700">Choose your level:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((lvl) => (
              <Link
                key={lvl.href}
                href={lvl.href}
                className="block p-5 rounded-xl bg-navy/5 hover:bg-orange/10 border border-navy/10 hover:border-orange/30 transition"
              >
                <span className="font-montserrat text-navy">{lvl.name}</span>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="section-title text-left mb-4">Sample Modules</h2>
            <ul className="grid md:grid-cols-2 gap-4 font-lato text-gray-700">
              {[
                "STEM Pedagogy 101",
                "Assessment in STEM",
                "Project-Based Learning",
                "Integrating AI in Class",
                "Safety & Lab Setup",
                "Differentiation Strategies",
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

          <div>
            <h2 className="section-title text-left mb-4">Outcomes</h2>
            <div className="grid md:grid-cols-3 gap-4 font-lato">
              {[
                "Lesson design",
                "Assessment design",
                "Classroom management",
                "Tech integration",
                "Mentoring",
                "Evidence portfolios",
              ].map((o) => (
                <div
                  key={o}
                  className="p-4 bg-white rounded-lg shadow border border-navy/10"
                >
                  {o}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange/20 to-orange/10 border border-orange/30">
            <h3 className="font-bebas text-2xl text-navy mb-2">
              Kickstart Teacher Certification
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              We’ll tailor a pathway for your teachers’ level and goals.
            </p>
            <a
              href="/contact"
              className="btn-primary bg-orange hover:bg-orange-dark"
            >
              Talk to Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

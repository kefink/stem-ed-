import Link from "next/link";

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
      <section className="bg-navy text-white py-16 px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl md:text-6xl font-bebas">Courses for Teachers</h1>
        <p className="mt-2 font-lato text-white/80">Certification, pedagogy, and classroom implementation.</p>
      </section>

      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl space-y-6">
          <p className="font-lato text-gray-700">
            Choose your level:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((lvl) => (
              <Link key={lvl.href} href={lvl.href} className="block p-5 rounded-xl bg-navy/5 hover:bg-orange/10 border border-navy/10 hover:border-orange/30 transition">
                <span className="font-montserrat text-navy">{lvl.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

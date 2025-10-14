import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function K12LevelPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/teachers" },
            { label: "Teachers", href: "/courses/teachers" },
            { label: "K-12 Schools" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">
          Teachers: K-12 Schools
        </h1>
        <p className="mt-2 font-lato text-white/80">
          Whole-school STEM alignment and leadership.
        </p>
      </section>
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl space-y-8">
          <Link
            href="/courses/teachers"
            className="font-montserrat text-navy hover:text-orange"
          >
            ← Back to Teachers
          </Link>

          <div>
            <h2 className="section-title text-left mb-4">Program Outline</h2>
            <ul className="list-disc pl-6 font-lato text-gray-700 space-y-2">
              <li>STEM vision & strategy</li>
              <li>Scope & sequence (K-12)</li>
              <li>Teacher PD & coaching</li>
              <li>Labs, makerspaces, safety</li>
              <li>Assessment & accreditation</li>
            </ul>
          </div>

          <div>
            <h2 className="section-title text-left mb-4">Outcomes</h2>
            <div className="grid md:grid-cols-3 gap-4 font-lato">
              {[
                "Aligned K-12 curriculum",
                "PD plan & coaching",
                "Lab/makerspace setup",
                "Evidence portfolios",
                "Community partnerships",
                "Sustainability roadmap",
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
              Transform Your School
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              We'll co-design a K-12 STEM roadmap tailored to your school
              context.
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

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function JuniorSchoolLevelPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/teachers" },
            { label: "Teachers", href: "/courses/teachers" },
            { label: "Junior School" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">
          Teachers: Junior School
        </h1>
        <p className="mt-2 font-lato text-white/80">
          Competency-based STEM frameworks and projects.
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
            <h2 className="section-title text-left mb-4">Curriculum Outline</h2>
            <ul className="list-disc pl-6 font-lato text-gray-700 space-y-2">
              <li>Design challenges</li>
              <li>Robotics competitions prep</li>
              <li>Intro to AI concepts</li>
              <li>STEM career exposure</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange/20 to-orange/10 border border-orange/30">
            <h3 className="font-bebas text-2xl text-navy mb-2">
              Start Junior School Pathway
            </h3>
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

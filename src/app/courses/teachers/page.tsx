"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function TeachersCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEnroll = () => {
    if (status === "authenticated") {
      alert("🎉 Enrollment successful! Course materials coming soon.");
      // Future: router.push("/courses/teachers/materials");
    } else {
      router.push("/register?next=/courses/teachers");
    }
  };

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
              Ready to Get Certified?
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              {status === "authenticated"
                ? "Enroll in teacher certification to access course materials and track your progress."
                : "Register now to enroll and begin your teacher certification journey."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEnroll}
                className="btn-primary bg-orange hover:bg-orange-dark font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                {status === "authenticated" ? "Enroll in Certification" : "Register & Enroll"}
              </button>
              <a
                href="/contact"
                className="btn-secondary border-2 border-navy text-navy hover:bg-navy hover:text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Talk to Us
              </a>
            </div>
            {status !== "authenticated" && (
              <p className="mt-3 text-sm font-lato text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login?next=/courses/teachers"
                  className="text-orange hover:text-orange-dark font-semibold"
                >
                  Sign in here
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

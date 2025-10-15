"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function StudentsCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEnroll = () => {
    if (status === "authenticated") {
      // User is logged in - show success message or redirect to course materials
      alert("🎉 Enrollment successful! Course materials coming soon.");
      // Future: router.push("/courses/students/materials");
    } else {
      // User not logged in - redirect to register
      router.push("/register?next=/courses/students");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-navy text-white pt-10 pb-6 px-6 md:px-12 lg:px-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses/students" },
            { label: "Students" },
          ]}
        />
        <h1 className="text-4xl md:text-6xl font-bebas">
          Courses for Students
        </h1>
        <p className="mt-2 font-lato text-white/80">
          Explore student-focused STEM programs and pathways.
        </p>
      </section>

      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl space-y-12">
          {/* Tracks */}
          <div>
            <h2 className="section-title text-left mb-6">Curriculum Tracks</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Robotics & Automation",
                "Coding & App Dev",
                "AI & Data Basics",
              ].map((t) => (
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
                    Hands-on modules with projects and challenges.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h2 className="section-title text-left mb-6">Sample Modules</h2>
            <ul className="grid md:grid-cols-2 gap-4 font-lato text-gray-700">
              {[
                "Intro to Block Coding",
                "Sensors & Inputs",
                "Building a Line-Follower",
                "Intro to Python",
                "Data in Everyday Life",
                "Design Thinking Sprint",
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

          {/* Outcomes */}
          <div>
            <h2 className="section-title text-left mb-6">Learner Outcomes</h2>
            <div className="grid md:grid-cols-3 gap-4 font-lato">
              {[
                "Problem solving",
                "Collaboration",
                "Basic coding",
                "Prototyping",
                "Presentation skills",
                "Creative thinking",
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

          {/* CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange/20 to-orange/10 border border-orange/30">
            <h3 className="font-bebas text-2xl text-navy mb-2">
              Ready to Get Started?
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              {status === "authenticated"
                ? "Enroll in this course to access materials and track your progress."
                : "Register now to enroll in this course and access all learning materials."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEnroll}
                className="btn-primary bg-orange hover:bg-orange-dark font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                {status === "authenticated" ? "Enroll in This Course" : "Register & Enroll"}
              </button>
              <a
                href="/contact"
                className="btn-secondary border-2 border-navy text-navy hover:bg-navy hover:text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Request Group Program
              </a>
            </div>
            {status !== "authenticated" && (
              <p className="mt-3 text-sm font-lato text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login?next=/courses/students"
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

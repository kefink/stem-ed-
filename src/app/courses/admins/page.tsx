"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AdminsCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEnroll = () => {
    if (status === "authenticated") {
      alert("🎉 Enrollment successful! Course materials coming soon.");
      // Future: router.push("/courses/admins/materials");
    } else {
      router.push("/register?next=/courses/admins");
    }
  };

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
              Ready to Transform Your School's STEM Program?
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              {status === "authenticated"
                ? "Enroll now to access admin resources, strategy templates, and implementation guides."
                : "Register now to access leadership resources and plan your school-wide STEM rollout."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEnroll}
                className="btn-primary bg-orange hover:bg-orange-dark font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                {status === "authenticated" ? "Enroll & Access Resources" : "Register & Enroll"}
              </button>
              <a
                href="/contact"
                className="btn-secondary border-2 border-navy text-navy hover:bg-navy hover:text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Book a Consult
              </a>
            </div>
            {status !== "authenticated" && (
              <p className="mt-3 text-sm font-lato text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login?next=/courses/admins"
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

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ParentsCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEnroll = () => {
    if (status === "authenticated") {
      alert("🎉 Enrollment successful! Course materials coming soon.");
      // Future: router.push("/courses/parents/materials");
    } else {
      router.push("/register?next=/courses/parents");
    }
  };

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
              Ready to Support Your Child's STEM Journey?
            </h3>
            <p className="font-lato text-gray-700 mb-4">
              {status === "authenticated"
                ? "Enroll now to access home STEM kits, guides, and parent resources."
                : "Register now to access exclusive parent guides and home learning kits."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEnroll}
                className="btn-primary bg-orange hover:bg-orange-dark font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                {status === "authenticated" ? "Enroll & Access Materials" : "Register & Enroll"}
              </button>
              <a
                href="/contact"
                className="btn-secondary border-2 border-navy text-navy hover:bg-navy hover:text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Schedule Info Session
              </a>
            </div>
            {status !== "authenticated" && (
              <p className="mt-3 text-sm font-lato text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login?next=/courses/parents"
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

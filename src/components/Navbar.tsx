"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clearTokens, logout } from "@/lib/apiClient";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  // Get user's first name or email
  const getUserDisplayName = () => {
    if (session?.user?.name) {
      return session.user.name.split(" ")[0];
    }
    if (session?.user?.email) {
      return session.user.email.split("@")[0];
    }
    return "User";
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    clearTokens();
    await signOut({ callbackUrl: "/" });
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest(".profile-dropdown-container")) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isProfileOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  const coursesMenu = {
    students: {
      name: "For Students",
      href: "/courses/students",
    },
    teachers: {
      name: "For Teachers",
      href: "/courses/teachers",
      levels: [
        { name: "Elementary Level", href: "/courses/teachers/elementary" },
        { name: "Middle School", href: "/courses/teachers/middle-school" },
        { name: "Junior School", href: "/courses/teachers/junior-school" },
        { name: "Senior School", href: "/courses/teachers/senior-school" },
        { name: "K-12 Schools", href: "/courses/teachers/k12" },
      ],
    },
    admins: {
      name: "For School Admins",
      href: "/courses/admins",
    },
    parents: {
      name: "For Parents",
      href: "/courses/parents",
    },
  };

  const authLinks = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
        <div className="relative rounded-2xl px-3 md:px-5 py-3 text-white backdrop-blur-2xl bg-gradient-to-br from-navy/95 via-navy/90 to-navy/95 border border-cyan-500/30 shadow-[0_8px_32px_0_rgba(0,119,182,0.37)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:ring-1 before:ring-cyan-400/30 before:shadow-[0_0_22px_rgba(0,200,255,0.25)] before:pointer-events-none">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <div className="relative w-14 h-14 md:w-16 md:h-16 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/stemed.png"
                  alt="STEM-ED-ARCHITECTS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-orange font-bebas tracking-wide">
                <span className="hidden 2xl:block text-3xl">
                  STEM-ED-ARCHITECTS
                </span>
                <span className="hidden lg:block 2xl:hidden text-2xl">
                  STEM-ED
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 overflow-visible gap-4 xl:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch
                  className={`whitespace-nowrap font-montserrat font-medium text-sm lg:text-[15px] xl:text-base hover:text-orange transition-colors duration-300 relative group ${
                    isActive(link.href) ? "text-orange" : ""
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full ${
                      isActive(link.href) ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              ))}

              {/* Courses Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCoursesOpen(true)}
                onMouseLeave={() => {
                  setIsCoursesOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <button
                  className={`whitespace-nowrap font-montserrat font-medium hover:text-orange transition-colors duration-300 relative group flex items-center gap-1 ${
                    pathname.startsWith("/courses") ? "text-orange" : ""
                  }`}
                  onClick={() => setIsCoursesOpen((v) => !v)}
                  onFocus={() => setIsCoursesOpen(true)}
                >
                  Courses
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isCoursesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full ${
                      pathname.startsWith("/courses") ? "w-full" : ""
                    }`}
                  ></span>
                </button>

                {/* Dropdown Menu */}
                {isCoursesOpen && (
                  <div className="absolute z-50 top-full left-0 mt-2 w-64 backdrop-blur-2xl bg-gradient-to-br from-navy/95 via-navy/90 to-navy/95 border border-cyan-500/30 rounded-xl shadow-[0_8px_32px_0_rgba(0,119,182,0.37)] overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-xl before:ring-1 before:ring-cyan-400/30 before:shadow-[0_0_18px_rgba(0,200,255,0.22)] before:pointer-events-none">
                    {/* For Students */}
                    <Link
                      href={coursesMenu.students.href}
                      className="block px-6 py-3 hover:bg-orange/20 transition-colors duration-300 border-b border-white/10"
                    >
                      <span className="font-montserrat font-medium">
                        {coursesMenu.students.name}
                      </span>
                    </Link>

                    {/* For Teachers with Submenu */}
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveSubmenu("teachers")}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <div className="hover:bg-orange/20 transition-colors duration-300 border-b border-white/10 flex items-stretch justify-between">
                        <Link
                          href={coursesMenu.teachers.href}
                          className="flex-1 px-6 py-3 font-montserrat font-medium"
                        >
                          {coursesMenu.teachers.name}
                        </Link>
                        <button
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded={activeSubmenu === "teachers"}
                          className="px-4 py-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCoursesOpen(true);
                            setActiveSubmenu((prev) =>
                              prev === "teachers" ? null : "teachers"
                            );
                          }}
                          title="Show teacher levels"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Teachers Submenu */}
                      {activeSubmenu === "teachers" && (
                        <div className="absolute z-50 left-full top-0 ml-2 w-56 backdrop-blur-2xl bg-gradient-to-br from-navy/95 via-navy/90 to-navy/95 border border-cyan-500/30 rounded-xl shadow-[0_8px_32px_0_rgba(0,119,182,0.37)] overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-xl before:ring-1 before:ring-cyan-400/30 before:shadow-[0_0_18px_rgba(0,200,255,0.22)] before:pointer-events-none">
                          {coursesMenu.teachers.levels.map((level) => (
                            <Link
                              key={level.name}
                              href={level.href}
                              className="block px-6 py-3 hover:bg-orange/20 transition-colors duration-300 border-b border-white/10 last:border-b-0"
                            >
                              <span className="font-montserrat text-sm">
                                {level.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* For School Admins */}
                    <Link
                      href={coursesMenu.admins.href}
                      className="block px-6 py-3 hover:bg-orange/20 transition-colors duration-300 border-b border-white/10"
                    >
                      <span className="font-montserrat font-medium">
                        {coursesMenu.admins.name}
                      </span>
                    </Link>

                    {/* For Parents */}
                    <Link
                      href={coursesMenu.parents.href}
                      className="block px-6 py-3 hover:bg-orange/20 transition-colors duration-300"
                    >
                      <span className="font-montserrat font-medium">
                        {coursesMenu.parents.name}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0 ml-auto">
              {isAuthed ? (
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-dark rounded-full flex items-center justify-center text-white text-sm font-bebas">
                      {getUserInitials()}
                    </div>
                    <span className="font-montserrat font-medium text-sm lg:text-[15px] xl:text-base whitespace-nowrap">
                      {getUserDisplayName()}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-montserrat font-semibold text-navy text-sm">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="font-lato text-xs text-gray-500 truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 font-montserrat text-sm text-gray-700 hover:bg-orange/10 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          My Profile
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 font-montserrat text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-montserrat font-medium text-sm lg:text-[15px] xl:text-base hover:text-orange transition-colors duration-300 whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-orange to-orange/90 hover:from-orange-dark hover:to-orange px-5 xl:px-6 py-2.5 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange/50 whitespace-nowrap"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-4 animate-slide-up backdrop-blur-2xl bg-gradient-to-br from-navy/95 via-navy/90 to-navy/95 rounded-xl p-4 border border-cyan-500/30 shadow-[0_8px_32px_0_rgba(0,119,182,0.37)]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block font-montserrat font-medium hover:text-orange transition-colors duration-300 ${
                    isActive(link.href) ? "text-orange" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Courses Menu */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                  className="w-full text-left font-montserrat font-medium hover:text-orange transition-colors duration-300 flex items-center justify-between"
                >
                  Courses
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isCoursesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCoursesOpen && (
                  <div className="ml-4 space-y-2 pl-4 border-l-2 border-orange/30">
                    <Link
                      href={coursesMenu.students.href}
                      className="block font-montserrat text-sm hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {coursesMenu.students.name}
                    </Link>

                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setActiveSubmenu(
                            activeSubmenu === "teachers" ? null : "teachers"
                          )
                        }
                        className="w-full text-left font-montserrat text-sm hover:text-orange transition-colors duration-300 flex items-center justify-between"
                      >
                        {coursesMenu.teachers.name}
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${
                            activeSubmenu === "teachers" ? "rotate-90" : ""
                          }`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {activeSubmenu === "teachers" && (
                        <div className="ml-4 space-y-2 pl-4 border-l border-orange/20">
                          {coursesMenu.teachers.levels.map((level) => (
                            <Link
                              key={level.name}
                              href={level.href}
                              className="block font-montserrat text-xs hover:text-orange transition-colors duration-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {level.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={coursesMenu.admins.href}
                      className="block font-montserrat text-sm hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {coursesMenu.admins.name}
                    </Link>

                    <Link
                      href={coursesMenu.parents.href}
                      className="block font-montserrat text-sm hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {coursesMenu.parents.name}
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/20 space-y-3">
                <Link
                  href="/newsletter"
                  className="block font-montserrat font-medium hover:text-orange transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Newsletter
                </Link>
                {isAuthed ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-dark rounded-full flex items-center justify-center text-white text-sm font-bebas">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="font-montserrat font-semibold text-sm">
                          {getUserDisplayName()}
                        </p>
                        <p className="font-lato text-xs text-white/70 truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block font-montserrat font-medium hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full bg-orange hover:bg-orange-dark px-6 py-2 rounded-lg font-montserrat font-semibold text-center transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block font-montserrat font-medium hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-orange hover:bg-orange-dark px-6 py-2 rounded-lg font-montserrat font-semibold text-center transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

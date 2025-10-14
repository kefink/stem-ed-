"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const authLinks = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/stemed.png"
                alt="STEM-ED-ARCHITECTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-orange text-xl md:text-2xl lg:text-3xl font-bebas tracking-wider">
              STEM-ED-ARCHITECTS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-montserrat font-medium hover:text-orange transition-colors duration-300 relative group ${
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
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/newsletter"
              className="font-montserrat font-medium hover:text-orange transition-colors duration-300"
            >
              Newsletter
            </Link>
            <Link
              href="/login"
              className="font-montserrat font-medium hover:text-orange transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-orange hover:bg-orange-dark px-6 py-2 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105"
            >
              Register
            </Link>
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
          <div className="lg:hidden mt-4 pb-4 space-y-4 animate-slide-up">
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
            <div className="pt-4 border-t border-white/20 space-y-3">
              <Link
                href="/newsletter"
                className="block font-montserrat font-medium hover:text-orange transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Newsletter
              </Link>
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

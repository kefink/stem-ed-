"use client";

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/stemed.png"
                  alt="STEM-ED-ARCHITECTS Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bebas text-orange">
                STEM-ED-ARCHITECTS
              </h3>
            </div>
            <p className="font-lato text-white/80 mb-4">
              Engineering Learning Solutions for Africa's Future
            </p>
            <div className="flex space-x-4">
              {/* Social Icons - Placeholder */}
              <a
                href="#"
                className="hover:text-orange transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-orange transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-orange transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bebas text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2 font-lato">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-orange transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-orange transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/80 hover:text-orange transition-colors duration-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-white/80 hover:text-orange transition-colors duration-300"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-orange transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bebas text-xl mb-4">Our Services</h4>
            <ul className="space-y-2 font-lato text-sm">
              <li className="text-white/80">Institutional STEM Consulting</li>
              <li className="text-white/80">
                Teacher Training & Certification
              </li>
              <li className="text-white/80">Student Programs</li>
              <li className="text-white/80">EdTech Development</li>
              <li className="text-white/80">Competition Readiness</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bebas text-xl mb-4">Get in Touch</h4>
            <ul className="space-y-2 font-lato text-sm text-white/80">
              <li>Email: info@stem-ed-architects.com</li>
              <li>Phone: +254 XXX XXX XXX</li>
              <li>Location: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center font-lato text-sm text-white/70">
          <p>
            &copy; {currentYear} STEM-ED-ARCHITECTS. All rights reserved. |
            Engineering Learning Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

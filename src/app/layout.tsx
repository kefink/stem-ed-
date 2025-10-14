import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STEM-ED-ARCHITECTS | Engineering Learning Solutions",
  description:
    "The definitive leader in African STEM transformation - engineering complete, AI-integrated, CBC/Cambridge/IB-aligned robotics curricula from strategy to student capstone.",
  keywords: [
    "STEM Education",
    "Robotics",
    "AI Integration",
    "Teacher Training",
    "EdTech",
    "Africa",
    "Kenya",
  ],
  authors: [{ name: "STEM-ED-ARCHITECTS" }],
  openGraph: {
    title: "STEM-ED-ARCHITECTS | Engineering Learning Solutions",
    description: "Designing the future of STEM education across Africa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${lato.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-montserrat antialiased bg-white text-navy"
        suppressHydrationWarning
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

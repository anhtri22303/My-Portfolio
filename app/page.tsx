"use client";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import emailjs from "@emailjs/browser";
import {
  fadeInUp, staggerContainer, navItems, projects, skillGroups, experiences,
  ThemeToggle, ScrollToTop, SectionHeading, GlassCard,
  TimelineItem, ProjectGallery,
} from "./components";

const HeroScene = dynamic(() => import("./Scene3D").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => null,
});
const ProjectsDecoration3D = dynamic(
  () => import("./Scene3D").then((mod) => mod.ProjectsDecoration3D),
  { ssr: false, loading: () => null }
);

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeProject, setActiveProject] = useState(0);
  const [projectImageIndex, setProjectImageIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formStartTime, setFormStartTime] = useState<number | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const { scrollYProgress } = useScroll();

  const techPalette: Record<string, { bg: string; text: string; border: string }> = {
    "Next.js": { bg: "rgba(15, 23, 42, 0.55)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.4)" },
    React: { bg: "rgba(59, 130, 246, 0.2)", text: "#bfdbfe", border: "rgba(59, 130, 246, 0.4)" },
    "React.js": { bg: "rgba(59, 130, 246, 0.2)", text: "#bfdbfe", border: "rgba(59, 130, 246, 0.4)" },
    TypeScript: { bg: "rgba(30, 64, 175, 0.22)", text: "#93c5fd", border: "rgba(59, 130, 246, 0.4)" },
    JavaScript: { bg: "rgba(245, 158, 11, 0.22)", text: "#fde68a", border: "rgba(245, 158, 11, 0.4)" },
    HTML5: { bg: "rgba(234, 88, 12, 0.2)", text: "#fdba74", border: "rgba(251, 146, 60, 0.4)" },
    CSS3: { bg: "rgba(14, 116, 144, 0.2)", text: "#a5f3fc", border: "rgba(6, 182, 212, 0.4)" },
    "Spring Boot": { bg: "rgba(22, 101, 52, 0.2)", text: "#86efac", border: "rgba(34, 197, 94, 0.35)" },
    PostgreSQL: { bg: "rgba(30, 64, 175, 0.2)", text: "#93c5fd", border: "rgba(59, 130, 246, 0.35)" },
    Firebase: { bg: "rgba(194, 120, 3, 0.22)", text: "#fde68a", border: "rgba(245, 158, 11, 0.4)" },
    RabbitMQ: { bg: "rgba(185, 28, 28, 0.22)", text: "#fca5a5", border: "rgba(239, 68, 68, 0.45)" },
    Upstash: { bg: "rgba(190, 24, 93, 0.22)", text: "#fbcfe8", border: "rgba(236, 72, 153, 0.45)" },
    Vercel: { bg: "rgba(15, 23, 42, 0.55)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.35)" },
    Railway: { bg: "rgba(30, 64, 175, 0.18)", text: "#bfdbfe", border: "rgba(59, 130, 246, 0.35)" },
    MongoDB: { bg: "rgba(22, 101, 52, 0.2)", text: "#bbf7d0", border: "rgba(34, 197, 94, 0.35)" },
    "Tailwind CSS": { bg: "rgba(8, 145, 178, 0.2)", text: "#67e8f9", border: "rgba(34, 211, 238, 0.4)" },
    "Shadcn UI": { bg: "rgba(15, 23, 42, 0.45)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.35)" },
    "Framer Motion": { bg: "rgba(190, 24, 93, 0.18)", text: "#fbcfe8", border: "rgba(236, 72, 153, 0.35)" },
    Redux: { bg: "rgba(109, 40, 217, 0.2)", text: "#ddd6fe", border: "rgba(139, 92, 246, 0.4)" },
    Zustand: { bg: "rgba(124, 45, 18, 0.2)", text: "#fed7aa", border: "rgba(251, 146, 60, 0.35)" },
    "RESTful APIs": { bg: "rgba(2, 132, 199, 0.2)", text: "#bae6fd", border: "rgba(14, 165, 233, 0.4)" },
    "MySQL server": { bg: "rgba(29, 78, 216, 0.2)", text: "#bfdbfe", border: "rgba(59, 130, 246, 0.35)" },
    Docker: { bg: "rgba(3, 105, 161, 0.2)", text: "#bae6fd", border: "rgba(14, 165, 233, 0.35)" },
    Supabase: { bg: "rgba(22, 101, 52, 0.22)", text: "#86efac", border: "rgba(34, 197, 94, 0.35)" },
    Cloudinary: { bg: "rgba(8, 145, 178, 0.2)", text: "#a5f3fc", border: "rgba(34, 211, 238, 0.35)" },
    Git: { bg: "rgba(185, 28, 28, 0.2)", text: "#fca5a5", border: "rgba(239, 68, 68, 0.35)" },
    GitHub: { bg: "rgba(15, 23, 42, 0.55)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.35)" },
    Cursor: { bg: "rgba(30, 41, 59, 0.5)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.3)" },
    Antivity: { bg: "rgba(71, 85, 105, 0.3)", text: "#e2e8f0", border: "rgba(148, 163, 184, 0.3)" },
    "Intellij IDEA": { bg: "rgba(17, 24, 39, 0.6)", text: "#f8fafc", border: "rgba(148, 163, 184, 0.3)" },
    "Draw.io": { bg: "rgba(234, 88, 12, 0.2)", text: "#fdba74", border: "rgba(251, 146, 60, 0.35)" },
    AWS: { bg: "rgba(124, 58, 237, 0.2)", text: "#ddd6fe", border: "rgba(139, 92, 246, 0.35)" },
    NodeJs: { bg: "rgba(22, 101, 52, 0.2)", text: "#86efac", border: "rgba(34, 197, 94, 0.35)" },
    NestJs: { bg: "rgba(190, 18, 60, 0.2)", text: "#fecdd3", border: "rgba(244, 63, 94, 0.35)" },
  };

  const lightTechPalette: Record<string, { bg: string; text: string; border: string }> = {
    "Next.js": { bg: "rgba(15, 23, 42, 0.08)", text: "#0f172a", border: "rgba(15, 23, 42, 0.18)" },
    React: { bg: "rgba(59, 130, 246, 0.12)", text: "#1e3a8a", border: "rgba(59, 130, 246, 0.25)" },
    "React.js": { bg: "rgba(59, 130, 246, 0.12)", text: "#1e3a8a", border: "rgba(59, 130, 246, 0.25)" },
    TypeScript: { bg: "rgba(30, 64, 175, 0.12)", text: "#1e3a8a", border: "rgba(30, 64, 175, 0.25)" },
    JavaScript: { bg: "rgba(245, 158, 11, 0.14)", text: "#92400e", border: "rgba(245, 158, 11, 0.28)" },
    HTML5: { bg: "rgba(234, 88, 12, 0.14)", text: "#9a3412", border: "rgba(234, 88, 12, 0.3)" },
    CSS3: { bg: "rgba(14, 116, 144, 0.14)", text: "#0e7490", border: "rgba(14, 116, 144, 0.28)" },
    "Spring Boot": { bg: "rgba(22, 101, 52, 0.14)", text: "#166534", border: "rgba(22, 101, 52, 0.28)" },
    PostgreSQL: { bg: "rgba(30, 64, 175, 0.12)", text: "#1e3a8a", border: "rgba(30, 64, 175, 0.25)" },
    Firebase: { bg: "rgba(194, 120, 3, 0.16)", text: "#92400e", border: "rgba(194, 120, 3, 0.3)" },
    RabbitMQ: { bg: "rgba(185, 28, 28, 0.14)", text: "#991b1b", border: "rgba(185, 28, 28, 0.28)" },
    Upstash: { bg: "rgba(190, 24, 93, 0.14)", text: "#9d174d", border: "rgba(190, 24, 93, 0.28)" },
    Vercel: { bg: "rgba(15, 23, 42, 0.08)", text: "#0f172a", border: "rgba(15, 23, 42, 0.18)" },
    Railway: { bg: "rgba(30, 64, 175, 0.12)", text: "#1e3a8a", border: "rgba(30, 64, 175, 0.24)" },
    MongoDB: { bg: "rgba(22, 101, 52, 0.14)", text: "#166534", border: "rgba(22, 101, 52, 0.28)" },
    "Tailwind CSS": { bg: "rgba(8, 145, 178, 0.14)", text: "#0e7490", border: "rgba(8, 145, 178, 0.28)" },
    "Shadcn UI": { bg: "rgba(15, 23, 42, 0.08)", text: "#0f172a", border: "rgba(15, 23, 42, 0.18)" },
    "Framer Motion": { bg: "rgba(190, 24, 93, 0.12)", text: "#9d174d", border: "rgba(190, 24, 93, 0.25)" },
    Redux: { bg: "rgba(109, 40, 217, 0.12)", text: "#5b21b6", border: "rgba(109, 40, 217, 0.25)" },
    Zustand: { bg: "rgba(124, 45, 18, 0.12)", text: "#7c2d12", border: "rgba(124, 45, 18, 0.25)" },
    "RESTful APIs": { bg: "rgba(2, 132, 199, 0.12)", text: "#0c4a6e", border: "rgba(2, 132, 199, 0.25)" },
    "MySQL server": { bg: "rgba(29, 78, 216, 0.12)", text: "#1e3a8a", border: "rgba(29, 78, 216, 0.25)" },
    Docker: { bg: "rgba(3, 105, 161, 0.12)", text: "#075985", border: "rgba(3, 105, 161, 0.25)" },
    Supabase: { bg: "rgba(22, 101, 52, 0.14)", text: "#166534", border: "rgba(22, 101, 52, 0.28)" },
    Cloudinary: { bg: "rgba(8, 145, 178, 0.12)", text: "#0e7490", border: "rgba(8, 145, 178, 0.25)" },
    Git: { bg: "rgba(185, 28, 28, 0.12)", text: "#991b1b", border: "rgba(185, 28, 28, 0.25)" },
    GitHub: { bg: "rgba(15, 23, 42, 0.08)", text: "#0f172a", border: "rgba(15, 23, 42, 0.18)" },
    Cursor: { bg: "rgba(30, 41, 59, 0.08)", text: "#0f172a", border: "rgba(30, 41, 59, 0.18)" },
    Antivity: { bg: "rgba(71, 85, 105, 0.12)", text: "#334155", border: "rgba(71, 85, 105, 0.22)" },
    "Intellij IDEA": { bg: "rgba(15, 23, 42, 0.08)", text: "#0f172a", border: "rgba(15, 23, 42, 0.18)" },
    "Draw.io": { bg: "rgba(234, 88, 12, 0.14)", text: "#9a3412", border: "rgba(234, 88, 12, 0.3)" },
    AWS: { bg: "rgba(124, 58, 237, 0.12)", text: "#5b21b6", border: "rgba(124, 58, 237, 0.25)" },
    NodeJs: { bg: "rgba(22, 101, 52, 0.14)", text: "#166534", border: "rgba(22, 101, 52, 0.28)" },
    NestJs: { bg: "rgba(190, 18, 60, 0.12)", text: "#9f1239", border: "rgba(190, 18, 60, 0.25)" },
  };

  const getTechChipStyle = (tech: string) => {
    const palette = isDark ? techPalette : lightTechPalette;
    return (
      palette[tech] ?? {
        bg: isDark ? "var(--accent-glow)" : "rgba(79, 70, 229, 0.12)",
        text: isDark ? "var(--accent-light)" : "#3730a3",
        border: isDark ? "rgba(129, 140, 248, 0.35)" : "rgba(79, 70, 229, 0.25)",
      }
    );
  };

  const getSkillChipStyle = (skill: string) => {
    const palette = isDark ? techPalette : lightTechPalette;
    if (palette[skill]) return palette[skill];
    const parts = skill.split("/").map((part) => part.trim()).filter(Boolean);
    for (const part of parts) {
      if (palette[part]) return palette[part];
    }
    const aliasMap: Record<string, string> = {
      "React.js": "React",
      "Next.js": "Next.js",
      TypeScript: "TypeScript",
      JavaScript: "JavaScript",
      HTML5: "HTML5",
      CSS3: "CSS3",
      "Tailwind CSS": "Tailwind CSS",
      "Shadcn UI": "Shadcn UI",
      "Framer Motion": "Framer Motion",
      Redux: "Redux",
      Zustand: "Zustand",
      "RESTful APIs": "RESTful APIs",
      MongoDB: "MongoDB",
      PostgreSQL: "PostgreSQL",
      "MySQL server": "MySQL server",
      Docker: "Docker",
      Firebase: "Firebase",
      AWS: "AWS",
      Upstash: "Upstash",
      RabbitMQ: "RabbitMQ",
      Supabase: "Supabase",
      Cloudinary: "Cloudinary",
      Git: "Git",
      GitHub: "GitHub",
      Cursor: "Cursor",
      Antivity: "Antivity",
      "Intellij IDEA": "Intellij IDEA",
      "Draw.io": "Draw.io",
    };
    const normalized = skill.replace(/\s+/g, " ").trim();
    const aliasKey = aliasMap[normalized];
    return aliasKey && palette[aliasKey]
      ? palette[aliasKey]
      : getTechChipStyle(skill);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setProjectImageIndex(0);
  }, [activeProject]);

  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      document.documentElement.classList.toggle("light", prev);
      return !prev;
    });
  }, []);

  const handlePrevProjectImage = useCallback(() => {
    setProjectImageIndex((prev) => {
      const count = projects[activeProject].images.length;
      return (prev - 1 + count) % count;
    });
  }, [activeProject]);

  const handleNextProjectImage = useCallback(() => {
    setProjectImageIndex((prev) => {
      const count = projects[activeProject].images.length;
      return (prev + 1) % count;
    });
  }, [activeProject]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const now = Date.now();
    if (honeypot.trim()) {
      setFormError("Spam detected. Please try again.");
      setFormStatus("error");
      return;
    }

    if (formStartTime && now - formStartTime < 3000) {
      setFormError("Please take a moment before sending.");
      setFormStatus("error");
      return;
    }

    if (now - lastSubmitTime < 30000) {
      setFormError("Please wait a bit before sending again.");
      setFormStatus("error");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setFormError("Please fill in all fields.");
      setFormStatus("error");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailOk) {
      setFormError("Please enter a valid email address.");
      setFormStatus("error");
      return;
    }

    if (formData.message.length > 1000) {
      setFormError("Message is too long (max 1000 characters).");
      setFormStatus("error");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFormError("Email service is not configured yet.");
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
          subject: "Portfolio Contact",
          to_email: "Anhtri22303@gmail.com",
        },
        { publicKey }
      );
      setFormStatus("success");
      setLastSubmitTime(now);
      setFormStartTime(Date.now());
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus("error");
      setFormError("Failed to send. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden text-[15px] sm:text-[16px] lg:text-[17px]" style={{ background: "var(--bg-primary)" }}>
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left" style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />

      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-xl border-b" style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="playfair text-2xl sm:text-3xl md:text-4xl gradient-text font-bold">Anh Tri</h1>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleScroll(e, item.id)}
                className={`nav-link-anim text-base font-medium ${activeSection === item.id ? "active" : ""}`}>
                {item.label}
              </a>
            ))}
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              href="/CV/CV_Frontend_Developer_ChauNgocAnhTri.pdf"
              download="CV_Frontend_Developer_ChauNgocAnhTri.pdf"
              className="px-5 py-2 rounded-full text-base font-medium text-white"
              style={{ background: "var(--accent)" }}>
              Download CV
            </motion.a>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2" style={{ color: "var(--text-primary)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t px-4 sm:px-6 py-4 space-y-1" style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleScroll(e, item.id)} className="block py-2 text-base font-medium" style={{ color: activeSection === item.id ? "var(--accent)" : "var(--text-secondary)" }}>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
        <HeroScene />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg font-medium tracking-widest uppercase mb-4" style={{ color: "var(--accent-light)" }}>
              Front-End Developer / Business Analyst
            </motion.p>
            <h1 className="playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 gradient-text leading-tight">
              Chau Ngoc<br />Anh Tri
            </h1>
            <div className="space-y-2 mb-6 sm:mb-8 text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
              <p><span className="font-medium" style={{ color: "var(--text-primary)" }}>Phone:</span> +84 917 280 180</p>
              <p><span className="font-medium" style={{ color: "var(--text-primary)" }}>Email:</span> Anhtri22303@gmail.com</p>
              <p><span className="font-medium" style={{ color: "var(--text-primary)" }}>GitHub:</span> github.com/anhtri22303</p>
            </div>
            <div className="flex gap-4">
              <Link href="https://www.linkedin.com/in/anhtri/" target="_blank" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
              <Link href="https://www.facebook.com/TriCNA.Coder/" target="_blank" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="https://github.com/anhtri22303" target="_blank" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="absolute -inset-1 rounded-2xl opacity-50 blur-lg" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)" }} />
            <Image src="/profile.jpg" alt="Profile" width={1600} height={1600} priority className="relative object-cover rounded-2xl w-full h-full" />
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <a href="#about" onClick={(e) => handleScroll(e, "about")} style={{ color: "var(--text-tertiary)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </a>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-secondary)" }}>
        <motion.div className="max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          <SectionHeading>About Me</SectionHeading>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-5">
              <p className="leading-relaxed text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                As a Front-End Developer with 3+ years of experience, I build scalable, user-focused web applications with React, TypeScript, Next.js, and modern UI practices. I focus on clean, maintainable code, performance optimization, and smooth collaboration across teams to deliver reliable products.
              </p>
              <p className="leading-relaxed text-lg" style={{ color: "var(--text-secondary)" }}>
                As a Business Analyst with Japanese N3, I work on requirements gathering and documentation, and I am experienced in producing project artifacts such as SRS, user stories, and process flows. I have hands-on experience with diagrams (use case, sequence, activity, ERD) from project-based courses in software development, entrepreneurship, and software requirements.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Core Skills</h3>
              <div className="grid gap-4">
                {skillGroups.map((group) => (
                  <GlassCard key={group.title}>
                    <h4 className="font-semibold mb-3" style={{ color: "var(--accent-light)" }}>{group.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{
                            background: getSkillChipStyle(skill).bg,
                            color: getSkillChipStyle(skill).text,
                            border: `1px solid ${getSkillChipStyle(skill).border}`,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
        <motion.div className="max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          <SectionHeading>Education</SectionHeading>
          <motion.div variants={fadeInUp}>
            <GlassCard>
              <TimelineItem period="2023 - 2026" title="Bachelor of Information Technology" subtitle="FPT University HCM, Vietnam">
                <ul className="list-disc list-inside space-y-1 mt-2" style={{ color: "var(--text-secondary)" }}>
                  <li>Major: Information Technology</li>
                  <li>Minor: Software Engineering</li>
                  <li>GPA: 2.8/4.0</li>
                  <li>Relevant Coursework: Data Structures and Algorithms, Database Systems, Web Development, Software Development project, The UI/UX Design and more</li>
                </ul>
              </TimelineItem>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <ProjectsDecoration3D />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <SectionHeading>Projects</SectionHeading>
            <motion.p variants={fadeInUp} className="max-w-2xl text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
              Selected work focused on product quality, clean UX, and scalable architecture.
            </motion.p>
          </motion.div>
          <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
            <div className="space-y-4">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setActiveProject(index);
                    setProjectImageIndex(0);
                  }}
                  className={`project-tab ${activeProject === index ? "active" : ""}`}
                >
                  <div className="project-tab-content">
                    <div className="flex items-center justify-between">
                      <span className="project-tab-kicker">0{index + 1}</span>
                      <span className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>{project.date}</span>
                    </div>
                    <h3 className="project-tab-title" style={{ color: "var(--text-primary)" }}>{project.title}</h3>
                    <p className="project-tab-desc" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="project-chip"
                          style={{
                            background: getTechChipStyle(t).bg,
                            color: getTechChipStyle(t).text,
                            border: `1px solid ${getTechChipStyle(t).border}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span
                          className="project-chip"
                          style={
                            isDark
                              ? {
                                background: "rgba(99, 102, 241, 0.18)",
                                color: "var(--accent-light)",
                                border: "1px solid rgba(129, 140, 248, 0.35)",
                              }
                              : {
                                background: "rgba(79, 70, 229, 0.12)",
                                color: "#3730a3",
                                border: "1px solid rgba(79, 70, 229, 0.25)",
                              }
                          }
                        >
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="project-showcase lg:sticky lg:top-24"
            >
              <ProjectGallery
                project={projects[activeProject]}
                imageIndex={projectImageIndex}
                setImageIndex={setProjectImageIndex}
                onPrev={handlePrevProjectImage}
                onNext={handleNextProjectImage}
              />
              <div className="project-showcase-card mt-5">
                <div className="flex items-center gap-3">
                  <span className="project-pill">Featured</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Project Overview
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  {projects[activeProject].title}
                </h3>
                <p className="mt-2 text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                  {projects[activeProject].description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {projects[activeProject].tech.map((t) => (
                    <span
                      key={t}
                      className="project-chip"
                      style={{
                        background: getTechChipStyle(t).bg,
                        color: getTechChipStyle(t).text,
                        border: `1px solid ${getTechChipStyle(t).border}`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={projects[activeProject].link} target="_blank" className="project-link inline-flex items-center gap-2 mt-5 text-base font-semibold">
                  View Code <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="resume" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
        <motion.div className="max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
          <SectionHeading>Experience</SectionHeading>

          <div className="mt-8 grid gap-6">
            {experiences.map((exp, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="experience-card">
                  <div className="experience-header">
                    <div>
                      <p className="experience-period">{exp.period}</p>
                      <h3 className="experience-role">{exp.role}</h3>
                      <p className="experience-company">{exp.company}</p>
                    </div>
                    <div className="experience-badge">Featured Role</div>
                  </div>
                  <div className="experience-divider" />
                  <ul className="experience-list">
                    {exp.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-secondary)" }}>
        <motion.div className="max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          <SectionHeading>Get in Touch</SectionHeading>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <p className="text-lg sm:text-xl" style={{ color: "var(--text-secondary)" }}>
                I&apos;m always interested in hearing about new projects and opportunities. Feel free to reach out if you&apos;d like to connect!
              </p>
              <div className="space-y-4">
                {[
                  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, label: "Email", value: "Anhtri22303@gmail.com" },
                  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />, label: "Phone", value: "+84 917 280 180" },
                  { icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>, label: "Location", value: "Ho Chi Minh, Vietnam" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                    </div>
                    <div>
                      <p className="text-base font-medium" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GlassCard className="!p-8">
              <form className="space-y-5" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
                />
                <div>
                  <label htmlFor="name" className="block text-base font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    className="form-input"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Your message..."
                    className="form-input"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                {formError && (
                  <p className="text-base" style={{ color: "#fca5a5" }}>{formError}</p>
                )}
                {formStatus === "success" && (
                  <p className="text-base" style={{ color: "#86efac" }}>Message sent successfully.</p>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full py-3 rounded-xl text-white font-medium transition-shadow hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px var(--accent-glow-strong)" }}>
                  {formStatus === "sending" ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 text-center border-t" style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}>
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-center gap-4">
            {[
              { href: "https://www.linkedin.com/in/anhtri/", label: "LinkedIn" },
              { href: "https://www.facebook.com/TriCNA.Coder/", label: "Facebook" },
              { href: "https://github.com/anhtri22303", label: "GitHub" },
            ].map((link) => (
              <Link key={link.label} href={link.href} target="_blank" className="text-base transition-colors hover:underline" style={{ color: "var(--text-secondary)" }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-base" style={{ color: "var(--text-tertiary)" }}>&copy; 2025 Anh Tri. All rights reserved.</p>
        </div>
      </footer>

      <ScrollToTop show={showScrollTop} />
    </main>
  );
}

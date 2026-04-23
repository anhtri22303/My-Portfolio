"use client";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import {
  fadeInUp, staggerContainer, navItems, projects, skillGroups, experiences,
  ThemeToggle, FloatingOrbs, ScrollToTop, SectionHeading, GlassCard,
  TimelineItem, ProjectGallery,
} from "./components";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { scrollYProgress } = useScroll();

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

  useEffect(() => { setCurrentImageIndex(0); }, [selectedProject]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      document.documentElement.classList.toggle("light", prev);
      return !prev;
    });
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const nextImage = () => setCurrentImageIndex((p) => (p === selectedProject.images.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentImageIndex((p) => (p === 0 ? selectedProject.images.length - 1 : p - 1));

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left" style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />

      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-xl border-b" style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="playfair text-lg sm:text-xl gradient-text font-bold">Anh Tri</h1>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleScroll(e, item.id)}
                className={`nav-link-anim text-sm font-medium ${activeSection === item.id ? "active" : ""}`}>
                {item.label}
              </a>
            ))}
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="px-5 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: "var(--accent)" }}>
              Download CV
            </motion.button>
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
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleScroll(e, item.id)} className="block py-2 text-sm font-medium" style={{ color: activeSection === item.id ? "var(--accent)" : "var(--text-secondary)" }}>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
        <FloatingOrbs />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "var(--accent-light)" }}>
              Front-End Developer
            </motion.p>
            <h1 className="playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 gradient-text leading-tight">
              Chau Ngoc<br />Anh Tri
            </h1>
            <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
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
                As a Front-End Developer with over 3 years of experience, I specialize in building scalable web applications using modern technologies. My expertise includes React, Node.js, TypeScript, Next.js and Spring Boot, with a strong focus on creating efficient and maintainable code.
              </p>
              <p className="leading-relaxed text-lg" style={{ color: "var(--text-secondary)" }}>
                I have a proven track record of delivering complex projects, implementing microservices architectures, and optimizing application performance. I&apos;m passionate about clean code practices, agile methodologies, and staying current with emerging technologies.
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
                        <span key={skill} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}>
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
              <TimelineItem period="2021 - 2026" title="Bachelor of Science in Computer Science" subtitle="FPT University">
                <ul className="list-disc list-inside space-y-1 mt-2" style={{ color: "var(--text-secondary)" }}>
                  <li>Major: Computer Science</li>
                  <li>Minor: Data Science</li>
                  <li>GPA: 3.8/4.0</li>
                  <li>Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development</li>
                </ul>
              </TimelineItem>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <SectionHeading>Projects</SectionHeading>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <ProjectGallery project={selectedProject} imageIndex={currentImageIndex} setImageIndex={setCurrentImageIndex} onPrev={prevImage} onNext={nextImage} />
            <div className="space-y-6">
              {projects.map((project) => (
                <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: selectedProject.id === project.id ? "var(--bg-card-hover)" : "transparent",
                    border: `1px solid ${selectedProject.id === project.id ? "var(--accent)" : "var(--border-color)"}`,
                  }}>
                  <span className="text-sm font-medium" style={{ color: "var(--accent-light)" }}>{project.date}</span>
                  <h3 className="text-xl font-semibold mt-1" style={{ color: selectedProject.id === project.id ? "var(--text-primary)" : "var(--text-secondary)" }}>{project.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-tertiary)" }}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}>{t}</span>
                    ))}
                  </div>
                  <Link href={project.link} target="_blank" className="inline-flex items-center gap-1 mt-3 text-sm font-medium transition-colors" style={{ color: "var(--accent)" }}
                    onClick={(e) => e.stopPropagation()}>
                    View Code <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="resume" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
        <motion.div className="max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-5 sm:space-y-8">
            {experiences.map((exp, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard>
                  <TimelineItem period={exp.period} title={exp.role} subtitle={exp.company}>
                    <ul className="list-disc list-inside space-y-1 mt-2" style={{ color: "var(--text-secondary)" }}>
                      {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </TimelineItem>
                </GlassCard>
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
              <p className="text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
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
                      <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GlassCard className="!p-8">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
                  <input type="text" id="name" placeholder="Your name" className="form-input" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <input type="email" id="email" placeholder="your@email.com" className="form-input" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Message</label>
                  <textarea id="message" rows={4} placeholder="Your message..." className="form-input" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                  className="w-full py-3 rounded-xl text-white font-medium transition-shadow hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px var(--accent-glow-strong)" }}>
                  Send Message
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
              <Link key={link.label} href={link.href} target="_blank" className="text-sm transition-colors hover:underline" style={{ color: "var(--text-secondary)" }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>&copy; 2025 Anh Tri. All rights reserved.</p>
        </div>
      </footer>

      <ScrollToTop show={showScrollTop} />
    </main>
  );
}

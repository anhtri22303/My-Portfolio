"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ===== Animation Variants =====
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// ===== Data =====
export const navItems = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const projects = [
  {
    id: 1, title: "Student Club Loyalty & Membership System (SCLMS)", date: "2026",
    description: "Digital platform for managing university student club memberships, events, points, and rewards.",
    tech: ["Next.js", "Spring Boot", "PostgreSQL", "Firebase", "RabbitMQ", "Upstash", "Vercel", "Railway"],
    images: ["/uniclub1.webp", "/uniclub3.webp", "/univlub5.webp"],
    link: "https://github.com/anhtri22303/uni-club.git",
  },
  {
    id: 2, title: "GlowCorner’s website", date: "2025",
    description: "website will focus on providing a personalized and engaging experience for users.",
    tech: ["Next.js", "Spring Boot", "MongoDB", "Tailwind CSS", "Firebase", "Vercel", "AWS"],
    images: ["/Swp1.webp", "/Swp2.webp", "/Swp3.webp"],
    link: "https://github.com/anhtri22303/GlowCorner.git",
  },
  {
    id: 3, title: "Billiard Club - Scoring System Web App", date: "2025",
    description: "Scoring System Web App for Billiard Club, providing real-time score tracking, player statistics, and match history for billiard players.",
    tech: ["Next.js", "NodeJs", "NestJs", "MongoDB", "Tailwind CSS", "Firebase", "Vercel", "AWS"],
    images: ["/Swd1.webp", "/Swd2.webp", "/Swd3.webp"],
    link: "https://github.com/anhtri22303/fe_web_ball_pooling.git",
  },
];

export const skillGroups = [
  {
    title: "Tech Stack",
    items: ["React.js / Next.js", "TypeScript / JavaScript", "HTML5 / CSS3", "Spring Boot", "Tailwind CSS / Shadcn UI", "Framer Motion",
      "Redux / Zustand", "Vercel / Railway",   
       "RESTful APIs", "MongoDB / PostgreSQL", "MySQL server", 
       "Docker", "Firebase", "AWS / Upstash", "RabbitMQ", "Supabase", "Cloudinary",
       "Git / GitHub", "Cursor", "Antivity", "Intellij IDEA", "Draw.io"
      ],
  },
];

export const experiences = [
  {
    period: "2025 - 2026", role: "Front-End Developer - Mobile Developer", company: "Student Club Loyalty & Membership System (SCLMS)",
    points: [
      "Delivered responsive web and mobile UI for club membership, events, and rewards, aligning with business rules and user flows.",
      "Implemented reusable UI components and state handling for points, QR check-ins, and notifications to improve consistency.",
      "Partnered with BA and back-end teams to refine requirements, write clear tickets, and validate features with stakeholders.",
    ],
  },
  {
    period: "2024 - 2025", role: "Front-End Developer", company: "Billiard Club - Scoring System Web App",
    points: [
      "Built a real-time scoring interface with match tracking, player stats, and history views for club staff and players.",
      "Optimized UI flows and validation to reduce input errors and speed up referee operations during matches.",
      "Coordinated API integration and QA feedback loops to ensure stable releases before tournaments.",
    ],
  },
  {
    period: "2024 - 2025", role: "Front-End Developer", company: "GlowCorner - Ecommerce website",
    points: [
      "Developed a storefront UI with product discovery, filters, and detailed pages optimized for conversion.",
      "Integrated checkout flows and customer account features while maintaining responsive layouts.",
      "Collaborated with designers to refine visual consistency and improve page performance metrics.",
    ],
  },
];

// ===== Sub-Components =====

export function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={toggle} aria-label="Toggle theme"
      className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
      style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </motion.button>
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 -left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl animate-float" style={{ background: "var(--accent)", opacity: "var(--orb-opacity)" }} />
      <div className="absolute top-40 -right-10 w-56 sm:w-96 h-56 sm:h-96 rounded-full blur-3xl animate-float-slow" style={{ background: "#8b5cf6", opacity: "var(--orb-opacity)" }} />
      <div className="absolute -bottom-20 left-1/4 sm:left-1/3 w-52 sm:w-80 h-52 sm:h-80 rounded-full blur-3xl animate-float-reverse" style={{ background: "#06b6d4", opacity: "var(--orb-opacity)" }} />
    </div>
  );
}

export function ScrollToTop({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-to-top fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-colors"
          style={{ background: "var(--accent)", color: "white" }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2 variants={fadeInUp} className="playfair text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12 section-heading" style={{ color: "var(--text-primary)" }}>
      {children}
    </motion.h2>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-card p-4 sm:p-6 ${className}`}>{children}</div>;
}

export function TimelineItem({ period, title, subtitle, children }: { period: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeInUp} className="relative pl-8 border-l-2 group" style={{ borderColor: "var(--border-color)" }}>
      <div className="glow-dot absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ background: "var(--accent)" }} />
      <div className="space-y-2">
        <span className="text-sm font-medium" style={{ color: "var(--accent-light)" }}>{period}</span>
        <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        {children}
      </div>
    </motion.div>
  );
}

export function ProjectGallery({
  project, imageIndex, setImageIndex, onPrev, onNext
}: {
  project: typeof projects[0]; imageIndex: number;
  setImageIndex: (i: number) => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="relative">
      <motion.div
        key={`${project.id}-${imageIndex}`}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-color)", boxShadow: "var(--card-shadow)" }}
      >
        <Image src={project.images[imageIndex]} alt={`${project.title} screenshot ${imageIndex + 1}`} fill className="object-cover" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {project.images.map((_, i) => (
          <button key={i} onClick={() => setImageIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: imageIndex === i ? "24px" : "8px",
              background: imageIndex === i ? "var(--accent)" : "var(--text-tertiary)",
            }}
          />
        ))}
      </div>
      <button onClick={onPrev} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-colors" style={{ background: "rgba(0,0,0,0.4)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
      </button>
      <button onClick={onNext} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-colors" style={{ background: "rgba(0,0,0,0.4)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
      </button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// ─── FONTS ───────────────────────────────────────────────────────────────────

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

// ─── THEME ───────────────────────────────────────────────────────────────────
// Cream:   #f6f1e9   warm ivory — light sections
// Dark:    #13100c   deep warm brown-black — dark sections
// Mid:     #eae4d9   warm off-white — mid sections
// Amber:   #b8833c   warm gold accent
// Muted:   #9c8c7c   warm gray-brown

// ─── DATA ────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: 1,
    title: "Bloom Wedding Co.",
    category: "Wedding",
    year: "2024",
    description:
      "Elegant RSVP system with live seating chart, gift registry integration, and real-time guest management.",
    link: "https://example.com",
    stack: ["Next.js", "Tailwind CSS", "Supabase"],
    features: ["Online RSVP", "Seating Chart", "Gift Registry", "Admin Dashboard"],
    desktop: "/projects/bloom-desktop.png",
    mobile: "/projects/bloom-mobile.png",
  },
  {
    id: 2,
    title: "Peaks & Pines Resort",
    category: "Corporate",
    year: "2024",
    description:
      "Full booking platform with room availability calendar, payment gateway, and SEO-optimized landing pages.",
    link: "https://example.com",
    stack: ["React", "Node.js", "Stripe", "PostgreSQL"],
    features: ["Live Booking", "Payment Gateway", "CMS", "SEO Optimized"],
    desktop: "/projects/peaks-desktop.png",
    mobile: "/projects/peaks-mobile.png",
  },
  {
    id: 3,
    title: "Celeste Turns 7",
    category: "Birthday",
    year: "2024",
    description:
      "Animated event page with countdown timer, RSVP form, and shareable digital invites via QR code.",
    link: "https://example.com",
    stack: ["HTML", "CSS", "JavaScript"],
    features: ["Countdown Timer", "RSVP Form", "QR Code Invite", "Gallery"],
    desktop: "/projects/celeste-desktop.png",
    mobile: "/projects/celeste-mobile.png",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Bride, Bloom Wedding Co.",
    quote:
      "Carlo made our wedding website so beautiful. Guests kept complimenting it. The RSVP system saved us so much stress.",
    avatar: "MS",
  },
  {
    name: "Jed Reyes",
    role: "Owner, Peaks & Pines Resort",
    quote:
      "Bookings went up 40% after the new site launched. Carlo delivered ahead of schedule and it looked incredible.",
    avatar: "JR",
  },
  {
    name: "Trisha Lim",
    role: "Event Organizer",
    quote:
      "Professional, fast, and genuinely talented. He understood my vision immediately. Will work with him again.",
    avatar: "TL",
  },
];

// ─── GRAIN ───────────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9990] opacity-[0.045]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "180px 180px",
      }}
    />
  );
}

// ─── CURSOR ──────────────────────────────────────────────────────────────────

function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest("[data-cursor-label]") as HTMLElement | null;
      setHovered(!!t.closest("a, button, [data-cursor]"));
      setLabel(el?.dataset?.cursorLabel ?? "");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{ backgroundColor: "#b8833c" }}
        animate={{ x: pos.x - 4, y: pos.y - 4, scale: hovered ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 700, damping: 35 }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{ border: "1px solid #b8833c", mixBlendMode: "normal" }}
        animate={{
          x: pos.x - (hovered ? 32 : 20),
          y: pos.y - (hovered ? 32 : 20),
          width: hovered ? 64 : 40,
          height: hovered ? 64 : 40,
          opacity: hovered ? 0.7 : 0.4,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        {label && (
          <span
            className="text-[8px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Work", href: "#work" },
    { label: "Why Us", href: "#why-us" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 flex items-center justify-between transition-all duration-700 ${
          scrolled
            ? "backdrop-blur-sm border-b"
            : ""
        }`}
        style={
          scrolled
            ? { backgroundColor: "rgba(246,241,233,0.96)", borderColor: "rgba(184,131,60,0.15)" }
            : {}
        }
      >
        <a
          href="#hero"
          className="text-[11px] font-medium tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-body)", color: "#13100c" }}
        >
          bycarlo
        </a>

        <ul className="hidden md:flex items-center gap-12">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="relative text-[11px] tracking-[0.35em] uppercase transition-colors duration-300 group"
                style={{ fontFamily: "var(--font-body)", color: "#9c8c7c" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#b8833c")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9c8c7c")}
              >
                {l.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-400"
                  style={{ backgroundColor: "#b8833c" }}
                />
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Open menu"
        >
          <span className="w-6 h-px block" style={{ backgroundColor: "#13100c" }} />
          <span className="w-3.5 h-px block" style={{ backgroundColor: "#13100c" }} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-start justify-end pb-16 px-8"
            style={{ backgroundColor: "#13100c" }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-7 right-7 text-2xl font-light transition-colors"
              style={{ color: "rgba(184,131,60,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b8833c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,131,60,0.5)")}
              aria-label="Close menu"
            >
              ✕
            </button>

            <div className="flex flex-col gap-5">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.09 + 0.2,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setMenuOpen(false)}
                  className="text-[52px] font-light leading-none tracking-tight transition-colors"
                  style={{ fontFamily: "var(--font-display)", color: "#f6f1e9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#b8833c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#f6f1e9")}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>

            <p
              className="mt-12 text-[10px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
            >
              bycarlo · Web Design & Development
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

function Marquee() {
  const services = [
    "Wedding Websites",
    "Birthday Events",
    "Corporate Brands",
    "Business Platforms",
    "Custom Web Apps",
    "Mobile-First Design",
    "Vercel Deployments",
    "Landing Pages",
  ];
  const doubled = [...services, ...services, ...services, ...services];

  return (
    <div
      aria-hidden
      className="overflow-hidden py-[18px]"
      style={{ borderTop: "1px solid rgba(184,131,60,0.15)", borderBottom: "1px solid rgba(184,131,60,0.15)", backgroundColor: "#f6f1e9" }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.55em] uppercase flex-shrink-0 flex items-center"
            style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full mx-8"
              style={{ backgroundColor: "rgba(184,131,60,0.35)" }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#13100c" }}
    >
      {/* Video layer */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          src="/projects/hero.mp4"
        />
      </motion.div>

      {/* Warm vignette overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(19,16,12,0.7) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y: titleY }}
        className="relative z-30 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-light leading-none tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-display)",
            color: "#f6f1e9",
            fontSize: "clamp(72px, 14vw, 172px)",
          }}
        >
          bycarlo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-px mx-auto mt-8 mb-7 origin-left"
          style={{ backgroundColor: "#b8833c", width: "120px" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          className="text-[11px] tracking-[0.65em] uppercase"
          style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
        >
          Web Design & Development
        </motion.p>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
        style={{ background: "linear-gradient(to top, #13100c, transparent)" }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ scaleY: [1, 0, 1] }}
          style={{ originY: 0, backgroundColor: "#b8833c" }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-14"
        />
        <span
          className="text-[9px] tracking-[0.55em] uppercase"
          style={{ fontFamily: "var(--font-body)", color: "#6a5840" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

// ─── DEVICE MOCKUP ───────────────────────────────────────────────────────────

function DeviceMockup({ desktop, mobile }: { desktop: string; mobile: string }) {
  return (
    <div className="relative w-full select-none" style={{ paddingBottom: "65%" }}>
      {/* Desktop */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 40px 100px rgba(19,16,12,0.18)",
          border: "1px solid rgba(184,131,60,0.2)",
        }}
      >
        {/* Browser chrome */}
        <div
          className="h-8 border-b flex items-center gap-2 px-4 shrink-0"
          style={{ backgroundColor: "#ede8df", borderColor: "rgba(184,131,60,0.12)" }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div
            className="ml-3 flex-1 rounded-sm h-4 max-w-[200px]"
            style={{ backgroundColor: "#f6f1e9", border: "1px solid rgba(184,131,60,0.12)" }}
          />
        </div>
        {/* Screen */}
        <div
          className="absolute top-8 inset-x-0 bottom-0 overflow-hidden"
          style={{ backgroundColor: "#f6f1e9" }}
        >
          <img
            src={desktop}
            alt="Desktop preview"
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f6f1e9, #ede8df)" }}
          >
            <span
              className="text-[10px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
            >
              Desktop Preview
            </span>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="absolute -bottom-3 right-2 w-[22%] rounded-[20px] overflow-hidden"
        style={{ aspectRatio: "9/19.5", boxShadow: "0 24px 60px rgba(19,16,12,0.28)", border: "2.5px solid #2a201a" }}
      >
        <div
          className="h-5 flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#1c1410" }}
        >
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#2e2218" }} />
        </div>
        <div
          className="relative overflow-hidden"
          style={{ height: "calc(100% - 1.25rem)", backgroundColor: "#f6f1e9" }}
        >
          <img
            src={mobile}
            alt="Mobile preview"
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ede8df, #e0d8cc)" }}
          >
            <span
              className="text-[7px] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#b8a898" }}
            >
              Mobile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WORK ────────────────────────────────────────────────────────────────────

function Work() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Parallax for header
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="work"
      ref={ref}
      className="py-28 md:py-44 overflow-hidden"
      style={{ backgroundColor: "#f6f1e9" }}
    >
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        {/* Header with parallax */}
        <motion.div
          style={{ y: headerY }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[10px] tracking-[0.55em] uppercase mb-5"
              style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
            >
              Selected Work
            </p>
            <h2
              className="font-light leading-[0.88] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-display)",
                color: "#13100c",
                fontSize: "clamp(58px, 9vw, 112px)",
              }}
            >
              Projects.
            </h2>
          </motion.div>
        </motion.div>

        {/* Tab nav */}
        <div
          className="flex items-stretch gap-0 mb-20 overflow-x-auto no-scrollbar"
          style={{ borderBottom: "1px solid rgba(184,131,60,0.18)" }}
        >
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className="flex items-end gap-3 px-6 md:px-8 py-5 border-b-2 whitespace-nowrap transition-all duration-400 group"
              style={{
                fontFamily: "var(--font-body)",
                borderBottomColor: active === i ? "#b8833c" : "transparent",
                color: active === i ? "#13100c" : "#9c8c7c",
              }}
            >
              <span
                className="text-[10px] tracking-widest uppercase self-end mb-0.5 transition-colors"
                style={{ color: active === i ? "#b8833c" : "#c8b898" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] tracking-wider">{p.title}</span>
            </button>
          ))}
        </div>

        {/* Project panel */}
        <AnimatePresence mode="wait">
          {projects.map((p, i) =>
            active === i ? (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start"
              >
                {/* Mockup */}
                <div className="relative">
                  <div
                    className="absolute -top-6 -left-2 text-[160px] md:text-[200px] font-light leading-none pointer-events-none select-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(184,131,60,0.06)",
                    }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10">
                    <DeviceMockup desktop={p.desktop} mobile={p.mobile} />
                  </div>
                </div>

                {/* Info */}
                <div className="lg:pt-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-[10px] tracking-[0.5em] uppercase"
                      style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
                    >
                      {p.category}
                    </span>
                    <span className="w-8 h-px inline-block" style={{ backgroundColor: "rgba(184,131,60,0.3)" }} />
                    <span
                      className="text-[10px] tracking-[0.4em] uppercase"
                      style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
                    >
                      {p.year}
                    </span>
                  </div>

                  <h3
                    className="font-light leading-[1] tracking-[-0.02em] mb-6"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#13100c",
                      fontSize: "clamp(36px, 4vw, 52px)",
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="leading-relaxed mb-10 text-sm max-w-sm"
                    style={{ fontFamily: "var(--font-body)", color: "#7a6858" }}
                  >
                    {p.description}
                  </p>

                  {/* Stack */}
                  <div className="mb-8">
                    <p
                      className="text-[10px] tracking-[0.5em] uppercase mb-4"
                      style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
                    >
                      Built with
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300 cursor-default"
                          style={{
                            fontFamily: "var(--font-body)",
                            border: "1px solid rgba(184,131,60,0.25)",
                            color: "#9c8c7c",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "#b8833c";
                            (e.currentTarget as HTMLElement).style.color = "#b8833c";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,131,60,0.25)";
                            (e.currentTarget as HTMLElement).style.color = "#9c8c7c";
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-12">
                    <p
                      className="text-[10px] tracking-[0.5em] uppercase mb-4"
                      style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
                    >
                      Key Features
                    </p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      {p.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-3 text-sm"
                          style={{ fontFamily: "var(--font-body)", color: "#7a6858" }}
                        >
                          <span className="w-3 h-px shrink-0" style={{ backgroundColor: "#b8833c" }} />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    data-cursor-label="Visit"
                    className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase pb-1.5 hover:gap-7 transition-all duration-400"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#b8833c",
                      borderBottom: "1px solid #b8833c",
                    }}
                  >
                    Visit Live Site
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── WHY US — PUNCHLINE ──────────────────────────────────────────────────────

function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const subtextY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const words = ["Hand", "built.", "No", "exceptions."];

  return (
    <section
      id="why-us"
      ref={ref}
      className="relative py-36 md:py-52 overflow-hidden"
      style={{ backgroundColor: "#13100c" }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(184,131,60,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="px-6 md:px-16 max-w-7xl mx-auto relative z-10">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.6em] uppercase mb-16 md:mb-24"
          style={{ fontFamily: "var(--font-body)", color: "#6a5840" }}
        >
          The Difference
        </motion.p>

        {/* THE PUNCHLINE */}
        <motion.div style={{ y: lineY }}>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-light leading-[0.85] tracking-[-0.04em]"
              style={{
                fontFamily: "var(--font-display)",
                color: "#f6f1e9",
                fontSize: "clamp(72px, 14vw, 180px)",
              }}
            >
              Hand
              <em style={{ color: "#b8833c", fontStyle: "italic" }}>built.</em>
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-light leading-[0.85] tracking-[-0.04em]"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(246,241,233,0.22)",
                fontSize: "clamp(72px, 14vw, 180px)",
              }}
            >
              No exceptions.
            </motion.h2>
          </div>
        </motion.div>

        {/* Divider rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-px mt-16 mb-14 origin-left"
          style={{ backgroundColor: "rgba(184,131,60,0.25)" }}
        />

        {/* Three micro-facts */}
        <motion.div
          style={{ y: subtextY }}
          className="grid grid-cols-3 max-w-lg"
        >
          {[
            { value: "0", label: "Templates" },
            { value: "0", label: "Agencies" },
            { value: "∞", label: "Care" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65 + i * 0.1, duration: 0.7 }}
            >
              <p
                className="text-[38px] font-light leading-none mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#b8833c" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section id="about" ref={ref} className="py-28 md:py-44 overflow-hidden" style={{ backgroundColor: "#f6f1e9" }}>
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.55em] uppercase mb-20"
          style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
        >
          The Person
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 lg:gap-32 items-start">
          {/* Photo with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div style={{ y: photoY }}>
              <div
                className="aspect-[4/5] relative overflow-hidden"
                style={{ backgroundColor: "#ede8df" }}
              >
                {/* Photo: <img src="/projects/carlo.jpg" alt="Carlo" className="w-full h-full object-cover" /> */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className="text-[100px] font-light leading-none tracking-[-0.05em]"
                      style={{ fontFamily: "var(--font-display)", color: "#d8cfc4" }}
                    >
                      bc
                    </p>
                    <p
                      className="text-[10px] tracking-[0.5em] uppercase mt-4"
                      style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
                    >
                      bycarlo
                    </p>
                  </div>
                </div>
                {/* Amber inset border */}
                <div
                  className="absolute inset-5 pointer-events-none"
                  style={{ border: "1px solid rgba(184,131,60,0.2)" }}
                />
                {/* Warm corner accent */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                  style={{
                    background: "linear-gradient(225deg, rgba(184,131,60,0.12) 0%, transparent 60%)",
                  }}
                />
              </div>
            </motion.div>
            <p
              className="text-[10px] mt-3 tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#c8b898" }}
            >
              — replace with /public/projects/carlo.jpg
            </p>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pt-4"
          >
            <h2
              className="font-light leading-[1.05] tracking-[-0.02em] mb-10"
              style={{
                fontFamily: "var(--font-display)",
                color: "#13100c",
                fontSize: "clamp(36px, 4.5vw, 56px)",
              }}
            >
              I build sites people{" "}
              <em style={{ fontStyle: "italic", color: "#b8833c" }}>
                actually
              </em>{" "}
              want to use.
            </h2>

            <div
              className="space-y-6 leading-relaxed text-[14px]"
              style={{ fontFamily: "var(--font-body)", color: "#7a6858" }}
            >
              <p>
                I started bycarlo because I saw too many small businesses and
                families paying for websites that looked cold, loaded slow, and
                didn't actually help them.
              </p>
              <p>
                I'm Carlo — a freelance web developer based in the Philippines.
                I've built sites for weddings, corporate brands, birthday events,
                and everything in between. Each one is custom. Each one is
                hand-coded.
              </p>
              <p>
                I love this work because a well-built website can change how
                people see a business. It can make a couple's wedding feel more
                real. It can turn a small resort into something guests trust.
                That kind of impact matters to me.
              </p>
              <p>If you have something worth showing the world — I'll make it look that way.</p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-14 pt-10"
              style={{ borderTop: "1px solid rgba(184,131,60,0.2)" }}
            >
              {[
                { value: "3+", label: "Years Building" },
                { value: "20+", label: "Sites Launched" },
                { value: "100%", label: "Custom Code" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-[42px] font-light leading-none tracking-[-0.03em]"
                    style={{ fontFamily: "var(--font-display)", color: "#b8833c" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.4em] uppercase mt-2"
                    style={{ fontFamily: "var(--font-body)", color: "#9c8c7c" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-28 md:py-44 overflow-hidden"
      style={{ backgroundColor: "#eae4d9" }}
    >
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <p
            className="text-[10px] tracking-[0.55em] uppercase mb-5"
            style={{ fontFamily: "var(--font-body)", color: "#b8833c" }}
          >
            Social Proof
          </p>
          <h2
            className="font-light leading-[0.88] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-display)",
              color: "#13100c",
              fontSize: "clamp(58px, 9vw, 112px)",
            }}
          >
            What they say.
          </h2>
        </motion.div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 pb-16"
          style={{ borderBottom: "1px solid rgba(184,131,60,0.2)" }}
        >
          {/* Decorative quote mark */}
          <div
            className="absolute -top-10 -left-2 text-[180px] leading-none pointer-events-none select-none"
            style={{ fontFamily: "var(--font-display)", color: "rgba(184,131,60,0.12)" }}
            aria-hidden
          >
            &ldquo;
          </div>

          <blockquote
            className="relative z-10 font-light leading-[1.25] tracking-[-0.01em] max-w-4xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "#13100c",
              fontSize: "clamp(22px, 3.5vw, 38px)",
            }}
          >
            {testimonials[0].quote}
          </blockquote>

          <div className="flex items-center gap-4 mt-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-medium shrink-0"
              style={{ backgroundColor: "#b8833c", fontFamily: "var(--font-body)" }}
            >
              {testimonials[0].avatar}
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-body)", color: "#13100c" }}
              >
                {testimonials[0].name}
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "#9c8c7c" }}
              >
                {testimonials[0].role}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Other testimonials */}
        <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: "rgba(184,131,60,0.12)" }}>
          {testimonials.slice(1).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.12 + 0.4,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-10 md:p-12"
              style={{ backgroundColor: "#eae4d9" }}
            >
              <p
                className="leading-relaxed mb-8 text-sm"
                style={{ fontFamily: "var(--font-body)", color: "#7a6858" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: "#13100c", color: "#f6f1e9", fontFamily: "var(--font-body)" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-body)", color: "#13100c" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-body)", color: "#9c8c7c" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const socials = [
    { label: "Instagram", handle: "@bycarlo", href: "https://instagram.com/bycarlo" },
    { label: "Facebook", handle: "bycarlo", href: "https://facebook.com/bycarlo" },
    { label: "Viber", handle: "bycarlo", href: "viber://chat?number=bycarlo" },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-28 md:py-44 overflow-hidden"
      style={{ backgroundColor: "#13100c" }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(184,131,60,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1 }}
        >
          <p
            className="text-[10px] tracking-[0.55em] uppercase mb-8"
            style={{ fontFamily: "var(--font-body)", color: "#6a5840" }}
          >
            Get In Touch
          </p>

          <motion.h2
            style={{ y: headlineY }}
            className="font-light leading-[0.86] tracking-[-0.03em] mb-12 max-w-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "#f6f1e9",
              fontSize: "clamp(58px, 11vw, 140px)",
            }}
          >
            Let&rsquo;s build
            <br />
            <span style={{ color: "#b8833c", fontStyle: "italic" }}>
              something
            </span>{" "}
            <span style={{ color: "rgba(246,241,233,0.25)" }}>great.</span>
          </motion.h2>

          <p
            className="mb-20 max-w-xs text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "#7a6858" }}
          >
            Have a project in mind? Reach out through any channel — I respond within 24 hours.
          </p>

          {/* Social links */}
          <div className="flex flex-col">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: i * 0.1 + 0.5,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                data-cursor
                className="flex items-center justify-between py-7 transition-all duration-500 group"
                style={{ borderTop: "1px solid rgba(184,131,60,0.12)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderTopColor = "rgba(184,131,60,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderTopColor = "rgba(184,131,60,0.12)";
                }}
              >
                <span
                  className="text-[10px] tracking-[0.5em] uppercase w-10 shrink-0 transition-colors duration-500"
                  style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 font-light tracking-[-0.01em] group-hover:translate-x-2 transition-transform duration-500"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#f6f1e9",
                    fontSize: "clamp(28px, 4vw, 48px)",
                  }}
                >
                  {s.label}
                </span>
                <span
                  className="text-sm hidden md:block transition-colors duration-500"
                  style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
                >
                  {s.handle}
                </span>
                <span
                  className="ml-8 text-2xl group-hover:translate-x-3 transition-all duration-400"
                  style={{ color: "#b8833c" }}
                >
                  →
                </span>
              </motion.a>
            ))}
            <div style={{ borderTop: "1px solid rgba(184,131,60,0.12)" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-10 px-6 md:px-16"
      style={{ backgroundColor: "#13100c", borderTop: "1px solid rgba(184,131,60,0.08)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="text-[10px] tracking-[0.55em] uppercase"
          style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
        >
          bycarlo
        </p>
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
        >
          © {new Date().getFullYear()} bycarlo. All rights reserved.
        </p>
        <p
          className="text-[10px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "#4a3828" }}
        >
          Built with Next.js & Framer Motion
        </p>
      </div>
    </footer>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main
      className={`${displayFont.variable} ${bodyFont.variable} overflow-x-hidden`}
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#f6f1e9" }}
    >
      <Grain />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <WhyUs />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
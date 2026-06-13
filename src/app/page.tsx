"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, Check, ChevronRight, MessageCircle,
  Database, Cpu, Layers, BarChart3, Workflow,
  ShieldCheck, Send, Loader2, CheckCircle2, X
} from "lucide-react";
import Image from "next/image";
import PageLoader from "@/components/PageLoader";
import ProjectModal from "@/components/ProjectModal";
import { unlockAudio, sfxClick, sfxHover, sfxWhoosh, sfxSuccess, sfxIntro, sfxModalOpen, sfxModalClose } from "@/lib/sfx";

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  industry: string;
  overview: string;
  image: string;
  metrics: string[];
  features: string[];
  role: string;
  timeline: string;
}

/* ─── Spring easing ─────────────────────────────────────────────────────────── */
const spring = { type: "spring" as const, damping: 24, stiffness: 220 };
const easeSpring = [0.22, 0.68, 0, 1.2] as const;
const easeOut   = [0.22, 0.68, 0, 1]   as const;

/* ─── Magnetic Pill Button ──────────────────────────────────────────────────── */
function PillBtn({
  label, dark = false, size = "md", onClick, href,
}: {
  label: string; dark?: boolean; size?: "sm" | "md";
  onClick?: () => void; href?: string;
}) {
  const iconSize = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  const cls = `pill-btn select-none ${dark ? "bg-[#0F172A] text-white" : "bg-[#E2E8F0] text-[#0F172A]"}`;
  const iconBg = dark ? "bg-[#1E293B]" : "bg-white";
  const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M2 16 L16 2 M6 2 h10 v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
  const inner = (
    <>
      <span className={`pill-btn__label text-xs`}>{label}</span>
      <span className={`${iconBg} ${iconSize} pill-btn__icon`}>
        <span className="icon-in w-4 flex items-center justify-center"><ArrowIcon /></span>
        <span className="icon-out w-4 flex items-center justify-center"><ArrowIcon /></span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <button onClick={onClick} className={cls}>{inner}</button>
  );
}

/* ─── Scroll Reveal wrapper ─────────────────────────────────────────────────── */
function Reveal({
  children, delay = 0, className = "", as: Tag = "div",
}: {
  children: React.ReactNode; delay?: number; className?: string; as?: any;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${delay === 1 ? "reveal-delay-1" : delay === 2 ? "reveal-delay-2" : delay === 3 ? "reveal-delay-3" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ─── Count-up stat ─────────────────────────────────────────────────────────── */
function StatCount({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const dur = 1800;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, value]);

  return (
    <div className="space-y-1">
      <span ref={ref} className="text-4xl md:text-5xl font-black text-white tabular-nums block">
        {count}{suffix}
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{label}</span>
    </div>
  );
}

/* ─── Cycling word ──────────────────────────────────────────────────────────── */
const CYCLE_WORDS = ["Scale", "Automate", "Modernise", "Transform", "Accelerate"];

function CycleWord() {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % CYCLE_WORDS.length);
        setExiting(false);
      }, 320);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block text-[#0A84FF] overflow-hidden" style={{ minWidth: "max-content" }}>
      <span
        key={CYCLE_WORDS[index]}
        className={exiting ? "word-cycle-exit" : "word-cycle-enter"}
        style={{ display: "inline-block" }}
      >
        {CYCLE_WORDS[index]}
      </span>
    </span>
  );
}

/* ─── Marquee ──────────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "Enterprise ERP Systems", "AI Automation", "Custom Software",
  "Analytics Dashboards", "Digital Transformation", "Business Intelligence",
  "Manufacturing Systems", "Salon & Retail Platforms", "Restaurant Solutions",
];

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-5 border-y border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#475569] whitespace-nowrap">{item}</span>
            <span className="text-[#CBD5E1]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  /* Contact form */
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", projectType: "", businessScale: "", message: "" });
  const [formErrors, setFormErrors] = useState<Partial<typeof form>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  /* Scroll tracking */
  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 32);
      const sections = ["home", "services", "projects", "about", "contact"];
      const pos = window.scrollY + 110;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) setActiveSection(s);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Unlock audio on first user interaction & play intro after loader */
  useEffect(() => {
    const handleFirstInteraction = () => {
      unlockAudio();
      // Play intro sound after the loader exits (~3s)
      setTimeout(() => sfxIntro(), 3200);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    sfxClick();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  /* Form */
  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.projectType) e.projectType = "Required";
    if (!form.message.trim()) e.message = "Required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (formErrors[name as keyof typeof form]) setFormErrors(fe => ({ ...fe, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormSubmitting(true); setFormError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed");
      setFormSuccess(true);
      sfxSuccess();
      setForm({ name: "", company: "", email: "", phone: "", projectType: "", businessScale: "", message: "" });
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  /* Data */
  const projects: Project[] = [
    {
      id: "rk-polymers",
      title: "RK Polymers ERP",
      industry: "Manufacturing",
      overview: "RK Polymers needed consolidation of siloed processes. We built a bespoke ERP platform coordinating raw materials, production stages, warehouse inventory, and automated invoicing — delivering full operational visibility in 4 weeks.\n\nBy unifying their supply chain into one system, management gained real-time visibility and dramatically reduced order processing times.",
      image: "/rk-global-logo.svg",
      role: "Lead Engineering Agency",
      timeline: "4 Weeks",
      metrics: ["45% Inventory Efficiency", "100% Production Visibility", "Zero Order Loss"],
      features: [
        "Production Tracking: Stage-by-stage tracking of raw materials and polymer conversions.",
        "Inventory Management: Real-time levels with automated low-stock alerts.",
        "Sales & Billing: Customer invoicing, tracking, and dispatch documentation.",
        "Role-Based Access Control: Granular permissions for all staff levels.",
      ],
    },
    {
      id: "toni-guy",
      title: "Toni and Guy Essensuals",
      industry: "Salon & Retail",
      overview: "Manual booking and checkout stations made it hard to audit traffic and staff schedules. We delivered a unified platform syncing billing with a central dashboard, tracking attendance via secure logs, and enabling instant admin updates.\n\nThis simplified administrative work and improved scheduling across the entire salon.",
      image: "/esses.webp",
      role: "Full-Stack Development",
      timeline: "3 Weeks",
      metrics: ["-30% Admin Overhead", "22% Repeat Bookings", "Realtime Sync"],
      features: [
        "Billing System: Swift checkouts integrated with loyalty databases.",
        "Staff Management: Attendance logs, shift planners, and performance dashboards.",
        "Analytics Dashboard: Revenue metrics, average spend per client, appointment reports.",
        "Live Website Admin: Push operational changes and service rates instantly.",
      ],
    },
    {
      id: "japali-kitchens",
      title: "Japali Kitchens",
      industry: "Food Services",
      overview: "Japali Kitchens needed a polished web presence for their premium commercial catering. We delivered a lightning-fast SEO-optimized portal with image-heavy galleries, responsive menu catalogs, and lead-generation forms with immediate email alerts.\n\nResults: 80% of customer queries now come through the online portal.",
      image: "/japali.jpeg",
      role: "UI/UX Design & Frontend",
      timeline: "5 Days",
      metrics: ["80% Online Queries", "Mobile-First Speed", "Instant Lead Alerts"],
      features: [
        "Responsive Grid: Optimized for mobile food-delivery and catering requests.",
        "Menu Management: Easily updated catalog items, price listings, and imagery.",
        "Conversion Optimization: Direct WhatsApp CTAs and custom booking forms.",
      ],
    },
  ];

  const services = [
    { icon: <Database className="w-6 h-6" />, title: "Enterprise ERP Systems", tags: ["Production", "Inventory", "Sales Ops", "Role Access"], desc: "End-to-end platforms for manufacturing, procurement, order processing, and operations management — purpose-built for your industry." },
    { icon: <Cpu className="w-6 h-6" />, title: "AI & Automation", tags: ["LLM Agents", "Data Pipelines", "Workflow Bots", "Integration"], desc: "Eliminate manual data entry, automate repetitive workflows, and embed intelligent agents directly into your existing business systems." },
    { icon: <Layers className="w-6 h-6" />, title: "Custom Software", tags: ["React / Next.js", "Node.js", "PostgreSQL", "Cloud"], desc: "High-performance bespoke applications engineered for security, absolute reliability, and the scale demands of enterprise growth." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics & BI Dashboards", tags: ["Real-Time Data", "Charts & Reports", "KPI Tracking", "Exports"], desc: "Interactive dashboards aggregating sales, operations, and financial metrics to drive faster, data-informed decisions across your organisation." },
    { icon: <Workflow className="w-6 h-6" />, title: "Digital Transformation", tags: ["Legacy Migration", "Process Design", "Cloud Adoption", "Training"], desc: "Transition paper records and legacy Excel operations into modern, cloud-connected software environments that improve team output." },
  ];

  const cardBgs = ["#0F172A", "#1E293B", "#0F172A", "#1E293B", "#0F172A"];

  return (
    <>
      <PageLoader />

      <div className="min-h-screen bg-white text-[#0F172A] flex flex-col overflow-x-hidden">

        {/* ── Navbar ────────────────────────────────────────────────────────── */}
        <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${isScrolled ? "glass-nav py-3" : "bg-transparent py-5"}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <a href="#home" onClick={e => scrollTo(e, "home")} className="flex items-center gap-2 md:gap-2.5 select-none group">
              <motion.div whileHover={{ rotate: 20, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }} className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0">
                <Image src="/icon_only.png" alt="FIFTH ORBIT" fill sizes="28px" className="object-contain" priority />
              </motion.div>
              <span className="font-black text-sm md:text-base tracking-[0.18em] uppercase text-[#0F172A] pt-0.5">FIFTH ORBIT</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#475569]">
              {NAV_ITEMS.map(item => (
                <a key={item.id} href={`#${item.id}`} onClick={e => scrollTo(e, item.id)}
                  className={`relative transition-colors hover:text-[#0A84FF] py-1 ${activeSection === item.id ? "text-[#0A84FF]" : ""}`}>
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-[#0A84FF]" />
                  )}
                </a>
              ))}
            </nav>

            {/* CTA pill */}
            <div className="hidden md:block">
              <PillBtn label="Book Consultation" dark href="#contact" />
            </div>

            {/* Mobile burger */}
            <button onClick={() => setMenuOpen(m => !m)} className="md:hidden p-2 rounded-lg border border-[#E2E8F0] bg-white" aria-label="Toggle menu">
              <div className={`w-5 h-0.5 bg-[#0F172A] mb-1.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#0F172A] mb-1.5 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#0F172A] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-[#E2E8F0] shadow-xl p-6 flex flex-col gap-4">
                {NAV_ITEMS.map(item => (
                  <a key={item.id} href={`#${item.id}`} onClick={e => scrollTo(e, item.id)}
                    className="text-lg font-semibold text-[#0F172A] hover:text-[#0A84FF] transition-colors py-1">
                    {item.label}
                  </a>
                ))}
                <div className="pt-2">
                  <PillBtn label="Book Consultation" dark href="#contact" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section id="home" className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 bg-white overflow-hidden">
          {/* Dot grid bg */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#0A84FF 1px,transparent 0)", backgroundSize: "28px 28px" }} />

          {/* Orbiting decoration */}
          <div className="absolute right-[-80px] top-[15%] w-[500px] h-[500px] pointer-events-none hidden lg:block opacity-20">
            <div className="absolute inset-0 border border-[#0A84FF]/30 rounded-full animate-spin-slow" />
            <div className="absolute inset-8 border border-[#0A84FF]/20 rounded-full animate-spin-reverse" />
            <div className="absolute inset-16 border border-[#0A84FF]/10 rounded-full animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0A84FF] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-10">
              <div className="float-in">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[11px] font-bold text-[#0369A1] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-[#0A84FF] rounded-full animate-pulse" />
                  Enterprise Engineering Agency
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl xs:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-[#0F172A] leading-[1.04] float-in float-in-delay-1">
                  We help businesses{" "}
                  <br className="hidden sm:inline" />
                  <CycleWord />
                </h1>
                <p className="text-lg text-[#475569] leading-relaxed max-w-lg float-in float-in-delay-2">
                  Custom software, ERP systems, AI automation & analytics platforms — engineered to deliver measurable business outcomes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 float-in float-in-delay-3">
                <PillBtn label="Book a Consultation" dark href="#contact" />
                <a href="#projects" onClick={e => scrollTo(e, "projects")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors py-3 px-2">
                  View Projects <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-[#E2E8F0] float-in float-in-delay-4">
                {["Enterprise Solutions", "Custom Development", "AI Automation", "Ongoing Support"].map(b => (
                  <div key={b} className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Brand video */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
              className="relative w-full aspect-video max-w-xl mx-auto"
            >
              {/* Video card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0F172A] shadow-2xl shadow-[#0A84FF]/10 border border-[#1E293B]">
                <video id="hero-video" src="/Create_a_luxury_technology_bra.mp4" autoPlay loop muted playsInline
                  className="absolute -right-[6%] -bottom-[6%] w-[112%] h-[112%] max-w-none object-cover opacity-95" />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent pointer-events-none" />
                {/* Sound toggle (positioned bottom-right for clean visual alignment) */}
                <button
                  onClick={() => {
                    const vid = document.getElementById('hero-video') as HTMLVideoElement;
                    if (vid) { vid.muted = !vid.muted; }
                  }}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                  aria-label="Toggle sound"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Marquee ───────────────────────────────────────────────────────── */}
        <Marquee />

        {/* ── Clients ───────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal><p className="text-center text-[11px] font-black text-[#475569] uppercase tracking-[0.25em] mb-12">Trusted by Growing Businesses</p></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "RK Polymers", logo: "/rk-global-logo.svg", tagline: "Manufacturing & Procurement", desc: "Custom ERP & real-time inventory synchronizer" },
                { name: "Toni and Guy Essensuals Gorantla", logo: "/esses.webp", tagline: "Salon & Retail Operations", desc: "Centralized analytics, attendance, and billing" },
                { name: "Japali Kitchens", logo: "/japali.jpeg", tagline: "Food Services & Hospitality", desc: "High-speed website & lead engine" },
              ].map((c, i) => (
                <Reveal key={c.name} delay={i as 0|1|2}>
                  <div className="group p-6 bg-white border border-[#E2E8F0] rounded-2xl flex items-start gap-4 card-lift hover:border-[#0A84FF]/40">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                      <Image src={c.logo} alt={c.name} fill className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-500" sizes="48px" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-1">{c.tagline}</p>
                      <p className="text-sm font-bold text-[#0F172A] mb-1">{c.name}</p>
                      <p className="text-xs text-[#475569]">{c.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ──────────────────────────────────────────────────────── */}
        <section id="services" className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 space-y-4">
              <Reveal><span className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.25em]">Capabilities</span></Reveal>
              <Reveal delay={1}>
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05]">
                  What We Build
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="text-[#475569] text-lg max-w-xl leading-relaxed">
                  Bespoke software infrastructure that solves concrete bottlenecks, enhances output, and automates operations.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <Reveal key={i} delay={(i % 3) as 0|1|2}>
                  <div className="group bg-white border border-[#E2E8F0] rounded-2xl p-7 flex flex-col gap-5 card-lift hover:border-[#0A84FF]/40 h-full">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#0A84FF] flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-base font-bold text-[#0F172A]">{s.title}</h3>
                      <p className="text-sm text-[#475569] leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map(t => (
                        <span key={t} className="text-[10px] font-bold px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[#475569] uppercase tracking-wide">{t}</span>
                      ))}
                    </div>
                    <a href="#contact" onClick={e => scrollTo(e, "contact")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A84FF] hover:text-[#2563EB] transition-colors mt-auto">
                      Discuss Scope <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ──────────────────────────────────────────────────────── */}
        <section id="projects" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 space-y-4">
              <Reveal><span className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.25em]">Portfolio</span></Reveal>
              <Reveal delay={1}><h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05]">Case Studies</h2></Reveal>
              <Reveal delay={2}><p className="text-[#475569] text-lg max-w-xl leading-relaxed">Real solutions. Real outcomes. Click any card to explore the full case study.</p></Reveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((proj, i) => (
                <Reveal key={proj.id} delay={(i % 3) as 0|1|2}>
                  <div
                    onClick={() => { setSelectedProject(proj); sfxModalOpen(); }}
                    onMouseEnter={() => sfxHover()}
                    className="project-card-inner group cursor-pointer bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden card-lift hover:border-[#0A84FF]/40 flex flex-col"
                  >
                    {/* Image header */}
                    <div className="relative h-52 bg-[#0F172A] overflow-hidden flex-shrink-0">
                      <Image src={proj.image} alt={proj.title} fill
                        className="object-cover opacity-25 group-hover:opacity-45 filter grayscale group-hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 384px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2">{proj.industry}</span>
                        <div className="flex items-end justify-between gap-2">
                          <h3 className="text-lg font-black text-white leading-tight title-hover group-hover:translate-x-2 transition-transform duration-300">{proj.title}</h3>
                          <div className="arrow-reveal text-white flex-shrink-0 mb-0.5">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed">{proj.overview.split('\n')[0]}</p>
                      <div className="space-y-1.5">
                        {proj.features.slice(0, 2).map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-[11px] font-semibold text-[#0F172A]">
                            <Check className="w-3 h-3 text-[#0A84FF] flex-shrink-0" />
                            <span className="truncate">{f.split(":")[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer metric */}
                    <div className="px-6 pb-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                      <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full">
                        {proj.metrics[0].split(" ")[0]} {proj.metrics[0].split(" ")[1]}
                      </span>
                      <span className="text-xs font-bold text-[#0A84FF] flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────────────── */}
        <section id="about" className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
          {/* BG rings */}
          <div className="absolute right-[-120px] top-[-80px] w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute right-[-180px] top-[-140px] w-[700px] h-[700px] border border-white/5 rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Reveal><span className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.25em]">Company</span></Reveal>
              <Reveal delay={1}>
                <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight">
                  Engineering Digital Growth Through{" "}
                  <span className="text-[#0A84FF]">Software & Intelligence</span>
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  FIFTH ORBIT helps businesses modernise operations through enterprise software, AI automation, analytics platforms, and ERP systems. We build scalable technology that delivers measurable business outcomes — on time, every time.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="flex flex-col gap-4 pt-2">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4" />, title: "Technical Excellence", desc: "Clean code architecture, robust database models, and modern frameworks." },
                    { icon: <BarChart3 className="w-4 h-4" />, title: "Business Alignment", desc: "Every tool has a measurable financial ROI — no tech for tech's sake." },
                    { icon: <Cpu className="w-4 h-4" />, title: "Ongoing Support", desc: "Active maintenance, security patches, backups, and scaling pipelines." },
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[#0A84FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.title}</h4>
                        <p className="text-xs text-[#64748B] mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 xxs:grid-cols-2 gap-4 md:gap-5">
                {[
                  { value: 100, suffix: "%", label: "SLA Alignment" },
                  { value: 3, suffix: "+", label: "Enterprise Clients" },
                  { value: 24, suffix: "/7", label: "System Monitoring" },
                  { value: 4, suffix: " wks", label: "Avg Delivery Time" },
                ].map((s, i) => (
                  <Reveal key={i} delay={(i % 2) as 0|1}>
                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:border-[#0A84FF]/30 transition-colors">
                      <StatCount value={s.value} suffix={s.suffix} label={s.label} />
                    </div>
                  </Reveal>
                ))}
              </div>


            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────────── */}
        <section id="contact" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center space-y-4 mb-14">
              <Reveal><span className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.25em]">Get In Touch</span></Reveal>
              <Reveal delay={1}><h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">Start Your Project</h2></Reveal>
              <Reveal delay={2}><p className="text-[#475569] max-w-md mx-auto">Tell us about your goals. All enquiries go directly to <strong>fifthorbitofficial@gmail.com</strong>.</p></Reveal>
            </div>

            <Reveal>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-12 shadow-sm">
                {formSuccess ? (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center py-10 gap-5">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-[#0F172A]">Proposal Sent ✓</h3>
                    <p className="text-[#475569] max-w-sm">Your enquiry has been forwarded to our team. We'll respond within 24 hours.</p>
                    <button onClick={() => setFormSuccess(false)} className="text-sm font-bold text-[#0A84FF] hover:underline">Send another message</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {([
                        { id: "name", label: "Full Name *", type: "text", placeholder: "John Doe" },
                        { id: "company", label: "Company", type: "text", placeholder: "Acme Corp" },
                        { id: "email", label: "Email Address *", type: "email", placeholder: "john@company.com" },
                        { id: "phone", label: "Phone Number *", type: "tel", placeholder: "+91 98765 43210" },
                      ] as const).map(f => (
                        <div key={f.id}>
                          <label htmlFor={f.id} className="block text-[10px] font-black uppercase tracking-widest text-[#475569] mb-2">{f.label}</label>
                          <input type={f.type} id={f.id} name={f.id} value={form[f.id as keyof typeof form]} onChange={handleChange} placeholder={f.placeholder}
                            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-[#0A84FF]/20 ${formErrors[f.id as keyof typeof form] ? "border-rose-400" : "border-[#E2E8F0] focus:border-[#0A84FF]"}`} />
                          {formErrors[f.id as keyof typeof form] && <p className="text-rose-500 text-xs mt-1">{formErrors[f.id as keyof typeof form]}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="projectType" className="block text-[10px] font-black uppercase tracking-widest text-[#475569] mb-2">Project Type *</label>
                        <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#0A84FF]/20 ${formErrors.projectType ? "border-rose-400" : "border-[#E2E8F0] focus:border-[#0A84FF]"}`}>
                          <option value="">Select Type</option>
                          {["Enterprise ERP System", "AI Automation", "Custom Software", "Analytics Dashboard", "Website / Web App", "Digital Transformation"].map(t => <option key={t}>{t}</option>)}
                        </select>
                        {formErrors.projectType && <p className="text-rose-500 text-xs mt-1">{formErrors.projectType}</p>}
                      </div>
                      <div>
                        <label htmlFor="businessScale" className="block text-[10px] font-black uppercase tracking-widest text-[#475569] mb-2">Scale of Business</label>
                        <select id="businessScale" name="businessScale" value={form.businessScale} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-white outline-none focus:ring-2 focus:ring-[#0A84FF]/20 focus:border-[#0A84FF] transition-all">
                          <option value="">Select Scale</option>
                          {["Startup (1–10 employees)", "Small Business (10–50)", "SME (50–250)", "Enterprise (250+)", "Multi-Location / Franchise"].map(b => <option key={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-[#475569] mb-2">Project Brief *</label>
                      <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Describe your goals, requirements, timeline..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-[#0A84FF]/20 resize-none ${formErrors.message ? "border-rose-400" : "border-[#E2E8F0] focus:border-[#0A84FF]"}`} />
                      {formErrors.message && <p className="text-rose-500 text-xs mt-1">{formErrors.message}</p>}
                    </div>

                    {formError && <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium">{formError}</div>}

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-[#94A3B8]">* Required. Forwarded directly to our inbox.</p>
                      <button type="submit" disabled={formSubmitting}
                        className="inline-flex items-center gap-2 bg-[#0A84FF] hover:bg-[#2563EB] text-white font-bold text-sm py-3.5 px-8 rounded-xl transition-colors disabled:opacity-60 min-w-[170px] justify-center">
                        {formSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Proposal</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer className="py-16 bg-[#0F172A] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="relative w-7 h-7"><Image src="/icon_only.png" alt="FIFTH ORBIT" fill sizes="28px" className="object-contain brightness-0 invert" /></div>
                  <span className="font-black text-sm tracking-[0.2em] uppercase">FIFTH ORBIT</span>
                </div>
                <p className="text-[#64748B] text-xs leading-relaxed">Premium technology consulting & software development. Engineering digital growth through intelligence.</p>
                <div className="flex gap-3 pt-2">
                  {[["Twitter", "https://twitter.com/fifthorbit"], ["LinkedIn", "https://linkedin.com/company/fifthorbit"]].map(([name, href]) => (
                    <a key={name} href={href} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#64748B] hover:text-white transition-colors uppercase tracking-wider border border-white/10 px-3 py-1.5 rounded-full hover:border-white/30">{name}</a>
                  ))}
                </div>
              </div>

              {[
                { title: "Capabilities", items: ["Custom ERP Systems", "AI Automation", "Custom Software", "Analytics Dashboards"] },
                { title: "Case Studies", items: ["RK Polymers", "Toni and Guy Essensuals", "Japali Kitchens"] },
                { title: "Company", items: ["Enterprise SLA", "Privacy Policy", "Terms of Service"] },
              ].map(col => (
                <div key={col.title} className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569]">{col.title}</h5>
                  <ul className="space-y-2.5">
                    {col.items.map(item => <li key={item} className="text-xs text-[#64748B] hover:text-white transition-colors cursor-pointer">{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#475569]">© {new Date().getFullYear()} FIFTH ORBIT. All rights reserved.</p>
              <p className="text-xs text-[#475569]">Engineering digital growth through intelligence.</p>
            </div>
          </div>
        </footer>

        {/* ── Floating WhatsApp ─────────────────────────────────────────────── */}
        <motion.a
          href="https://wa.me/918074763113?text=Hi%20Fifth%20Orbit,%20I'd%20like%20to%20discuss%20a%20software%20project."
          target="_blank" rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-colors"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>

      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => { setSelectedProject(null); sfxModalClose(); }} />
        )}
      </AnimatePresence>
    </>
  );
}

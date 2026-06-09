"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ORBIT_OUTER = [
  "ERP", "CRM", "AI", "Analytics",
  "Web Apps", "Automation", "BI", "Cloud",
];

const ORBIT_INNER = ["IoT", "SaaS", "E-Commerce", "Mobile"];

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-[#0A84FF] flex items-center justify-center overflow-hidden"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.22, 0.68, 0, 1] } }}
        >
          {/* ── Orbit ring visuals ────────────────────── */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.68, 0, 1] }}
            className="absolute w-[560px] h-[560px] border border-white rounded-full"
          />
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.12 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 0.68, 0, 1] }}
            className="absolute w-[360px] h-[360px] border border-white rounded-full"
          />

          {/* ── Outer orbit items (radius 280px) ───── */}
          <div className="absolute w-0 h-0 animate-spin-slow" style={{ animationDuration: "25s" }}>
            {ORBIT_OUTER.map((item, i) => {
              const angleDeg = (360 / ORBIT_OUTER.length) * i;
              const angleRad = (angleDeg * Math.PI) / 180;
              const r = 280;
              const x = Math.cos(angleRad) * r;
              const y = Math.sin(angleRad) * r;
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: [0.22, 0.68, 0, 1.2] }}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="animate-spin-reverse"
                    style={{ animationDuration: "25s" }}
                  >
                    <span className="text-[10px] md:text-[11px] font-black text-white/80 uppercase tracking-[0.15em] whitespace-nowrap bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg shadow-black/5">
                      {item}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Inner orbit items (radius 180px) ───── */}
          <div className="absolute w-0 h-0 animate-spin-reverse" style={{ animationDuration: "20s" }}>
            {ORBIT_INNER.map((item, i) => {
              const angleDeg = (360 / ORBIT_INNER.length) * i + 45;
              const angleRad = (angleDeg * Math.PI) / 180;
              const r = 180;
              const x = Math.cos(angleRad) * r;
              const y = Math.sin(angleRad) * r;
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.6, ease: [0.22, 0.68, 0, 1.2] }}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="animate-spin-slow"
                    style={{ animationDuration: "20s" }}
                  >
                    <span className="text-[10px] md:text-[11px] font-bold text-white/60 uppercase tracking-[0.15em] whitespace-nowrap bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                      {item}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Tiny dot accents on orbits ────────── */}
          <div className="absolute w-0 h-0 animate-spin-slow" style={{ animationDuration: "35s" }}>
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <div
                  key={deg}
                  className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                  style={{ left: Math.cos(rad) * 280, top: Math.sin(rad) * 280, transform: "translate(-50%,-50%)" }}
                />
              );
            })}
          </div>

          {/* ── Center content ────────────────────── */}
          <div className="relative z-10 flex flex-col items-center gap-5 pointer-events-none">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 0.68, 0, 1.2] }}
              className="relative w-20 h-20 md:w-24 md:h-24"
            >
              <Image
                src="/icon_only.png"
                alt="FIFTH ORBIT"
                fill
                sizes="96px"
                className="object-contain brightness-0 invert drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Brand name */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 0.68, 0, 1.2] }}
                className="text-white font-black text-xl md:text-2xl tracking-[0.35em] uppercase"
              >
                FIFTH ORBIT
              </motion.div>
            </div>

            {/* Tagline */}
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
                className="text-white/70 text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-center"
              >
                We cover every industry
              </motion.p>
            </div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="w-40 h-[2px] bg-white/20 rounded-full overflow-hidden origin-center"
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

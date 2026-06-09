"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, ExternalLink, Calendar, Briefcase, ChevronRight } from "lucide-react";
import Image from "next/image";

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
  externalLink?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0F172A]/60 backdrop-blur-sm"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#E2E8F0]"
      >
        {/* Banner */}
        <div className="relative p-6 md:p-8 bg-[#0F172A] flex-shrink-0 flex items-center justify-between overflow-hidden border-b border-[#1E293B]">
          {/* Orbit rings */}
          <div className="absolute -right-16 -bottom-16 w-52 h-52 border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -right-28 -bottom-28 w-80 h-80 border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -right-40 -bottom-40 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

          {/* Title */}
          <div className="relative z-10 space-y-1.5 pr-8 sm:pr-0">
            <span className="inline-block text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest bg-[#0A84FF]/10 px-2 py-0.5 rounded">
              {project.industry} Case Study
            </span>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h3>
          </div>

          {/* Logo Badge */}
          <div className="relative z-10 flex-shrink-0 ml-6 hidden sm:block">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white border border-[#1E293B] p-3.5 flex items-center justify-center shadow-lg">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} logo`}
                  width={80}
                  height={80}
                  className="object-contain max-h-full max-w-full"
                  priority
                />
              ) : (
                <span className="text-[#0F172A] text-sm font-black">{project.title.substring(0, 2)}</span>
              )}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition-colors border border-white/10 z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-sm">
            <div>
              <span className="block text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Client Industry</span>
              <span className="font-semibold text-[#0F172A]">{project.industry}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Our Role</span>
              <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0A84FF]" />
                {project.role}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Timeline</span>
              <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0A84FF]" />
                {project.timeline}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">System Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Production Live
              </span>
            </div>
          </div>

          {/* Overview & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-base font-bold uppercase tracking-wide text-[#0F172A] border-b border-[#E2E8F0] pb-2">
                Project Overview
              </h4>
              <p className="text-[#475569] text-sm leading-relaxed whitespace-pre-line">
                {project.overview}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold uppercase tracking-wide text-[#0F172A] border-b border-[#E2E8F0] pb-2">
                Key Outcomes
              </h4>
              <div className="space-y-3">
                {project.metrics.map((metric, idx) => (
                  <div key={idx} className="p-3.5 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] flex items-center gap-4">
                    <span className="text-2xl font-black text-[#0A84FF] shrink-0 leading-none">
                      {metric.split(" ")[0]}
                    </span>
                    <span className="text-xs font-semibold text-[#475569] leading-tight">
                      {metric.substring(metric.indexOf(" ") + 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-base font-bold uppercase tracking-wide text-[#0F172A] border-b border-[#E2E8F0] pb-2">
              Engineered Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#0A84FF]/40 transition-colors bg-white"
                >
                  <div className="p-1 rounded bg-[#0A84FF]/5 text-[#0A84FF] mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#0F172A]">{feature.split(":")[0]}</h5>
                    {feature.includes(":") && (
                      <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                        {feature.substring(feature.indexOf(":") + 1).trim()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#475569] text-center sm:text-left">
              Interested in achieving similar results for your business? Let&apos;s discuss your requirements.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0A84FF] hover:bg-[#2563EB] text-white py-2.5 px-5 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Book Strategic Call
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#0F172A] py-2.5 px-4 border border-[#E2E8F0] rounded-lg transition-colors"
                >
                  Visit Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

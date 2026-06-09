"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
}

const initialFormState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  budgetRange: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const projectTypes = [
    "Enterprise ERP System",
    "AI Automation & LLM Systems",
    "Custom Software Development",
    "Analytics & BI Dashboard",
    "Website & Web App Development",
    "Digital Transformation Consultation",
  ];

  const budgetRanges = [
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+",
  ];

  const validate = (): boolean => {
    const tempErrors: Partial<FormState> = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!form.phone.trim()) tempErrors.phone = "Phone number is required";
    if (!form.projectType) tempErrors.projectType = "Please select a project type";
    if (!form.budgetRange) tempErrors.budgetRange = "Please select a budget range";
    if (!form.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit proposal request.");
      }

      setIsSuccess(true);
      setForm(initialFormState);
    } catch (err: any) {
      console.error("Form submission error:", err);
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden shadow-sm bg-white p-6 md:p-10">
      {isSuccess ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center text-center py-10"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-success">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-primary-text mb-2">
            Proposal Request Sent Successfully
          </h3>
          <p className="text-secondary-text max-w-md mb-8">
            Thank you for reaching out. Your proposal request has been forwarded to **fifthorbitofficial@gmail.com**. A senior consultant from Fifth Orbit will review your requirements and respond within 24 hours.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="py-2.5 px-6 rounded-lg text-sm font-medium border border-border-color hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  errors.name ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border-color text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="Acme Corp"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  errors.email ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
                }`}
                placeholder="john@company.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  errors.phone ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
                }`}
                placeholder="+91 80747 63113"
              />
              {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Project Type *
              </label>
              <select
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  errors.projectType ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
                }`}
              >
                <option value="">Select Project Type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.projectType && <p className="text-rose-500 text-xs mt-1">{errors.projectType}</p>}
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budgetRange" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Budget Range *
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={form.budgetRange}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  errors.budgetRange ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
                }`}
              >
                <option value="">Select Budget Range</option>
                {budgetRanges.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
              {errors.budgetRange && <p className="text-rose-500 text-xs mt-1">{errors.budgetRange}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
              Brief Project Overview *
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                errors.message ? "border-rose-500 focus:border-rose-500" : "border-border-color focus:border-accent"
              }`}
              placeholder="Describe your goals, requirements, timeline, and any integration dependencies..."
            />
            {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
          </div>

          {submitError && (
            <div className="p-4 border border-rose-100 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-secondary-text">
              * Required fields. Inquiries forward directly to our inbox.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-secondary text-white font-semibold text-sm py-3.5 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[170px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Proposal Request
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

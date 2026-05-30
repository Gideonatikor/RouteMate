"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bus,
  BusFront,
  Clock3,
  Compass,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  MessageCircle,
  Navigation,
  Route,
  Search,
  Shield,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const steps = [
  {
    icon: MapPin,
    title: "Set Your Location",
    desc: "Type where you are or let GPS detect it. RouteMate knows 80+ Kumasi neighborhoods.",
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    icon: Search,
    title: "Search Your Destination",
    desc: "Type where you want to go — Kejetia, Adum, Tech Junction, or any Kumasi area.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    icon: Bus,
    title: "Get Exact Directions",
    desc: "See which trotro or taxi to board, where to board, and exactly what to tell the driver.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    icon: Navigation,
    title: "Track Your Trip",
    desc: "Start the trip timer, follow the map, and get alerted when it is time to alight.",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
];

const features = [
  { icon: Wallet, label: "Real Fare Estimates", desc: "Know the exact trotro and taxi fares before you board." },
  { icon: MessageCircle, label: "Driver Phrase Guide", desc: 'Learn exactly what to say — "Boss, Kejetia side."' },
  { icon: Compass, label: "Lost Mode", desc: "Don't know where you are? RouteMate will figure it out." },
  { icon: Clock3, label: "ETA Countdown", desc: "Live timer so you know when to prepare to alight." },
  { icon: Shield, label: "Safety Tips", desc: "Night-time boarding advice and safety notes for each route." },
  { icon: Globe, label: "Works Offline", desc: "PWA support — works even with poor network coverage." },
  { icon: Smartphone, label: "Mobile First", desc: "Designed for your phone. Present your hackathon demo on mobile." },
  { icon: Heart, label: "Share with Friends", desc: "Share route details to WhatsApp with one tap." },
];

const team = [
  { name: "RouteMate Team", role: "Built at KNUST for Kumasi commuters" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <DarkModeToggle />

      {/* Header */}
      <section className="mx-auto max-w-4xl px-5 pt-8 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to RouteMate
        </Link>

        <motion.div {...fadeUp} className="mt-10 text-center">
          <div className="relative mx-auto mb-6 flex h-28 w-28 overflow-hidden rounded-[32px] border border-sky-200/80 shadow-[0_20px_48px_rgba(14,165,233,0.3)] transition-transform duration-300 hover:scale-105 dark:border-sky-850 dark:shadow-[0_20px_48px_rgba(14,165,233,0.15)]">
            <img
              src="/logo-bus-transparent.png"
              alt="RouteMate Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            About RouteMate
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            The smartest way to navigate Kumasi's public transport. Built by KNUST students, 
            for everyone who needs to get around the Garden City.
          </p>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/30"
        >
          <div className="flex items-start gap-4">
            <Lightbulb className="mt-1 h-8 w-8 shrink-0 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">The Problem</h2>
              <p className="mt-2 text-slate-700 leading-relaxed dark:text-slate-300">
                Navigating Kumasi's trotro and taxi system is confusing for newcomers, visitors, and even residents 
                exploring unfamiliar areas. There's no Google Maps-style guidance for informal transport — you don't know 
                <strong> where to board</strong>, <strong>what to tell the driver</strong>, <strong>how much to pay</strong>, 
                or <strong>where to get off</strong>.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed dark:text-slate-300">
                People end up paying 5-10× more for Uber/Bolt rides or getting lost and overcharged. 
                <strong> RouteMate fixes this</strong> — it gives you the exact, local knowledge you need 
                to ride like a Kumasi native.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <motion.h2 {...fadeUp} className="mb-8 text-center text-2xl font-bold text-slate-950 dark:text-white">
          How It Works
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
              >
                <div className={`mb-4 inline-flex items-center justify-center rounded-xl ${step.bg} p-3`}>
                  <span className="mr-2 text-sm font-bold text-slate-400 dark:text-slate-500">
                    {i + 1}
                  </span>
                  <Icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <motion.h2 {...fadeUp} className="mb-8 text-center text-2xl font-bold text-slate-950 dark:text-white">
          Features
        </motion.h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-sky-800"
              >
                <Icon className="mb-3 h-6 w-6 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">{f.label}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "80+", label: "Kumasi Areas" },
            { value: "5", label: "Full Routes" },
            { value: "GH₵20+", label: "Avg. Savings" },
            { value: "Free", label: "Always Free" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-center shadow-lg shadow-sky-500/15"
            >
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-sky-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800/80"
        >
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Built With</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Next.js 15", "React 19", "TypeScript", "Leaflet Maps", "Framer Motion", "PWA", "CSS3"].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            No external APIs required — all route data is locally embedded for lightning-fast, offline-first performance.
            The app works as a Progressive Web App installable on any phone.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <motion.div {...fadeUp} className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <Navigation className="h-5 w-5" />
            Start Navigating
          </Link>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Made with ❤️ in Kumasi, Ghana
          </p>
        </motion.div>
      </section>
    </main>
  );
}

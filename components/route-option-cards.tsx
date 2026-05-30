"use client";

import { motion } from "framer-motion";
import type { RouteRecord } from "@/lib/mock-data";
import type { RouteOptionKey } from "@/lib/route-presentation";
import { GlassCard } from "@/components/ui/glass-card";

type RouteOptionCardsProps = {
  route: RouteRecord;
  activeKey: null | RouteOptionKey;
  onSelect: (key: RouteOptionKey) => void;
};

const accents = {
  cheapest: "border-emerald-200 bg-emerald-50 text-emerald-700",
  fastest: "border-amber-200 bg-amber-50 text-amber-700",
  balanced: "border-sky-200 bg-sky-50 text-sky-700",
} as const;

export function RouteOptionCards({
  route,
  activeKey,
  onSelect,
}: RouteOptionCardsProps) {
  const cards = [
    route.options.cheapest,
    route.options.fastest,
    route.options.balanced,
  ];
  const keys = ["cheapest", "fastest", "balanced"] as const;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map((option, index) => (
        <motion.button
          key={option.label}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          whileHover={{ y: -4 }}
          onClick={() => onSelect(keys[index])}
          className="text-left"
        >
          <GlassCard
            className={`h-full p-5 transition ${
              activeKey === keys[index]
                ? "border-sky-400 bg-sky-50 shadow-[0_0_0_1px_rgba(2,132,199,0.15),0_18px_40px_rgba(37,99,235,0.12)]"
                : "hover:border-sky-300"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">{option.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{option.highlight}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${accents[keys[index]]}`}>
                {option.transportType}
              </span>
            </div>
            {activeKey === keys[index] ? (
              <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Selected
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Fare</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{option.fare}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Time</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{option.time}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Comfort</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{option.comfort}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Walking</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{option.walkingDistance}</p>
              </div>
            </div>
          </GlassCard>
        </motion.button>
      ))}
    </div>
  );
}

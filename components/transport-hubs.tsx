"use client";

import { motion } from "framer-motion";
import type { TransportHub } from "@/lib/location-context";
import { GlassCard } from "@/components/ui/glass-card";

type TransportHubsProps = {
  hubs: TransportHub[];
};

const categoryStyles = {
  origin: "border-sky-200 bg-sky-50 text-sky-700",
  hub: "border-cyan-200 bg-cyan-50 text-cyan-700",
  destination: "border-emerald-200 bg-emerald-50 text-emerald-700",
  transfer: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

export function TransportHubs({ hubs }: TransportHubsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {hubs.map((hub, index) => (
        <motion.div
          key={hub.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04 }}
        >
          <GlassCard className="h-full p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Landmark / Hub
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-slate-950">
                  {hub.name}
                </h3>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${categoryStyles[hub.category]}`}
              >
                {hub.category}
              </span>
            </div>

            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                Use in the app
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{hub.use}</p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

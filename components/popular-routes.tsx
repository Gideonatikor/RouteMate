"use client";

import { motion } from "framer-motion";
import type { RouteRecord } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/glass-card";

type PopularRoutesProps = {
  routes: RouteRecord[];
  onSelect: (route: RouteRecord) => void;
};

export function PopularRoutes({ routes, onSelect }: PopularRoutesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {routes.map((route, index) => (
        <motion.button
          key={route.id}
          type="button"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 }}
          whileHover={{ y: -6 }}
          onClick={() => onSelect(route)}
          className="text-left"
        >
          <GlassCard className="h-full p-5 transition duration-300 hover:border-sky-300 hover:shadow-[0_18px_36px_rgba(37,99,235,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Popular route
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-slate-950">
                  {route.from} to {route.to}
                </h3>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {route.savings}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Fare</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{route.fareRange}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Time</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{route.estimatedTime}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Vehicle</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{route.vehicleType}</p>
              </div>
            </div>
          </GlassCard>
        </motion.button>
      ))}
    </div>
  );
}

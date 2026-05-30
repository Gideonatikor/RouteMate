import { ShieldCheck, TriangleAlert, Users } from "lucide-react";
import type { RouteRecord } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/glass-card";

type SafetyTrustCardProps = {
  route: RouteRecord;
};

export function SafetyTrustCard({ route }: SafetyTrustCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Safety and trust
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Ride with more confidence</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <TriangleAlert className="h-4 w-4" />
            Safety note
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">{route.safetyNote}</p>
        </div>
        <div className="rounded-[22px] border border-sky-200 bg-sky-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
            <Users className="h-4 w-4" />
            Community signal
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>Route confidence: <span className="font-semibold text-slate-950">{route.confidence}</span></p>
            <p>Last verified: <span className="font-semibold text-slate-950">{route.lastVerified}</span></p>
            <p>{route.usersConfirmed} users confirmed this route</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

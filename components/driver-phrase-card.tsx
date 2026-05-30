import { MessageCircleMore, Sparkles } from "lucide-react";
import type { RouteRecord } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/glass-card";

type DriverPhraseCardProps = {
  route: RouteRecord;
};

export function DriverPhraseCard({ route }: DriverPhraseCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-600">
          <MessageCircleMore className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            What to tell the driver
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Use the local phrase</h3>
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-sky-200 bg-sky-50 p-5">
        <p className="text-2xl font-semibold leading-tight text-slate-950">"{route.driverPhrase}"</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This is the shortest, clearest phrase to confirm direction with the driver or mate.
        </p>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        <Sparkles className="h-3.5 w-3.5" />
        Say it before the vehicle moves
      </div>
    </GlassCard>
  );
}

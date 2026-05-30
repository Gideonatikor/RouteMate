"use client";

import { Share2 } from "lucide-react";
import type { RouteRecord } from "@/lib/mock-data";

type ShareRouteButtonProps = {
  route: RouteRecord;
};

export function ShareRouteButton({ route }: ShareRouteButtonProps) {
  async function handleShare() {
    const text = [
      `🚌 RouteMate — ${route.from} → ${route.destination}`,
      ``,
      `💰 Fare: ${route.fareRange}`,
      `🚗 Vehicle: ${route.vehicleType}`,
      `⏱️ Time: ${route.estimatedTime}`,
      `📍 Board at: ${route.boardingPoint}`,
      `🗣️ Say: "${route.driverPhrase}"`,
      `🏁 Alight at: ${route.alightingPoint}`,
      ``,
      `Steps:`,
      ...route.steps.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `💡 ${route.savings} compared to Uber/Bolt!`,
      ``,
      `— Shared via RouteMate 🧭`,
    ].join("\n");

    // Try native Web Share API first (works great on phones)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RouteMate: ${route.from} → ${route.destination}`,
          text,
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      // Show a small feedback
      const btn = document.getElementById("share-route-btn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "✓ Copied!";
        setTimeout(() => {
          btn.textContent = original;
        }, 2000);
      }
    } catch {
      // Last resort: WhatsApp deep link
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${encoded}`, "_blank");
    }
  }

  function handleWhatsApp() {
    const text = [
      `🚌 *RouteMate — ${route.from} → ${route.destination}*`,
      ``,
      `💰 Fare: ${route.fareRange}`,
      `🚗 ${route.vehicleType}`,
      `⏱️ ${route.estimatedTime}`,
      `📍 Board at: *${route.boardingPoint}*`,
      `🗣️ Say: _"${route.driverPhrase}"_`,
      `🏁 Alight: *${route.alightingPoint}*`,
      ``,
      `💡 ${route.savings} vs Uber/Bolt!`,
    ].join("\n");

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }

  return (
    <div className="flex gap-2">
      <button
        id="share-route-btn"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
      >
        <Share2 className="h-4 w-4" />
        Share Route
      </button>
      <button
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </button>
    </div>
  );
}

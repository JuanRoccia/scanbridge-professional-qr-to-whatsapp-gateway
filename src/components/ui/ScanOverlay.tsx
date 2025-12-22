import React from "react";
export function ScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Dimmed Background with Cutout */}
      <div className="absolute inset-0 border-[60px] sm:border-[100px] border-black/40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      {/* Scanner Frame */}
      <div className="relative w-[250px] h-[250px] border-2 border-white/30 rounded-3xl overflow-hidden">
        {/* Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
        {/* Laser Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan-laser" />
      </div>
    </div>
  );
}
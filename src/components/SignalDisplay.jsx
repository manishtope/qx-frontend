import React from "react";
import { CaretUp, CaretDown, Target, Timer } from "@phosphor-icons/react";

export default function SignalDisplay({ signal, loading }) {
  if (!signal && !loading) {
    return (
      <div className="border border-white/10 bg-[#0F0F0F] p-8 min-h-[220px] flex flex-col items-center justify-center text-center">
        <div className="font-mono text-[10px] text-[#525252] tracking-widest mb-2">AWAITING SETUP</div>
        <h2 className="text-2xl font-bold text-[#262626] tracking-tighter uppercase">NO ACTIVE SIGNAL</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-white/10 bg-[#0F0F0F] p-8 min-h-[220px] flex flex-col items-center justify-center text-center">
        <div className="font-mono text-[10px] text-[#525252] tracking-widest mb-4">PROCESSING DATA</div>
        <div className="w-12 h-1 bg-[#00FF66] animate-pulse" />
      </div>
    );
  }

  const isUp = signal.direction === "UP";
  const color = isUp ? "#00FF66" : "#FF0044";
  const Caret = isUp ? CaretUp : CaretDown;

  return (
    <div className="border p-6 bg-[#0F0F0F]" style={{ borderColor: `${color}40` }}>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-white font-bold">{signal.name} • {signal.timeframe.toUpperCase()}</span>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-white/10 text-[#A3A3A3] uppercase">{signal.category}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Caret size={64} weight="fill" style={{ color }} />
          <div>
            <div className="text-5xl font-black tracking-tighter" style={{ color }}>{signal.direction}</div>
            <div className="font-mono text-[10px] text-[#A3A3A3] mt-0.5">{isUp ? "CALL OPTION" : "PUT OPTION"}</div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-[#525252]">CONFIDENCE</span>
              <span style={{ color }} className="font-bold">{signal.confidence}%</span>
            </div>
            <div className="h-1.5 bg-[#1a1a1a]">
              <div className="h-full transition-all duration-500" style={{ width: `${signal.confidence}%`, background: color }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="border border-white/5 bg-[#050505] p-2">
              <div className="text-[9px] text-[#525252] flex items-center justify-center gap-1"><Target size={10}/> ENTRY</div>
              <div className="text-sm font-bold text-white mt-0.5">{signal.entry_price}</div>
            </div>
            <div className="border border-white/5 bg-[#050505] p-2">
              <div className="text-[9px] text-[#525252] flex items-center justify-center gap-1"><Timer size={10}/> EXPIRY</div>
              <div className="text-sm font-bold text-white mt-0.5">{signal.timeframe.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
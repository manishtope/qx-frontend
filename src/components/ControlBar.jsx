import React from "react";
import { Lightning } from "@phosphor-icons/react";

export default function ControlBar({ assets, symbol, setSymbol, timeframe, setTimeframe, onGenerate, loading }) {
  return (
    <div className="border border-white/10 bg-[#0F0F0F] p-4 flex flex-col md:flex-row items-stretch md:items-end gap-4">
      <div className="flex-1">
        <label className="block font-mono text-[10px] text-[#525252] tracking-widest mb-1.5">ASSET / PAIR</label>
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-[#050505] border border-white/10 text-white font-mono p-2.5 h-11 focus:outline-none focus:border-white/30"
        >
          {assets.map(a => (
            <option key={a.symbol} value={a.symbol}>{a.name} ({a.category.toUpperCase()})</option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-48">
        <label className="block font-mono text-[10px] text-[#525252] tracking-widest mb-1.5">EXPIRY TIMEFRAME</label>
        <div className="grid grid-cols-3 border border-white/10 bg-[#050505] h-11">
          {["1m", "5m", "15m"].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`font-mono text-xs font-bold transition-colors ${timeframe === tf ? "bg-white text-black" : "text-[#A3A3A3] hover:bg-white/5"}`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="h-11 px-6 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black font-bold tracking-wider text-xs border border-[#00FF66] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
      >
        <Lightning size={16} weight="fill" /> {loading ? "ANALYZING..." : "GENERATE SIGNAL"}
      </button>
    </div>
  );
}
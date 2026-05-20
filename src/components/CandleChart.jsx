import React from "react";

export default function CandleChart({ candles, direction }) {
  if (!candles || candles.length === 0) {
    return (
      <div className="border border-white/10 bg-[#0F0F0F] p-4 h-[180px] flex items-center justify-center text-center">
        <span className="font-mono text-[10px] text-[#525252] tracking-widest">CHART DATA STREAM PENDING</span>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-[#0F0F0F] p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-xs text-white uppercase">PRICE ACTION STREAM</h4>
        <span className="font-mono text-[10px] text-[#525252]">{candles.length} SECURED DATA CANDLES</span>
      </div>
      <div className="h-[140px] border border-white/5 bg-[#050505] flex items-center justify-center font-mono text-xs text-[#525252]">
        [ ACTIVE MARKET CANDLE MONITOR - TIMELINE FEED OK ]
      </div>
    </div>
  );
}
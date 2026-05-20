import React from "react";

export default function IndicatorsPanel({ indicators }) {
  if (!indicators) {
    return (
      <div className="border border-white/10 bg-[#0F0F0F] p-4 text-center font-mono text-[10px] text-[#525252] py-8">
        NO ENGINE METRICS
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (["BULLISH", "OVERSOLD", "LOWER BAND"].includes(status)) return "text-[#00FF66]";
    if (["BEARISH", "OVERBOUGHT", "UPPER BAND"].includes(status)) return "text-[#FF0044]";
    return "text-[#A3A3A3]";
  };

  return (
    <div className="border border-white/10 bg-[#0F0F0F] p-4">
      <h3 className="font-bold text-xs tracking-tight text-white uppercase mb-3">TECHNICAL INDICATORS</h3>
      <div className="space-y-2.5 font-mono text-xs">
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-[#737373]">RSI(14)</span>
          <span className={getStatusColor(indicators.rsi_status)}>{indicators.rsi} • {indicators.rsi_status}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-[#737373]">MACD HIST</span>
          <span className={getStatusColor(indicators.macd_status)}>{indicators.macd_hist} • {indicators.macd_status}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-[#737373]">EMA 9 / 21</span>
          <span className={getStatusColor(indicators.ema_status)}>{indicators.ema_status}</span>
        </div>
      </div>
    </div>
  );
}
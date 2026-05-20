import React from "react";
import { Brain } from "@phosphor-icons/react";

export default function ReasoningCard({ reasoning, direction }) {
  const color = direction === "UP" ? "#00FF66" : direction === "DOWN" ? "#FF0044" : "#A3A3A3";
  return (
    <div className="border border-white/10 bg-[#0F0F0F] p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xs text-white uppercase flex items-center gap-1.5">
          <Brain size={14} weight="duotone" style={{ color }} /> AI ANALYST NOTE
        </h3>
        <span className="font-mono text-[9px] text-[#525252]">CLAUDE 4.5</span>
      </div>
      <p className="font-mono text-xs leading-relaxed text-[#D4D4D4]">
        {reasoning || "GENERATE A SIGNAL TO INJECT LIVE AI ANALYTICAL STREAM COMMENTARY COMMENT SHEETS."}
      </p>
    </div>
  );
}
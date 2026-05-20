import React from "react";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

export default function HistoryTable({ history }) {
  return (
    <div className="border border-white/10 bg-[#0F0F0F] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-[#0A0A0A] flex justify-between items-center">
        <h3 className="font-bold text-xs text-white uppercase">SIGNAL SESSION HISTORY</h3>
        <span className="font-mono text-[10px] text-[#525252]">{history.length} ACTIVE LOGS</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs text-left">
          <thead>
            <tr className="text-[#525252] border-b border-white/5 uppercase text-[10px]">
              <th className="p-3">TIME</th>
              <th className="p-3">ASSET</th>
              <th className="p-3">TF</th>
              <th className="p-3">BIAS</th>
              <th className="p-3 text-right">CONF</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#525252] uppercase text-[10px]">NO ENTRIES REGISTERED</td>
              </tr>
            ) : (
              history.map((h, i) => (
                <tr key={i} className="border-b border-white/5 text-white hover:bg-white/[0.02]">
                  <td className="p-3 text-[#A3A3A3]">{h.created_at ? h.created_at.slice(11,19) : "—"}</td>
                  <td className="p-3 font-bold">{h.name || h.symbol}</td>
                  <td className="p-3 uppercase text-[#A3A3A3]">{h.timeframe}</td>
                  <td className="p-3 font-bold" style={{ color: h.direction === "UP" ? "#00FF66" : "#FF0044" }}>
                    {h.direction}
                  </td>
                  <td className="p-3 text-right tabular-nums">{h.confidence}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
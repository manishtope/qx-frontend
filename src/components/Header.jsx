import React, { useEffect, useState } from "react";
import { Pulse, Circle } from "@phosphor-icons/react";

export default function Header() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const utc = time.toISOString().slice(11, 19);
  const date = time.toISOString().slice(0, 10);

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border border-[#00FF66] bg-[#00FF66]/10 flex items-center justify-center">
          <Pulse size={20} weight="bold" className="text-[#00FF66]" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tighter text-white">
            QX <span className="text-[#00FF66]">SIGNAL</span>
          </h1>
          <p className="font-mono text-[10px] text-[#525252] tracking-widest mt-0.5">
            QUOTEX / OTC SIGNAL ENGINE
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 font-mono text-xs">
        <div className="text-right">
          <div className="text-[10px] text-[#525252]">UTC TIME</div>
          <div className="text-white font-bold text-sm tracking-wider">{utc}</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#00FF66]/30 bg-[#00FF66]/5 text-[#00FF66] text-[10px] font-bold">
          <Circle weight="fill" size={8} className="animate-pulse" /> LIVE
        </div>
      </div>
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Clock, Activity,
  BarChart2, ShieldAlert, Layers, RefreshCw, ChevronDown
} from 'lucide-react';

export default function SignalDashboard() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [timeframe, setTimeframe] = useState('5m');
  const [signal, setSignal] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candleTimeLeft, setCandleTimeLeft] = useState('');
  const [nextCandleTime, setNextCandleTime] = useState('');
  const [headerClock, setHeaderClock] = useState('');

  // Live cloud backend server URL running on Render
  const BACKEND_URL = "https://qx-backend.onrender.com";

  // Global Header Clock Sync
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      
      // Update running header clock (HH:MM:SS)
      setHeaderClock(now.toTimeString().split(' ')[0]);

      // Calculate time left for standard candle closures
      const secs = now.getSeconds();
      const mins = now.getMinutes();
      const remMins = 4 - (mins % 5);
      const remSecs = 60 - secs;
      
      setCandleTimeLeft(
        `${String(remMins).padStart(2, '0')}:${String(remSecs === 60 ? 0 : remSecs).padStart(2, '0')}`
      );

      // Estimate next static candle arrival block
      const nextCandle = new Date(now.getTime() + (remMins * 60 + remSecs) * 1000);
      setNextCandleTime(
        nextCandle.toTimeString().split(' ')[0].substring(0, 5)
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Available Trading Pairs from Render Safely
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/assets`)
      .then((res) => {
        if (!res.ok) throw new Error("Server response not ok");
        return res.json();
      })
      .then((data) => {
        if (data && data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
          setAssets(data.assets);
          
          // Fallback parsing logic to check first element type
          const firstAsset = data.assets[0];
          if (typeof firstAsset === 'object' && firstAsset !== null) {
            setSelectedAsset(firstAsset.symbol || '');
          } else {
            setSelectedAsset(firstAsset);
          }
        } else {
          // Fallback array list so the app NEVER crashes even if the backend is waking up
          const fallbackAssets = ["BTC/USD", "ETH/USD", "EUR/USD"];
          setAssets(fallbackAssets);
          setSelectedAsset(fallbackAssets[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching assets from cloud backend:", err);
        const fallbackAssets = ["BTC/USD", "ETH/USD", "EUR/USD"];
        setAssets(fallbackAssets);
        setSelectedAsset(fallbackAssets[0]);
      });
  }, []);

  // Generate Trading Signal Function
  const generateSignal = async () => {
    if (!selectedAsset) return;
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: selectedAsset, timeframe: timeframe })
      });
      const data = await response.json();
      setSignal(data);
      
      // Add entry to running history log panel safely parsing text properties
      setHistory(prev => [
        {
          time: new Date().toTimeString().split(' ')[0],
          asset: typeof selectedAsset === 'object' ? selectedAsset.symbol : selectedAsset,
          timeframe: timeframe,
          direction: data.direction || 'UNKNOWN',
          result: 'Pending'
        },
        ...prev
      ]);
    } catch (error) {
      console.error("Cloud signaling runtime error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30">
      {/* HEADER BAR */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              QX QUANTUM ENGINE
            </h1>
            <p className="text-xs text-emerald-400/80 font-mono tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              CLOUD ENGINE SYNCHRONIZED
            </p>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="flex items-center gap-8 font-mono text-sm">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
            <span className="text-slate-500 text-xs tracking-uppercase">Live Time</span>
            <span className="text-slate-200 font-bold tracking-wide">{headerClock || "00:00:00"}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
            <span className="text-slate-500 text-xs tracking-uppercase">Candle Close</span>
            <span className="text-amber-400 font-bold tracking-wide animate-pulse">{candleTimeLeft || "00:00"}</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTROL GRID */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ACTION SELECTORS (LEFT PANEL) */}
        <section className="lg:col-span-1 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-1 text-slate-200">Execution Controls</h2>
            <p className="text-xs text-slate-400">Configure parameters for direct signal calculation routing.</p>
          </div>

          {/* ASSET SELECTOR */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Asset Pair</label>
            <div className="relative">
              <select 
                value={selectedAsset} 
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
              >
                {assets.map((asset, index) => {
                  // Guard rails against Error #31: string vs object check
                  const assetValue = typeof asset === 'object' && asset !== null ? asset.symbol : asset;
                  const assetDisplay = typeof asset === 'object' && asset !== null ? `${asset.name} (${asset.symbol})` : asset;
                  return (
                    <option key={assetValue || index} value={assetValue}>{assetDisplay}</option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* TIMEFRAME SELECTOR */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis Expiry Period</label>
            <div className="grid grid-cols-3 gap-2">
              {['1m', '5m', '15m'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition-all ${
                    timeframe === tf 
                      ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/5' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* EXECUTE ACTION BUTTON */}
          <button
            onClick={generateSignal}
            disabled={loading || !selectedAsset}
            className="w-full mt-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm tracking-wide py-4 px-6 rounded-xl hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin stroke-[2.5]" />
                CALCULATING PROBABILITIES...
              </>
            ) : (
              <>
                <BarChart2 className="h-4 w-4 stroke-[2.5]" />
                GENERATE INSTANT SIGNAL
              </>
            )}
          </button>
        </section>

        {/* MAIN RESULTS MONITOR (CENTER/RIGHT PANEL) */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          
          {/* LOGIC INTERFACE SCREEN */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[340px] text-center shadow-xl relative overflow-hidden">
            {signal ? (
              <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
                
                {/* DYNAMIC DIRECTION BADGE */}
                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-lg tracking-wide shadow-md ${
                  signal.direction === 'CALL' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5'
                }`}>
                  {signal.direction === 'CALL' ? (
                    <TrendingUp className="h-6 w-6 stroke-[2.5] animate-bounce" />
                  ) : (
                    <TrendingDown className="h-6 w-6 stroke-[2.5] animate-bounce" />
                  )}
                  {typeof signal.asset === 'object' ? signal.asset.symbol : signal.asset} — {signal.direction} EXECUTIVE ORDER
                </div>

                {/* ALGORITHM DATA MATRIX */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-2 font-mono text-xs">
                  <div className="bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl flex flex-col gap-1 text-left">
                    <span className="text-slate-500 uppercase tracking-wider font-sans">Confidence Level</span>
                    <span className="text-slate-200 font-bold text-sm">{signal.confidence}% Accuracy Rating</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl flex flex-col gap-1 text-left">
                    <span className="text-slate-500 uppercase tracking-wider font-sans">Execution Window</span>
                    <span className="text-amber-400 font-bold text-sm">Open until {nextCandleTime || "00:00"}</span>
                  </div>
                </div>

                {/* AI EXPLANATION FIELD */}
                <div className="w-full max-w-md bg-slate-950 border border-slate-800/60 rounded-xl p-4 text-left shadow-inner">
                  <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                    <Layers className="h-3 w-3" /> Core Indicator Rationale
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{signal.reasoning}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 max-w-sm">
                <div className="h-14 w-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 shadow-inner">
                  <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-1">Telemetry Monitor Clear</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select your operational trading pair asset on the sidebar control deck and prompt calculations to evaluate live indicators.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUNNING SESSION LOGGER HISTORY PANEL */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" /> Recent Cloud Telemetry Sessions
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                {history.length} SAVED REQUESTS
              </span>
            </div>

            <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar">
              {history.length > 0 ? (
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800/40">
                      <th className="pb-2 font-sans font-semibold">Timestamp</th>
                      <th className="pb-2 font-sans font-semibold">Asset Pair</th>
                      <th className="pb-2 font-sans font-semibold">Expiry</th>
                      <th className="pb-2 font-sans font-semibold">Direction</th>
                      <th className="pb-2 font-sans font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {history.map((item, index) => (
                      <tr key={index} className="text-slate-300 hover:bg-slate-950/30 transition-colors">
                        <td className="py-2.5 text-slate-500">{item.time}</td>
                        <td className="py-2.5 font-bold text-slate-200">{item.asset}</td>
                        <td className="py-2.5 text-slate-400">{item.timeframe}</td>
                        <td className="py-2.5">
                          <span className={`font-bold ${item.direction === 'CALL' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.direction}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="text-amber-400 bg-amber-400/5 border border-amber-400/20 px-2 py-0.5 rounded text-[10px] font-sans">
                            {item.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-slate-600 text-center py-6 font-sans italic">
                  No active queries sent to the cloud cluster in this viewport session.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
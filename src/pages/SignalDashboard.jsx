import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, Activity, 
  BarChart2, ShieldAlert, Layers, RefreshCw, ChevronDown 
} from 'lucide-react';

export default function SignalDashboard() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [timeframe, setTimeframe] = useState('1m');
  const [timezone, setTimezone] = useState('IST');
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState(null);
  const [ticker, setTicker] = useState([]);

  const [candleTimeLeft, setCandleTimeLeft] = useState('');
  const [nextCandleTime, setNextCandleTime] = useState('');
  const [headerClock, setHeaderClock] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/assets')
      .then(res => res.json())
      .then(data => {
        if (data.assets && data.assets.length > 0) {
          setAssets(data.assets);
          setSelectedAsset(data.assets[0].symbol);
        }
      })
      .catch(err => console.error("Error pulling asset registry:", err));

    const fetchTicker = () => {
      fetch('http://127.0.0.1:8001/api/ticker')
        .then(res => res.json())
        .then(data => { if (data.ticker) setTicker(data.ticker); })
        .catch(err => console.error("Error pulling ticker feed:", err));
    };

    fetchTicker();
    const tickerInterval = setInterval(fetchTicker, 5000);
    return () => clearInterval(tickerInterval);
  }, []);

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      let tzOffsetMs = 0;
      if (timezone === 'IST') tzOffsetMs = 5.5 * 60 * 60 * 1000;
      if (timezone === 'EST') tzOffsetMs = -5 * 60 * 60 * 1000;
      
      const tzTime = new Date(now.getTime() + tzOffsetMs);
      setHeaderClock(`${String(tzTime.getUTCHours()).padStart(2, '0')}:${String(tzTime.getUTCMinutes()).padStart(2, '0')}:${String(tzTime.getUTCSeconds()).padStart(2, '0')}`);

      let periodSeconds = 60;
      if (timeframe === '5m') periodSeconds = 300;
      if (timeframe === '15m') periodSeconds = 900;

      const currentEpochSec = Math.floor(now.getTime() / 1000);
      const secondsPassed = currentEpochSec % periodSeconds;
      const totalSecondsRemaining = periodSeconds - secondsPassed;

      setCandleTimeLeft(`${Math.floor(totalSecondsRemaining / 60)}:${String(totalSecondsRemaining % 60).padStart(2, '0')}`);

      const nextCandleDate = new Date(((currentEpochSec + totalSecondsRemaining + periodSeconds) * 1000) + tzOffsetMs);
      setNextCandleTime(`${String(nextCandleDate.getUTCHours()).padStart(2, '0')}:${String(nextCandleDate.getUTCMinutes()).padStart(2, '0')}:${String(nextCandleDate.getUTCSeconds()).padStart(2, '0')}`);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [timeframe, timezone]);

  const handleGenerateSignal = async () => {
    if (!selectedAsset) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8001/api/signal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedAsset, timeframe, tz: timezone })
      });
      const data = await response.json();
      setSignal(data);
    } catch (err) {
      console.error("Signal API failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans antialiased grid-bg">
      <div className="w-full tape-strip py-1.5 overflow-hidden border-b border-zinc-900">
        <div className="flex whitespace-nowrap animate-marquee gap-8 text-[11px] font-mono text-zinc-400">
          {ticker.map((t, idx) => (
            <div key={idx} className="inline-flex items-center gap-1.5">
              <span>{t.name}</span>
              <span className="text-zinc-200">{t.price}</span>
              <span className={t.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0A0A0A] border border-zinc-900 rounded-xl p-4 gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Activity size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black font-mono tracking-tighter text-white">QX SIGNAL ENGINE</h1>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wider">QUOTEX / OTC TECHNICAL CALCULATOR</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 bg-zinc-950/40 p-2 rounded-lg border border-zinc-900">
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Timezone Context</label>
              <div className="relative">
                <select 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  className="appearance-none bg-[#050505] border border-zinc-800 text-zinc-300 font-mono text-xs rounded-md pl-2 pr-7 py-1 focus:outline-none focus:border-emerald-500"
                >
                  <option value="IST">IST (India Local)</option>
                  <option value="UTC">UTC (Universal)</option>
                  <option value="EST">EST (New York)</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div className="text-right border-l border-zinc-800 pl-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{timezone} Digital Time</span>
              <span className="font-mono text-lg font-bold text-white tracking-wide">{headerClock || '00:00:00'}</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A0A0A] border border-zinc-900 rounded-xl p-5 space-y-5 shadow-lg">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">Asset / Symbol Select</label>
                <div className="relative">
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full appearance-none bg-[#050505] border border-zinc-800 text-zinc-100 font-mono text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    {assets.map((a) => (
                      <option key={a.symbol} value={a.symbol}>{a.name} ({a.category.toUpperCase()})</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">Expiry Framework</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1m', '5m', '15m'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                        timeframe === tf ? 'bg-white text-black border-white font-black' : 'bg-[#050505] text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {tf.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-900 font-mono">
                <div className="p-2 border-r border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Active Candle Ends</span>
                  <span className={`text-xl font-black ${
                    candleTimeLeft.startsWith('0:') && parseInt(candleTimeLeft.split(':')[1]) <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'
                  }`}>
                    {candleTimeLeft || '0:00'}
                  </span>
                </div>
                <div className="p-2 pl-4">
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Next Expiry Target</span>
                  <span className="text-xl font-bold text-sky-400">{nextCandleTime || '00:00:00'}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateSignal}
                disabled={loading || !selectedAsset}
                className={`w-full py-3.5 rounded-lg font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Clock size={16} />}
                <span>{loading ? "Analyzing Indicators..." : "Generate Signal"}</span>
              </button>
            </div>
          </section>

          <section className="lg:col-span-7 space-y-6">
            {signal ? (
              <div className="bg-[#0A0A0A] border border-zinc-900 rounded-xl p-5 space-y-6 shadow-xl">
                <div className={`p-4 rounded-xl border flex justify-between items-center ${
                  signal.direction === 'UP' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/30 border-rose-500/30 text-rose-400'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border ${signal.direction === 'UP' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-black'}`}>
                      {signal.direction === 'UP' ? <TrendingUp size={24} strokeWidth={3} /> : <TrendingDown size={24} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono block opacity-70">{signal.name} • {signal.timeframe.toUpperCase()} Framework</span>
                      <h2 className="text-2xl font-black font-mono">{signal.direction === 'UP' ? 'CALL / UP OPTION' : 'PUT / DOWN OPTION'}</h2>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] block opacity-70">Confidence Metrics</span>
                    <span className="text-2xl font-black">{signal.confidence}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                    <span className="text-[10px] text-zinc-500 block uppercase mb-1">Target Entry Price</span>
                    <span className="text-xl font-bold text-white">{signal.entry_price}</span>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                    <span className="text-[10px] text-zinc-500 block uppercase mb-1">Signal Expiry Target</span>
                    <span className="text-xl font-bold text-zinc-200">{signal.expiry_at}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5"><Layers size={14} /> Matrix Indicator Convergences</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                      <span className="text-zinc-500 block text-[10px]">RSI (14)</span>
                      <span className="text-white block font-bold">{signal.indicators.rsi}</span>
                      <span className="text-[9px] text-zinc-400">{signal.indicators.rsi_status}</span>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                      <span className="text-zinc-500 block text-[10px]">MACD Hist</span>
                      <span className="text-white block font-bold">{signal.indicators.macd_hist}</span>
                      <span className="text-[9px] text-zinc-400">{signal.indicators.macd_status}</span>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                      <span className="text-zinc-500 block text-[10px]">EMA Cross</span>
                      <span className="text-white block font-bold">9 / 21 Period</span>
                      <span className="text-[9px] text-zinc-400">{signal.indicators.ema_status}</span>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                      <span className="text-zinc-500 block text-[10px]">Bollinger</span>
                      <span className="text-white block font-bold">20 StdDev</span>
                      <span className="text-[9px] text-zinc-400">{signal.indicators.bb_status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase flex items-center gap-1"><BarChart2 size={12} /> Execution Rationale Notes</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono">{signal.reasoning}</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] bg-[#0A0A0A] border border-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 text-zinc-500 shadow-inner font-mono">
                <ShieldAlert size={36} className="mb-3 text-zinc-600" />
                <p className="text-sm tracking-wide">AWAITING SYSTEM INITIALIZATION TRIGGER</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
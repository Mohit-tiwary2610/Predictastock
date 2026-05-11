import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import SearchBar           from "../components/SearchBar";
import StockChart          from "../components/StockChart";
import PredictionCard      from "../components/PredictionCard";
import MetricsPanel        from "../components/MetricsPanel";
import TechnicalIndicators from "../components/TechnicalIndicators";
import ForecastTable       from "../components/ForecastTable";
import ModelInfo           from "../components/ModelInfo";
import Loader              from "../components/Loader";
import useStockData        from "../hooks/useStockData";

const TABS = [
  { label:"Chart",      icon:"📈" },
  { label:"Indicators", icon:"📊" },
  { label:"Forecast",   icon:"🔮" },
  { label:"Model",      icon:"🧠" },
];

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(0);
  
  const { symbol, stockData, prediction, loading, predicting, fetchStock, runPrediction } = useStockData();

  useEffect(() => {
    const s = searchParams.get("symbol");
    if (s) fetchStock(s.toUpperCase());
  }, [searchParams, fetchStock]);

  const handleSearch = (sym) => {
    fetchStock(sym);
    setTab(0);
  };

  const handlePredict = (sym, days) => {
    runPrediction(sym, days).then(success => {
      if (success) {
        toast.success("Prediction complete! ✅");
        setTab(2);
      }
    });
  };

  const tabBtn = (i) => ({
    fontFamily:"'Space Mono',monospace", fontSize:".7rem", fontWeight:700,
    padding:"8px 12px", borderRadius:"7px", cursor:"pointer", border:"none",
    whiteSpace:"nowrap", transition:"all .2s", display:"flex", alignItems:"center", gap:"5px",
    background: tab === i ? "rgba(56,189,248,.14)" : "transparent",
    color: tab === i ? "var(--cyan)" : "var(--t3)",
    borderBottom: tab === i ? "2px solid var(--cyan)" : "2px solid transparent",
    minHeight:"40px",
  });

  return (
    <div style={{ minHeight:"100vh", paddingTop:"var(--nav-h)", position:"relative" }}>
      <div className="grid-bg" />
      <div style={{ position:"relative", zIndex:1, padding:"24px 0 60px" }}>
        <div className="content-max">

          {/* Header */}
          <div style={{ marginBottom:"24px" }}>
            <span className="section-label">Market Analysis</span>
            <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.1rem,3vw,1.6rem)", color:"var(--t1)", fontWeight:700, marginBottom:"20px" }}>
              Stock Dashboard
            </h1>
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          {/* Loading */}
          {loading && (
            <div className="glass-card" style={{ padding:"20px", marginBottom:"20px" }}>
              <Loader message="Fetching Market Data…" subMessage={`Loading ${symbol}…`} />
            </div>
          )}

          {/* Empty state */}
          {!loading && !stockData && (
            <div className="glass-card anim-fade" style={{ padding:"clamp(40px,8vw,60px) 20px", textAlign:"center" }}>
              <div style={{ fontSize:"clamp(2.5rem,8vw,4rem)", marginBottom:"16px" }}>📊</div>
              <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(.85rem,2.5vw,.95rem)", color:"var(--cyan)", marginBottom:"12px" }}>
                SELECT A STOCK TO BEGIN
              </h2>
              <p style={{ color:"var(--t2)", fontSize:".875rem", lineHeight:1.75, maxWidth:"400px", margin:"0 auto 24px" }}>
                Enter a ticker symbol above — e.g. AAPL, TSLA, NVDA — or click any quick-select chip.
              </p>
              <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }}>
                {["AAPL","GOOGL","MSFT","TSLA","NVDA"].map(s => (
                  <button key={s} onClick={() => handleSearch(s)} style={{ background:"rgba(56,189,248,.08)", border:"1px solid rgba(56,189,248,.22)", color:"var(--cyan)", fontFamily:"'Space Mono',monospace", fontSize:".72rem", fontWeight:700, padding:"7px 14px", borderRadius:"6px", cursor:"pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main dashboard */}
          {!loading && stockData && (
            <div className="dashboard-grid">

              {/* Left column */}
              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                {/* Tab strip */}
                <div className="glass-card" style={{ padding:"6px 12px" }}>
                  <div className="tab-row">
                    {TABS.map((t, i) => (
                      <button key={t.label} onClick={() => setTab(i)} style={tabBtn(i)}>
                        <span style={{ fontSize:"1rem" }}>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                {tab === 0 && <StockChart historical={stockData.historical} prediction={prediction} symbol={symbol} />}
                {tab === 1 && <TechnicalIndicators historical={stockData.historical} symbol={symbol} />}
                {tab === 2 && prediction && <ForecastTable prediction={prediction} />}
                {tab === 2 && !prediction && (
                  <div className="glass-card" style={{ padding:"clamp(32px,6vw,48px)", textAlign:"center" }}>
                    <div style={{ fontSize:"3rem", marginBottom:"14px" }}>🔮</div>
                    <p style={{ color:"var(--t2)", fontFamily:"'Space Mono',monospace", fontSize:".8rem", lineHeight:1.7 }}>
                      Run a prediction from the panel on the right to see the 30-day forecast table.
                    </p>
                  </div>
                )}
                {tab === 3 && <ModelInfo modelConfig={prediction?.model_config} />}

                {/* Training history */}
                {prediction?.training_history && tab === 0 && (
                  <TrainingHistory history={prediction.training_history} />
                )}
              </div>

              {/* Right column */}
              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                <MetricsPanel stockData={stockData} prediction={prediction} />
                {predicting ? (
                  <div className="glass-card" style={{ padding:"20px" }}>
                    <Loader message="Training LSTM…" subMessage="This takes 30–90 seconds on CPU" />
                  </div>
                ) : (
                  <PredictionCard prediction={prediction} symbol={symbol} onPredict={handlePredict} predicting={predicting} />
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrainingHistory({ history }) {
  if (!history?.length) return null;
  const max = Math.max(...history.map(h => h.loss));
  return (
    <div className="glass-card" style={{ padding:"22px" }}>
      <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".8rem", color:"var(--cyan)", marginBottom:"16px", letterSpacing:".05em" }}>
        TRAINING LOSS CURVE
      </h3>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"2px", height:"60px", overflow:"hidden" }}>
        {history.filter((_, i) => i % 2 === 0).map((h, i) => (
          <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", background:"linear-gradient(to top,rgba(56,189,248,.85),rgba(192,132,252,.5))", height: Math.max(4, (h.loss / max) * 60) + "px", minWidth:"3px", transition:"height .3s" }} title={`Epoch ${h.epoch}: ${h.loss.toFixed(6)}`} />
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"7px", fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--t3)" }}>
        <span>Epoch 1</span>
        <span style={{ color:"var(--green)" }}>↘ Converging</span>
        <span>Epoch {history.length}</span>
      </div>
    </div>
  );
}

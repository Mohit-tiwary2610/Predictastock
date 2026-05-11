import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar     from "../components/SearchBar";
import PopularStocks from "../components/PopularStocks";

const FEATURES = [
  { icon:"🧠", title:"3-Layer LSTM",       color:"var(--cyan)",
    desc:"Stacked LSTM (128→64→32 units) with Batch Normalization and Dropout for robust time-series learning." },
  { icon:"📊", title:"Technical Analysis", color:"var(--amber)",
    desc:"SMA, EMA, RSI, MACD, Bollinger Bands computed and overlaid on beautiful interactive charts." },
  { icon:"🔮", title:"30-Day Forecast",    color:"var(--purple)",
    desc:"Multi-step iterative predictions using a 60-day lookback window. Visualise the full price path." },
  { icon:"📐", title:"Model Metrics",      color:"var(--green)",
    desc:"RMSE, MAE, MAPE, and R² scores let you evaluate how well the model fits your chosen stock." },
  { icon:"💹", title:"Live Market Data",   color:"var(--cyan)",
    desc:"Real-time OHLCV data from Yahoo Finance. Automatic statistical fallback when data is unavailable." },
  { icon:"⚡", title:"Fast & Responsive",  color:"var(--amber)",
    desc:"Fully mobile-responsive with interactive Chart.js visualisations, timeframe controls, and SMA toggles." },
];

const STATS = [
  { n:"50+", l:"Project Files"  },
  { n:"3",   l:"LSTM Layers"    },
  { n:"60",  l:"Day Lookback"   },
  { n:"30",  l:"Day Forecast"   },
];

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight:"100vh", position:"relative" }}>
      <div className="grid-bg" />

      {/* ── HERO ── */}
      <section style={{ paddingTop:"clamp(90px,15vw,130px)", paddingBottom:"clamp(50px,8vw,80px)", position:"relative", zIndex:1 }}>
        <div className="content-max">
          <div style={{ textAlign:"center", maxWidth:"800px", margin:"0 auto" }}>
            <div className="anim-fade">
              <span className="section-label">AI-Powered Stock Forecasting</span>
              <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.8rem,5.5vw,3.4rem)", fontWeight:900, lineHeight:1.15, color:"var(--t1)", marginBottom:"22px", letterSpacing:".03em" }}>
                Predict Stock Prices<br/>
                <span style={{ background:"linear-gradient(135deg,#38bdf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>with Deep Learning</span>
              </h1>
              <p style={{ fontSize:"clamp(.9rem,2.5vw,1.1rem)", color:"var(--t2)", lineHeight:1.8, marginBottom:"36px", maxWidth:"580px", margin:"0 auto 36px" }}>
                Enterprise-grade LSTM neural networks analyse 2 years of market data
                to generate 30-day price forecasts — right in your browser, completely free.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="anim-slide-up delay-1" style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", marginBottom:"52px", opacity:0 }}>
              <button className="btn-primary" style={{ fontSize:"clamp(.9rem,2.5vw,1rem)", padding:"13px 32px" }} onClick={()=>nav("/dashboard")}>
                🚀 Open Dashboard
              </button>
              <button className="btn-secondary" style={{ fontSize:"clamp(.9rem,2.5vw,1rem)", padding:"13px 28px" }} onClick={()=>nav("/about")}>
                Learn How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="anim-slide-up delay-2" style={{ display:"flex", gap:"clamp(20px,5vw,48px)", justifyContent:"center", flexWrap:"wrap", marginBottom:"56px", opacity:0 }}>
              {STATS.map(s=>(
                <div key={s.l} style={{ textAlign:"center", minWidth:"64px" }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.5rem,4vw,2.2rem)", fontWeight:900, color:"var(--cyan)", textShadow:"0 0 18px rgba(56,189,248,.55)", lineHeight:1.1 }}>{s.n}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".67rem", color:"var(--t3)", letterSpacing:".1em", marginTop:"5px" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="anim-slide-up delay-3" style={{ maxWidth:"700px", margin:"0 auto", opacity:0 }}>
              <SearchBar onSearch={sym=>nav("/dashboard?symbol="+sym)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR STOCKS ── */}
      <section style={{ paddingBottom:"clamp(40px,6vw,60px)", position:"relative", zIndex:1 }}>
        <div className="content-max">
          <PopularStocks onSelect={sym=>nav("/dashboard?symbol="+sym)} />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ paddingBottom:"clamp(50px,8vw,80px)", position:"relative", zIndex:1 }}>
        <div className="content-max">
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <span className="section-label">What You Get</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.2rem,3.5vw,1.9rem)", color:"var(--t1)", fontWeight:700 }}>
              Full-Stack ML Platform
            </h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f,i)=>(
              <div key={f.title} className={"glass-card anim-slide-up delay-"+Math.min(i+1,5)} style={{ padding:"clamp(18px,4vw,28px) clamp(16px,3vw,22px)", animationDelay:i*0.07+"s", opacity:0 }}>
                <div style={{ fontSize:"2.2rem", marginBottom:"14px" }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".87rem", color:f.color, fontWeight:700, letterSpacing:".04em", marginBottom:"10px" }}>{f.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".875rem", color:"var(--t2)", lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (mini) ── */}
      <section style={{ paddingBottom:"clamp(50px,8vw,80px)", position:"relative", zIndex:1 }}>
        <div className="content-max">
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <span className="section-label">Quick Overview</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.1rem,3vw,1.7rem)", color:"var(--t1)", fontWeight:700 }}>How It Works</h2>
          </div>
          <div style={{ display:"flex", gap:"0", overflowX:"auto", paddingBottom:"8px" }}>
            {[
              { step:"1", title:"Search",  desc:"Enter any stock ticker symbol",      icon:"🔍", color:"var(--cyan)"   },
              { step:"2", title:"Load",    desc:"Real-time data from Yahoo Finance",  icon:"📡", color:"var(--purple)" },
              { step:"3", title:"Train",   desc:"LSTM model trains on 2yr history",   icon:"🧠", color:"var(--green)"  },
              { step:"4", title:"Predict", desc:"30-day forecast generated instantly", icon:"🔮", color:"var(--amber)"  },
            ].map((s,i,arr)=>(
              <React.Fragment key={s.step}>
                <div style={{ flex:"1 1 140px", minWidth:"130px", textAlign:"center", padding:"20px 12px" }}>
                  <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(56,189,248,.1)", border:"2px solid rgba(56,189,248,.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", margin:"0 auto 12px" }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:s.color, fontWeight:700, marginBottom:"5px", letterSpacing:".1em" }}>STEP {s.step}</div>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".82rem", color:"var(--t1)", fontWeight:700, marginBottom:"6px" }}>{s.title}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", color:"var(--t2)", lineHeight:1.6 }}>{s.desc}</div>
                </div>
                {i<arr.length-1 && <div style={{ flexShrink:0, display:"flex", alignItems:"center", padding:"0 4px", color:"rgba(56,189,248,.3)", fontSize:"1.4rem", marginTop:"-20px" }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBottom:"clamp(50px,8vw,80px)", position:"relative", zIndex:1 }}>
        <div className="content-max">
          <div className="gradient-border" style={{ padding:"clamp(28px,6vw,56px)", textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.1rem,3.5vw,1.7rem)", color:"var(--t1)", fontWeight:700, marginBottom:"16px" }}>
              Ready to Forecast?
            </h2>
            <p style={{ color:"var(--t2)", fontSize:"clamp(.87rem,2vw,.97rem)", marginBottom:"28px", maxWidth:"480px", margin:"0 auto 28px", lineHeight:1.7 }}>
              Pick any stock ticker, hit <strong style={{ color:"var(--cyan)" }}>Analyze</strong>, and watch the
              LSTM model train on 2 years of data in real-time.
            </p>
            <button className="btn-primary" style={{ fontSize:"clamp(.9rem,2vw,1rem)", padding:"13px 36px" }} onClick={()=>nav("/dashboard")}>
              🔮 Start Predicting
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

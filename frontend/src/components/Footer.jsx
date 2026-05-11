import React from "react";
import { Link } from "react-router-dom";

const TICKERS = [
  {s:"AAPL",p:"$189.25",c:"+1.24%",u:true},{s:"GOOGL",p:"$175.40",c:"+0.87%",u:true},
  {s:"MSFT",p:"$415.20",c:"+1.05%",u:true},{s:"NVDA",p:"$875.60",c:"+2.34%",u:true},
  {s:"TSLA",p:"$242.10",c:"-0.56%",u:false},{s:"AMZN",p:"$198.50",c:"+0.92%",u:true},
  {s:"META",p:"$525.30",c:"+1.67%",u:true},{s:"NFLX",p:"$681.40",c:"+0.44%",u:true},
  {s:"JPM", p:"$204.80",c:"+0.33%",u:true},{s:"V",   p:"$279.50",c:"+0.71%",u:true},
  {s:"AMD", p:"$168.90",c:"+1.89%",u:true},{s:"INTC",p:"$43.20", c:"-0.34%",u:false},
  {s:"TSMC",p:"$149.20",c:"+1.12%",u:true},{s:"BRK.B",p:"$382.10",c:"+0.25%",u:true},
];

const TickerItem = ({s,p,c,u}) => (
  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".71rem", padding:"0 20px", borderRight:"1px solid var(--border)", display:"inline-flex", alignItems:"center", gap:"8px", flexShrink:0, whiteSpace:"nowrap" }}>
    <span style={{ color:"var(--t1)", fontWeight:700 }}>{s}</span>
    <span style={{ color:"var(--t2)" }}>{p}</span>
    <span style={{ color:u?"var(--green)":"var(--red)", fontWeight:700 }}>{c}</span>
  </span>
);

export default function Footer() {
  const yr = new Date().getFullYear();
  return (
    <footer className="site-footer">
      {/* Live ticker scrollbar */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          {[...TICKERS,...TICKERS,...TICKERS].map((t,i)=><TickerItem key={i} {...t} />)}
        </div>
      </div>

      <div className="content-max">
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"18px" }}>
              <div style={{ width:"40px", height:"40px", background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", borderRadius:"9px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>📈</div>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"1.1rem", fontWeight:700, color:"var(--cyan)", textShadow:"0 0 12px rgba(56,189,248,.4)" }}>Predictastock</span>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", color:"var(--t2)", lineHeight:1.8, maxWidth:"300px", marginBottom:"18px" }}>
              AI-powered stock price forecasting using deep learning LSTM neural networks.
              Analyse real-time market data and explore 30-day price predictions — free and open source.
            </p>

            {/* Tags */}
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" }}>
              {["Deep Learning","Real-Time Data","Open Source","Free"].map(tag=>(
                <span key={tag} style={{ background:"rgba(56,189,248,.08)", border:"1px solid rgba(56,189,248,.2)", color:"var(--cyan)", borderRadius:"20px", padding:"3px 10px", fontSize:".65rem", fontFamily:"'Space Mono',monospace" }}>{tag}</span>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"18px" }}>
              {[
                {icon:"🐙",label:"GitHub",  href:"https://github.com/Mohit-tiwary2610"},
                {icon:"💼",label:"LinkedIn",href:"https://www.linkedin.com/in/tiwary-mohit"},
                {icon:"📧",label:"Email",   href:"mailto:mtiwary982@gmail.com"},
              ].map(s=>(
                <a key={s.label} href={s.href} title={s.label} className="social-btn" target="_blank" rel="noreferrer">{s.icon}</a>
              ))}
            </div>

            <div className="footer-disclaimer">
              <strong style={{ color:"var(--amber)", display:"block", marginBottom:"6px" }}>⚠ Investment Disclaimer</strong>
              Predictastock is for educational purposes only. Nothing on this site
              constitutes financial advice, investment recommendations, or a solicitation
              to buy/sell securities. Past model performance does not guarantee future
              results. Always consult a qualified financial advisor before investing.
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="footer-heading">Navigate</div>
            <Link to="/"          className="footer-link">🏠&nbsp; Home</Link>
            <Link to="/dashboard" className="footer-link">📊&nbsp; Dashboard</Link>
            <Link to="/about"     className="footer-link">ℹ️&nbsp; About</Link>
            <Link to="/about#faq" className="footer-link">❓&nbsp; FAQ</Link>

            <div className="footer-heading" style={{ marginTop:"24px" }}>Resources</div>
            <a href="https://github.com/Mohit-tiwary2610" target="_blank" rel="noreferrer" className="footer-link">📂&nbsp; GitHub Repository</a>
            <a href="https://docs.Predictastock.ai"        target="_blank" rel="noreferrer" className="footer-link">📖&nbsp; API Documentation</a>
            <a href="https://hub.docker.com"            target="_blank" rel="noreferrer" className="footer-link">🐳&nbsp; Docker Image</a>
            <a href="https://pypi.org"                  target="_blank" rel="noreferrer" className="footer-link">🐍&nbsp; PyPI Package</a>
          </div>

          {/* Features */}
          <div>
            <div className="footer-heading">Features</div>
            {[
              "🧠 3-Layer Stacked LSTM",
              "📈 5 Technical Indicators",
              "🔮 30-Day Price Forecast",
              "📐 RMSE / MAE / R² Metrics",
              "💹 Live Yahoo Finance Data",
              "⚡ Interactive Charts",
              "🔄 Statistical Fallback Mode",
              "🐳 Docker Compose Ready",
              "🧪 Unit Test Coverage",
              "🔒 In-Memory TTL Cache",
            ].map(f=>(
              <span key={f} className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>{f}</span>
            ))}
          </div>

          {/* Tech + Market info */}
          <div>
            <div className="footer-heading">Tech Stack</div>
            {[
              {n:"TensorFlow / Keras", i:"⚡"},
              {n:"Flask REST API",     i:"🔗"},
              {n:"React 18",           i:"⚛"},
              {n:"Chart.js 4",         i:"📉"},
              {n:"Yahoo Finance API",  i:"📡"},
              {n:"scikit-learn",       i:"🔧"},
              {n:"Tailwind CSS",       i:"🎨"},
              {n:"Docker Compose",     i:"🐳"},
            ].map(t=>(
              <span key={t.n} className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>{t.i}&nbsp; {t.n}</span>
            ))}

            <div className="footer-heading" style={{ marginTop:"24px" }}>Market Hours (ET)</div>
            <span className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>🗓&nbsp; NYSE / NASDAQ</span>
            <span className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>⏰&nbsp; 09:30 – 16:00 Mon–Fri</span>
            <span className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>📦&nbsp; ~15-min data delay</span>
            <span className="footer-link" style={{ cursor:"default", fontSize:".82rem" }}>🌍&nbsp; Global exchanges supported</span>

            {/* Version badge */}
            <div style={{ marginTop:"20px", display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.22)", borderRadius:"8px", padding:"8px 12px" }}>
              <span className="pulse-dot" style={{ width:"6px", height:"6px" }} />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--green)", fontWeight:700 }}>v1.0.0 — Stable</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".68rem", color:"var(--t4)" }}>
            © {yr} Predictastock — MIT License &nbsp;·&nbsp; Built with ❤️ in India
          </div>
          <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center" }}>
            {["Privacy Policy","Terms of Use","Disclaimer","Contact"].map(l=>(
              <span key={l} style={{ fontFamily:"'Space Mono',monospace", fontSize:".66rem", color:"var(--t4)", cursor:"pointer", transition:"color .2s" }}
                    onMouseEnter={e=>e.target.style.color="var(--cyan)"}
                    onMouseLeave={e=>e.target.style.color="var(--t4)"}>
                {l}
              </span>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
            <span className="pulse-dot" style={{ width:"6px", height:"6px" }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".64rem", color:"var(--green)" }}>Markets Open</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

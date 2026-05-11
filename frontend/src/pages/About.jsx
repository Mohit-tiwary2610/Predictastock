import React, { useState } from "react";

/* ── Team data — 1 Leader + 4 Members from SMIT ── */



const ARCH_LAYERS = [
  { name: "Input",     detail: "(batch, 60, 1)", color: "var(--cyan)",   w: "100%" },
  { name: "LSTM 1",    detail: "128 units",      color: "var(--cyan)",   w: "90%"  },
  { name: "Dropout",   detail: "20%",            color: "var(--t4)",     w: "88%"  },
  { name: "BatchNorm", detail: "Normalise",      color: "var(--t4)",     w: "88%"  },
  { name: "LSTM 2",    detail: "64 units",       color: "var(--purple)", w: "72%"  },
  { name: "Dropout",   detail: "20%",            color: "var(--t4)",     w: "70%"  },
  { name: "BatchNorm", detail: "Normalise",      color: "var(--t4)",     w: "70%"  },
  { name: "LSTM 3",    detail: "32 units",       color: "var(--green)",  w: "52%"  },
  { name: "Dropout",   detail: "20%",            color: "var(--t4)",     w: "50%"  },
  { name: "Dense",     detail: "16 · ReLU",      color: "var(--amber)",  w: "32%"  },
  { name: "Output",    detail: "1 · Linear",     color: "var(--red)",    w: "18%"  },
];

const PIPELINE = [
  { n: "01", icon: "📡", title: "Data Acquisition",
    desc: "Fetches up to 2 years of daily OHLCV data from Yahoo Finance via yfinance. Automatic retry on network errors with in-memory TTL caching." },
  { n: "02", icon: "📊", title: "Technical Indicators",
    desc: "Computes SMA(20), SMA(50), EMA(20), RSI(14), MACD(12,26,9), and Bollinger Bands overlaid on the raw price series." },
  { n: "03", icon: "🔧", title: "Preprocessing",
    desc: "MinMaxScaler normalises Close prices to [0,1]. A 60-day sliding window builds the (batch, 60, 1) input sequences for the LSTM." },
  { n: "04", icon: "🧠", title: "Model Training",
    desc: "3-layer LSTM trains with Huber loss, Adam optimiser, EarlyStopping (patience=8), and ReduceLROnPlateau for adaptive learning rate." },
  { n: "05", icon: "🔮", title: "Multi-Step Forecast",
    desc: "Iterative inference: each predicted price feeds back as the next input window, rolling 30 steps forward to generate the forecast horizon." },
  { n: "06", icon: "📐", title: "Evaluation",
    desc: "RMSE, MAE, MAPE and R² computed on the held-out test set (20%), giving transparent, objective model performance statistics." },
];

const HYPERPARAMS = [
  ["Lookback window","60 days"],["Forecast horizon","30 days"],
  ["LSTM units","128→64→32"],["Dropout rate","20%"],
  ["Batch size","32"],["Max epochs","50"],
  ["Optimiser","Adam"],["Learning rate","0.001"],
  ["Loss function","Huber"],["Val split","10%"],
  ["Train/test split","80 / 20"],["Early stop patience","8"],
];

const STACK = [
  {n:"Python 3.11",i:"🐍",c:"#fcd34d"},{n:"TensorFlow 2.15",i:"⚡",c:"#fb7185"},
  {n:"Keras",i:"🔴",c:"#fb7185"},{n:"Flask 3.0",i:"🔗",c:"#4ade80"},
  {n:"React 18",i:"⚛",c:"#38bdf8"},{n:"Chart.js 4",i:"📉",c:"#c084fc"},
  {n:"Tailwind CSS",i:"🎨",c:"#38bdf8"},{n:"yfinance",i:"📡",c:"#fcd34d"},
  {n:"scikit-learn",i:"🔧",c:"#4ade80"},{n:"Pandas / NumPy",i:"🔢",c:"#c084fc"},
  {n:"Docker Compose",i:"🐳",c:"#38bdf8"},{n:"Gunicorn",i:"🦄",c:"#4ade80"},
];

const FAQS = [
  { q:"Is this real financial advice?",
    a:"No. PredictaStock is strictly for educational and research purposes. LSTM models identify patterns in historical data but cannot predict the future with certainty. Always consult a licensed financial advisor before making any investment decisions." },
  { q:"How accurate is the LSTM model?",
    a:"Accuracy varies by stock. The model typically achieves R² of 0.85–0.95 on test data — impressive but not a guarantee of future accuracy. Financial markets are non-stationary and influenced by news events the model cannot see." },
  { q:"Why does prediction take 30–90 seconds?",
    a:"The model trains from scratch on each request using up to 2 years of daily data (~500 rows). Training involves forward/backward passes through a 3-layer LSTM for up to 50 epochs on CPU. A pre-trained model cache is planned for v2." },
  { q:"What data source is used?",
    a:"All market data comes from Yahoo Finance via the yfinance Python library. Data is cached in-memory: 5 minutes for stock data, 30 minutes for predictions." },
  { q:"Can I run this locally?",
    a:"Yes! Clone the GitHub repo, install Python 3.10+ and Node 18+, then run pip install -r requirements.txt in /backend and npm install && npm start in /frontend. Docker Compose is also available: docker-compose up --build." },
  { q:"What does fallback mode do?",
    a:"If TensorFlow is not installed, the backend automatically switches to statistical simulation using geometric Brownian motion. This lets you explore the UI without ML dependencies." },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div style={{ minHeight:"100vh", paddingTop:"var(--nav-h)", position:"relative" }}>
      <div className="grid-bg" />
      <div style={{ position:"relative", zIndex:1, padding:"36px 0 80px" }}>
        <div className="content-max">

          {/* Hero */}
          <div className="anim-fade" style={{ textAlign:"center", marginBottom:"60px" }}>
            <span className="section-label">Documentation & Team</span>
            <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.5rem,4.5vw,2.4rem)", color:"var(--t1)", fontWeight:900, marginBottom:"18px", letterSpacing:".03em" }}>
              About PredictaStock
            </h1>
            <p style={{ color:"var(--t2)", fontSize:"clamp(.9rem,2.2vw,1.05rem)", lineHeight:1.8, maxWidth:"640px", margin:"0 auto" }}>
              PredictaStock combines a stacked LSTM deep-learning model with real-time Yahoo Finance data
              to generate transparent 30-day stock price forecasts. Built by B.Tech CSE students as an educational project.
            </p>
          </div>

          {/* Pipeline */}
          <section style={{ marginBottom:"72px" }}>
            <span className="section-label">How It Works</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.15rem,2.6vw,1.55rem)", color:"var(--t1)", fontWeight:700, marginBottom:"30px" }}>Prediction Pipeline</h2>
            <div className="pipe-grid">
              {PIPELINE.map((p,i)=>(
                <div key={p.n} className={"glass-card anim-slide-up delay-"+Math.min(i+1,5)}
                     style={{ padding:"22px", display:"flex", gap:"16px", opacity:0 }}>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:"rgba(56,189,248,.1)", border:"1px solid rgba(56,189,248,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>{p.icon}</div>
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"7px", flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".65rem", color:"var(--cyan)", fontWeight:700 }}>{p.n}</span>
                      <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".82rem", color:"var(--t1)", fontWeight:700 }}>{p.title}</h3>
                    </div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".875rem", color:"var(--t2)", lineHeight:1.75 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section style={{ marginBottom:"72px" }}>
            <span className="section-label">Architecture</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.15rem,2.6vw,1.55rem)", color:"var(--t1)", fontWeight:700, marginBottom:"30px" }}>LSTM Model Design</h2>
            <div className="arch-grid">
              <div className="glass-card" style={{ padding:"28px" }}>
                <h3 style={{ fontFamily:"'Space Mono',monospace", fontSize:".68rem", color:"var(--t3)", letterSpacing:".12em", marginBottom:"20px", textTransform:"uppercase" }}>Layer Diagram</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                  {ARCH_LAYERS.map((l,i)=>(
                    <div key={i} style={{ width:l.w, height:"30px", background:l.color==="var(--t4)"?"rgba(22,45,74,0.5)":"rgba(56,189,248,0.08)", border:"1px solid "+(l.color==="var(--t4)"?"rgba(22,45,74,0.8)":"rgba(56,189,248,0.25)"), borderRadius:"5px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px" }}>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".63rem", fontWeight:700, color:l.color==="var(--t4)"?"var(--t4)":l.color }}>{l.name}</span>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".6rem", color:l.color==="var(--t4)"?"var(--t5)":"var(--t3)" }}>{l.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card" style={{ padding:"28px" }}>
                <h3 style={{ fontFamily:"'Space Mono',monospace", fontSize:".68rem", color:"var(--t3)", letterSpacing:".12em", marginBottom:"20px", textTransform:"uppercase" }}>Hyperparameters</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {HYPERPARAMS.map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"rgba(6,20,34,0.55)", border:"1px solid rgba(22,45,74,.7)", borderRadius:"7px" }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", color:"var(--t2)" }}>{k}</span>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".78rem", color:"var(--cyan)", fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          

          {/* FAQ */}
          <section style={{ marginBottom:"72px" }}>
            <span className="section-label">Common Questions</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1.15rem,2.6vw,1.55rem)", color:"var(--t1)", fontWeight:700, marginBottom:"26px" }}>FAQ</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {FAQS.map((f,i)=><FaqItem key={i} {...f} open={openFaq===i} onToggle={()=>setOpenFaq(openFaq===i?null:i)} />)}
            </div>
          </section>

          {/* Tech stack */}
          <section>
            <span className="section-label">Built With</span>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(1rem,2.5vw,1.4rem)", color:"var(--t1)", fontWeight:700, marginBottom:"24px" }}>Technology Stack</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
              {STACK.map(s=>(
                <span key={s.n} style={{ background:"rgba(10,28,48,0.8)", border:"1px solid rgba(56,189,248,0.2)", color:s.c, fontFamily:"'Space Mono',monospace", fontSize:".72rem", fontWeight:700, padding:"7px 14px", borderRadius:"8px", display:"inline-flex", alignItems:"center", gap:"7px" }}>
                  <span>{s.i}</span> {s.n}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

/* ══════════ LEADER CARD (Larger, Special) ══════════ */
function LeaderCard({ member: m }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="glass-card" style={{ padding:"40px 36px", textAlign:"center", position:"relative", overflow:"hidden", border:"2px solid rgba(56,189,248,0.35)", background:"linear-gradient(135deg, rgba(56,189,248,0.09), rgba(192,132,252,0.09))" }}>
      {/* Crown icon */}
      <div style={{ position:"absolute", top:"20px", right:"20px", fontSize:"2.2rem", filter:"drop-shadow(0 0 10px rgba(56,189,248,0.5))" }}>👑</div>
      
      {/* Top accent */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background:"linear-gradient(90deg, var(--cyan), var(--purple), var(--green))" }} />
      
      {/* Leader Badge */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg, rgba(56,189,248,0.2), rgba(192,132,252,0.2))", border:"1px solid rgba(56,189,248,0.4)", borderRadius:"20px", padding:"5px 14px", marginBottom:"20px", fontSize:".7rem", fontFamily:"'Space Mono',monospace", color:"var(--cyan)", fontWeight:700, letterSpacing:".06em" }}>
        ⭐ TEAM LEADER
      </div>
      
      {/* Avatar - Empty circle for your image */}
      <div style={{ width:"140px", height:"140px", borderRadius:"50%", border:"4px solid rgba(56,189,248,0.4)", margin:"0 auto 24px", overflow:"hidden", background:"linear-gradient(135deg, rgba(56,189,248,0.15), rgba(192,132,252,0.15))", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 30px rgba(56,189,248,0.3)", position:"relative" }}>
        {!imgError ? (
          <img 
            src={m.image} 
            alt={m.name} 
            onError={() => setImgError(true)} 
            style={{ width:"100%", height:"100%", objectFit:"cover" }} 
          />
        ) : (
          <div style={{ fontSize:"4.5rem", opacity:0.3 }}>{m.fallback}</div>
        )}
      </div>
      
      {/* Name & role */}
      <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"1.25rem", color:"var(--t1)", fontWeight:800, marginBottom:"8px", letterSpacing:".02em" }}>
        {m.name}
      </h3>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".88rem", color:m.accentColor, fontWeight:700, marginBottom:"16px", letterSpacing:".04em" }}>
        {m.role}
      </div>
      
      {/* College info */}
      <div style={{ background:"rgba(10,28,48,0.6)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem", color:"var(--t3)", marginBottom:"4px" }}>🎓 {m.college}</div>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".7rem", color:"var(--cyan)", fontWeight:600 }}>{m.degree} • {m.year}</div>
      </div>
      
      {/* Bio */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".94rem", color:"var(--t2)", lineHeight:1.8, marginBottom:"24px", textAlign:"center" }}>
        {m.bio}
      </p>
      
      {/* Expertise */}
      <div style={{ marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".65rem", color:"var(--t3)", letterSpacing:".08em", marginBottom:"12px", textTransform:"uppercase" }}>💡 Expertise</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", justifyContent:"center" }}>
          {m.expertise.map(e=>(
            <span key={e} style={{ background:"linear-gradient(135deg, rgba(56,189,248,0.12), rgba(192,132,252,0.12))", border:"1px solid rgba(56,189,248,0.3)", color:"var(--cyan)", borderRadius:"20px", padding:"5px 13px", fontSize:".7rem", fontFamily:"'Space Mono',monospace", fontWeight:600 }}>{e}</span>
          ))}
        </div>
      </div>
      
      {/* Skills */}
      <div style={{ marginBottom:"24px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".65rem", color:"var(--t3)", letterSpacing:".08em", marginBottom:"10px", textTransform:"uppercase" }}>🛠 Technical Skills</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", justifyContent:"center" }}>
          {m.skills.map(s=>(
            <span key={s} style={{ background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.22)", color:"var(--cyan)", borderRadius:"16px", padding:"3px 10px", fontSize:".66rem", fontFamily:"'Space Mono',monospace", fontWeight:600 }}>{s}</span>
          ))}
        </div>
      </div>
      
      {/* Divider */}
      <div style={{ height:"1px", background:"linear-gradient(90deg, transparent, var(--cyan), transparent)", margin:"0 0 20px" }} />
      
      {/* Contact - Real SVG Icons */}
      <div style={{ display:"flex", gap:"10px", justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
        <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer" 
           style={{ width:"38px", height:"38px", borderRadius:"8px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="GitHub"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
        
        <a href={`https://linkedin.com/in/${m.linkedin}`} target="_blank" rel="noreferrer"
           style={{ width:"38px", height:"38px", borderRadius:"8px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="LinkedIn"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        
        <a href={`https://twitter.com/${m.twitter}`} target="_blank" rel="noreferrer"
           style={{ width:"38px", height:"38px", borderRadius:"8px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="Twitter / X"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        <a href={`mailto:${m.email}`}
           style={{ width:"38px", height:"38px", borderRadius:"8px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="Email"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ══════════ TEAM CARD (Regular Members) ══════════ */
function TeamCard({ member:m, delay }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className={"team-card anim-slide-up delay-"+Math.min(delay+1,5)} style={{ opacity:0, padding:"30px 24px" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:"linear-gradient(90deg,"+m.accentColor+",transparent)", opacity:0.7 }} />
      
      {/* Avatar - Empty circle for your image */}
      <div style={{ width:"110px", height:"110px", borderRadius:"50%", border:"3px solid rgba(56,189,248,0.3)", margin:"0 auto 18px", overflow:"hidden", background:"linear-gradient(135deg, rgba(56,189,248,0.1), rgba(192,132,252,0.1))", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        {!imgError ? (
          <img 
            src={m.image} 
            alt={m.name} 
            onError={() => setImgError(true)} 
            style={{ width:"100%", height:"100%", objectFit:"cover" }} 
          />
        ) : (
          <div style={{ fontSize:"3.5rem", opacity:0.3 }}>{m.fallback}</div>
        )}
      </div>
      
      {/* Name & role */}
      <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".96rem", color:"var(--t1)", fontWeight:700, marginBottom:"6px" }}>{m.name}</h3>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".75rem", color:m.accentColor, fontWeight:700, marginBottom:"14px", letterSpacing:".04em" }}>{m.role}</div>
      
      {/* College info - compact */}
      <div style={{ background:"rgba(10,28,48,0.5)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"8px", padding:"8px 12px", marginBottom:"16px", fontSize:".68rem", fontFamily:"'Space Mono',monospace", color:"var(--t3)", lineHeight:1.6 }}>
        <div>🎓 SMIT</div>
        <div style={{ color:"var(--cyan)" }}>{m.degree.split(' in ')[0]} • {m.year}</div>
      </div>
      
      {/* Bio */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".87rem", color:"var(--t2)", lineHeight:1.75, marginBottom:"16px", textAlign:"left" }}>{m.bio}</p>
      
      {/* Expertise */}
      <div style={{ marginBottom:"14px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--t3)", letterSpacing:".06em", marginBottom:"8px", textTransform:"uppercase" }}>💡 Expertise</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
          {m.expertise.map(e=>(
            <div key={e} style={{ background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"6px", padding:"5px 10px", fontSize:".68rem", fontFamily:"'Space Mono',monospace", color:"var(--t2)" }}>• {e}</div>
          ))}
        </div>
      </div>
      
      {/* Skills */}
      <div style={{ marginBottom:"18px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--t3)", letterSpacing:".06em", marginBottom:"8px", textTransform:"uppercase" }}>🛠 Skills</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
          {m.skills.map(s=>(
            <span key={s} style={{ background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.18)", color:"var(--cyan)", borderRadius:"14px", padding:"3px 9px", fontSize:".64rem", fontFamily:"'Space Mono',monospace" }}>{s}</span>
          ))}
        </div>
      </div>
      
      {/* Divider */}
      <div style={{ height:"1px", background:"var(--border)", margin:"0 0 16px" }} />
      
      {/* Contact - Real SVG Icons */}
      <div style={{ display:"flex", gap:"8px", justifyContent:"center" }}>
        <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer"
           style={{ width:"34px", height:"34px", borderRadius:"7px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="GitHub"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
        
        <a href={`https://linkedin.com/in/${m.linkedin}`} target="_blank" rel="noreferrer"
           style={{ width:"34px", height:"34px", borderRadius:"7px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="LinkedIn"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        
        <a href={`https://twitter.com/${m.twitter}`} target="_blank" rel="noreferrer"
           style={{ width:"34px", height:"34px", borderRadius:"7px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="Twitter / X"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#38bdf8">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        <a href={`mailto:${m.email}`}
           style={{ width:"34px", height:"34px", borderRadius:"7px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", textDecoration:"none" }}
           title="Email"
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="glass-card" style={{ overflow:"hidden" }}>
      <button onClick={onToggle} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", gap:"12px", minHeight:"52px" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".92rem", color:"var(--t1)", fontWeight:600, lineHeight:1.4 }}>{q}</span>
        <span style={{ color:"var(--cyan)", fontSize:"1.1rem", transform:open?"rotate(180deg)":"rotate(0)", transition:"transform .25s", flexShrink:0 }}>▾</span>
      </button>
      {open && (
        <div style={{ padding:"0 20px 18px", fontFamily:"'DM Sans',sans-serif", fontSize:".875rem", color:"var(--t2)", lineHeight:1.8, borderTop:"1px solid var(--border)" }}>
          <div style={{ paddingTop:"14px" }}>{a}</div>
        </div>
      )}
    </div>
  );
}
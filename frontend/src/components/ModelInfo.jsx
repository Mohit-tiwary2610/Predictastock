import React from "react";

const LAYERS = [
  { name:"INPUT",    detail:"60 × 1",    color:"#38bdf8", w:"100%" },
  { name:"LSTM 1",   detail:"128 units", color:"#38bdf8", w:"90%"  },
  { name:"DROPOUT",  detail:"20%",       color:"#2a4a70", w:"88%"  },
  { name:"BATCH N",  detail:"Norm",      color:"#2a4a70", w:"88%"  },
  { name:"LSTM 2",   detail:"64 units",  color:"#c084fc", w:"70%"  },
  { name:"DROPOUT",  detail:"20%",       color:"#2a4a70", w:"68%"  },
  { name:"BATCH N",  detail:"Norm",      color:"#2a4a70", w:"68%"  },
  { name:"LSTM 3",   detail:"32 units",  color:"#34d399", w:"50%"  },
  { name:"DROPOUT",  detail:"20%",       color:"#2a4a70", w:"48%"  },
  { name:"DENSE",    detail:"16·ReLU",   color:"#fbbf24", w:"30%"  },
  { name:"OUTPUT",   detail:"1·Linear",  color:"#f87171", w:"16%"  },
];

export default function ModelInfo({ modelConfig }) {
  return (
    <div className="glass-card" style={{ padding:"22px" }}>
      <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".82rem",
                   color:"var(--cyan)", letterSpacing:".04em", marginBottom:"18px" }}>
        MODEL ARCHITECTURE
      </h3>

      <div style={{ display:"flex", flexDirection:"column", gap:"5px", marginBottom:"22px" }}>
        {LAYERS.map((l, i) => (
          <div key={i} style={{
            width:l.w, height:"26px",
            background: l.color==="#2a4a70" ? "rgba(42,74,112,.22)" : `${l.color}1a`,
            border:`1px solid ${l.color}55`,
            borderRadius:"4px",
            display:"flex", alignItems:"center",
            justifyContent:"space-between", padding:"0 10px",
          }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".58rem", fontWeight:700,
                           color: l.color==="#2a4a70" ? "#3d6a8a" : l.color }}>
              {l.name}
            </span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".56rem",
                           color: l.color==="#2a4a70" ? "#2a4a70" : `${l.color}bb` }}>
              {l.detail}
            </span>
          </div>
        ))}
      </div>

      {modelConfig && (
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:"16px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem",
                        color:"var(--t3)", letterSpacing:".1em", marginBottom:"12px" }}>
            TRAINING CONFIG
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
            {[
              ["Seq Length",  `${modelConfig.sequence_length} days`],
              ["Forecast",    `${modelConfig.prediction_days} days`],
              ["LSTM Units",  modelConfig.lstm_units?.join("→")],
              ["Dropout",     `${modelConfig.dropout*100}%`],
              ["Max Epochs",  modelConfig.epochs],
              ["TensorFlow",  modelConfig.using_tensorflow ? "✓ Active" : "⚠ Sim"],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between",
                                     fontFamily:"'Space Mono',monospace", fontSize:".63rem",
                                     padding:"5px 8px", background:"var(--bg-card)",
                                     borderRadius:"5px" }}>
                <span style={{ color:"var(--t3)" }}>{k}</span>
                <span style={{ color:"var(--cyan)", fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

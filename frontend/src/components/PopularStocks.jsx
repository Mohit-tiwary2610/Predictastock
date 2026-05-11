import React, { useEffect, useState } from "react";
import { getPopularStocks } from "../utils/api";

export default function PopularStocks({ onSelect }) {
  const [stocks,  setStocks]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularStocks()
      .then(d => setStocks(d.stocks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card" style={{ padding:"20px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    marginBottom:"16px", gap:"10px", flexWrap:"wrap" }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".66rem",
                       fontWeight:700, color:"var(--t3)", letterSpacing:".12em" }}>
          POPULAR STOCKS
        </span>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--t4)" }}>
          Click to analyse →
        </span>
      </div>

      <div className="popular-grid">
        {loading
          ? Array(8).fill(0).map((_,i) => (
              <div key={i} style={{ height:"64px", background:"var(--bg-elevated)",
                                    borderRadius:"10px", opacity:.5 }} />
            ))
          : stocks.map(s => {
              const up = (s.price_change_pct || 0) >= 0;
              return (
                <button key={s.symbol} onClick={() => onSelect?.(s.symbol)} style={{
                  background:"var(--bg-card)", borderRadius:"10px", padding:"10px 11px",
                  border:`1px solid ${up ? "rgba(52,211,153,.22)" : "rgba(248,113,113,.22)"}`,
                  cursor:"pointer", textAlign:"left", transition:"all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--glow-cyan)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".72rem",
                                fontWeight:700, color:"var(--t1)", marginBottom:"4px" }}>
                    {s.symbol}
                  </div>
                  {s.current_price ? (
                    <>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".78rem",
                                    color:"var(--t1)", fontWeight:700 }}>
                        ${s.current_price?.toFixed(2)}
                      </div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".63rem",
                                    color: up ? "var(--green)" : "var(--red)", marginTop:"2px" }}>
                        {up ? "▲" : "▼"} {Math.abs(s.price_change_pct||0).toFixed(2)}%
                      </div>
                    </>
                  ) : (
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".7rem",
                                  color:"var(--t4)" }}>—</div>
                  )}
                </button>
              );
          })
        }
      </div>
    </div>
  );
}

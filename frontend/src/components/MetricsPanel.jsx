import React from "react";

const fmtCap = v => {
  if (!v) return "N/A";
  if (v >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `$${(v/1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `$${(v/1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};
const fmtVol = v => {
  if (!v) return "N/A";
  if (v >= 1e9) return `${(v/1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v/1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(1)}K`;
  return `${v}`;
};

export default function MetricsPanel({ stockData }) {
  if (!stockData) return null;
  const { info={}, current_price, price_change, price_change_pct, data_points } = stockData;
  const up = price_change >= 0;

  const fundamentals = [
    { label:"MARKET CAP", value:fmtCap(info.market_cap) },
    { label:"P/E RATIO",  value:info.pe_ratio ? info.pe_ratio.toFixed(2) : "N/A" },
    { label:"52W HIGH",   value:info.fifty_two_week_high ? `$${info.fifty_two_week_high.toFixed(2)}` : "N/A" },
    { label:"52W LOW",    value:info.fifty_two_week_low  ? `$${info.fifty_two_week_low.toFixed(2)}`  : "N/A" },
    { label:"AVG VOLUME", value:fmtVol(info.avg_volume) },
    { label:"DATA PTS",   value:data_points?.toLocaleString() || "N/A" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
      {/* Price card */}
      <div className="gradient-border" style={{ padding:"22px" }}>
        <div style={{ marginBottom:"14px" }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"1.35rem",
                         fontWeight:900, color:"var(--t1)", letterSpacing:".05em" }}>
            {stockData.symbol}
          </span>
          {info.name && (
            <span style={{ display:"block", fontFamily:"'DM Sans',sans-serif",
                           fontSize:".82rem", color:"var(--t2)", marginTop:"3px" }}>
              {info.name}
            </span>
          )}
          {info.sector && (
            <span style={{
              display:"inline-block", marginTop:"8px",
              background:"rgba(192,132,252,.1)", border:"1px solid rgba(192,132,252,.22)",
              color:"var(--purple)", fontFamily:"'Space Mono',monospace",
              fontSize:".62rem", padding:"2px 9px", borderRadius:"20px",
            }}>{info.sector}</span>
          )}
        </div>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"2.2rem",
                      fontWeight:700, color:"var(--t1)", lineHeight:1 }}>
          ${current_price?.toFixed(2)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"8px" }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".95rem",
                         color:up ? "var(--green)" : "var(--red)", fontWeight:700 }}>
            {up ? "▲" : "▼"} ${Math.abs(price_change).toFixed(2)}
          </span>
          <span style={{
            background: up ? "var(--green-dim)" : "var(--red-dim)",
            border:`1px solid ${up ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)"}`,
            color: up ? "var(--green)" : "var(--red)",
            fontFamily:"'Space Mono',monospace", fontSize:".72rem",
            fontWeight:700, padding:"3px 8px", borderRadius:"4px",
          }}>
            {up ? "+" : ""}{price_change_pct?.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Fundamentals */}
      <div className="glass-card" style={{ padding:"18px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".64rem",
                      color:"var(--t3)", letterSpacing:".12em", marginBottom:"12px", fontWeight:700 }}>
          FUNDAMENTALS
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {fundamentals.map(({ label, value }) => (
            <div key={label} style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
                                       borderRadius:"8px", padding:"10px" }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".58rem",
                            color:"var(--t3)", marginBottom:"4px" }}>{label}</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".82rem",
                            color:"var(--t1)", fontWeight:700 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

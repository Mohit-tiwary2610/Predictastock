import React, { useState } from "react";

export default function ForecastTable({ prediction }) {
  const [expanded, setExpanded] = useState(false);
  if (!prediction?.future?.length) return null;

  const { future, last_actual_price, predicted_trend } = prediction;
  const rows = expanded ? future : future.slice(0, 10);
  const tc = predicted_trend==="bullish" ? "var(--green)"
           : predicted_trend==="bearish" ? "var(--red)" : "var(--t2)";
  const overallPct = last_actual_price
    ? ((future.at(-1).price - last_actual_price) / last_actual_price) * 100 : 0;

  const summaryItems = [
    { label:"START",       value:`$${last_actual_price?.toFixed(2)}`,                       color:"var(--t2)" },
    { label:"MIN FORECAST",value:`$${Math.min(...future.map(f=>f.price)).toFixed(2)}`,      color:"var(--red)" },
    { label:"MAX FORECAST",value:`$${Math.max(...future.map(f=>f.price)).toFixed(2)}`,      color:"var(--green)" },
    { label:"END FORECAST",value:`$${future.at(-1)?.price?.toFixed(2)}`,                    color:tc },
  ];

  return (
    <div className="glass-card" style={{ padding:"22px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    marginBottom:"18px", gap:"10px", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".82rem",
                     color:"var(--cyan)", letterSpacing:".04em" }}>
          {future.length}-DAY FORECAST TABLE
        </h3>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem", color:tc,
                      background:`color-mix(in srgb, ${tc} 12%, transparent)`,
                      border:`1px solid color-mix(in srgb, ${tc} 30%, transparent)`,
                      borderRadius:"6px", padding:"4px 10px" }}>
          {overallPct >= 0 ? "+" : ""}{overallPct.toFixed(2)}% over {future.length} days
        </div>
      </div>

      {/* Summary */}
      <div className="forecast-4col" style={{ marginBottom:"18px" }}>
        {summaryItems.map(({ label, value, color }) => (
          <div key={label} style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
                                     borderRadius:"8px", padding:"10px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".56rem",
                          color:"var(--t3)", marginBottom:"5px" }}>{label}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".82rem",
                          fontWeight:700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>DATE</th><th>PRICE</th>
              <th>DAILY</th><th>FROM NOW</th><th>SIGNAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const prev    = i===0 ? last_actual_price : future[i-1]?.price;
              const daily   = prev ? ((row.price - prev) / prev * 100) : 0;
              const fromNow = last_actual_price ? ((row.price - last_actual_price) / last_actual_price * 100) : 0;
              const up      = daily >= 0;
              return (
                <tr key={row.date}>
                  <td style={{ color:"var(--t4)" }}>{i+1}</td>
                  <td style={{ color:"var(--t2)", whiteSpace:"nowrap" }}>{row.date}</td>
                  <td style={{ color:"var(--t1)", fontWeight:700 }}>${row.price?.toFixed(2)}</td>
                  <td style={{ color:up?"var(--green)":"var(--red)" }}>
                    {up?"▲":"▼"} {Math.abs(daily).toFixed(2)}%
                  </td>
                  <td style={{ color:fromNow>=0?"var(--green)":"var(--red)" }}>
                    {fromNow>=0?"+":""}{fromNow.toFixed(2)}%
                  </td>
                  <td>
                    <span style={{
                      background: up ? "var(--green-dim)" : "var(--red-dim)",
                      border:`1px solid ${up ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)"}`,
                      color: up ? "var(--green)" : "var(--red)",
                      fontFamily:"'Space Mono',monospace", fontSize:".62rem",
                      fontWeight:700, padding:"2px 8px", borderRadius:"4px",
                    }}>{up ? "BUY" : "SELL"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {future.length > 10 && (
        <button onClick={() => setExpanded(!expanded)} className="btn-secondary"
                style={{ marginTop:"14px", width:"100%", fontSize:".8rem" }}>
          {expanded ? "▲ Collapse" : `▼ Show All ${future.length} Days`}
        </button>
      )}

      <p style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--t3)",
                  marginTop:"12px", lineHeight:1.7 }}>
        ⚠ BUY/SELL signals are for educational purposes only. Not financial advice.
      </p>
    </div>
  );
}

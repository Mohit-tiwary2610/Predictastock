import React from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, PointElement, LineElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

const baseOpts = (yLabel="") => ({
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{ display:false },
    tooltip:{
      backgroundColor:"rgba(7,21,37,.95)", bodyColor:"var(--t1)",
      borderColor:"rgba(56,189,248,.28)", borderWidth:1, padding:10,
      bodyFont:{ family:"Space Mono", size:11 },
    },
  },
  scales:{
    x:{ grid:{ color:"rgba(26,58,92,.45)" },
        ticks:{ color:"#6b9cc0", font:{ family:"Space Mono",size:9 }, maxTicksLimit:7, maxRotation:0 } },
    y:{ grid:{ color:"rgba(26,58,92,.45)" },
        ticks:{ color:"#6b9cc0", font:{ family:"Space Mono",size:9 } } },
  },
  animation:{ duration:400 },
});

export default function TechnicalIndicators({ historical=[], symbol="" }) {
  if (!historical?.length) return null;

  const data   = historical.slice(-90);
  const labels = data.map(d => d.date);
  const latest = data.at(-1) || {};
  const rsi    = latest.rsi || 0;
  const rsiState = rsi > 70 ? { text:"Overbought", color:"var(--red)" }
                 : rsi < 30 ? { text:"Oversold",   color:"var(--green)" }
                             : { text:"Neutral",    color:"var(--t2)" };

  const macdVals = data.map(d => d.macd || 0);
  const volVals  = data.map(d => d.volume || 0);

  const stat = (label, value, color="var(--t1)") => (
    <div key={label} style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
                               borderRadius:"8px", padding:"10px 12px", textAlign:"center" }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".6rem",
                    color:"var(--t3)", marginBottom:"4px" }}>{label}</div>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".85rem",
                    fontWeight:700, color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>

      {/* RSI */}
      <div className="glass-card" style={{ padding:"22px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
          <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".8rem",
                       color:"var(--cyan)", letterSpacing:".04em" }}>RSI (14)</h3>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem",
                         fontWeight:700, color:rsiState.color }}>
            {rsi.toFixed(1)} — {rsiState.text}
          </span>
        </div>
        <div style={{ height:"160px", marginBottom:"12px" }}>
          <Line data={{ labels, datasets:[{
            label:"RSI", data:data.map(d=>d.rsi||0),
            borderColor:"#c084fc", backgroundColor:"rgba(192,132,252,.07)",
            pointRadius:0, borderWidth:1.8, fill:true, tension:.3,
          }]}} options={{
            ...baseOpts(), scales:{
              x:baseOpts().scales.x,
              y:{ ...baseOpts().scales.y, min:0, max:100,
                  ticks:{ ...baseOpts().scales.y.ticks, stepSize:20 } },
            },
            plugins:{
              ...baseOpts().plugins,
              annotation:undefined,
            },
          }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
          {stat("CURRENT RSI", rsi.toFixed(1), rsiState.color)}
          {stat("OVERBOUGHT",  "70.0", "var(--red)")}
          {stat("OVERSOLD",    "30.0", "var(--green)")}
        </div>
      </div>

      {/* MACD */}
      <div className="glass-card" style={{ padding:"22px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
          <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".8rem",
                       color:"var(--cyan)", letterSpacing:".04em" }}>MACD (12,26,9)</h3>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem",
                         color:(macdVals.at(-1)||0)>=0 ? "var(--green)" : "var(--red)", fontWeight:700 }}>
            {(macdVals.at(-1)||0).toFixed(4)}
          </span>
        </div>
        <div style={{ height:"140px" }}>
          <Bar data={{ labels, datasets:[{
            label:"MACD", data:macdVals,
            backgroundColor:macdVals.map(v => v>=0 ? "rgba(52,211,153,.65)" : "rgba(248,113,113,.65)"),
            borderWidth:0,
          }]}} options={baseOpts()} />
        </div>
      </div>

      {/* Volume */}
      <div className="glass-card" style={{ padding:"22px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
          <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".8rem",
                       color:"var(--cyan)", letterSpacing:".04em" }}>VOLUME (90-day)</h3>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem", color:"var(--t2)" }}>
            Avg: {(volVals.reduce((a,b)=>a+b,0)/volVals.length/1e6).toFixed(1)}M
          </span>
        </div>
        <div style={{ height:"130px" }}>
          <Bar data={{ labels, datasets:[{
            label:"Volume", data:volVals,
            backgroundColor:"rgba(56,189,248,.38)",
            borderColor:"rgba(56,189,248,.6)", borderWidth:1,
          }]}} options={baseOpts()} />
        </div>
      </div>

    </div>
  );
}

import React, { useState } from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,Filler);

const VIEWS = ["1M","3M","6M","1Y","ALL"];
const VIEW_DAYS = { "1M":22,"3M":66,"6M":132,"1Y":252,"ALL":9999 };

const chartOpts = {
  responsive:true, maintainAspectRatio:false,
  interaction:{ mode:"index", intersect:false },
  plugins:{
    legend:{ labels:{ color:"#a8c8e8", font:{ family:"Space Mono",size:11 },
                      boxWidth:18, padding:16 } },
    tooltip:{
      backgroundColor:"rgba(7,21,37,.96)", titleColor:"#6b9cc0",
      bodyColor:"#eef4fc", borderColor:"rgba(56,189,248,.28)", borderWidth:1, padding:12,
      titleFont:{ family:"Space Mono",size:10 }, bodyFont:{ family:"Space Mono",size:12 },
      callbacks:{ label: ctx => ` ${ctx.dataset.label}: $${Number(ctx.parsed.y).toFixed(2)}` },
    },
  },
  scales:{
    x:{ grid:{ color:"rgba(26,58,92,.5)" },
        ticks:{ color:"#4a7099", font:{ family:"Space Mono",size:10 }, maxTicksLimit:8, maxRotation:0 } },
    y:{ grid:{ color:"rgba(26,58,92,.5)" },
        ticks:{ color:"#4a7099", font:{ family:"Space Mono",size:10 },
                callback:v=>`$${v.toFixed(0)}` } },
  },
  animation:{ duration:600 },
};

export default function StockChart({ historical=[], prediction=null, symbol }) {
  const [view,        setView]        = useState("6M");
  const [showSMA,     setShowSMA]     = useState(true);
  const [showLSTM,    setShowLSTM]    = useState(!!prediction);

  const sliced = historical.slice(-VIEW_DAYS[view]);
  const labels = sliced.map(d => d.date);
  const prices = sliced.map(d => d.close);
  const sma20  = sliced.map(d => d.sma_20 || null);
  const sma50  = sliced.map(d => d.sma_50 || null);

  const mainDS = [
    { label:`${symbol} Close`, data:prices, borderColor:"#38bdf8",
      backgroundColor:"rgba(56,189,248,.07)", fill:true, tension:.3,
      pointRadius:0, pointHoverRadius:4, borderWidth:2 },
    ...(showSMA ? [
      { label:"SMA 20", data:sma20, borderColor:"#fbbf24", borderDash:[5,3],
        pointRadius:0, borderWidth:1.5, fill:false, tension:.3 },
      { label:"SMA 50", data:sma50, borderColor:"#c084fc", borderDash:[5,3],
        pointRadius:0, borderWidth:1.5, fill:false, tension:.3 },
    ] : []),
  ];

  const predLabels = [
    ...(prediction?.actual  || []).map(d => d.date),
    ...(prediction?.future  || []).map(d => d.date),
  ];
  const predDS = showLSTM && prediction ? [
    { label:"Actual (Test)", data:(prediction.actual||[]).map(d=>d.price),
      borderColor:"#38bdf8", pointRadius:0, borderWidth:2, fill:false, tension:.3 },
    { label:"LSTM Predicted", data:(prediction.predicted||[]).map(d=>d.price),
      borderColor:"#34d399", borderDash:[6,3], pointRadius:0, borderWidth:2, fill:false, tension:.3 },
    { label:"Future Forecast", data:(prediction.future||[]).map(d=>d.price),
      borderColor:"#c084fc", backgroundColor:"rgba(192,132,252,.07)", borderDash:[4,2],
      pointRadius:2, borderWidth:2, fill:true, tension:.4 },
  ] : [];

  const tbtn = (active, ac) => ({
    background: active ? `rgba(${ac},0.16)` : "transparent",
    border:`1px solid ${active ? `rgba(${ac},0.6)` : "rgba(42,85,128,.5)"}`,
    color: active ? `rgba(${ac},1)` : "#6b9cc0",
    fontFamily:"'Space Mono',monospace", fontSize:".68rem", fontWeight:700,
    padding:"4px 10px", borderRadius:"5px", cursor:"pointer", transition:"all .2s",
  });

  return (
    <div className="glass-card" style={{ padding:"22px" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"10px",
                    alignItems:"center", justifyContent:"space-between", marginBottom:"18px" }}>
        <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".9rem",
                     color:"var(--cyan)", letterSpacing:".04em" }}>
          {symbol} — Price Chart
        </h3>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)}
                    style={tbtn(view===v, "56,189,248")}>{v}</button>
          ))}
          <button onClick={() => setShowSMA(!showSMA)}
                  style={tbtn(showSMA, "251,191,36")}>SMA</button>
          {prediction && (
            <button onClick={() => setShowLSTM(!showLSTM)}
                    style={tbtn(showLSTM, "52,211,153")}>LSTM</button>
          )}
        </div>
      </div>

      <div className="chart-container">
        <Line data={{ labels, datasets:mainDS }} options={chartOpts} />
      </div>

      {prediction && showLSTM && (
        <div style={{ marginTop:"22px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem",
                        color:"var(--t3)", letterSpacing:".05em", marginBottom:"12px" }}>
            ╔═ LSTM PREDICTION vs ACTUAL ═╗
          </div>
          <div className="chart-container" style={{ height:"260px" }}>
            <Line data={{ labels:predLabels, datasets:predDS }} options={chartOpts} />
          </div>
        </div>
      )}
    </div>
  );
}

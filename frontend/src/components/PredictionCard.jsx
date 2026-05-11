import React from "react";

export default function PredictionCard({ prediction, onPredict, predicting, symbol }) {
  // Debug: log prediction data
  console.log("PredictionCard - prediction:", prediction);
  console.log("PredictionCard - symbol:", symbol);
  
  if (!prediction) {
    return (
      <div className="glass-card" style={{ padding:"28px", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"14px" }}>🧠</div>
        <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".88rem", color:"var(--cyan)", marginBottom:"12px", letterSpacing:".04em" }}>
          LSTM FORECAST
        </h3>
        <p style={{ color:"var(--t2)", fontSize:".875rem", marginBottom:"22px", lineHeight:1.75 }}>
          Train a deep learning model on {symbol || "this stock"}'s historical data and forecast the next 30 days.
        </p>
        <button onClick={() => onPredict(symbol, 30)} disabled={predicting || !symbol}
                className="btn-primary" style={{ width:"100%", fontSize:".9rem" }}>
          {predicting ? "⚙️ Training LSTM…" : "🚀 Run Prediction"}
        </button>
        <p style={{ color:"var(--t3)", fontSize:".68rem", marginTop:"10px", fontFamily:"'Space Mono',monospace" }}>
          ⏱ Training: 30–90 seconds on CPU
        </p>
      </div>
    );
  }

  // Extract data safely with fallbacks
  const metrics = prediction?.metrics || {};
  const future = prediction?.future || [];
  const predicted_trend = prediction?.predicted_trend || "neutral";
  const last_actual_price = prediction?.last_actual_price || 0;
  const last_predicted_price = future?.[0]?.price || prediction?.last_predicted_price || 0;
  const model_config = prediction?.model_config || {};

  const tc = predicted_trend === "bullish" ? "var(--green)" : predicted_trend === "bearish" ? "var(--red)" : "var(--t2)";
  const ti = predicted_trend === "bullish" ? "↑" : predicted_trend === "bearish" ? "↓" : "→";

  return (
    <div className="glass-card" style={{ padding:"22px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px" }}>
        <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".82rem", color:"var(--cyan)", letterSpacing:".04em" }}>
          LSTM PREDICTION
        </h3>
        <span className={`metric-badge ${predicted_trend}`}>
          {ti} {predicted_trend?.toUpperCase()}
        </span>
      </div>

      {/* Current vs Day 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"18px" }}>
        {[
          { label:"CURRENT",        val:`$${last_actual_price?.toFixed(2)}`,       color:"var(--t1)" },
          { label:"DAY 1 FORECAST", val:`$${last_predicted_price?.toFixed(2)}`,    color:tc },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background:"rgba(56,189,248,.06)", border:"1px solid rgba(56,189,248,.14)", borderRadius:"10px", padding:"12px", textAlign:"center" }}>
            <div style={{ color:"var(--t3)", fontSize:".63rem", fontFamily:"'Space Mono',monospace", marginBottom:"5px" }}>
              {label}
            </div>
            <div style={{ color, fontSize:"1.2rem", fontWeight:700, fontFamily:"'Space Mono',monospace" }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* 7-day preview */}
      {future && future.length > 0 && (
        <div style={{ marginBottom:"18px" }}>
          <div style={{ color:"var(--t3)", fontSize:".63rem", fontFamily:"'Space Mono',monospace", letterSpacing:".08em", marginBottom:"10px", textTransform:"uppercase" }}>
            Next {Math.min(7, future.length)} Days Preview
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
            {future.slice(0, 7).map((d, i) => {
              const prev = i === 0 ? last_actual_price : future[i - 1]?.price;
              const change = prev ? ((d.price - prev) / prev * 100) : 0;
              return (
                <div key={d.date} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", borderRadius:"6px", background:"rgba(10,28,48,0.5)" }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".72rem", color:"var(--t2)" }}>
                    {d.date}
                  </span>
                  <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".8rem", color:"var(--t1)", fontWeight:700 }}>
                      ${d.price?.toFixed(2)}
                    </span>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".7rem", color: change >= 0 ? "var(--green)" : "var(--red)", minWidth:"56px", textAlign:"right" }}>
                      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics */}
      {metrics && Object.keys(metrics).length > 0 && (
        <div style={{ borderTop:"1px solid rgba(22,45,74,.8)", paddingTop:"16px", marginBottom:"16px" }}>
          <div style={{ color:"var(--t3)", fontSize:".63rem", fontFamily:"'Space Mono',monospace", letterSpacing:".08em", marginBottom:"10px", textTransform:"uppercase" }}>
            Model Metrics
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            {[
              { label:"RMSE", value: metrics.rmse ? `$${metrics.rmse.toFixed(4)}` : "N/A" },
              { label:"MAE",  value: metrics.mae  ? `$${metrics.mae.toFixed(4)}`  : "N/A" },
              { label:"MAPE", value: metrics.mape ? `${metrics.mape.toFixed(2)}%` : "N/A" },
              { label:"R²",   value: metrics.r2   ? metrics.r2.toFixed(4)         : "N/A" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:"rgba(10,28,48,0.6)", border:"1px solid rgba(22,45,74,.8)", borderRadius:"8px", padding:"8px" }}>
                <div style={{ color:"var(--t3)", fontSize:".6rem", fontFamily:"'Space Mono',monospace" }}>{label}</div>
                <div style={{ color:"var(--cyan)", fontSize:".85rem", fontWeight:700, fontFamily:"'Space Mono',monospace", marginTop:"3px" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model config */}
      {model_config && Object.keys(model_config).length > 0 && (
        <div style={{ marginTop:"14px", padding:"10px 12px", background:"rgba(10,28,48,0.5)", borderRadius:"8px", fontSize:".66rem", fontFamily:"'Space Mono',monospace", color:"var(--t3)", lineHeight:1.8 }}>
          <div>⚙ LSTM: {model_config.lstm_units?.join(" → ") || "128→64→32"}</div>
          <div>📅 Lookback: {model_config.sequence_length || 60} days</div>
          <div>🔮 Forecast: {model_config.prediction_days || 30} days</div>
          <div>🏋️ Epochs: {model_config.epochs || 50}</div>
        </div>
      )}

      {/* Re-run button */}
      <button onClick={() => onPredict(symbol, 30)} disabled={predicting}
              className="btn-secondary" style={{ width:"100%", marginTop:"14px", fontSize:".85rem" }}>
        {predicting ? "⚙️ Training…" : "🔄 Re-run Prediction"}
      </button>
    </div>
  );
}
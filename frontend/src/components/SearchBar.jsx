import React, { useState } from "react";

const QUICK = ["AAPL","GOOGL","MSFT","TSLA","NVDA","AMZN","META","NFLX"];

const SearchBar = ({ onSearch, loading }) => {
  const [input, setInput] = useState("");
  const submit = (e) => { e.preventDefault(); if (input.trim()) onSearch(input.trim().toUpperCase()); };
  const quick  = (sym) => { setInput(sym); onSearch(sym); };

  return (
    <div style={{ width:"100%" }}>
      <form onSubmit={submit} style={{ display:"flex", gap:"10px", marginBottom:"14px" }}>
        <div style={{ position:"relative", flex:1, minWidth:0 }}>
          <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"1.1rem", opacity:0.55, pointerEvents:"none" }}>🔍</span>
          <input
            className="input-dark"
            value={input}
            onChange={e=>setInput(e.target.value.toUpperCase())}
            placeholder="Symbol: AAPL, TSLA, NVDA…"
            style={{ paddingLeft:"44px", fontSize:"clamp(.85rem,2.5vw,.95rem)", height:"52px" }}
            disabled={loading}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading||!input.trim()}
                style={{ minWidth:"clamp(80px,20vw,120px)", height:"52px", fontSize:"clamp(.82rem,2vw,.92rem)", flexShrink:0, padding:"0 16px" }}>
          {loading ? "⏳" : "Analyze"}
        </button>
      </form>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", alignItems:"center" }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".66rem", color:"var(--t4)", letterSpacing:".08em" }}>QUICK:</span>
        {QUICK.map(sym=>(
          <button key={sym} onClick={()=>quick(sym)} disabled={loading} style={{
            background:"rgba(56,189,248,.08)", border:"1px solid rgba(56,189,248,.2)",
            color:"var(--cyan)", fontFamily:"'Space Mono',monospace", fontSize:".72rem", fontWeight:700,
            padding:"5px 11px", borderRadius:"20px", cursor:"pointer", transition:"all .18s",
            whiteSpace:"nowrap", minHeight:"32px",
          }}
          onMouseEnter={e=>{e.target.style.background="rgba(56,189,248,.16)";}}
          onMouseLeave={e=>{e.target.style.background="rgba(56,189,248,.08)";}}>
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SearchBar;

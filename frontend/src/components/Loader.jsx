import React from "react";

export default function Loader({ message="Processing…", subMessage="" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  padding:"52px 20px", gap:"20px" }}>
      {/* Triple ring spinner */}
      <div style={{ position:"relative", width:"72px", height:"72px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:`${72-i*18}px`, height:`${72-i*18}px`,
            border:"2px solid",
            borderColor: i===0?"#38bdf8":i===1?"#c084fc":"#34d399",
            borderRadius:"50%",
            animation:`spin ${1+i*.35}s linear infinite`,
            animationDirection: i%2===0?"normal":"reverse",
          }} />
        ))}
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:"10px", height:"10px",
          background:"#38bdf8", borderRadius:"50%",
          boxShadow:"0 0 12px #38bdf8",
        }} />
      </div>

      <div style={{ textAlign:"center" }}>
        <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:".88rem",
                    color:"var(--cyan)", letterSpacing:".1em", marginBottom:"6px" }}>
          {message}
        </p>
        {subMessage && (
          <p style={{ fontFamily:"'Space Mono',monospace", fontSize:".7rem",
                      color:"var(--t3)" }}>{subMessage}</p>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ width:"200px", height:"3px", background:"rgba(56,189,248,.1)",
                    borderRadius:"2px", overflow:"hidden" }}>
        <div style={{ height:"100%", background:"linear-gradient(90deg,#38bdf8,#c084fc)",
                      borderRadius:"2px", animation:"progBar 2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

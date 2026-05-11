import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { path:"/",          label:"HOME",      icon:"🏠" },
  { path:"/dashboard", label:"DASHBOARD", icon:"📊" },
  { path:"/about",     label:"ABOUT",     icon:"ℹ️"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMenuOpen(false), [loc.pathname]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => { if (!e.target.closest("nav") && !e.target.closest(".mobile-menu")) setMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  const lnk = (active) => ({
    textDecoration:"none",
    color: active ? "var(--cyan)" : "var(--t2)",
    fontFamily:"'Space Mono',monospace", fontSize:".73rem", fontWeight:700,
    letterSpacing:".1em", padding:"7px 14px", borderRadius:"7px",
    background: active ? "rgba(56,189,248,.11)" : "transparent",
    border: active ? "1px solid rgba(56,189,248,.3)" : "1px solid transparent",
    transition:"all .18s", whiteSpace:"nowrap",
  });

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background: scrolled ? "rgba(2,12,24,.97)" : "rgba(2,12,24,.7)",
        backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
        borderBottom:`1px solid ${scrolled?"rgba(56,189,248,.14)":"transparent"}`,
        transition:"all .3s",
      }}>
        <div className="content-max" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:"64px", gap:"12px" }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
            <div style={{ width:"36px", height:"36px", background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0, boxShadow:"0 2px 12px rgba(56,189,248,.35)" }}>📈</div>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:"1.05rem", color:"var(--cyan)", textShadow:"0 0 12px rgba(56,189,248,.45)", letterSpacing:".05em" }}>Predictastock</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop">
            {LINKS.map(l=>(
              <Link key={l.path} to={l.path} style={lnk(loc.pathname===l.path)}>{l.label}</Link>
            ))}
            <a href="https://github.com/Mohit-tiwary2610" target="_blank" rel="noreferrer"
               style={{ ...lnk(false), display:"flex", alignItems:"center", gap:"6px", marginLeft:"4px" }}>
              <span>🐙</span><span>GITHUB</span>
            </a>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", marginLeft:"8px", background:"rgba(74,222,128,.1)", border:"1px solid rgba(74,222,128,.3)", borderRadius:"20px", padding:"5px 12px" }}>
              <span className="pulse-dot" />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".62rem", color:"var(--green)", fontWeight:700 }}>LIVE</span>
            </div>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span style={{ display:"block", transition:"transform .2s", transform:menuOpen?"rotate(90deg)":"none", fontSize:"1.2rem" }}>
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={"mobile-menu"+(menuOpen?" open":"")} role="navigation">
        {LINKS.map(l=>(
          <Link key={l.path} to={l.path}
                style={{ textDecoration:"none", color:loc.pathname===l.path?"var(--cyan)":"var(--t2)", fontFamily:"'Space Mono',monospace", fontSize:".82rem", fontWeight:700, letterSpacing:".1em", padding:"12px 16px", borderRadius:"8px", border:"1px solid "+(loc.pathname===l.path?"rgba(56,189,248,.3)":"transparent"), background:loc.pathname===l.path?"rgba(56,189,248,.1)":"transparent", display:"flex", alignItems:"center", gap:"10px", minHeight:"48px" }}>
            <span style={{ fontSize:"1.1rem" }}>{l.icon}</span>
            {l.label}
          </Link>
        ))}
        <a href="https://github.com/Mohit-tiwary2610" target="_blank" rel="noreferrer"
           style={{ textDecoration:"none", color:"var(--t2)", fontFamily:"'Space Mono',monospace", fontSize:".82rem", fontWeight:700, letterSpacing:".1em", padding:"12px 16px", borderRadius:"8px", border:"1px solid transparent", display:"flex", alignItems:"center", gap:"10px", minHeight:"48px" }}>
          <span>🐙</span> GITHUB
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:"7px", marginTop:"4px", background:"rgba(74,222,128,.07)", border:"1px solid rgba(74,222,128,.2)", borderRadius:"8px", padding:"10px 16px" }}>
          <span className="pulse-dot" />
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".65rem", color:"var(--green)", fontWeight:700 }}>LIVE DATA ACTIVE</span>
        </div>
      </div>
    </>
  );
}

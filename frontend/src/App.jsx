import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home          from "./pages/Home";
import Dashboard     from "./pages/Dashboard";
import About         from "./pages/About";
import "./styles/globals.css";

function App() {
  return (
    <Router>
      <div style={{ minHeight:"100vh", background:"var(--bg-primary)", display:"flex", flexDirection:"column" }}>
        <Navbar />
        <main style={{ flex:1 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about"     element={<About />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background:   "#0a1c30",
              color:        "#f0f8ff",
              border:       "1px solid rgba(56,189,248,0.25)",
              fontFamily:   "'Space Mono',monospace",
              fontSize:     ".78rem",
              borderRadius: "10px",
              padding:      "12px 16px",
              maxWidth:     "320px",
            },
            success: { iconTheme:{ primary:"#4ade80", secondary:"#020c18" } },
            error:   { iconTheme:{ primary:"#fb7185", secondary:"#020c18" } },
            loading: { iconTheme:{ primary:"#38bdf8", secondary:"#020c18" } },
          }}
        />
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", textAlign:"center" }}>
    <div className="grid-bg" />
    <div style={{ position:"relative", zIndex:1 }}>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(4rem,15vw,8rem)", fontWeight:900, color:"rgba(56,189,248,0.1)", lineHeight:1, marginBottom:"16px" }}>404</div>
      <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(.9rem,2.5vw,1.1rem)", color:"var(--cyan)", letterSpacing:".15em", marginBottom:"16px" }}>PAGE NOT FOUND</h1>
      <p style={{ color:"var(--t2)", fontSize:".9rem", marginBottom:"28px", maxWidth:"360px" }}>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" style={{ background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", color:"#030c18", fontFamily:"'DM Sans',sans-serif", fontWeight:700, padding:"12px 28px", borderRadius:"9px", textDecoration:"none", display:"inline-block" }}>← Back to Home</a>
    </div>
  </div>
);

export default App;

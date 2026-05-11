import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          textAlign: "center",
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "16px",
          margin: "20px",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "1rem",
            color: "#ef4444",
            marginBottom: "12px",
            letterSpacing: "0.05em",
          }}>
            COMPONENT ERROR
          </h2>
          <p style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.8rem",
            color: "#94a3b8",
            marginBottom: "20px",
          }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-secondary"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

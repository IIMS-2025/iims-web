import { useState } from "react";
import { colors } from "../styles/colors";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For demo, route based on role keyword in email
    if (email.includes("owner")) navigate("/owner");
    else if (email.includes("manager")) navigate("/manager");
    else navigate("/chef");
  }

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center", height: "calc(100vh - 2rem)" }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, background: colors.primary, borderRadius: 10, display: "grid", placeItems: "center", color: "white" }}>🍽️</div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Reztro</div>
        </div>
        <h2 style={{ margin: 0 }}>Hello Again!</h2>
        <p className="footer-note">Welcome back, you've been missed!</p>
        <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <label className="label">Email Address</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@demo.com" />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <button className="btn" type="submit">Sign In</button>
          <div className="footer-note">Use owner/manager/chef in email to navigate.</div>
          <div className="footer-note">Don't have an account? <Link to="#">Sign up</Link></div>
        </form>
      </div>
      <div className="panel" style={{ padding: 24, textAlign: "center" }}>
        <img alt="Dashboard preview" src={`https://dummyimage.com/480x280/${colors.secondary.slice(1)}/ffffff&text=Reztro+Dashboard`} style={{ width: 480, maxWidth: "100%", borderRadius: 12 }} />
        <h2>Your Restaurant's Command Center</h2>
        <p className="footer-note">Manage inventory, track sales, and gain insights to drive growth.</p>
      </div>
    </div>
  );
}



import { useState } from "react";
import { colors } from "../styles/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I'm your managerial assistant. Ask about stock or forecasts." },
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    const reply = text.toLowerCase().includes("stock")
      ? "Tomatoes at 45kg; reorder point 20kg. No action needed today."
      : text.toLowerCase().includes("forecast")
      ? "Cheese demand tomorrow: 6kg ± 2kg."
      : "Sorry, demo bot answers stock/forecast questions.";
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: reply }]);
    setText("");
  }

  return (
    <div className="card" style={{ display: "grid", gridTemplateRows: "1fr auto", height: 360, padding: 12 }}>
      <div style={{ overflow: "auto", display: "grid", gap: 8 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ justifySelf: m.role === "user" ? "end" : "start", maxWidth: 560 }}>
            <div className="alert" style={m.role === "user" ? { background: colors.surface, borderColor: colors.primary } : undefined}>{m.content}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask: what items are low on stock?" />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}



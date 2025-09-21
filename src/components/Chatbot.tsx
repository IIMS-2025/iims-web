import { useState } from "react";
import { colors } from "../styles/colors";
import appConfig from "../config/appConfig";

export default function Chatbot() {
  // Chatbot configuration (can be loaded from backend)
  const chatbotConfig = {
    text: appConfig.text.chatbot,
    ui: {
      height: 360,
      padding: 12,
      maxWidth: 560
    },
    responses: {
      stock: appConfig.text.chatbot.responses.stock,
      forecast: appConfig.text.chatbot.responses.forecast,
      default: appConfig.text.chatbot.responses.default
    }
  };

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: chatbotConfig.text.welcomeMessage },
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    const reply = text.toLowerCase().includes("stock")
      ? chatbotConfig.responses.stock
      : text.toLowerCase().includes("forecast")
        ? chatbotConfig.responses.forecast
        : chatbotConfig.responses.default;
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: reply }]);
    setText("");
  }

  return (
    <div className="card" style={{
      display: "grid",
      gridTemplateRows: "1fr auto",
      height: chatbotConfig.ui.height,
      padding: chatbotConfig.ui.padding
    }}>
      <div style={{ overflow: "auto", display: "grid", gap: 8 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{
            justifySelf: m.role === "user" ? "end" : "start",
            maxWidth: chatbotConfig.ui.maxWidth
          }}>
            <div className="alert" style={m.role === "user" ? { background: colors.surface, borderColor: colors.primary } : undefined}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={chatbotConfig.text.placeholder}
        />
        <button className="btn" onClick={send}>{chatbotConfig.text.sendButton}</button>
      </div>
    </div>
  );
}



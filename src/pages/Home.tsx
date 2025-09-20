import Card from "../components/Card";
import Chatbot from "../components/Chatbot";

export default function HomePage() {
  return (
    <div className="grid two">
      <Card title="Welcome to Reztro">
        <p className="footer-note">Multi-tenant inventory analytics for restaurants. Use the sidebar to navigate dashboards.</p>
      </Card>
      <Chatbot />
    </div>
  );
}



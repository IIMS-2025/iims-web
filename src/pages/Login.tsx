import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginGraph from "../assets/login/login-graph.svg";
import appConfig from "../config/appConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login page configuration (can be loaded from backend)
  const loginConfig = {
    branding: appConfig.branding,
    routes: appConfig.routes,
    text: appConfig.text,
    assets: {
      loginGraph: loginGraph
    },
    content: {
      rightPanel: {
        title: "Your Restaurant's Command Center",
        subtitle: "Seamlessly manage inventory, track sales, and gain powerful insights to drive growth.",
        imageAlt: "Restaurant Dashboard Preview"
      },
      socialProviders: [
        {
          id: 'google',
          name: 'Google',
          icon: (
            <svg width="17.16" height="18" viewBox="0 0 17.16 18" fill="none">
              <path d="M16.3442 7.35845H8.68421V10.8585H13.1442C12.6842 12.8585 10.9842 14.1585 8.68421 14.1585C5.98421 14.1585 3.78421 11.9585 3.78421 9.25845C3.78421 6.55845 5.98421 4.35845 8.68421 4.35845C9.88421 4.35845 11.0842 4.85845 11.9842 5.65845L14.5842 3.05845C12.8842 1.45845 10.7842 0.658447 8.68421 0.658447C3.98421 0.658447 0.284211 4.35845 0.284211 9.05845C0.284211 13.7585 3.98421 17.4585 8.68421 17.4585C13.3842 17.4585 16.8842 14.2585 16.8842 9.05845C16.8842 8.45845 16.7842 7.85845 16.3442 7.35845Z" fill="#EF4444" />
            </svg>
          )
        },
        {
          id: 'apple',
          name: 'Apple',
          icon: (
            <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
              <path d="M11.624 6.91c-.051-3.042 2.488-4.517 2.6-4.583-1.417-2.075-3.625-2.358-4.408-2.392-1.875-.192-3.658 1.1-4.608 1.1-.95 0-2.417-1.075-3.975-1.042-2.042.033-3.925 1.192-4.975 3.025-2.125 3.683-.542 9.125 1.525 12.108 1.017 1.458 2.225 3.1 3.808 3.042 1.542-.067 2.125-.992 3.992-.992 1.867 0 2.408.992 4.008.958 1.65-.025 2.708-1.492 3.717-2.958 1.167-1.692 1.642-3.333 1.667-3.417-.034-.017-3.208-1.233-3.242-4.883zm-2.858-8.467c.842-1.017 1.408-2.433 1.258-3.843-1.217.05-2.692.817-3.567 1.842-.783.908-1.467 2.358-1.283 3.75 1.358.108 2.742-.692 3.592-1.75z" fill="#111827" />
            </svg>
          )
        }
      ]
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Navigate to home page after sign in
    navigate(loginConfig.routes.default);
  }

  function handleSocialSignIn(provider: string) {
    // Placeholder for social sign-in
    console.log(`Sign in with ${provider}`);
  }

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-card">
          {/* Left Panel - Login Form */}
          <div className="login-left">
            <div className="login-brand">
              <div className="login-brand-badge">{loginConfig.branding.logoIcon}</div>
              <div className="login-brand-text">{loginConfig.branding.brandName}</div>
            </div>

            <h1 className="login-title">{loginConfig.text.loginWelcome}</h1>
            <p className="login-subtitle">{loginConfig.text.loginSubtitle}</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">{loginConfig.text.loginFormLabels.email}</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{loginConfig.text.loginFormLabels.password}</label>
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-actions">
                <div className="checkbox-group">
                  <input type="checkbox" className="checkbox-input" />
                  <label className="checkbox-label">{loginConfig.text.loginFormLabels.rememberMe}</label>
                </div>
                <Link to="#" className="forgot-password">{loginConfig.text.loginFormLabels.forgotPassword}</Link>
              </div>

              <button type="submit" className="sign-in-button">{loginConfig.text.loginFormLabels.signIn}</button>
            </form>

            <div className="divider-section">
              <div className="divider-line"></div>
              <div className="divider-text">{loginConfig.text.socialSignIn.dividerText}</div>
            </div>

            <div className="social-buttons">
              {loginConfig.content.socialProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className={`social-button ${provider.id}`}
                  onClick={() => handleSocialSignIn(provider.name)}
                >
                  <div className="social-button-icon">
                    {provider.icon}
                  </div>
                  <div className="social-button-text">
                    {provider.id === 'google' ? loginConfig.text.socialSignIn.google : loginConfig.text.socialSignIn.apple}
                  </div>
                </button>
              ))}
            </div>

            <div className="signup-text">
              {loginConfig.text.socialSignIn.noAccount} <Link to="#" style={{ color: loginConfig.branding.primaryColor }}>{loginConfig.text.loginFormLabels.signUp}</Link>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="login-right">
            <img
              src={loginConfig.assets.loginGraph}
              alt={loginConfig.content.rightPanel.imageAlt}
              className="right-panel-image"
            />
            <h2 className="right-panel-title">{loginConfig.content.rightPanel.title}</h2>
            <p className="right-panel-subtitle">
              {loginConfig.content.rightPanel.subtitle}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



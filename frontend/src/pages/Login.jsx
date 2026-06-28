import { useState } from "react";
import { apiRequest, storeAuth } from "../api";

function AuthPage({ initialMode = "login", onLogin }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setCanCreate(false);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setCanCreate(false);
    setLoading(true);

    const payload = isSignup
      ? {
          name: form.name.trim(),
          username: form.identifier.trim(),
          email: form.email.trim(),
          password: form.password
        }
      : {
          identifier: form.identifier.trim(),
          password: form.password
        };

    try {
      const data = await apiRequest(`/auth/${isSignup ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      storeAuth(data.token, data.user);
      onLogin(data.user);
    } catch (error) {
      if (!isSignup && error.message === "Invalid login details") {
        setCanCreate(true);
        setMessage("No account found for this login. Create it with Sign up.");
      } else {
        setMessage(error.message === "Failed to fetch" ? "Cannot reach the backend. Start the Express server on port 5001." : error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-preview" aria-label="Circlio preview">
        <h1>Share the bright parts of your day.</h1>
      </section>
      <section className="auth-card">
        <div className="brand login-brand">Circlio</div>
        <p className="tagline">Connect. Share. Grow.</p>
        <div className="tabs" role="tablist">
          <button className={`tab ${!isSignup ? "active" : ""}`} type="button" onClick={() => switchMode("login")}>Log in</button>
          <button className={`tab ${isSignup ? "active" : ""}`} type="button" onClick={() => switchMode("signup")}>Sign up</button>
        </div>
        <form onSubmit={submit}>
          {isSignup && <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />}
          {isSignup && <input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />}
          <input className="field" required value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder={isSignup ? "Username" : "Username or email"} />
          <input className="field" type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          <button className="primary" disabled={loading} type="submit">{isSignup ? "Create account" : "Log in"}</button>
          <p className="message">{message}</p>
          {canCreate && <button className="text-action" type="button" onClick={() => switchMode("signup")}>Create this account</button>}
        </form>
      </section>
    </main>
  );
}

export default AuthPage;

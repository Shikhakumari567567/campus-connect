import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in");
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span><h1>Sign in</h1>
        <p className="muted">Access your Campus Connect account.</p>
        {error && <p className="alert">{error}</p>}
        <label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="muted">New student? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}

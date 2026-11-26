import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await register(form); navigate("/student"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <span className="eyebrow">Join Campus Connect</span><h1>Create account</h1>
        {error && <p className="alert">{error}</p>}
        <label>Full name<input required maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" minLength="8" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <small className="muted">Use at least 8 characters.</small>
        <button className="btn full" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
        <p className="muted">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}

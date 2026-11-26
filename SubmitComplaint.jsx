import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const categories = ["Hostel", "Classroom", "Wi-Fi", "Electricity", "Water", "Cleanliness", "Library", "Other"];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "Other", priority: "Medium" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (image) body.append("image", image);
      await api.post("/complaints", body);
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Complaint could not be submitted");
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card wide" onSubmit={submit}>
        <span className="eyebrow">Student portal</span><h1>Report a concern</h1>
        <p className="muted">Share enough detail so the campus team can understand the issue.</p>
        {error && <p className="alert">{error}</p>}
        <label>Complaint title<input required maxLength="120" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Description<textarea required maxLength="2000" rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <label>Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label>Attach image (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setImage(e.target.files[0] || null)} /></label>
        <small className="muted">JPG, PNG or WEBP; maximum 5 MB.</small>
        <button className="btn full" disabled={busy}>{busy ? "Submitting..." : "Submit complaint"}</button>
      </form>
    </main>
  );
}

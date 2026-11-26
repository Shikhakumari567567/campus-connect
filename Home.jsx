import { Link } from "react-router-dom";
import { ShieldCheck, ClipboardList, MessageSquareText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A better campus starts with a conversation</span>
          <h1>Your campus.<br /><span>Your voice.</span></h1>
          <p>Report campus concerns, follow progress, and help make everyday college life better — all in one place.</p>
          <div className="hero-actions">
            <Link className="btn" to="/register">Report a concern <ArrowRight size={17} /></Link>
            <Link className="btn btn-outline" to="/login">Sign in</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-icon"><MessageSquareText size={28} /></div>
          <h2>Speak up. Stay updated.</h2>
          <p>One simple platform to submit and track campus complaints.</p>
          <div className="mini-stat"><span className="dot" /> Transparent complaint tracking</div>
          <div className="mini-stat"><ShieldCheck size={16} /> Student-focused and secure</div>
          <div className="mini-stat"><ClipboardList size={16} /> Organized campus records</div>
        </div>
      </section>
      <section className="features">
        <div><MessageSquareText /><h3>Easy reporting</h3><p>Submit a concern with a category, description, and optional image.</p></div>
        <div><ClipboardList /><h3>Track progress</h3><p>Check whether your complaint is pending, in progress, or resolved.</p></div>
        <div><ShieldCheck /><h3>Account access</h3><p>Students and administrators get role-appropriate dashboards.</p></div>
      </section>
    </main>
  );
}

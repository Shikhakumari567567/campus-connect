import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  ClipboardList,
  Droplets,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  PlusSquare,
  UserRound,
  Wifi,
  Zap
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./StudentDashboard.css";

const statusCards = [
  { label: "Total", status: "", icon: ClipboardList, color: "total" },
  { label: "Pending", status: "Pending", icon: CircleDashed, color: "pending" },
  { label: "In Progress", status: "In Progress", icon: ArrowDown, color: "progress" },
  { label: "Resolved", status: "Resolved", icon: CheckCircle2, color: "resolved" }
];

function CampusArtwork() {
  return (
    <svg className="campus-artwork" viewBox="0 0 480 175" role="img" aria-label="Illustration of a campus building">
      <path d="M0 148c63-27 119-16 175-7 74 12 141-30 305-7v41H0z" fill="#c6e8df" />
      <path d="M32 135V83l34-14 34 14v52z" fill="#a9c8d6" />
      <path d="M24 84l42-19 42 19z" fill="#6b95ad" />
      <path d="M64 135V96h9v39" fill="#eaf4f5" />
      <rect x="150" y="47" width="211" height="104" rx="3" fill="#d58d72" />
      <path d="M137 52l119-39 119 39z" fill="#627f9e" />
      <path d="M236 23h41v28h-41z" fill="#f3c9a9" />
      <path d="M250 23V8h14v15" fill="#627f9e" />
      <path d="M238 14h38" stroke="#627f9e" strokeWidth="4" />
      <rect x="245" y="94" width="23" height="57" rx="11" fill="#f0c7a6" />
      <circle cx="256.5" cy="87" r="13" fill="#f9dda9" />
      <path d="M256 78v9l6 4" fill="none" stroke="#bd8654" strokeWidth="2" />
      <g fill="#f8e6d3">
        <rect x="169" y="66" width="18" height="17" rx="2" /><rect x="199" y="66" width="18" height="17" rx="2" />
        <rect x="285" y="66" width="18" height="17" rx="2" /><rect x="315" y="66" width="18" height="17" rx="2" />
        <rect x="169" y="104" width="18" height="17" rx="2" /><rect x="199" y="104" width="18" height="17" rx="2" />
        <rect x="285" y="104" width="18" height="17" rx="2" /><rect x="315" y="104" width="18" height="17" rx="2" />
      </g>
      <g>
        <path d="M93 151v-34" stroke="#7d684c" strokeWidth="5" />
        <circle cx="93" cy="105" r="25" fill="#72ae79" /><circle cx="75" cy="117" r="17" fill="#80be83" />
        <path d="M399 151v-37" stroke="#7d684c" strokeWidth="5" />
        <circle cx="399" cy="96" r="27" fill="#77b57c" /><circle cx="419" cy="113" r="19" fill="#8bc68b" />
      </g>
      <g fill="#fff" opacity=".8">
        <circle cx="109" cy="34" r="13" /><circle cx="124" cy="34" r="18" /><circle cx="142" cy="37" r="12" />
        <circle cx="365" cy="32" r="11" /><circle cx="380" cy="29" r="17" /><circle cx="398" cy="34" r="12" />
      </g>
    </svg>
  );
}

function ComplaintIcon({ category }) {
  if (category === "Wi-Fi") return <Wifi size={23} />;
  if (category === "Water" || category === "Cleanliness" || category === "Hostel") return <Droplets size={23} />;
  if (category === "Electricity") return <Zap size={23} />;
  if (category === "Library") return <BookOpen size={23} />;
  return <ClipboardList size={23} />;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api.get("/complaints/my")
      .then(({ data }) => {
        if (active) setComplaints(data.complaints);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Could not load complaints");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const count = (status) => status
    ? complaints.filter((complaint) => complaint.status === status).length
    : complaints.length;
  const visibleComplaints = activeStatus
    ? complaints.filter((complaint) => complaint.status === activeStatus)
    : complaints;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";
  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "S";

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <div className="student-shell">
      <aside className="student-sidebar">
        <Link className="student-brand" to="/student">
          <span className="student-brand-icon"><GraduationCap size={25} /></span>
          <span>Campus<br />Connect</span>
        </Link>

        <nav className="student-nav" aria-label="Student navigation">
          <NavLink to="/student" end className={({ isActive }) => `student-nav-link${isActive ? " active" : ""}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => `student-nav-link${isActive ? " active" : ""}`}>
            <PlusSquare size={18} /> Report a Concern
          </NavLink>
          <a className="student-nav-link" href="#my-complaints">
            <ClipboardList size={18} /> My Complaints
          </a>
          <button className="student-nav-link" type="button" onClick={() => setProfileOpen((open) => !open)}>
            <UserRound size={18} /> Profile
          </button>
        </nav>

        <div className="student-sidebar-note">
          <GraduationCap size={22} />
          <span>Better campus.<br />Happier you.</span>
        </div>
      </aside>

      <div className="student-main">
        <header className="student-topbar">
          <span className="student-topbar-label">Student portal</span>
          <div className="student-profile-wrap">
            <button
              className="student-profile-button"
              type="button"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="student-avatar">{initials}</span>
              <span className="student-profile-name">{user?.name || "Student"}</span>
              <ChevronDown size={16} />
            </button>
            {profileOpen && (
              <div className="student-profile-menu">
                <strong>{user?.name || "Student"}</strong>
                <span>{user?.email}</span>
                <button type="button" onClick={signOut}><LogOut size={15} /> Sign out</button>
              </div>
            )}
          </div>
        </header>

        <main className="student-content">
          <section className="student-welcome">
            <div className="student-welcome-copy">
              <span className="student-welcome-kicker">Your campus, your voice</span>
              <h1>Welcome, {firstName}!</h1>
              <p>Report campus concerns, follow progress, and help make everyday college life better — all in one place.</p>
            </div>
            <CampusArtwork />
          </section>

          {error && <p className="student-error" role="alert">{error}</p>}

          <section className="student-stats" aria-label="Complaint summary">
            {statusCards.map(({ label, status, icon: Icon, color }) => (
              <button
                className={`student-stat ${color}${activeStatus === status ? " selected" : ""}`}
                key={label}
                type="button"
                aria-pressed={activeStatus === status}
                onClick={() => setActiveStatus(activeStatus === status ? "" : status)}
              >
                <span className="student-stat-icon"><Icon size={22} /></span>
                <span className="student-stat-copy">
                  <span>{label}</span>
                  <strong>{loading ? "—" : count(status)}</strong>
                </span>
                <ArrowRight className="student-stat-arrow" size={17} />
              </button>
            ))}
          </section>

          <div className="student-dashboard-grid">
            <section className="student-complaints-panel" id="my-complaints">
              <div className="student-section-heading">
                <div>
                  <h2><ClipboardList size={19} /> My Complaints</h2>
                  <p>Track the progress of your campus concerns.</p>
                </div>
                <Link className="student-primary-button" to="/submit"><Plus size={17} /> New Complaint</Link>
              </div>

              {loading ? (
                <div className="student-empty">Loading your complaints...</div>
              ) : visibleComplaints.length ? (
                <div className="student-complaint-list">
                  {visibleComplaints.map((complaint) => (
                    <article className="student-complaint" key={complaint._id}>
                      <span className={`student-complaint-icon category-${complaint.category.toLowerCase().replaceAll(" ", "-")}`}>
                        <ComplaintIcon category={complaint.category} />
                      </span>
                      <div className="student-complaint-details">
                        <div className="student-complaint-title-row">
                          <h3>{complaint.title}</h3>
                          <span className={`student-status status-${complaint.status.toLowerCase().replaceAll(" ", "-")}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p>{complaint.description}</p>
                        <div className="student-complaint-meta">
                          <span><CalendarDays size={14} /> {formatDate(complaint.createdAt)}</span>
                          <span>{complaint.category}</span>
                          <span>{complaint.priority} priority</span>
                          {complaint.imageUrl && (
                            <a href={complaint.imageUrl} target="_blank" rel="noreferrer">View image</a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="student-empty">
                  {activeStatus
                    ? `No ${activeStatus.toLowerCase()} complaints to show.`
                    : "No complaints yet. Submit a concern to get started."}
                  {activeStatus && <button type="button" onClick={() => setActiveStatus("")}>Clear filter</button>}
                </div>
              )}
            </section>

            <aside className="student-quick-actions">
              <h2><Bell size={19} /> Quick Actions</h2>
              <Link className="student-action-primary" to="/submit"><Plus size={18} /> Report a Concern</Link>
              <a className="student-action-secondary" href="#my-complaints"><ClipboardList size={18} /> Track Progress</a>
              <button className="student-action-secondary" type="button" onClick={() => setProfileOpen((open) => !open)}>
                <UserRound size={18} /> View Profile
              </button>
            </aside>
          </div>

          <footer className="student-footer">
            Campus Connect <span>·</span> Helping campuses listen and respond. <CheckCircle2 size={15} />
          </footer>
        </main>
      </div>
    </div>
  );
}

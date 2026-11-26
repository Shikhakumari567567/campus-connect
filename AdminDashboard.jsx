import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock3,
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
  UserRound
} from "lucide-react";
import api from "../services/api";
import "./AdminDashboard.css";

const categories = ["Hostel", "Classroom", "Wi-Fi", "Electricity", "Water", "Cleanliness", "Library", "Other"];
const statuses = [
  { value: "Pending", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Rejected", label: "Rejected" }
];
const priorities = ["Low", "Medium", "High"];

function displayStatus(status) {
  return status === "Pending" ? "Open" : status;
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [managingId, setManagingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const [complaintRes, statsRes] = await Promise.all([
        api.get("/admin/complaints", { params }),
        api.get("/admin/stats")
      ]);
      setComplaints(complaintRes.data.complaints);
      setStats(statsRes.data.stats);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin dashboard");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, priorityFilter, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id, status) {
    try {
      await api.patch(`/admin/complaints/${id}/status`, { status });
      setManagingId("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  }

  async function changePriority(id, priority) {
    try {
      await api.patch(`/admin/complaints/${id}/priority`, { priority });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Priority update failed");
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-heading">
        <div>
          <span className="admin-eyebrow"><ClipboardList size={15} /> Admin dashboard</span>
          <h1>System Management</h1>
          <p>Manage and monitor campus complaints effectively.</p>
        </div>
      </header>

      <section className="admin-stats" aria-label="Complaint summary">
        <article className="admin-stat stat-purple">
          <span>Total Complaints</span>
          <div><strong>{stats.total ?? 0}</strong><ClipboardList /></div>
        </article>
        <article className="admin-stat stat-blue">
          <span>Open</span>
          <div><strong>{stats.pending ?? 0}</strong><CircleAlert /></div>
        </article>
        <article className="admin-stat stat-amber">
          <span>In Progress</span>
          <div><strong>{stats.inProgress ?? 0}</strong><Clock3 /></div>
        </article>
        <article className="admin-stat stat-green">
          <span>Resolved</span>
          <div><strong>{stats.resolved ?? 0}</strong><CheckCircle2 /></div>
        </article>
      </section>

      <section className="admin-management">
        <div className="admin-management-heading">
          <div>
            <h2><SlidersHorizontal size={18} /> Complaints Management</h2>
            <p>View, filter, and manage student complaints.</p>
          </div>
          <span className="admin-result-count">{complaints.length} {complaints.length === 1 ? "result" : "results"}</span>
        </div>

        <div className="admin-filters">
          <label className="admin-search">
            <Search size={16} />
            <input
              aria-label="Search complaints"
              placeholder="Search complaints..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Statuses</option>
            {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select aria-label="Filter by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option value="">All Priorities</option>
            {priorities.map((priority) => <option key={priority} value={priority}>{priority} Priority</option>)}
          </select>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}

        {loading ? (
          <div className="admin-empty">Loading complaints...</div>
        ) : complaints.length ? (
          <div className="admin-complaints">
            {complaints.map((complaint) => (
              <article className="admin-complaint" key={complaint._id}>
                <div className="admin-complaint-top">
                  <div className="admin-tags">
                    <span className="admin-tag tag-id">Complaint</span>
                    <span className={`admin-tag tag-status status-${complaint.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {displayStatus(complaint.status)}
                    </span>
                    <span className={`admin-tag tag-priority priority-${complaint.priority.toLowerCase()}`}>
                      {complaint.priority} Priority
                    </span>
                    <span className="admin-tag tag-category">{complaint.category}</span>
                  </div>
                  <button
                    className="admin-manage-button"
                    type="button"
                    aria-expanded={managingId === complaint._id}
                    onClick={() => setManagingId(managingId === complaint._id ? "" : complaint._id)}
                  >
                    {managingId === complaint._id ? "Done" : "Manage"}
                  </button>
                </div>

                <h3>{complaint.title}</h3>
                <p className="admin-description">{complaint.description}</p>

                <div className="admin-complaint-footer">
                  <span><CalendarDays size={14} /> Submitted: {formatDate(complaint.createdAt)}</span>
                  <span><UserRound size={14} /> {complaint.student?.name || "Student"}</span>
                  {complaint.imageUrl && (
                    <a href={complaint.imageUrl} target="_blank" rel="noreferrer">
                      <ImageIcon size={14} /> View image
                    </a>
                  )}
                </div>

                {managingId === complaint._id && (
                  <div className="admin-manage-panel">
                    <label>
                      Status
                      <select value={complaint.status} onChange={(event) => changeStatus(complaint._id, event.target.value)}>
                        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                      </select>
                    </label>
                    <label>
                      Priority
                      <select value={complaint.priority} onChange={(event) => changePriority(complaint._id, event.target.value)}>
                        {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                      </select>
                    </label>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">No complaints match these filters.</div>
        )}
      </section>
    </main>
  );
}

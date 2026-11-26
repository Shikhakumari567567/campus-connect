export default function ComplaintCard({ complaint }) {
  return (
    <article className="card complaint-card">
      <div className="card-top">
        <span className={`status status-${complaint.status.toLowerCase().replaceAll(" ", "-")}`}>
          {complaint.status}
        </span>
        <span className="muted">{new Date(complaint.createdAt).toLocaleDateString()}</span>
      </div>
      <h3>{complaint.title}</h3>
      <p className="muted">{complaint.category} · {complaint.priority} priority</p>
      <p>{complaint.description}</p>
      {complaint.imageUrl && <a href={complaint.imageUrl} target="_blank" rel="noreferrer">View attached image</a>}
    </article>
  );
}

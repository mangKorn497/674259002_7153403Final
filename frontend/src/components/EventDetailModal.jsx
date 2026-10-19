import React from "react";

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "อบรม":
        return "badge-category badge-tech";
      case "สัมมนา":
        return "badge-category badge-science";
      case "จิตอาสา":
        return "badge-category badge-lit";
      default:
        return "badge-category";
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-header-icon">🎯</span>
            <div>
              <h3>รายละเอียดข้อมูลกิจกรรม</h3>
              <span className="modal-book-id">รหัสกิจกรรม #{event.id}</span>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-hero-box">
            <h4 className="detail-book-title">{event.title}</h4>
            <div className="detail-meta-row">
              <span className="detail-author">🏢 ผู้จัด: <strong>{event.organizer}</strong></span>
              <span className={`badge ${getCategoryBadge(event.category)}`}>
                {event.category === "อบรม" ? "🎓 " : event.category === "สัมมนา" ? "🎙️ " : "🤝 "}
                {event.category}
              </span>
            </div>
          </div>

          <div className="detail-grid-cards">
            <div className="detail-mini-card">
              <span className="mini-card-label">📅 วันที่จัด</span>
              <span className="mini-card-value">{event.eventDate}</span>
            </div>

            <div className="detail-mini-card">
              <span className="mini-card-label">⚡ สถานะข้อมูล</span>
              <span className={`badge status-pill ${event.status ? "badge-success" : "badge-draft"}`}>
                <span className={`status-dot ${event.status ? "dot-active" : "dot-draft"}`}></span>
                {event.status ? "เผยแพร่" : "ฉบับร่าง"}
              </span>
            </div>
          </div>

          <div className="detail-desc-box">
            <label className="detail-label">
              <span>📝 รายละเอียดกิจกรรม:</span>
            </label>
            <p className="detail-desc">{event.description}</p>
          </div>

          <div className="detail-timestamps">
            {event.createdAt && (
              <div className="timestamp-item">
                <span className="timestamp-label">สร้างเมื่อ:</span>
                <span className="timestamp-val">
                  {new Date(event.createdAt).toLocaleString("th-TH")}
                </span>
              </div>
            )}
            {event.updatedAt && (
              <div className="timestamp-item">
                <span className="timestamp-label">แก้ไขล่าสุด:</span>
                <span className="timestamp-val">
                  {new Date(event.updatedAt).toLocaleString("th-TH")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}


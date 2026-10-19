import React from "react";

export default function EventTable({
  events,
  loading,
  onView,
  onEdit,
  onDeleteClick,
}) {
  if (loading) {
    return (
      <div className="loading-box">
        <div className="spinner"></div>
        <p className="loading-text">กำลังโหลดข้อมูลกิจกรรมจากฐานข้อมูล...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="empty-box">
        <div className="empty-icon">📭</div>
        <h3>ไม่พบข้อมูลกิจกรรมในระบบ</h3>
        <p>ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา หรือยังไม่มีข้อมูลในระบบ</p>
      </div>
    );
  }

  const getCategoryClass = (cat) => {
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
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th style={{ width: "9%" }}>รหัส</th>
            <th style={{ width: "26%" }}>ชื่อกิจกรรม</th>
            <th style={{ width: "18%" }}>ผู้จัด</th>
            <th style={{ width: "15%" }}>หมวดหมู่</th>
            <th style={{ width: "13%" }}>วันที่จัด</th>
            <th style={{ width: "10%" }}>สถานะ</th>
            <th style={{ width: "9%" }} className="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <span className="book-id-badge">#{String(event.id).padStart(2, "0")}</span>
              </td>
              <td>
                <div className="book-title-cell">
                  <span className="book-title-text">{event.title}</span>
                </div>
              </td>
              <td>
                <span className="book-author-text">🏢 {event.organizer}</span>
              </td>
              <td>
                <span className={`badge ${getCategoryClass(event.category)}`}>
                  {event.category === "อบรม" ? "🎓 " : event.category === "สัมมนา" ? "🎙️ " : "🤝 "}
                  {event.category}
                </span>
              </td>
              <td>
                <span className="book-date-text">📅 {event.eventDate}</span>
              </td>
              <td>
                <span
                  className={`badge status-pill ${event.status ? "badge-success" : "badge-draft"}`}
                >
                  <span className={`status-dot ${event.status ? "dot-active" : "dot-draft"}`}></span>
                  {event.status ? "เผยแพร่" : "ฉบับร่าง"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-icon btn-view"
                    title="ดูรายละเอียดฉบับเต็ม"
                    onClick={() => onView(event)}
                  >
                    👁️
                  </button>
                  <button
                    type="button"
                    className="btn-icon btn-edit"
                    title="แก้ไขข้อมูลกิจกรรม"
                    onClick={() => onEdit(event)}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="btn-icon btn-delete"
                    title="ลบกิจกรรมออกจากระบบ"
                    onClick={() => onDeleteClick(event)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


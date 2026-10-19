import React from "react";

export default function DeleteConfirmModal({
  event,
  onConfirm,
  onCancel,
  isDeleting,
}) {
  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-header-icon text-danger">⚠️</span>
            <div>
              <h3>ยืนยันการลบข้อมูลกิจกรรม</h3>
              <span className="modal-sub">การดำเนินการนี้ไม่สามารถเรียกคืนได้</span>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onCancel}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-modal-msg">
            คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลกิจกรรมรายการนี้ออกจากระบบ?
          </p>

          <div className="delete-target-card">
            <div className="delete-target-id">รหัสกิจกรรม #{event.id}</div>
            <h4 className="delete-target-title">"{event.title}"</h4>
            <div className="delete-target-meta">
              <span>🏢 ผู้จัด: {event.organizer}</span>
              <span>📂 หมวด: {event.category}</span>
            </div>
          </div>

          <div className="danger-warning-box">
            <span className="warning-icon">🚨</span>
            <span className="danger-warning">
              ข้อมูลจะถูกลบออกจากฐานข้อมูล PostgreSQL อย่างถาวร และไม่สามารถกู้คืนได้
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn btn-danger-gradient"
            onClick={() => onConfirm(event.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "⏳ กำลังลบ..." : "🗑️ ยืนยันการลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}

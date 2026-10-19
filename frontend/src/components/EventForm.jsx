import React, { useState, useEffect } from "react";

const CATEGORIES = ["อบรม", "สัมมนา", "จิตอาสา"];

export default function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    category: "อบรม",
    eventDate: new Date().toISOString().split("T")[0],
    description: "",
    status: true,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        organizer: initialData.organizer || "",
        category: initialData.category || "อบรม",
        eventDate:
          initialData.eventDate || new Date().toISOString().split("T")[0],
        description: initialData.description || "",
        status:
          initialData.status !== undefined ? Boolean(initialData.status) : true,
      });
    } else {
      setFormData({
        title: "",
        organizer: "",
        category: "อบรม",
        eventDate: new Date().toISOString().split("T")[0],
        description: "",
        status: true,
      });
    }
    setFormErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ตรวจสอบข้อมูลก่อนส่ง (Client-side Validation) ตามเกณฑ์ข้อสอบ
  const validateForm = () => {
    const errors = {};

    if (!formData.title || formData.title.trim() === "") {
      errors.title = "กรุณาระบุชื่อกิจกรรม (ห้ามเป็นเฉพาะช่องว่าง)";
    } else if (formData.title.length > 150) {
      errors.title = "ชื่อกิจกรรมต้องยาวไม่เกิน 150 ตัวอักษร";
    }

    if (!formData.organizer || formData.organizer.trim() === "") {
      errors.organizer = "กรุณาระบุผู้จัด (ห้ามเป็นเฉพาะช่องว่าง)";
    } else if (formData.organizer.length > 100) {
      errors.organizer = "ผู้จัดต้องยาวไม่เกิน 100 ตัวอักษร";
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errors.category = "กรุณาเลือกหมวดหมู่ที่กำหนด (อบรม, สัมมนา, จิตอาสา)";
    }

    if (!formData.eventDate) {
      errors.eventDate = "กรุณาระบุวันที่จัด";
    }

    if (!formData.description || formData.description.trim() === "") {
      errors.description = "กรุณาระบุรายละเอียด (ห้ามเป็นเฉพาะช่องว่าง)";
    } else if (formData.description.length > 2000) {
      errors.description = "รายละเอียดต้องยาวไม่เกิน 2,000 ตัวอักษร";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      title: formData.title.trim(),
      organizer: formData.organizer.trim(),
      category: formData.category,
      eventDate: formData.eventDate,
      description: formData.description.trim(),
      status: formData.status,
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-card-header">
        <div className="form-header-title-wrap">
          <span className="form-header-icon">{initialData ? "✏️" : "✨"}</span>
          <div>
            <h3 className="form-title">
              {initialData ? "แก้ไขข้อมูลกิจกรรม" : "เพิ่มกิจกรรมใหม่"}
            </h3>
            <p className="form-subtitle">
              {initialData
                ? `กำลังแก้ไขรายการรหัส #${initialData.id}`
                : "กรอกข้อมูลเพื่อบันทึกลงระบบฐานข้อมูล"}
            </p>
          </div>
        </div>
        {initialData && (
          <span className="editing-badge">โหมดแก้ไข #{initialData.id}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">
          <span className="field-icon">🎯</span> ชื่อกิจกรรม <span className="req">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
          placeholder="เช่น อบรมเชิงปฏิบัติการพัฒนา Web Services ด้วย Node.js"
          value={formData.title}
          onChange={handleChange}
        />
        {formErrors.title && (
          <div className="error-text">⚠️ {formErrors.title}</div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group col-half">
          <label htmlFor="organizer">
            <span className="field-icon">🏢</span> ผู้จัด (Organizer) <span className="req">*</span>
          </label>
          <input
            id="organizer"
            name="organizer"
            type="text"
            className={`form-control ${formErrors.organizer ? "is-invalid" : ""}`}
            placeholder="เช่น สาขาวิชาเทคโนโลยีสารสนเทศ"
            value={formData.organizer}
            onChange={handleChange}
          />
          {formErrors.organizer && (
            <div className="error-text">⚠️ {formErrors.organizer}</div>
          )}
        </div>

        <div className="form-group col-half">
          <label htmlFor="category">
            <span className="field-icon">🏷️</span> หมวดหมู่ <span className="req">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`form-control select-control ${formErrors.category ? "is-invalid" : ""}`}
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "อบรม" ? "🎓 " : cat === "สัมมนา" ? "🎙️ " : "🤝 "}
                {cat}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <div className="error-text">⚠️ {formErrors.category}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-half">
          <label htmlFor="eventDate">
            <span className="field-icon">📅</span> วันที่จัด <span className="req">*</span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            className={`form-control ${formErrors.eventDate ? "is-invalid" : ""}`}
            value={formData.eventDate}
            onChange={handleChange}
          />
          {formErrors.eventDate && (
            <div className="error-text">⚠️ {formErrors.eventDate}</div>
          )}
        </div>

        <div className="form-group col-half">
          <label htmlFor="status">
            <span className="field-icon">⚡</span> สถานะข้อมูล
          </label>
          <div className="status-toggle-group">
            <button
              type="button"
              className={`status-toggle-btn ${formData.status ? "active-published" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, status: true }))}
            >
              🟢 เผยแพร่
            </button>
            <button
              type="button"
              className={`status-toggle-btn ${!formData.status ? "active-draft" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, status: false }))}
            >
              🟡 ฉบับร่าง
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          <span className="field-icon">📝</span> รายละเอียด <span className="req">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
          placeholder="กรอกเนื้อหารายละเอียดของกิจกรรม ไม่เกิน 2,000 ตัวอักษร..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <div className="char-count">
          <span>{formData.description.length} / 2,000 ตัวอักษร</span>
        </div>
        {formErrors.description && (
          <div className="error-text">⚠️ {formErrors.description}</div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className={`btn ${initialData ? "btn-warning-gradient" : "btn-primary-gradient"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>⏳ กำลังบันทึก...</span>
          ) : initialData ? (
            <span>💾 บันทึกการแก้ไข</span>
          ) : (
            <span>➕ บันทึกข้อมูลกิจกรรม</span>
          )}
        </button>
        {initialData && (
          <button
            type="button"
            className="btn btn-secondary-outline"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}


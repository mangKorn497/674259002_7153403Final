import React, { useState, useEffect } from "react";
import eventService from "../services/api";
import SearchBar from "../components/SearchBar";
import EventTable from "../components/EventTable";
import EventForm from "../components/EventForm";
import EventDetailModal from "../components/EventDetailModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger', message: '' }

  // สถานะค้นหาและกรอง
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // สถานะฟอร์ม (แก้ไข/เพิ่ม)
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // สถานะโมดอล
  const [viewingEvent, setViewingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // แสดงการแจ้งเตือนชั่วคราว
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // ดึงข้อมูลกิจกรรมจาก Backend API
  const fetchEvents = async (
    currentSearch = search,
    currentCategory = category,
  ) => {
    setLoading(true);
    try {
      const response = await eventService.getAll(currentSearch, currentCategory);
      setEvents(response.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      const msg =
        error.response?.data?.message ||
        "ไม่สามารถติดต่อเซิร์ฟเวอร์ Backend ได้";
      showAlert(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // เมื่อกดค้นหา
  const handleSearch = () => {
    fetchEvents(search, category);
  };

  // ล้างเงื่อนไขการค้นหา
  const handleResetSearch = () => {
    setSearch("");
    setCategory("");
    fetchEvents("", "");
  };

  // เพิ่มหรือแก้ไขข้อมูล
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        // แก้ไขข้อมูล PUT /api/events/:id
        await eventService.update(editingEvent.id, formData);
        showAlert(
          `แก้ไขข้อมูลกิจกรรม "${formData.title}" เรียบร้อยแล้ว`,
          "success",
        );
        setEditingEvent(null);
      } else {
        // เพิ่มข้อมูลใหม่ POST /api/events
        await eventService.create(formData);
        showAlert(`เพิ่มกิจกรรม "${formData.title}" สำเร็จแล้ว`, "success");
      }
      fetchEvents();
    } catch (error) {
      console.error("Save error:", error);
      const msg =
        error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      showAlert(msg, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  // ยืนยันการลบ DELETE /api/events/:id
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await eventService.delete(id);
      showAlert(`ลบข้อมูลกิจกรรมรหัส #${id} สำเร็จแล้ว`, "success");
      setDeletingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Delete error:", error);
      const msg =
        error.response?.data?.message || "เกิดข้อผิดพลาดในการลบข้อมูล";
      showAlert(msg, "danger");
    } finally {
      setIsDeleting(false);
    }
  };

  // สถิติข้อมูลกิจกรรม
  const stats = {
    total: events.length,
    training: events.filter((e) => e.category === "อบรม").length,
    seminar: events.filter((e) => e.category === "สัมมนา").length,
    volunteer: events.filter((e) => e.category === "จิตอาสา").length,
    published: events.filter((e) => e.status).length,
  };

  const handleStatCardClick = (targetCat) => {
    if (category === targetCat) {
      setCategory("");
      fetchEvents(search, "");
    } else {
      setCategory(targetCat);
      fetchEvents(search, targetCat);
    }
  };

  return (
    <div className="app-container">
      {/* Modern Hero Header */}
      <header className="app-header">
        <div className="header-top-row">
          <div className="header-brand">
            <div className="brand-icon">🎯</div>
            <div className="brand-info">
              <h1>ระบบบริหารจัดการข้อมูลกิจกรรม</h1>
              <p className="subtitle">
                รายวิชา 7153403 เทคโนโลยีการบริการเว็บ (Web Services Technology) — ชุดที่ 4 (D)
              </p>
            </div>
          </div>
          <div className="header-badges">
            <span className="live-status-badge">
              <span className="pulse-dot"></span>
              Docker & API Online
            </span>
            <button
              type="button"
              className="btn-refresh"
              onClick={() => fetchEvents()}
              title="ดึงข้อมูลล่าสุด"
            >
              🔄 รีเฟรช
            </button>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="stats-grid">
          <div
            className={`stat-card stat-all ${category === "" ? "stat-active" : ""}`}
            onClick={() => handleStatCardClick("")}
            title="คลิกเพื่อดูกิจกรรมทั้งหมด"
          >
            <div className="stat-icon-wrap bg-indigo">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">กิจกรรมทั้งหมด</div>
            </div>
          </div>

          <div
            className={`stat-card stat-tech ${category === "อบรม" ? "stat-active" : ""}`}
            onClick={() => handleStatCardClick("อบรม")}
            title="คลิกเพื่อกรองเฉพาะหมวดอบรม"
          >
            <div className="stat-icon-wrap bg-blue">🎓</div>
            <div className="stat-content">
              <div className="stat-number">{stats.training}</div>
              <div className="stat-label">อบรม</div>
            </div>
          </div>

          <div
            className={`stat-card stat-science ${category === "สัมมนา" ? "stat-active" : ""}`}
            onClick={() => handleStatCardClick("สัมมนา")}
            title="คลิกเพื่อกรองเฉพาะหมวดสัมมนา"
          >
            <div className="stat-icon-wrap bg-emerald">🎙️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.seminar}</div>
              <div className="stat-label">สัมมนา</div>
            </div>
          </div>

          <div
            className={`stat-card stat-lit ${category === "จิตอาสา" ? "stat-active" : ""}`}
            onClick={() => handleStatCardClick("จิตอาสา")}
            title="คลิกเพื่อกรองเฉพาะหมวดจิตอาสา"
          >
            <div className="stat-icon-wrap bg-amber">🤝</div>
            <div className="stat-content">
              <div className="stat-number">{stats.volunteer}</div>
              <div className="stat-label">จิตอาสา</div>
            </div>
          </div>

          <div className="stat-card stat-published">
            <div className="stat-icon-wrap bg-green">🟢</div>
            <div className="stat-content">
              <div className="stat-number">{stats.published}</div>
              <div className="stat-label">สถานะเผยแพร่</div>
            </div>
          </div>
        </div>
      </header>

      {/* แจ้งเตือนสถานะผลลัพธ์ */}
      {alert && (
        <div className={`alert-banner alert-${alert.type}`}>
          <div className="alert-content">
            <span className="alert-icon">
              {alert.type === "success" ? "✅" : "⚠️"}
            </span>
            <span>{alert.message}</span>
          </div>
          <button
            type="button"
            className="close-alert"
            onClick={() => setAlert(null)}
          >
            &times;
          </button>
        </div>
      )}

      <main className="main-content">
        {/* แถบด้านซ้าย: แบบฟอร์มเพิ่ม/แก้ไขกิจกรรม */}
        <section className="form-section">
          <EventForm
            initialData={editingEvent}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        </section>

        {/* แถบด้านขวา: ค้นหา + ตารางกิจกรรม */}
        <section className="table-section">
          <div className="section-card">
            <SearchBar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              onSearch={handleSearch}
              onReset={handleResetSearch}
            />

            <div className="table-header-info">
              <div className="table-header-left">
                <h2>📋 รายการกิจกรรมในระบบ</h2>
                <span className="table-counter-pill">
                  แสดง {events.length} รายการ {category && `(หมวด: ${category})`}
                </span>
              </div>
            </div>

            <EventTable
              events={events}
              loading={loading}
              onView={(event) => setViewingEvent(event)}
              onEdit={(event) => {
                setEditingEvent(event);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDeleteClick={(event) => setDeletingEvent(event)}
            />
          </div>
        </section>
      </main>

      {/* โมดอลแสดงรายละเอียดกิจกรรม */}
      {viewingEvent && (
        <EventDetailModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
        />
      )}

      {/* โมดอลยืนยันลบกิจกรรม */}
      {deletingEvent && (
        <DeleteConfirmModal
          event={deletingEvent}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingEvent(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

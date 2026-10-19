import React from "react";

const CATEGORIES = ["อบรม", "สัมมนา", "จิตอาสา"];

export default function SearchBar({
  search,
  setSearch,
  category,
  setCategory,
  onSearch,
  onReset,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleCategoryClick = (cat) => {
    const newCat = category === cat ? "" : cat;
    setCategory(newCat);
  };

  return (
    <div className="search-bar-wrapper">
      <form className="search-bar-container" onSubmit={handleSubmit}>
        <div className="search-group search-input-group">
          <label htmlFor="search-input">
            <span className="search-label-icon">🔍</span> ค้นหาจากชื่อกิจกรรม:
          </label>
          <div className="input-with-icon">
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="พิมพ์ชื่อกิจกรรมที่ต้องการค้นหา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-input-btn"
                title="ล้างข้อความ"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="search-group search-select-group">
          <label htmlFor="category-filter">
            <span className="search-label-icon">📂</span> หมวดหมู่:
          </label>
          <select
            id="category-filter"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- ทุกหมวดหมู่ --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="search-actions">
          <button type="submit" className="btn btn-primary btn-search">
            <span>🔍 ค้นหา</span>
          </button>
          <button type="button" className="btn btn-secondary btn-reset" onClick={onReset}>
            <span>🔄 รีเซ็ต</span>
          </button>
        </div>
      </form>

      {/* Quick Filter Pills */}
      <div className="quick-filter-pills">
        <span className="quick-filter-label">หมวดหมู่ด่วน:</span>
        <button
          type="button"
          className={`pill-btn ${category === "" ? "active" : ""}`}
          onClick={() => setCategory("")}
        >
          ทั้งหมด
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill-btn pill-${cat} ${category === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat === "อบรม" ? "🎓 " : cat === "สัมมนา" ? "🎙️ " : "🤝 "}
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

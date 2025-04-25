import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css";

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://localhost:7007/api/Categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: formData.categoryName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      navigate("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-create">
      <div className="category-create-header">
        <h2>Thêm danh mục mới</h2>
      </div>
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="categoryName">Tên danh mục</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Thêm danh mục
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/categories")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreate;

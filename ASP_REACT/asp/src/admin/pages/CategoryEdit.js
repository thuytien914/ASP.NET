import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CategoryList.css";

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `https://localhost:7007/api/Categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "text/plain",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }

        const data = await response.json();
        setFormData({
          categoryName: data.categoryName,
        });
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
      }
    };

    fetchCategory();
  }, [id]);

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

      const response = await fetch(
        `https://localhost:7007/api/Categories/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryId: parseInt(id),
            categoryName: formData.categoryName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      navigate("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-edit">
      <div className="category-edit-header">
        <h2>Chỉnh sửa danh mục</h2>
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
            Cập nhật
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

export default CategoryEdit;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://localhost:7007/api/Categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "text/plain",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `https://localhost:7007/api/Categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "text/plain",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        setCategories(
          categories.filter((category) => category.categoryId !== id)
        );
      } catch (err) {
        console.error("Error deleting category:", err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-list">
      <div className="category-list-header">
        <h2>Danh sách danh mục</h2>
        <Link to="/admin/categories/create" className="btn-create">
          <i className="fas fa-plus"></i>
          Thêm danh mục
        </Link>
      </div>
      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.categoryName}</td>
                <td className="actions">
                  <Link
                    to={`/admin/categories/${category.categoryId}/edit`}
                    className="btn-edit"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(category.categoryId)}
                    className="btn-delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;

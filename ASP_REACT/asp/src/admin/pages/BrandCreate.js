import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css";

const BrandCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    brandName: "",
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
      const response = await fetch("https://localhost:7007/api/Brand", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: formData.brandName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create brand");
      }

      navigate("/admin/brands");
    } catch (err) {
      console.error("Error creating brand:", err);
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="brand-create">
      <div className="brand-create-header">
        <h2>Thêm thương hiệu mới</h2>
      </div>
      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label htmlFor="brandName">Tên thương hiệu</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Thêm thương hiệu
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/brands")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandCreate;

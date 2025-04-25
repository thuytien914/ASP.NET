import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CategoryList.css";

const BrandEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    brandName: "",
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`https://localhost:7007/api/Brand/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "text/plain",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch brand");
        }

        const data = await response.json();
        setFormData({
          brandName: data.brandName,
        });
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError(err.message);
      }
    };

    fetchBrand();
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

      const response = await fetch(`https://localhost:7007/api/Brand/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId: parseInt(id),
          brandName: formData.brandName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update brand");
      }

      navigate("/admin/brands");
    } catch (err) {
      console.error("Error updating brand:", err);
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="brand-edit">
      <div className="brand-edit-header">
        <h2>Chỉnh sửa thương hiệu</h2>
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
            Cập nhật
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

export default BrandEdit;

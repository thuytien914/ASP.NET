import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrandList.css";

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7007/api/Brand", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();
      setBrands(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (brandId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7007/api/Brand/${brandId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }

      // Refresh the brands list
      fetchBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="brand-list">
      <div className="brand-list-header">
        <h2>Danh sách thương hiệu</h2>
        <Link to="/admin/brands/create" className="btn-add">
          <i className="fas fa-plus"></i>
          Thêm thương hiệu mới
        </Link>
      </div>

      <div className="brand-grid">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.brandId}>
                <td>{brand.brandId}</td>
                <td>{brand.brandName}</td>
                <td className="actions">
                  <Link
                    to={`/admin/brands/${brand.brandId}/edit`}
                    className="btn-edit"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(brand.brandId)}
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

export default BrandList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCreate.css";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    image: "",
    price: "",
    priceSale: "",
    content: "",
    categoryId: "",
    brandId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 1,
  });

  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchCategoriesAndBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "text/plain",
      };

      const [categoriesRes, brandsRes] = await Promise.all([
        fetch("https://localhost:7007/api/Categories", {
          method: "GET",
          headers,
        }),
        fetch("https://localhost:7007/api/Brand", {
          method: "GET",
          headers,
        }),
      ]);

      if (!categoriesRes.ok || !brandsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [categoriesData, brandsData] = await Promise.all([
        categoriesRes.json(),
        brandsRes.json(),
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

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

      const response = await fetch("https://localhost:7007/api/Product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: 0,
          productName: formData.productName,
          image: formData.image,
          price: parseFloat(formData.price),
          priceSale: parseFloat(formData.priceSale),
          content: formData.content,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt,
          brandId: parseInt(formData.brandId),
          categoryId: parseInt(formData.categoryId),
          userId: formData.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-create">
      <div className="product-create-header">
        <h2>Thêm sản phẩm mới</h2>
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Tên sản phẩm</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Tên file hình ảnh</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="Ví dụ: product.jpg"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priceSale">Giá khuyến mãi</label>
            <input
              type="number"
              id="priceSale"
              name="priceSale"
              value={formData.priceSale}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Mô tả</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoryId">Danh mục</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brandId">Thương hiệu</label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Thêm sản phẩm
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;

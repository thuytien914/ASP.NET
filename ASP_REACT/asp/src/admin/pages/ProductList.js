import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "text/plain",
      };

      // Fetch all data in parallel
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch("https://localhost:7007/api/Product", {
          method: "GET",
          headers: headers,
        }),
        fetch("https://localhost:7007/api/Categories", {
          method: "GET",
          headers: headers,
        }),
        fetch("https://localhost:7007/api/Brand", {
          method: "GET",
          headers: headers,
        }),
      ]);

      if (!productsRes.ok || !categoriesRes.ok || !brandsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [productsData, categoriesData, brandsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        brandsRes.json(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `https://localhost:7007/api/Product/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "text/plain",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((product) => product.productId !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError(err.message);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.categoryName : "N/A";
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : "N/A";
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Danh sách sản phẩm</h2>
        <Link to="/admin/products/create" className="btn-create">
          <i className="fas fa-plus"></i>
          Thêm sản phẩm
        </Link>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Giá khuyến mãi</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  <img
                    src={`/images/${product.image}`}
                    alt={product.productName}
                    className="product-image"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{product.productName}</td>
                <td>{product.price.toLocaleString("vi-VN")}đ</td>
                <td>{product.priceSale.toLocaleString("vi-VN")}đ</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{getBrandName(product.brandId)}</td>
                <td>
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="actions">
                  <Link
                    to={`/admin/products/${product.productId}/edit`}
                    className="btn-edit"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.productId)}
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

export default ProductList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductNew.css";

const ProductNew = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://localhost:7007/api/Product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Bước 1: Lọc trùng theo productName
        const uniqueByName = Array.from(
          new Map(res.data.map((item) => [item.productName, item])).values()
        );

        // Bước 2: Sắp xếp theo ngày tạo mới nhất
        const sorted = uniqueByName
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4); // Bước 3: Lấy 4 sản phẩm mới nhất

        setProducts(sorted);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="new-product-grid">
      {products.map((product) => (
        <Link
          to={`/product/${product.productId}`}
          key={product.productId}
          className="new-product-card"
        >
          <div className="new-product-image-wrapper">
            <img
              src={`/images/${product.image}`}
              alt={product.productName}
              className="new-product-image"
            />
            <div className="new-product-overlay">
              <i className="fas fa-eye"></i>
            </div>
          </div>
          <h3 className="new-product-title">{product.productName}</h3>
          <p className="new-product-price">
            Giá: {product.price.toLocaleString()}đ
          </p>
          <p className="new-product-date">
            Ngày tạo: {new Date(product.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductNew;

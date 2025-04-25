import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductSale.css";

const ProductSale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7007/api/Product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 1. Lọc sản phẩm có priceSale > 0
        const saleProducts = response.data.filter((p) => p.priceSale > 0);

        // 2. Loại bỏ trùng lặp theo tên sản phẩm (giữ lại sản phẩm có giảm giá cao nhất)
        const productsByName = {};
        saleProducts.forEach((product) => {
          const discount =
            ((product.price - product.priceSale) / product.price) * 100;
          if (
            !productsByName[product.productName] ||
            discount >
              ((productsByName[product.productName].price -
                productsByName[product.productName].priceSale) /
                productsByName[product.productName].price) *
                100
          ) {
            productsByName[product.productName] = product;
          }
        });

        // 3. Chuyển đổi object thành array
        const uniqueProducts = Object.values(productsByName);

        // 4. Sắp xếp theo phần trăm giảm giá từ cao xuống thấp
        const sortedProducts = uniqueProducts.sort((a, b) => {
          const discountA = ((a.price - a.priceSale) / a.price) * 100;
          const discountB = ((b.price - b.priceSale) / b.price) * 100;
          return discountB - discountA;
        });

        // 5. Lấy 4 sản phẩm giảm giá nhiều nhất
        setProducts(sortedProducts.slice(0, 4));
      } catch (err) {
        console.error("Error fetching sale products:", err);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="sale-loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="sale-error">{error}</div>;
  if (products.length === 0) return <div>Không có sản phẩm khuyến mãi</div>;

  return (
    <div className="sale-product-section">
      <h2 className="sale-section-title">Sản phẩm Sale</h2>
      <div className="sale-product-grid">
        {products.map((product) => {
          const discountPercent = Math.round(
            ((product.price - product.priceSale) / product.price) * 100
          );

          return (
            <Link
              to={`/product/${product.productId}`}
              key={product.productId}
              className="sale-product-card"
            >
              <div className="sale-badge">-{discountPercent}%</div>

              <div className="sale-product-image-wrapper">
                <img
                  src={`/images/${product.image}`}
                  alt={product.productName}
                  className="sale-product-image"
                />
                <div className="sale-product-overlay">
                  <i className="fas fa-eye"></i>
                </div>
              </div>

              <h3 className="sale-product-title">{product.productName}</h3>

              <div className="sale-price-container">
                <p className="sale-original-price">
                  {product.price.toLocaleString()}đ
                </p>
                <p className="sale-price">
                  {product.priceSale.toLocaleString()}đ
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSale;

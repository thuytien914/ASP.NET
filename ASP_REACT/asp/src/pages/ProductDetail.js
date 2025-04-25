import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://localhost:7007/api/Product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Sử dụng tên sản phẩm làm nội dung mô tả
        response.data.content = `${response.data.productName} là một loại nước hoa cao cấp với hương thơm độc đáo và quyến rũ. Sản phẩm mang đến trải nghiệm thơm mát, sang trọng và đẳng cấp.`;
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.productId === product.productId
    );

    const productToAdd = {
      productId: product.productId,
      productName: product.productName,
      productImage: product.image,
      quantity: quantity,
      unitPrice: product.priceSale > 0 ? product.priceSale : product.price,
    };

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    alert(`${quantity} ${product.productName} đã được thêm vào giỏ hàng!`);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-image-section">
          <img
            src={`/images/${product.image}`}
            alt={product.productName}
            className="product-detail-image"
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-detail-title">{product.productName}</h1>

          <div className="product-detail-prices">
            {product.priceSale > 0 ? (
              <>
                <p className="original-price">
                  {product.price.toLocaleString()}đ
                </p>
                <p className="sale-price">
                  {product.priceSale.toLocaleString()}đ
                </p>
                <span className="discount-badge">
                  -
                  {Math.round(
                    ((product.price - product.priceSale) / product.price) * 100
                  )}
                  %
                </span>
              </>
            ) : (
              <p className="regular-price">{product.price.toLocaleString()}đ</p>
            )}
          </div>

          <div className="product-detail-content">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.content}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={decreaseQuantity}>
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button className="quantity-btn" onClick={increaseQuantity}>
                +
              </button>
            </div>
            <button className="add-to-cart-btn" onClick={addToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>

          <div className="product-meta">
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
            {product.brand && (
              <p>
                <strong>Thương hiệu:</strong> {product.brand.name}
              </p>
            )}
            {product.category && (
              <p>
                <strong>Danh mục:</strong> {product.category.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

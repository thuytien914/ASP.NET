import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState(null); // State for main order info
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const token = localStorage.getItem("token");
        // Fetch main order info (assuming endpoint /api/Orders/{orderId})
        const orderInfoResponse = await fetch(
          `https://localhost:7007/api/Orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!orderInfoResponse.ok) {
          throw new Error(
            `Failed to fetch order info (status: ${orderInfoResponse.status})`
          );
        }
        const orderInfoData = await orderInfoResponse.json();
        setOrderInfo(orderInfoData);

        // Fetch order details
        const orderDetailsResponse = await fetch(
          `https://localhost:7007/api/OrderDetails/by-order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!orderDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch order details (status: ${orderDetailsResponse.status})`
          );
        }
        const orderDetailsData = await orderDetailsResponse.json();
        setOrderDetails(orderDetailsData);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setError(error.message); // Set error state
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle case where dateString might be null/undefined
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    // Check if the date is valid before formatting
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("vi-VN", options);
  };

  if (loading) {
    return <div className="loading">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <Link to="/orders" className="back-button">
          ← Quay lại
        </Link>
        <div className="error-message">Lỗi tải dữ liệu: {error}</div>
      </div>
    );
  }

  // Check if orderInfo is loaded before trying to access its properties
  if (!orderInfo) {
    return (
      <div className="order-detail-page">
        <Link to="/orders" className="back-button">
          ← Quay lại
        </Link>
        <div>Không tìm thấy thông tin đơn hàng chính.</div>
      </div>
    );
  }

  // Use totalAmount from orderInfo if available, otherwise keep the calculation as fallback (optional)
  const displayTotalAmount = orderInfo.totalAmount;

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="back-button">
        ← Quay lại
      </Link>

      <div className="order-detail-header">
        <h1>Chi Tiết Đơn Hàng #{orderId}</h1>
        <div className="order-info">
          <div className="order-info-item">
            {/* Use orderDate from orderInfo state */}
            <strong>Ngày đặt:</strong> {formatDate(orderInfo.orderDate)}
          </div>
          {/* You can add other info from orderInfo here, e.g., address */}
          <div className="order-info-item">
            <strong>Địa chỉ:</strong> {orderInfo.address || "N/A"}
          </div>
        </div>
      </div>

      {/* Check if orderDetails has items before mapping */}
      {orderDetails.length > 0 ? (
        <div className="order-items">
          {orderDetails.map((item) => (
            <div key={item.orderDetailId} className="order-item">
              <img
                src={`/images/${item.productImage}`}
                alt={item.productName}
                className="order-item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.png";
                }} // Optional: Add placeholder on image error
              />
              <div className="order-item-details">
                <div className="order-item-name">{item.productName}</div>
                <div className="order-item-price">
                  Đơn giá: {item.unitPrice.toLocaleString()}đ
                </div>
                <div className="order-item-quantity">
                  Số lượng: {item.quantity}
                </div>
              </div>
              <div className="order-item-total">
                {item.total.toLocaleString()}đ
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-items-message">
          Đơn hàng này không có sản phẩm chi tiết.
        </div>
      )}

      <div className="order-summary">
        <div className="order-total">
          <span>Tổng cộng:</span>
          {/* Use totalAmount from orderInfo state */}
          <span>{displayTotalAmount.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          navigate("/login");
          return;
        }
        const user = JSON.parse(userStr);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://localhost:7007/api/Orders/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return <div className="no-orders">Bạn chưa có đơn hàng nào.</div>;
  }

  return (
    <div className="orders-page">
      <h1>Đơn Hàng Của Tôi</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="order-card"
            onClick={() => handleOrderClick(order.orderId)}
          >
            <div className="order-header">
              <span className="order-id">Đơn hàng #{order.orderId}</span>
              <span className="order-date">{formatDate(order.orderDate)}</span>
            </div>

            <div className="order-preview">
              {order.orderDetails.map((detail) => (
                <div key={detail.orderDetailId} className="preview-item">
                  <img
                    src={`/images/${detail.productImage}`}
                    alt={detail.productName}
                  />
                  <div className="preview-item-details">
                    <div className="preview-item-name">
                      {detail.productName}
                    </div>
                    <div className="preview-item-quantity">
                      SL: {detail.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              Tổng tiền: {order.totalAmount.toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

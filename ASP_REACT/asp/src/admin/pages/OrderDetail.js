import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7007/api/Orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Không tìm thấy đơn hàng</div>;

  return (
    <div className="order-detail">
      <div className="order-detail-header">
        <h2>Chi tiết đơn hàng #{order.orderId}</h2>
        <Link to="/admin/orders" className="btn-back">
          <i className="fas fa-arrow-left"></i>
          Quay lại
        </Link>
      </div>

      <div className="order-info">
        <div className="info-group">
          <label>Ngày đặt:</label>
          <span>{formatDate(order.orderDate)}</span>
        </div>
        <div className="info-group">
          <label>Tổng tiền:</label>
          <span>{order.totalAmount.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="info-group">
          <label>Địa chỉ:</label>
          <span>{order.address || "Chưa có"}</span>
        </div>
      </div>

      <div className="order-items">
        <h3>Sản phẩm trong đơn</h3>
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item) => (
              <tr key={item.orderDetailId}>
                <td>
                  <img
                    src={`/images/${item.productImage}`}
                    alt={item.productName}
                    className="product-image"
                  />
                </td>
                <td>{item.productName}</td>
                <td>{item.unitPrice.toLocaleString("vi-VN")}đ</td>
                <td>{item.quantity}</td>
                <td>
                  {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;

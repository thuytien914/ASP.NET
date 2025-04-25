import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch all required data in parallel
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          fetch("https://localhost:7007/api/Product", { headers }),
          fetch("https://localhost:7007/api/Orders", { headers }),
          fetch("https://localhost:7007/api/User", { headers }),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();
        const customers = await customersRes.json();

        // Calculate total revenue from orders by summing up totalAmount
        const totalRevenue = orders.reduce((sum, order) => {
          // Ensure we're using the correct property name and converting to number
          const amount = parseFloat(order.totalAmount) || 0;
          return sum + amount;
        }, 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalRevenue: totalRevenue,
        });
        setLoading(false);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Đang tải...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Tổng quan</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>Sản phẩm</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>Đơn hàng</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Khách hàng</h3>
            <p className="stat-number">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-content">
            <h3>Doanh thu</h3>
            <p className="stat-number">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

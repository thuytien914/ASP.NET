import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      // Redirect back to cart or home if cart is empty
      alert("Giỏ hàng của bạn đang trống. Không thể thanh toán.");
      navigate("/cart");
    } else {
      setCartItems(storedCart);
    }
    setLoading(false);
  }, [navigate]);

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Handle placing the order (API call)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    // Get userId from localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    const userId = user.userId;

    const orderDetails = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const payload = {
      orderDate: new Date().toISOString(),
      totalAmount: totalAmount,
      userId,
      address: address.trim(), // Add the address
      orderDetails,
    };

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7007/api/Orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(
          `Đặt hàng thất bại: ${response.statusText} ${JSON.stringify(
            errorData
          )}`
        );
      }

      const data = await response.json();
      console.log("Order placed successfully:", data);
      alert("Đặt hàng thành công!");

      // Clear the cart from localStorage and notify header
      localStorage.removeItem("cart");
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      // Redirect to a success page or home page
      navigate("/"); // Redirect to home for now
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert(`Lỗi đặt hàng: ${err.message}`);
      setIsPlacingOrder(false); // Re-enable button on error
    }
    // No finally block needed here as navigation happens on success
  };

  if (loading) {
    return <div className="checkout-loading">Đang tải trang thanh toán...</div>;
  }

  // This check is redundant because useEffect handles redirection, but kept for safety
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="checkout-empty">
        Giỏ hàng trống. <Link to="/">Quay lại trang chủ</Link>.
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Thanh Toán Đơn Hàng</h1>
      <div className="checkout-container">
        {/* Shipping Information Form */}
        <div className="checkout-shipping">
          <h2>Thông Tin Giao Hàng</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ giao hàng:</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows="3"
                required
              />
            </div>
            {/* Add other fields like name, phone number if needed */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Đang xử lý..." : "Đặt Hàng"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Tóm Tắt Đơn Hàng</h2>
          {cartItems.map((item) => (
            <div key={item.productId} className="checkout-summary-item">
              <span>
                {item.productName} (x{item.quantity})
              </span>
              <span>{(item.quantity * item.unitPrice).toLocaleString()}đ</span>
            </div>
          ))}
          <div className="checkout-summary-total">
            <span>Tổng cộng:</span>
            <span>{totalAmount.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

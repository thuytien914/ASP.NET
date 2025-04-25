import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    setLoading(false);
  }, []);

  // Function to update cart in state and localStorage
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Dispatch event here as well
  };

  // Handle quantity increase
  const increaseQuantity = (productId) => {
    const newCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  // Handle quantity decrease
  const decreaseQuantity = (productId) => {
    let newCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    // Optional: remove item if quantity becomes 0 (depends on requirements)
    // newCart = newCart.filter(item => item.quantity > 0);
    updateCart(newCart);
  };

  // Handle item removal
  const removeItem = (productId) => {
    const newCart = cartItems.filter(item => item.productId !== productId);
    updateCart(newCart);
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice, 0
  );

  // Renamed function: Navigates to checkout page
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    // Navigate to the checkout page
    navigate('/checkout'); 
  };

  if (loading) {
    return <div className="cart-loading">Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="cart-page">
      <h1>Giỏ Hàng Của Bạn</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Giỏ hàng đang trống</h2>
          <Link to="/">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={`/images/${item.productImage}`} alt={item.productName} className="cart-item-image" />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.productName}</p>
                  <p className="cart-item-price">Đơn giá: {item.unitPrice.toLocaleString()}đ</p>
                </div>
                <div className="cart-item-quantity">
                  <label>Số lượng</label>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                    <input type="text" value={item.quantity} readOnly className="quantity-input"/>
                    <button onClick={() => increaseQuantity(item.productId)}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  Tổng: {(item.quantity * item.unitPrice).toLocaleString()}đ
                </div>
                <div className="cart-item-remove">
                  <button onClick={() => removeItem(item.productId)} className="remove-btn">Xóa</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Tóm Tắt Đơn Hàng</h2>
            {/* Add other summary details like subtotal, shipping etc. if needed */}
            <p>Tổng cộng:</p>
            <p className="cart-total-amount">{totalAmount.toLocaleString()}đ</p>
            <button 
              onClick={proceedToCheckout} 
              className="checkout-btn" 
            >
              Tiến hành Thanh Toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 
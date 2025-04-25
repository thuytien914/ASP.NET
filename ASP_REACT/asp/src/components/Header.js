import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// Helper function to get cart count from localStorage
const getCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Sum up quantities of all items
  return cart.reduce((count, item) => count + item.quantity, 0);
};

const Header = () => {
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount()); // Initialize cart count

  useEffect(() => {
    fetchMenus();

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }

    // Function to update cart count state
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    // Listen for custom cart updated events
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Initial check in case the component mounted after a cart update
    handleCartUpdate();

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []); // Dependencies array includes [] to run only on mount/unmount

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7007/api/Menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      const rootMenu = data.find((menu) => menu.id === 0);
      const childMenus = rootMenu?.children || [];
      setMenus(childMenus);
    } catch (err) {
      setError(err.message);
      console.error("Error loading menu:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  const DropdownMenu = ({ parent }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className="dropdown"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="nav-item">{parent.name}</span>
        {isOpen && parent.children.length > 0 && (
          <div className="dropdown-content">
            {parent.children.map((child) => (
              <Link key={child.id} to={child.link} className="dropdown-item">
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="main-header">
      <nav className="main-nav">
        <div className="logo">
          <Link to="/" className="logo-text">
            ASGONY
          </Link>
        </div>
        <div className="nav-left">
          {error ? (
            <span style={{ color: "red" }}>Lỗi tải menu</span>
          ) : (
            menus.map((menu) => (
              <div key={menu.id} className="nav-item-container">
                {menu.children && menu.children.length > 0 ? (
                  <DropdownMenu parent={menu} />
                ) : (
                  <Link to={menu.link} className="nav-item">
                    {menu.name}
                  </Link>
                )}
              </div>
            ))
          )}
        </div>

        <div className="nav-right">
          <Link to="/cart" className="cart-btn">
            🛒 Giỏ hàng
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <div
              className="user-menu"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="user-name">👤 {userName}</span>
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/orders" className="dropdown-item">
                    Đơn Hàng
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Đăng Nhập
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

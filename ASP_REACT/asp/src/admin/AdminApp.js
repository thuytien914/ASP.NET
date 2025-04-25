import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './AdminApp.css';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import ProductCreate from './pages/ProductCreate';
import CategoryList from './pages/CategoryList';
import CategoryCreate from './pages/CategoryCreate';
import CategoryEdit from './pages/CategoryEdit';
import BrandList from './pages/BrandList';
import BrandCreate from './pages/BrandCreate';
import BrandEdit from './pages/BrandEdit';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import MenuList from './pages/MenuList';
import UserList from './pages/UserList';
import Dashboard from './pages/Dashboard';

const AdminApp = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        if (token && name) {
            setIsLoggedIn(true);
            setUserName(name);
        } else {
            // Nếu không có token, chuyển về trang login
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/login');
    };

    if (!isLoggedIn) {
        return null; // Không render gì nếu chưa đăng nhập
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h1>ASGONY</h1>
                    <p>Trang Quản Trị</p>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="nav-item">
                        <i className="fas fa-home"></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="nav-item">
                        <i className="fas fa-box"></i>
                        <span>Sản phẩm</span>
                    </Link>
                    <Link to="/admin/categories" className="nav-item">
                        <i className="fas fa-tags"></i>
                        <span>Danh mục</span>
                    </Link>
                    <Link to="/admin/brands" className="nav-item">
                        <i className="fas fa-copyright"></i>
                        <span>Thương hiệu</span>
                    </Link>
                    <Link to="/admin/orders" className="nav-item">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Đơn hàng</span>
                    </Link>
                    <Link to="/admin/menus" className="nav-item">
                        <i className="fas fa-bars"></i>
                        <span>Menu</span>
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <i className="fas fa-users"></i>
                        <span>Người dùng</span>
                    </Link>
                </nav>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-content">
                        <h2>Xin chào, {userName}</h2>
                        <div className="admin-header-actions">
                            <button className="btn-logout" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/create" element={<ProductCreate />} />
                        <Route path="/products/:id/edit" element={<ProductEdit />} />
                        <Route path="/categories" element={<CategoryList />} />
                        <Route path="/categories/create" element={<CategoryCreate />} />
                        <Route path="/categories/:id/edit" element={<CategoryEdit />} />
                        <Route path="/brands" element={<BrandList />} />
                        <Route path="/brands/create" element={<BrandCreate />} />
                        <Route path="/brands/:id/edit" element={<BrandEdit />} />
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/orders/:id" element={<OrderDetail />} />
                        <Route path="/menus" element={<MenuList />} />
                        <Route path="/users" element={<UserList />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminApp;
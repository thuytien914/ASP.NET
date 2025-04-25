import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import LoginPage from './components/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SanPham from './pages/SanPham';
import Checkout from './pages/Checkout'; 
import Cart from'./pages/Cart';
import GioiThieu from './pages/GioiThieu';
import AdminApp from './admin/AdminApp';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import ProductBrand from './pages/ProductBrand';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';

function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Main site routes with header and footer */}
      <Route path="/*" element={
        <div className="main-app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:orderId" element={<OrderDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tat-ca-san-pham" element={<SanPham />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/gioi-thieu" element={<GioiThieu />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/danh-muc/:categoryId" element={<ProductCategory />} />
            <Route path="/thuong-hieu/:brandId" element={<ProductBrand />} />
          </Routes>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

export default App;

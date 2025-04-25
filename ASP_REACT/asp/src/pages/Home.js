import React from 'react';
import '../App.css';
import ProductNew from "../components/ProductNew";
import ProductSale from '../components/ProductSale';
import Banner from '../components/Banner';

const Home = () => (
  <main className="home-section">
     <Banner />
    <h2 className="section-title">Sản phẩm Mới</h2>
    <ProductNew />

  <ProductSale />
  </main>
);

export default Home; 
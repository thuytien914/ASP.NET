import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./SanPham.css"; // Dùng chung CSS với trang SanPham

const ProductCategory = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState("all");
  const productsPerPage = 8;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://localhost:7007/api/Categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const foundCategory = response.data.find(
          (cat) => cat.categoryId === parseInt(categoryId)
        );

        if (foundCategory) {
          // Loại bỏ sản phẩm trùng lặp dựa trên productName
          const uniqueProducts = Array.from(
            new Map(
              foundCategory.products.map((item) => [item.productName, item])
            ).values()
          );
          foundCategory.products = uniqueProducts;
          setCategory(foundCategory);
        } else {
          setError("Không tìm thấy danh mục");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Không thể tải danh mục sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  // Lọc sản phẩm theo giá
  const filterProductsByPrice = (products) => {
    switch (priceFilter) {
      case "under1m":
        return products.filter((product) => product.price < 1000000);
      case "1m-3m":
        return products.filter(
          (product) => product.price >= 1000000 && product.price <= 3000000
        );
      case "3m-5m":
        return products.filter(
          (product) => product.price > 3000000 && product.price <= 5000000
        );
      case "over5m":
        return products.filter((product) => product.price > 5000000);
      default:
        return products;
    }
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!category) return <div className="error">Không tìm thấy danh mục</div>;

  // Tính toán sản phẩm cho trang hiện tại
  const filteredProducts = filterProductsByPrice(category.products);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">{category.categoryName}</h1>

        <div className="filter-section">
          <select
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="price-filter"
          >
            <option value="all">Tất cả giá</option>
            <option value="under1m">Dưới 1 triệu</option>
            <option value="1m-3m">1 triệu - 3 triệu</option>
            <option value="3m-5m">3 triệu - 5 triệu</option>
            <option value="over5m">Trên 5 triệu</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {currentProducts.map((product) => (
          <Link
            to={`/product/${product.productId}`}
            key={product.productId}
            className="product-card"
          >
            {product.priceSale > 0 && (
              <div className="sale-badge">
                -
                {Math.round(
                  ((product.price - product.priceSale) / product.price) * 100
                )}
                %
              </div>
            )}
            <img
              src={`/images/${product.image}`}
              alt={product.productName}
              className="product-image"
            />
            <h3 className="product-title">{product.productName}</h3>
            <div className="price-container">
              {product.priceSale > 0 ? (
                <>
                  <p className="original-price">
                    {product.price.toLocaleString()}đ
                  </p>
                  <p className="sale-price">
                    {product.priceSale.toLocaleString()}đ
                  </p>
                </>
              ) : (
                <p className="regular-price">
                  {product.price.toLocaleString()}đ
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`page-button ${
                currentPage === number ? "active" : ""
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;

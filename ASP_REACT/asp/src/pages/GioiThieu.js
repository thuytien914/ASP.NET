import React from 'react';
import './GioiThieu.css';
import { FaHeart, FaGem, FaShieldAlt, FaSmile } from 'react-icons/fa';

const GioiThieu = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <img src="/images/slider4.webp" alt="Blanc Perfume Store" />
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            ASGONY - Sứ mệnh: “Remain your chic style”
          </h1>
          <p className="about-hero-subtitle">
            Hành trình dẫn đầu phong cách hiện đại đầy nữ tính
          </p>
        </div>
      </div>

      <section className="about-section">
        <h2 className="about-section-title">Câu Chuyện Của Chúng Tôi</h2>
        <div className="about-grid">
          <div className="about-card">
            <img src="/images/107.jpg" alt="Cửa hàng ASGONY" />
            <div className="about-card-content">
              <h3 className="about-card-title">
                Tinh thần thời trang thanh lịch
              </h3>
              <p className="about-card-text">
                Tinh thần cốt lõi mà ASGONY theo đuổi chính là sự kết hợp hài
                hòa giữa phong cách nữ tính hiện đại và thời trang mang tính ứng
                dụng cao. Những chi tiết đính kết, chất liệu cao cấp, đường cắt
                may tỉ mỉ và bảng màu thời thượng, đều được cân nhắc kỹ lưỡng
                trước khi tạo ra các thiết kế đẹp mắt, phù hợp trong nhiều bối
                cảnh khác nhau.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/images/108.jpg" alt="Bộ sưu tập nước hoa" />
            <div className="about-card-content">
              <h3 className="about-card-title">
                Vượt qua biên giới, chạm đến quốc tế
              </h3>
              <p className="about-card-text">
                ASGONY không chỉ dừng lại ở việc được đón nhận nồng nhiệt tại
                thị trường châu Á, mà đã trở thành thương hiệu được yêu thích
                trên toàn cầu, chinh phục trái tim của nhiều tín đồ thời trang
                và các biểu tượng sắc đẹp quốc tế.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/images/109.jpg" alt="Dịch vụ khách hàng" />
            <div className="about-card-content">
              <h3 className="about-card-title">
                Đề cao sự bền vững và chất lượng trong thiết kế
              </h3>
              <p className="about-card-text">
                ASGONY luôn đặt chất lượng lên hàng đầu, biến mỗi bộ trang phục
                trở thành “người bạn đồng hành” đắc lực nhất của các cô gái. Từ
                việc lựa chọn chất liệu cao cấp đến quy trình sản xuất tỉ mỉ,
                mỗi thiết kế đều thể hiện niềm đam mê thời trang bất tận và giá
                trị tinh thần lâu dài cho người mặc.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <h2 className="about-section-title">Giá Trị Cốt Lõi</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">
              <FaGem />
            </div>
            <h3 className="value-title">Chất Lượng</h3>
            <p className="value-text">Cam kết 100% sản phẩm chính hãng</p>
          </div>

          <div className="value-item">
            <div className="value-icon">
              <FaHeart />
            </div>
            <h3 className="value-title">Đam Mê</h3>
            <p className="value-text">Yêu thích và am hiểu về thời trang</p>
          </div>

          <div className="value-item">
            <div className="value-icon">
              <FaShieldAlt />
            </div>
            <h3 className="value-title">Uy Tín</h3>
            <p className="value-text">Xây dựng niềm tin với khách hàng</p>
          </div>

          <div className="value-item">
            <div className="value-icon">
              <FaSmile />
            </div>
            <h3 className="value-title">Hài Lòng</h3>
            <p className="value-text">
              Đặt sự hài lòng của khách hàng lên hàng đầu
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GioiThieu; 
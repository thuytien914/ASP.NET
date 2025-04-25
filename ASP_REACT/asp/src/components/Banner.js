import React, { useEffect, useRef } from 'react';
import '../App.css';

const Banner = () => {
  const slide1 = useRef();
  const slide2 = useRef();
  const slide3 = useRef();

  useEffect(() => {
    let idx = 1;
    const interval = setInterval(() => {
      idx = idx % 3 + 1;
      if (idx === 1 && slide1.current) slide1.current.checked = true;
      if (idx === 2 && slide2.current) slide2.current.checked = true;
      if (idx === 3 && slide3.current) slide3.current.checked = true;
    }, 3500); // đổi slide mỗi 3.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider-section">
      <div className="slider">
        <input
          ref={slide1}
          type="radio"
          name="slider"
          id="slide1"
          defaultChecked
        />
        <input ref={slide2} type="radio" name="slider" id="slide2" />
        <input ref={slide3} type="radio" name="slider" id="slide3" />
        <div className="slides">
          <div className="slide s1">
            <img src="/images/slider1.webp" alt="slider1" />
          </div>
          <div className="slide s2">
            <img src="/images/slider2.webp" alt="slider2" />
          </div>
          <div className="slide s3">
            <img src="/images/slider3.webp" alt="slider3" />
          </div>
        </div>
        <div className="slider-nav">
          <label htmlFor="slide1"></label>
          <label htmlFor="slide2"></label>
          <label htmlFor="slide3"></label>
        </div>
      </div>
    </section>
  );
};

export default Banner;
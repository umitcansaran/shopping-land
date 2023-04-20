import React from "react";
import { Carousel, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductCarousel({ latestProducts = [] }) {
  return (
    <Col md={6}>
      <Carousel
        pause="hover"
        style={{ backgroundColor: "#f7f7f7" }}
        className="text-center main-carousel"
      >
        {latestProducts.map((product) => {
          return (
            <Carousel.Item key={product.id}>
              <Link to={`/product/${product.id}`}>
                <h4 style={{ color: "black", letterSpacing: "0.06rem" }} className="pt-1">
                  {product.brand}
                </h4>
                <h5 style={{ color: "black", fontSize: "1rem" }}>
                  {product.name}
                </h5>
                <Image className="main-carousel-img" src={product.image} alt={product.name} fluid/>
                <h5 className="pt-2" style={{ color: "black" }}>
                  CHF {Math.trunc(product.price)}
                </h5>
              </Link>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Col>
  );
}

export default ProductCarousel;

import React from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import isNumberDecimal from "../../utils/isNumberDecimal";

function ProductCarousel({ latestProducts = [] }) {
  return (
    <div className="text-center main-carousel-container">
      <Carousel pause="hover" className="text-center main-carousel">
        {latestProducts.map((product) => {
          return (
            <Carousel.Item key={product.id}>
              <Link to={`/product/${product.id}`}>
                <h4 className="pt-1">{product.brand}</h4>
                <h5 style={{ fontSize: "1rem" }}>{product.name}</h5>
                <div className="main-carousel-img-container">
                  <Image
                    className="main-carousel-img"
                    src={product.image}
                    alt={product.name}
                    fluid
                  />
                </div>
                <h5 className="pt-2">
                  CHF{" "}
                  {isNumberDecimal(Number(product.price))}
                </h5>
              </Link>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}

export default ProductCarousel;

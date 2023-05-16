import React from "react";
import { Carousel, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LatestSellers({ latestSellers = [] }) {
  const charLimit =
    window.innerWidth < 1300 ? 30 : window.innerWidth < 1600 ? 40 : 70;

  return (
    <div className="text-center sellers-carousel">
      <h5>Latest Sellers</h5>
      <Carousel style={{ alignItems: "center" }}>
        {latestSellers.map((seller, index) => {
          return (
            seller && (
              <Carousel.Item key={index}>
                <Link to={`/seller/${seller.id}`} style={{ color: "#32415c" }}>
                  <Image
                    src={seller.image}
                    style={{
                      width: "auto",
                      height: 'auto',
                      maxHeight: "2.3rem",
                    }}
                    alt="latest-sellers"
                  />
                  {seller.description && (
                    <p style={{ marginTop: "2rem", fontSize: "1rem" }}>
                      {seller.description.length > charLimit
                        ? seller.description.substring(0, charLimit) + "..."
                        : seller.description}
                    </p>
                  )}
                  <h6 style={{ color: "#5b6da8" }}>{seller.industry}</h6>
                </Link>
              </Carousel.Item>
            )
          );
        })}
      </Carousel>
    </div>
  );
}

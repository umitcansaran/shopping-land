import React from "react";
import { Carousel, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LatestSellers({ latestSellers = [] }) {


  return (
    <Row className="text-center">
      <h5 className="text-center">Latest Sellers</h5>
      <Carousel className="sellers-carousel" style={{ alignItems: "center" }}>
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
                    <Row style={{ overflow:'hidden', height:'7rem', marginBottom:'1.5rem' }}>

                    <p style={{ marginTop: "2rem", fontSize: "1rem" }}>
                      {seller.description}
                    </p>
                    </Row>
                  )}
                  <h6 style={{ color: "#5b6da8" }}>{seller.industry}</h6>
                </Link>
              </Carousel.Item>
            )
          );
        })}
      </Carousel>
    </Row>
  );
}

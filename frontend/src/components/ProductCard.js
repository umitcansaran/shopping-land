import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, index }) {
  return (
    <Col xs={6} sm={4} md={6} lg={4} xl={3} className="gx-2 gy-2">
      <Card
        className="product-card"
        key={index}
        style={{ padding: "0.2rem 0.2rem 0rem 0.2rem" }}
      >
        <Row className="card-img-container">
          <Link to={`/product/${product.id}`}>
            <Card.Img
              src={product.image}
              variant="top"
              className="card-img-top"
            />
          </Link>
        </Row>
        <Row>
          <Card.Body className="product-row mt-1">
            <Link to={`/product/${product.id}`}>
              <Card.Title
                className="text-center product-title"
                style={{
                  fontSize: "16px",
                  letterSpacing: "0.06rem",
                  color: "#1e478a",
                }}
              >
                {product.brand}
              </Card.Title>
              <Card.Title className="text-center product-card-name">
                {product.name}
              </Card.Title>
            </Link>
            {product.description ? (
              <Card.Text
                className="product-card-description"
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {product.description}
              </Card.Text>
            ) : (
              <Card.Text style={{ fontSize: "0.9rem" }}>
                Product has no description.
              </Card.Text>
            )}
            <Card.Text
              className="text-center m-0"
              style={{ fontSize: "1rem", color: "black" }}
            >
              CHF{" "}
              {product.price % 1 !== 0
                ? product.price
                : Math.trunc(product.price) + ".-"}
            </Card.Text>
            <Card.Text
              style={{ fontSize: "1rem" }}
              className="text-center mb-1"
            >
              Sold by{" "}
              <Link
                to={`/seller/${
                  product && product.seller_id
                }`}
              >
                {product && product.seller_name}
              </Link>
            </Card.Text>
          </Card.Body>
        </Row>
      </Card>
    </Col>
  );
}

export default ProductCard;

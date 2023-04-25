import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product, index }) {
  return (
    <Card
      className="main-product-card"
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
            <Card.Title
              className="text-center product-card-name"
            >
              {product.name}
            </Card.Title>
          </Link>
          {product.description ? (
            <Card.Text className="product-card-description">
              {product.description.length > 27
                ? product.description.substring(0, 27) + "..."
                : product.description}
            </Card.Text>
          ) : (
            <Card.Text style={{ fontSize: "0.9rem" }}>
              Product has no description.
            </Card.Text>
          )}
          <Card.Text className="text-center m-0" style={{ fontSize: "1rem", color:'black' }}>
            CHF {Math.trunc(product.price)}
          </Card.Text>
          <Card.Text style={{ fontSize: "1rem" }} className="text-center mb-1 d-none d-sm-block">
            Sold by{" "}
            <Link
              to={`/seller/${
                product.seller_details && product.seller_details.id
              }`}
            >
              {product.seller_details && product.seller_details.name}
            </Link>
          </Card.Text>
        </Card.Body>
      </Row>
    </Card>
  );
}

import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <>
      <Card
        className="main-product-card"
        key={product.id}
        style={{ padding: "0.2rem 0.2rem 0rem 0.2rem" }}
      >
        <Row style={{ height: "25rem", alignItems: "center", margin: "0" }}>
          <Link to={`/product/${product.id}`}>
            <Card.Img
              src={product.image}
              variant="top"
              className="card-img-top"
            />
          </Link>
        </Row>
        <Row>
          <Card.Body>
            <Link to={`/product/${product.id}`}>
              <Card.Title
                className="text-center"
                style={{ letterSpacing: "0.06rem", color: "#1e478a" }}
              >
                <strong>{product.brand}</strong>
              </Card.Title>
              <Card.Title
                className="text-center"
                style={{ fontSize: "1rem", color: "black" }}
              >
                {product.name}
              </Card.Title>
            </Link>
            {product.description ? (
              <Card.Text
                style={{ fontSize: "1rem", textAlign: "center", margin: "0" }}
              >
                {product.description.length > 27
                  ? product.description.substring(0, 27) + "..."
                  : product.description}
              </Card.Text>
            ) : (
              <Card.Text style={{ fontSize: "0.9rem" }}>
                Product has no description.
              </Card.Text>
            )}
            <Card.Text
              className="text-center m-0"
              style={{ fontSize: "1.3rem" }}
            >
              <strong>CHF {Math.trunc(product.price)}</strong>
            </Card.Text>
            <Card.Text style={{ fontSize: "1rem" }} className="text-center">
              Sold by{" "}
              <Link to={`/seller/${product.seller_details && product.seller_details.id}`}>
                {product.seller_details && product.seller_details.name}
              </Link>
            </Card.Text>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
}

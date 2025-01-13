import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import Message from "../../components/Message";
import isNumberDecimal from "../../utils/isNumberDecimal";

export default function OrderItemCard({ orderItem, sellerOrder }) {
  return (
    <>
      <Row className="my-3">
        <Col md={1} className="mx-1">
          <Image src={orderItem.image} alt={orderItem.name} fluid rounded />
        </Col>
        <Col md={3} style={{ color: "#698bc2" }}>
          {orderItem.name}
        </Col>

        <Col md={2}>
          {orderItem.quantity} x CHF {isNumberDecimal(Number(orderItem.price))}
        </Col>

        <Col md={3}>
          <p
            style={{
              textAlign: "center",
            }}
          >
            {orderItem.orderType === "inStore"
              ? orderItem.store.name
              : "Online"}
          </p>
        </Col>
        <Col>
          <h6
            style={{
              textAlign: "center",
              width: "auto",
              margin: "0.5rem",
              color: "#698bc2",
            }}
          >
            {orderItem.orderType === "online" ? (
              sellerOrder.shippingPrice > 0 ? (
                <Message variant="light">
                  Shipping Price: {Number(sellerOrder.shippingPrice)}.-
                </Message>
              ) : (
                <Message variant="light">Free Shipping</Message>
              )
            ) : orderItem.isRetrieved ? (
              <Message variant="success">
                Retrieved on {orderItem.retrievedAt.substring(0, 10)}
              </Message>
            ) : (
              <Message variant="warning">Not Retrieved</Message>
            )}
          </h6>
        </Col>
      </Row>
    </>
  );
}

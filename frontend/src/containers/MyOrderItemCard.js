import React from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Message from "../components/Message";

export default function MyOrderItemCard({
  item,
  shippingHandler,
  pickUpHandler,
  isNumberDecimal,
}) {
  
  return (
    <>
      <ListGroup.Item key={item.id} style={{ paddingTop: "2rem" }}>
        <Row>
          <Col md={1}>
            <Image src={item.image} alt={item.name} fluid rounded />
          </Col>
          <Col md={3} style={{ color: "#698bc2" }}>
            {item.name}
          </Col>

          <Col md={2}>
            {item.quantity} x CHF {isNumberDecimal(Number(item.price))}
          </Col>

          <Col md={3}>
            <p
              style={{
                textAlign: "center",
              }}
            >
              {item.orderType === "inStore" ? item.store.name : "Online"}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <h6
            style={{
              textAlign: "center",
              width: "auto",
              margin: "0.5rem",
              color: "#698bc2",
            }}
          >
            {item.orderType === "online"
              ? item.shippingPrice > 0
                ? "Shipping Price: " + item.shippingPrice
                : "Free Shipping"
              : "Pick up in-store"}
          </h6>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row className="justify-content-center">
          <Col md={3} className="text-center">
            {item.orderType === "inStore" &&
              (item.isRetrieved ? (
                <Message variant="success">
                  Retrieved on {item.retrievedAt.substring(0, 10)}
                </Message>
              ) : (
                <Button
                  type="button"
                  className="btn btn-block"
                  onClick={() => pickUpHandler(item.id)}
                >
                  Mark As Retrieved
                </Button>
              ))}
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  );
}

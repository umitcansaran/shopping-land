import React from "react";
import { Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import isNumberDecimal from "../../utils/isNumberDecimal";
import Message from "../../components/Message";

export default function MyOrderItemCard({ item, pickUpHandler, sellerOrder }) {
  return (
    <>
      <ListGroup.Item key={item.id} style={{ paddingTop: "2rem" }}>
        <Row className="justify-content-end">Product # {item.id}</Row>
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

        {item.orderType === "inStore" && (
                              <Row className="justify-content-center my-1">
                              <Col md={4} className="text-center">
                                {item.isRetrieved ? (
                                  <Message variant="success">
                                    Pickep up on{" "}
                                    {item.retrievedAt.substring(0, 10) + ' at ' + item.retrievedAt.substring(11, 16)}
                                  </Message>
                                ) : (
                                  <Button
                                  className="blue-button"
                                    onClick={() => pickUpHandler(item.id)}
                                    disabled={!sellerOrder.order.isPaid}
                                  >
                                    Mark as Picked Up
                                  </Button>
                                )}
                              </Col>
                            </Row>
        )}
      </ListGroup.Item>
    </>
  );
}

import React from 'react'
import { Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import Message from '../components/Message';

export default function MyOrderItemCard({ sellerOrder, hasOnlinePurchase, isNumberDecimal }) {
  return (
    <ListGroup.Item>
                    <h2>Shipping Item(s)</h2>
                    <Card style={{ marginBlockStart: "1rem" }}>
                      {sellerOrder.orderItems.map((orderItem) => {
                        return (
                          <>
                            <ListGroup.Item
                              key={orderItem.id}
                              style={{ paddingTop: "2rem" }}
                            >
                              <Row>
                                <Col md={1}>
                                  <Image
                                    src={orderItem.image}
                                    alt={orderItem.name}
                                    fluid
                                    rounded
                                  />
                                </Col>
                                <Col md={3} style={{ color: "#698bc2" }}>
                                  {orderItem.name}
                                </Col>

                                <Col md={2}>
                                  {orderItem.quantity} x CHF{" "}
                                  {isNumberDecimal(Number(orderItem.price))}
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
                                  {orderItem.orderType === "online"
                                    ? orderItem.shippingPrice > 0
                                      ? "Shipping Price: " +
                                        orderItem.shippingPrice
                                      : "Free Shipping"
                                    : "Pick up in-store"}
                                </h6>
                              </Row>
                            </ListGroup.Item>
                          </>
                        );
                      })}
                      <ListGroup.Item>
                        {/* <Row className="justify-content-end">
              <h6
                style={{
                  textAlign: "center",
                  width: "auto",
                  margin: "0.5rem",
                }}
              >
                Subtotal: CHF{" "}
                {isNumberDecimal(
                  Number(sellerOrder.totalPrice)
                )}
              </h6>
            </Row> */}
                        <Row className="justify-content-center">
                          <Col md={3} className="text-center">
                            {sellerOrder.order.isPaid ? (
                              <Message variant="success">
                                Paid on{" "}
                                {sellerOrder.order.paidAt.substring(0, 10)}
                              </Message>
                            ) : (
                              <Message variant="warning">Not Paid</Message>
                            )}
                          </Col>
                          <Col md={3} className="text-center">
                            {hasOnlinePurchase &&
                              (sellerOrder.isShipped ? (
                                <Message variant="success">
                                  Sent on{" "}
                                  {sellerOrder.shippedAt.substring(0, 10)}
                                </Message>
                              ) : (
                                <Message variant="warning">Not Sent</Message>
                              ))}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </Card>
                  </ListGroup.Item>
  )
}

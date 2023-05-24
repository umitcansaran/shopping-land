import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../store/actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../store/constants/orderConstants";

function OrderScreen() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate;

  const orderId = params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // if (!loading && !error && order) {
  //   order.itemsPrice = order.orderItems
  //     .reduce((acc, item) => acc + item.price * item.quantity, 0)
  //     .toFixed(2);
  // }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_ID}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  let shippingCost;
  let subTotalPrice;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !order ||
      successPay ||
      order.id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal && process.env.PAYPAL_CLIENT_ID) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    userInfo,
    order,
    orderId,
    successPay,
    successDeliver,
    navigate,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return (
    <Container fluid className="order-page-container">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        order && (
          <div>
            <h2 className="text-center my-3">Order ID: {order.id}</h2>
            <Row>
              <Col md={8}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name: </strong> {order.customer}
                    </p>
                    {/* <p>
                      <strong>Email: </strong>
                      <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                    </p> */}
                    <p>
                      <strong>Shipping: </strong>
                      {order.totalShippingPrice}
                    </p>

                    {/* {order.isDelivered ? (
                      <Message variant="success">
                        Delivered on {order.deliveredAt}
                      </Message>
                    ) : (
                      <Message variant="warning">Not Delivered</Message>
                    )} */}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                      <strong>Method: </strong>
                      {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <Message variant="success">
                        Paid on {order.paidAt}
                      </Message>
                    ) : (
                      <Message variant="warning">Not Paid</Message>
                    )}
                  </ListGroup.Item>
                  {order.subOrder.length === 0 ? (
                    <Message variant="info">SubOrder is empty</Message>
                  ) : (
                    <ListGroup.Item>
                      <h2>Order Items</h2>
                      <ListGroup variant="flush">
                        {order.subOrder.map((subOrder, index) => {
                          return (
                            <Card style={{ marginBlockStart: "1rem" }}>
                              <Card.Body>
                                <Card.Title
                                  className="text-center"
                                  style={{ color: "#698bc2" }}
                                >
                                  {subOrder.seller.profile.name}
                                </Card.Title>
                              </Card.Body>
                              <ListGroup variant="flush" key={index}>
                              {subOrder.orderItems.map((orderItem) => {
                                console.log(orderItem)
                                //   shippingCost =
                                //   totalPriceBySeller[index] >= 100 ? 0 : 20;
                                // subTotalPrice =
                                //   totalPriceBySeller[index] + shippingCost;
                                return (
                                  <>
                                      <ListGroup.Item key={orderItem.id}>
                                        <Row>
                                          <Col md={1}>
                                            <Image
                                              src={orderItem.image}
                                              alt={orderItem.name}
                                              fluid
                                              rounded
                                            />
                                          </Col>
                                          <Col md={3}>
                                            <Link
                                              to={`/product/${orderItem.id}`}
                                            >
                                              {orderItem.name}
                                            </Link>
                                          </Col>

                                          <Col md={2}>
                                            {orderItem.quantity} x CHF {orderItem.price}
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
                                              ? shippingCost === 0
                                                ? "Free Shipping"
                                                : "Shipping: CHF 20"
                                              : "Pick up in-store"}
                                          </h6>
                                        </Row>
                                      </ListGroup.Item>
                                  </>
                                );
                              })}
                                      <ListGroup.Item>
                                        <Row className="justify-content-end">
                                          <h6
                                            style={{
                                              textAlign: "center",
                                              width: "auto",
                                              margin: "0.5rem",
                                            }}
                                            >
                                            Subtotal: CHF {subOrder.totalPrice}
                                          </h6>
                                        </Row>
                                      </ListGroup.Item>
                                            </ListGroup>
                            </Card>
                          );
                        })}
                      </ListGroup>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
              {/* {subOrder.isShipped ? (
                    <Message variant="success">
                      Shipped on{" "}
                      {subOrder.ShippedAt.substring(0, 10)}
                    </Message>
                  ) : (
                    <Message variant="warning">
                      Not Shipped
                    </Message>
                  )} */}

              {/* <Col md={4}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h2>Order Summary</h2>
                    </ListGroup.Item>
    
                    <ListGroup.Item>
                      <Row>
                        <Col>Items:</Col>
                        <Col>${order.itemsPrice}</Col>
                      </Row>
                    </ListGroup.Item>
    
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping:</Col>
                        <Col>${order.shippingPrice}</Col>
                      </Row>
                    </ListGroup.Item>
    
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax:</Col>
                        <Col>${order.taxPrice}</Col>
                      </Row>
                    </ListGroup.Item>
    
                    <ListGroup.Item>
                      <Row>
                        <Col>Total:</Col>
                        <Col>${order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
    
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalScriptProvider
                            options={{
                              "client-id": process.env.REACT_APP_PAYPAL_ID,
                            }}
                          >
                            <PayPalButtons
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: order.totalPrice,
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order
                                  .capture()
                                  .then(successPaymentHandler());
                              }}
                            />
                          </PayPalScriptProvider>
                        )}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
    
                  {loadingDeliver && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type="button"
                          className="btn btn-block"
                          onClick={deliverHandler}
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </Card>
              </Col> */}
            </Row>
          </div>
        )
      )}
    </Container>
  );
}

export default OrderScreen;

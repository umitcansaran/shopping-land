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

  console.log("order", order);
  let totalItem;

  const hasOnlinePurchase = order?.storeOrder
    .map((storeOrder) => {
      return storeOrder.orderItems.map((orderItem) => {
        return orderItem.orderType === "online";
      });
    })
    .flat()
    .includes(true);

  const hasInStorePickup = order?.storeOrder
    .map((storeOrder) => {
      return storeOrder.orderItems.filter((orderItem) => {
        return orderItem.orderType === "inStore";
      });
    })
    .flat();

  console.log("hasInStorePickup", hasInStorePickup);

  if (!loading && !error && order) {
    totalItem = order.storeOrder.reduce(
      (acc, storeOrder) =>
        acc +
        storeOrder.orderItems.reduce((acc, item) => acc + item.quantity, 0),
      0
    );
  }

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
          <>
            <h2 className="text-center my-3 main-order-id">
              Order ID: {order.id}
            </h2>
            <Row>
              <Col md={8}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Customer</h2>
                    <p>
                      <strong>Name: </strong> {order.customer.name}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      <a href={`mailto:${order.customer.email}`}>
                        {order.customer.email}
                      </a>
                    </p>
                    {hasOnlinePurchase && (
                      <>
                        <h2>Shipping</h2>
                        <p>
                          <strong>Address: </strong>
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city},{"  "}
                          {order.shippingAddress.postalCode},{"  "}
                          {order.shippingAddress.country}
                        </p>
                      </>
                    )}
                  </ListGroup.Item>

                  {hasInStorePickup && (
                    <ListGroup.Item>
                      <h2>Pickup Location(s)</h2>
                      {hasInStorePickup.map((item) => {
                        return (
                          <p>
                            {item.store.owner_name} - {item.store.name}
                          </p>
                        );
                      })}
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                      <strong>Method: </strong>
                      {order.paymentMethod}
                    </p>
                    <Col md={3} className="text-center">
                      {order.isPaid ? (
                        <Message variant="success">
                          Paid on {order.paidAt}
                        </Message>
                      ) : (
                        <Message variant="warning">Not Paid</Message>
                      )}
                    </Col>
                  </ListGroup.Item>
                  {order.storeOrder.length === 0 ? (
                    <Message variant="info">Store Order is empty</Message>
                  ) : (
                    <ListGroup.Item>
                      <h2>Store Order(s):</h2>
                      <ListGroup variant="flush">
                        {order.storeOrder.map((storeOrder, index) => {
                          return (
                            <Card style={{ marginBlockStart: "1rem" }}>
                              <Card.Body>
                                <Row className="text-end">
                                  <h6>Order ID: {storeOrder.id}</h6>
                                </Row>
                                <Row
                                  className="text-center"
                                  style={{ color: "#698bc2" }}
                                >
                                  <h4>{storeOrder.seller.profile.name}</h4>
                                </Row>
                              </Card.Body>
                              <ListGroup variant="flush" key={index}>
                                {storeOrder.orderItems.map((orderItem) => {
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
                                          <Col
                                            md={3}
                                            style={{ color: "#698bc2" }}
                                          >
                                            {orderItem.name}
                                          </Col>

                                          <Col md={2}>
                                            {orderItem.quantity} x CHF{" "}
                                            {orderItem.price}
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
                                              ? storeOrder.shippingPrice > 0
                                                ? "Shipping Price: " +
                                                  storeOrder.shippingPrice
                                                : "Free Shipping"
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
                                      Subtotal: CHF {storeOrder.totalPrice}
                                    </h6>
                                  </Row>
                                  <Row className="justify-content-center">
                                    <Col md={3} className="text-center">
                                      {hasOnlinePurchase &&
                                        (storeOrder.isShipped ? (
                                          <Message variant="success">
                                            Shipped on{" "}
                                            {storeOrder.ShippedAt.substring(
                                              0,
                                              10
                                            )}
                                          </Message>
                                        ) : (
                                          <Message variant="warning">
                                            Not Shipped
                                          </Message>
                                        ))}
                                    </Col>
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

              <Col md={4}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Store(s):</Col>
                        <Col>{order.storeOrder.length}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Item(s):</Col>
                        <Col>{totalItem}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>CHF {order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping:</Col>
                        <Col>CHF {order.totalShippingPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Total Price:</Col>
                        <Col>
                          CHF{" "}
                          {(
                            Number(order.totalPrice) +
                            Number(order.totalShippingPrice)
                          ).toFixed(2)}
                        </Col>
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
              </Col>
            </Row>
          </>
        )
      )}
    </Container>
  );
}

export default OrderScreen;

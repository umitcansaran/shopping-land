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
import { getOrderDetails, payOrder } from "../store/actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_SEND_RESET,
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

  const sellerOrderSend = useSelector((state) => state.sellerOrderSend);
  const { loading: loadingSellerOrderSend, success: successSellerOrderSend } =
    sellerOrderSend;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  console.log("order", order);

  const hasOnlineOrderItem = order?.sellerOrder.find((sellerOrder) => {
    return sellerOrder.onlineOrderItems.length > 0;
  });

  console.log("hasOnlineOrderItem", hasOnlineOrderItem);

  let hasInStorePickup = order?.sellerOrder
    .map((sellerOrder) => {
      return sellerOrder.inStoreOrderItems.reduce((accumulator, current) => {
        if (
          !accumulator.find(
            (item) =>
              item.store.owner_name === current.store.owner_name &&
              item.store.name == current.store.name
          )
        ) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
    })
    .flat()
    .sort((a, b) =>
      a.store.owner_name > b.store.owner_name
        ? 1
        : b.store.owner_name > a.store.owner_name
        ? -1
        : 0
    );

  console.log("pickUpLocations", hasInStorePickup);

  let totalInStoreOrderItems;
  let totalOnlineOrderItems;
  let totalItem;

  if (!loading && !error && order) {
    totalInStoreOrderItems = order.sellerOrder.reduce(
      (acc, sellerOrder) =>
        acc +
        sellerOrder.inStoreOrderItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
      0
    );
    totalOnlineOrderItems = order.sellerOrder.reduce(
      (acc, sellerOrder) =>
        acc +
        sellerOrder.onlineOrderItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
      0
    );
    totalItem = totalInStoreOrderItems + totalOnlineOrderItems;
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
      successSellerOrderSend
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_SEND_RESET });
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
    successSellerOrderSend,
    navigate,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const isNumberDecimal = (num) => {
    if (num.toFixed(2) % 1 !== 0) {
      return num.toFixed(2);
    } else {
      return Math.trunc(num) + ".-";
    }
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
            <Row>
              <strong>
                <p className="text-center my-3 main-order-id">
                  ORDER # {order.id}
                </p>
              </strong>
            </Row>
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
                    {hasOnlineOrderItem && (
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

                  {hasInStorePickup.length > 0 && (
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
                          Paid on {order.paidAt.substring(0, 10)}
                        </Message>
                      ) : (
                        <Message variant="warning">Not Paid</Message>
                      )}
                    </Col>
                  </ListGroup.Item>
                  {order.sellerOrder.length === 0 ? (
                    <Message variant="info">Store Order is empty</Message>
                  ) : (
                    <ListGroup.Item>
                      <h2>Seller Order(s):</h2>
                      {order.sellerOrder.map((sellerOrder, index) => {
                        return (
                          <Card>
                            <Card.Body>
                              <Row className="text-end">
                                <h6>Order ID: {sellerOrder.id}</h6>
                              </Row>
                              <Row
                                className="text-center"
                                style={{ color: "#698bc2" }}
                              >
                                <h4>{sellerOrder.seller.username}</h4>
                              </Row>
                            </Card.Body>
                            {sellerOrder.inStoreOrderItems.map((orderItem) => {
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
                                      <Col md={3} style={{ color: "#698bc2" }}>
                                        {orderItem.name}
                                      </Col>

                                      <Col md={2}>
                                        {orderItem.quantity} x CHF{" "}
                                        {isNumberDecimal(
                                          Number(orderItem.price)
                                        )}
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
                                          ? sellerOrder.shippingPrice > 0
                                            ? "Shipping Price: " +
                                              sellerOrder.shippingPrice
                                            : "Free Shipping"
                                          : "Pick up in-store"}
                                      </h6>
                                    </Row>
                                  </ListGroup.Item>
                                </>
                              );
                            })}
                            {sellerOrder.onlineOrderItems.map((orderItem) => {
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
                                      <Col md={3} style={{ color: "#698bc2" }}>
                                        {orderItem.name}
                                      </Col>

                                      <Col md={2}>
                                        {orderItem.quantity} x CHF{" "}
                                        {isNumberDecimal(
                                          Number(orderItem.price)
                                        )}
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
                                          ? sellerOrder.shippingPrice > 0
                                            ? "Shipping Price: " +
                                              sellerOrder.shippingPrice
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
                                  Subtotal: CHF{" "}
                                  {isNumberDecimal(
                                    Number(sellerOrder.totalPrice)
                                  )}
                                </h6>
                              </Row>
                              <Row className="justify-content-center">
                                <Col md={3} className="text-center">
                                  {/* {hasOnlinePurchase &&
                                    (sellerOrder.isSent ? (
                                      <Message variant="success">
                                        Sent on{" "}
                                        {sellerOrder.isSent.substring(0, 10)}
                                      </Message>
                                    ) : (
                                      <Message variant="warning">
                                        Not Sent
                                      </Message>
                                    ))} */}
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Card>
                        );
                      })}
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
                        <Col>Seller(s):</Col>
                        <Col>{order.sellerOrder.length}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Item(s):</Col>
                        <Col>{totalItem}</Col>
                      </Row>
                    </ListGroup.Item>

                    {/* {hasOnlinePurchase && (
                      <>
                        <ListGroup.Item>
                          <Row>
                            <Col>Price:</Col>
                            <Col>
                              CHF {isNumberDecimal(Number(order.totalPrice))}
                            </Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Shipping:</Col>
                            <Col>
                              {Number(order.totalShippingPrice) === 0
                                ? "Free"
                                : order.totalShippingPrice}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      </>
                    )} */}

                    <ListGroup.Item>
                      <Row>
                        <Col>Total Price:</Col>
                        <Col>
                          CHF{" "}
                          {isNumberDecimal(
                            Number(order.totalPrice) +
                              Number(order.totalShippingPrice)
                          )}
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

import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  ORDER_PAY_RESET,
  ORDER_SEND_RESET,
} from "../../store/constants/orderConstants";
import OrderItemCard from "./OrderItemCard";
import isNumberDecimal from "../../utils/isNumberDecimal";
import { getOrderDetails, payOrder } from "../../store/actions/orderActions";

function CustomerOrder() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  
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

  const hasOnlineOrderItem = order?.sellerOrder.find((sellerOrder) => {
    return sellerOrder.onlineOrderItems.length > 0;
  });

  const hasInStorePickup = order?.sellerOrder
    .map((sellerOrder) => {
      return sellerOrder.inStoreOrderItems.reduce((accumulator, current) => {
        if (
          !accumulator.find(
            (item) =>
              item.store.owner_name === current.store.owner_name &&
              item.store.name === current.store.name
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
    orderId,
    successPay,
    successSellerOrderSend, 
    navigate
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
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
                  CUSTOMER ORDER # {order.id}
                </p>
              </strong>
            </Row>
            <Row>
              <Col lg={8}>
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
                      {order.sellerOrder.map((sellerOrder, index) => {
                        return (
                          <Card style={{ marginBlockStart: "1rem" }}>
                            <Card.Body>
                              <Row className="text-end">
                                <h6>Seller Order # {sellerOrder.id}</h6>
                              </Row>
                              <Row
                                className="text-center"
                                style={{ color: "#698bc2" }}
                              >
                                <h5>{sellerOrder.seller.username}</h5>
                              </Row>
                            </Card.Body>
                            {sellerOrder.inStoreOrderItems.length > 0 && (
                              <>
                                <Row className="text-center">
                                  <h6>In-Store Pick Up Item(s)</h6>
                                </Row>
                                <Card
                                  style={{
                                    margin: "0.2rem",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  {sellerOrder.inStoreOrderItems.map(
                                    (orderItem) => {
                                      return (
                                        <>
                                          <OrderItemCard
                                            orderItem={orderItem}
                                            sellerOrder={sellerOrder}
                                          />
                                        </>
                                      );
                                    }
                                  )}
                                </Card>
                              </>
                            )}
                            {sellerOrder.onlineOrderItems.length > 0 && (
                              <>
                                <Row className="text-center">
                                  <h6>Shipping Item(s)</h6>
                                </Row>
                                <Card
                                  style={{
                                    margin: "0.2rem",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  {sellerOrder.onlineOrderItems.map(
                                    (orderItem) => {
                                      return (
                                        <>
                                          <OrderItemCard
                                            orderItem={orderItem}
                                            sellerOrder={sellerOrder}
                                          />
                                        </>
                                      );
                                    }
                                  )}
                                  <Row
                                    lg={4}
                                    className="text-center justify-content-center"
                                    style={{ marginTop: "0.5rem" }}
                                  >
                                    {sellerOrder.isShipped ? (
                                      <Message variant="success">
                                        Shipped on{" "}
                                        {sellerOrder.shippedAt.substring(0, 10)}
                                      </Message>
                                    ) : (
                                      <Message variant="warning">
                                        Not Shipped
                                      </Message>
                                    )}
                                  </Row>
                                </Card>
                              </>
                            )}
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
                          </Card>
                        );
                      })}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>

              <Col lg={4}>
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

                    <ListGroup.Item>
                      <Row>
                        <Col>Date:</Col>
                        <Col>
                          {order.createdAt.substring(0, 10)}{" "}
                          {order.createdAt.substring(11, 16)}
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

export default CustomerOrder;

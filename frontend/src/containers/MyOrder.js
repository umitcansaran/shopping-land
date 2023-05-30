import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
  ListGroupItem,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  getSellerOrderDetails,
  sendSellerOrder,
  retrieveSellerOrder,
} from "../store/actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_SEND_RESET,
  SELLER_ORDER_SEND_RESET,
} from "../store/constants/orderConstants";
import MyOrderItemCard from "./MyOrderItemCard";

function MyOrder() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate;

  const sellerOrderId = params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const {
    sellerOrder,
    error,
    loading: loadingSellerOrder,
  } = useSelector((state) => state.sellerOrderDetails);

  console.log(sellerOrder);

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const sellerOrderSend = useSelector((state) => state.sellerOrderSend);
  const { loading: loadingSellerOrderSend, success: successSellerOrderSend } =
    sellerOrderSend;

  // SUCCESSFULLY SENT MESSAGE BACKEND

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let totalItem;

  const isNumberDecimal = (num) => {
    if (num.toFixed(2) % 1 !== 0) {
      return num.toFixed(2);
    } else {
      return Math.trunc(num) + ".-";
    }
  };

  const hasOnlinePurchase =
    sellerOrder?.onlineOrderItems.length > 0 ? true : false;

  const hasInStorePickup =
    sellerOrder?.inStoreOrderItems.length > 0 ? true : false;

  let pickUpLocations = sellerOrder?.inStoreOrderItems
    .reduce((accumulator, current) => {
      if (
        !accumulator.find(
          (item) =>
            item.details.seller === current.details.seller &&
            item.store.name == current.store.name
        )
      ) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .sort((a, b) => (a.seller > b.seller ? 1 : b.seller > a.seller ? -1 : 0));

  //   const hasOnlinePurchase = order?.sellerOrder
  //     .map((sellerOrder) => {
  //       return sellerOrder.orderItems.map((orderItem) => {
  //         return orderItem.orderType === "online";
  //       });
  //     })
  //     .flat()
  //     .includes(true);

  //   const hasInStorePickup = order?.sellerOrder
  //     .map((sellerOrder) => {
  //       return sellerOrder.orderItems.filter((orderItem) => {
  //         return orderItem.orderType === "inStore";
  //       });
  //     })
  //     .flat();

  //   if (!loading && !error && order) {
  //     totalItem = order.sellerOrder.reduce(
  //       (acc, sellerOrder) =>
  //         acc +
  //         sellerOrder.orderItems.reduce((acc, item) => acc + item.quantity, 0),
  //       0
  //     );
  //   }

  let shippingCost;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !sellerOrder ||
      successPay ||
      sellerOrder.id !== Number(sellerOrderId) ||
      successSellerOrderSend
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: SELLER_ORDER_SEND_RESET });
      dispatch(getSellerOrderDetails(sellerOrderId));
    } else if (!sellerOrder.isPaid) {
      if (!window.paypal && process.env.PAYPAL_CLIENT_ID) {
        // addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    userInfo,
    sellerOrder,
    sellerOrderId,
    successPay,
    successSellerOrderSend,
    navigate
  ]);

  const shippingHandler = () => {
    dispatch(sendSellerOrder(sellerOrder.id));
  };

  const pickUpHandler = (id) => {
    dispatch(retrieveSellerOrder(id));
    // window.location.reload(true)
  };

  return (
    <Container fluid className="order-page-container">
      {loadingSellerOrder || loadingSellerOrderSend ? (
        <Loader />
      ) : (
        sellerOrder && (
          <>
            <Row>
              <strong>
                <p className="text-center my-3 main-order-id">
                  SELLER ORDER # {sellerOrder?.id}
                </p>
              </strong>
            </Row>
            <Row>
              <Col md={8}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Customer</h2>
                    <p>
                      <strong>Name: </strong> {sellerOrder.customer.username}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      <a href={`mailto:${sellerOrder.customer.email}`}>
                        {sellerOrder.customer.email}
                      </a>
                    </p>
                    {hasOnlinePurchase && (
                      <>
                        <h2>Shipping</h2>
                        <p>
                          <strong>Address: </strong>
                          {sellerOrder.shippingAddress.address},{" "}
                          {sellerOrder.shippingAddress.city},{"  "}
                          {sellerOrder.shippingAddress.postalCode},{"  "}
                          {sellerOrder.shippingAddress.country}
                        </p>
                      </>
                    )}
                  </ListGroup.Item>

                  {hasInStorePickup && (
                    <ListGroup.Item>
                      <h2>Pickup Location(s)</h2>
                      {pickUpLocations.map((item) => {
                        return (
                          <p>
                            {item.store.owner_name} - {item.store.name}
                          </p>
                        );
                      })}
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Col md={3} className="text-center">
                      {sellerOrder.isPaid ? (
                        <Message variant="success">
                          Paid on {sellerOrder.paidAt.substring(0, 10)}
                        </Message>
                      ) : (
                        <Message variant="warning">Not Paid</Message>
                      )}
                    </Col>
                  </ListGroup.Item>

                  {hasOnlinePurchase && (
                    <ListGroup.Item>
                      <Card style={{ marginBlockStart: "1rem" }}>
                        <h2>Item(s) to be shipped</h2>
                        {sellerOrder.onlineOrderItems.map((item) => {
                          return (
                            <MyOrderItemCard
                              item={item}
                              isNumberDecimal={isNumberDecimal}
                            />
                          );
                        })}
                        <Row className="justify-content-center">
                          <Col md={3} className="text-center">
                            {sellerOrder.isShipped ? (
                              <Message variant="success">
                                Sent on {sellerOrder.shippedAt.substring(0, 10)}
                              </Message>
                            ) : (
                              <Button
                                type="button"
                                className="btn btn-block"
                                onClick={() => shippingHandler()}
                                disabled={!sellerOrder.isPaid}
                              >
                                Mark As Sent
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Card>
                    </ListGroup.Item>
                  )}

                  {hasInStorePickup && (
                    <ListGroup.Item>
                      <Card style={{ marginBlockStart: "1rem" }}>
                        <h2>Item(s) to be retrieved</h2>
                        {sellerOrder.inStoreOrderItems.map((item) => {
                          return (
                            <>
                              <MyOrderItemCard
                                item={item}
                                pickUpHandler={pickUpHandler}
                                isNumberDecimal={isNumberDecimal}
                              />
                              <ListGroup.Item>
                                <Row className="justify-content-center">
                                  <Col md={3} className="text-center">
                                    {item.orderType === "inStore" &&
                                      (item.isRetrieved ? (
                                        <Message variant="success">
                                          Retrieved on{" "}
                                          {item.retrievedAt.substring(0, 10)}
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
                        })}
                      </Card>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </>
        )
      )}
    </Container>
  );
}

export default MyOrder;

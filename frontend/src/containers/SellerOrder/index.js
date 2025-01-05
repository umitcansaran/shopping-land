import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Card, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  getSellerOrderDetails,
  sendSellerOrder,
  retrieveSellerOrder,
  completeSellerOrder,
} from "../../store/actions/orderActions";
import {
  SELLER_ORDER_COMPLETE_RESET,
  SELLER_ORDER_RETRIEVE_RESET,
  SELLER_ORDER_SEND_RESET,
} from "../../store/constants/orderConstants";
import isNumberDecimal from "../../utils/isNumberDecimal";
import OrderItemCard from "./OrderItemCard";

function SellerOrder() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const sellerOrderId = params.id;

  const {
    sellerOrder,
    error: errorSellerOrder,
    loading: loadingSellerOrder,
  } = useSelector((state) => state.sellerOrderDetails);

  const sellerOrderSend = useSelector((state) => state.sellerOrderSend);
  const { loading: loadingSellerOrderSend, success: successSellerOrderSend } =
    sellerOrderSend;

  const sellerItemRetrieve = useSelector((state) => state.sellerOrderRetrieve);
  const {
    loading: loadingSellerOrderRetrieve,
    success: successSellerOrderRetrieve,
  } = sellerItemRetrieve;

  const sellerOrderComplete = useSelector((state) => state.sellerOrderComplete);
  const {
    loading: loadingSellerOrderComplete,
    success: successSellerOrderComplete,
  } = sellerOrderComplete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const hasOnlinePurchase =
    sellerOrder?.onlineOrderItems.length > 0 ? true : false;

  const hasInStorePickup =
    sellerOrder?.inStoreOrderItems.length > 0 ? true : false;

  const hasItemNotShipped = hasOnlinePurchase && !sellerOrder?.isShipped;
  const hasItemNotRetrieved =
    hasInStorePickup &&
    sellerOrder?.inStoreOrderItems.find((item) => item.isRetrieved === false)
      ? true
      : false;

  let pickUpLocations = sellerOrder?.inStoreOrderItems
    .reduce((accumulator, current) => {
      if (
        !accumulator.find(
          (item) =>
            item.details.seller === current.details.seller &&
            item.store.name === current.store.name
        )
      ) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .sort((a, b) => (a.seller > b.seller ? 1 : b.seller > a.seller ? -1 : 0));

  let totalInStoreOrderItems;
  let totalOnlineOrderItems;
  let totalItems;

  if (!loadingSellerOrder && !errorSellerOrder && sellerOrder) {
    totalInStoreOrderItems = sellerOrder.inStoreOrderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    totalOnlineOrderItems = sellerOrder.onlineOrderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    totalItems = totalInStoreOrderItems + totalOnlineOrderItems;
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !sellerOrder ||
      sellerOrder.id !== Number(sellerOrderId) ||
      successSellerOrderSend ||
      successSellerOrderRetrieve
    ) {
      dispatch({ type: SELLER_ORDER_SEND_RESET });
      dispatch({ type: SELLER_ORDER_RETRIEVE_RESET });
      dispatch({ type: SELLER_ORDER_COMPLETE_RESET });
      dispatch(getSellerOrderDetails(sellerOrderId));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    sellerOrderId,
    successSellerOrderSend,
    successSellerOrderRetrieve,
  ]);

  useEffect(() => {
    if (
      sellerOrder &&
      !sellerOrder.isCompleted &&
      sellerOrder.id === Number(sellerOrderId)
    ) {
      if (
        (!hasItemNotShipped || !hasOnlinePurchase) &&
        (!hasItemNotRetrieved || !hasInStorePickup)
      ) {
        dispatch(completeSellerOrder(sellerOrderId));
        dispatch(getSellerOrderDetails(sellerOrderId));
      }
    }
  }, [
    dispatch,
    sellerOrder,
    sellerOrderId,
    hasItemNotShipped,
    hasItemNotRetrieved,
    hasOnlinePurchase,
    hasInStorePickup,
  ]);

  useEffect(() => {
    if (successSellerOrderComplete) {
      dispatch({ type: SELLER_ORDER_COMPLETE_RESET });
    }
  }, [dispatch, successSellerOrderComplete]);

  const shippingHandler = () => {
    dispatch(sendSellerOrder(sellerOrder.id));
  };

  const pickUpHandler = (id) => {
    dispatch(retrieveSellerOrder(id));
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

                  <ListGroup.Item>
                    <Col md={3} className="text-center">
                      {sellerOrder.order.isPaid ? (
                        <Message variant="success">
                          Paid on {sellerOrder.order.paidAt.substring(0, 10)}
                        </Message>
                      ) : (
                        <Message variant="warning">Not Paid</Message>
                      )}
                    </Col>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    {hasOnlinePurchase && (
                      <Card style={{ marginBlockStart: "1rem" }}>
                        <Row className="text-center mt-2">
                          <h6>Shipping Item(s)</h6>
                        </Row>
                        {sellerOrder.onlineOrderItems.map((item, index) => {
                          return (
                            <OrderItemCard
                              item={item}
                              isNumberDecimal={isNumberDecimal}
                              key={item.id}
                            />
                          );
                        })}
                        <Row className="justify-content-center">
                          <Col md={4} className="text-center mt-2">
                            {sellerOrder.isShipped ? (
                              <Message variant="success">
                                Sent on{" "}
                                {sellerOrder.shippedAt.substring(0, 10) +
                                  " at " +
                                  sellerOrder.shippedAt.substring(11, 16)}
                              </Message>
                            ) : (
                              <Button
                                className="blue-button mb-2"
                                onClick={() => shippingHandler()}
                                disabled={!sellerOrder.order.isPaid}
                              >
                                Mark As Sent
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {hasInStorePickup && (
                      <Card style={{ marginBlockStart: "1rem" }}>
                        <Row className="text-center mt-2">
                          <h6>In-Store Pick Up Item(s)</h6>
                        </Row>

                        {sellerOrder.inStoreOrderItems.map((item, index) => {
                          return (
                            <>
                              <OrderItemCard
                                item={item}
                                pickUpHandler={pickUpHandler}
                                sellerOrder={sellerOrder}
                                key={item.id}
                              />
                            </>
                          );
                        })}
                      </Card>
                    )}
                  </ListGroup.Item>
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
                        <Col>Item(s):</Col>
                        <Col>{totalItems}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Total Price:</Col>
                        <Col>
                          CHF {isNumberDecimal(Number(sellerOrder.totalPrice))}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {hasInStorePickup && (
                      <ListGroup.Item>
                        <h2>Pickup Location(s)</h2>
                        {pickUpLocations.map((item) => {
                          return (
                            <p key={`${item.id}-${item.store}`}>
                              {item.store.name}
                            </p>
                          );
                        })}
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                      <h2>Parent Order</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <p>Customer Order #</p>
                        </Col>
                        <Col>
                          <p>{sellerOrder.order.id}</p>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <p>Date:</p>
                        </Col>
                        <Col>
                          <p>
                            {sellerOrder.createdAt.substring(0, 10)}{" "}
                            {sellerOrder.createdAt.substring(11, 16)}
                          </p>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {errorSellerOrder && (
                        <Message variant="danger">{errorSellerOrder}</Message>
                      )}
                    </ListGroup.Item>
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

export default SellerOrder;

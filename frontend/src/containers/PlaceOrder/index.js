import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import CheckoutSteps from "../../components/CheckoutSteps";
import { createOrder } from "../../store/actions/orderActions";
import { ORDER_CREATE_RESET } from "../../store/constants/orderConstants";
import isNumberDecimal from "../../utils/isNumberDecimal";

function PlaceOrder() {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.myDetails);

  const hasOnlinePurchase = cartItems.find(
    (item) => item.orderType === "online"
  );
  const hasInStorePickup = cartItems.find(
    (item) => item.orderType === "inStore"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  let shippingCost;
  let totalShippingPrice = 0;
  let subTotalPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
    if (success) {
      navigate(`/customer-order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, cart, success, order, navigate]);

  const placeOrder = () => {
    if (user) {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          paymentMethod: cart.paymentMethod,
          totalShippingPrice: totalShippingPrice,
          totalPrice: cart.itemsPrice,
          shippingAddress: cart.shippingAddress,
        })
      );
    }
  };

  // Remove duplicates and get unique seller name(s)
  let sellers = cartItems
    .reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.seller === current.seller)) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .map((item) => item.seller)
    .sort();

  // Remove duplicates and get unique location(s)
  let pickUpLocations = cartItems
    .filter((item) => item.orderType === "inStore")
    .reduce((accumulator, current) => {
      if (
        !accumulator.find(
          (item) =>
            item.seller === current.seller &&
            item.storeName == current.storeName
        )
      ) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .sort((a, b) => (a.seller > b.seller ? 1 : b.seller > a.seller ? -1 : 0));

  // Show total price by seller(s) order(s)
  let totalPriceBySeller = sellers.map((seller) => {
    return cart.cartItems
      .filter((product) => product.seller === seller)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  return (
    <Container fluid className="placeorder-page-container">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {hasOnlinePurchase && (
              <ListGroup.Item>
                <h2>Shipping Address</h2>
                <p>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
            )}
            {hasInStorePickup && (
              <ListGroup.Item>
                <h2>Pickup Location(s)</h2>
                {pickUpLocations.map((location) => {
                  return (
                    <p>
                      <span style={{ color: "#698bc2" }}>
                        {location.seller} - {location.storeName}:{" "}
                      </span>
                      {cartItems
                        .filter((item) => item.storeId === location.storeId)
                        .reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      product(s)
                    </p>
                  );
                })}
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                sellers.map((seller, index) => {
                  return (
                    <Card>
                      <Card.Title
                        className="text-center pt-3"
                        style={{ color: "#698bc2" }}
                      >
                        {seller}
                      </Card.Title>
                      <ListGroup variant="flush" key={index}>
                        {cart.cartItems
                          .filter((cartItem) => cartItem.seller === seller)
                          .map((product) => {
                            shippingCost =
                              totalPriceBySeller[index] >= 100 ? 0 : 20;
                            subTotalPrice =
                              totalPriceBySeller[index] + shippingCost;
                            totalShippingPrice += shippingCost;
                            return (
                              <>
                                <ListGroup.Item key={product.id}>
                                  <Row>
                                    <Col md={1}>
                                      <Image
                                        src={product.image}
                                        alt={product.name}
                                        fluid
                                        rounded
                                      />
                                    </Col>
                                    <Col md={3}>
                                      <Link to={`/product/${product.id}`}>
                                        {product.name}
                                      </Link>
                                    </Col>

                                    <Col md={2}>
                                      {product.quantity} x CHF{" "}
                                      {isNumberDecimal(Number(product.price))}
                                    </Col>

                                    <Col md={3}>
                                      <p
                                        style={{
                                          textAlign: "center",
                                        }}
                                      >
                                        {product.orderType === "inStore"
                                          ? product.storeName
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
                                      {product.orderType === "online"
                                        ? shippingCost === 0
                                          ? "Free Shipping"
                                          : "Shipping: CHF 20.-"
                                        : "Pick up in store"}
                                    </h6>
                                  </Row>
                                </ListGroup.Item>
                              </>
                            );
                          })}
                        <Row className="justify-content-end">
                          <h6
                            style={{
                              width: "auto",
                              margin: "0.5rem",
                            }}
                          >
                            Subtotal: CHF {isNumberDecimal(subTotalPrice)}
                          </h6>
                        </Row>
                      </ListGroup>
                    </Card>
                  );
                })
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
                  <Col>Seller(s):</Col>
                  <Col>{sellers.length}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Item(s):</Col>
                  <Col>{totalItems}</Col>
                </Row>
              </ListGroup.Item>

              {hasOnlinePurchase && (
                <>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>CHF {isNumberDecimal(cart.itemsPrice)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>
                        {totalShippingPrice === 0
                          ? "Free"
                          : "CHF " + totalShippingPrice + ".-"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Total Price:</Col>
                  <Col>
                    CHF {isNumberDecimal(cart.itemsPrice + totalShippingPrice)}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
                {!user && (
                  <Message variant="danger">Please log in to continue.</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className="justify-content-center">
                  <Button
                    type="button"
                    className="blue-button"
                    disabled={cart.cartItems === 0 || !user}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PlaceOrder;

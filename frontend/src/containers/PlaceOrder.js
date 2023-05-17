import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../store/actions/orderActions";
import { ORDER_CREATE_RESET } from "../store/constants/orderConstants";

function PlaceOrderScreen() {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
    if (success) {
      navigate(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, cart, success, order, navigate]);

  // !! Updating stock number in the backend !!
  // const updateProductStock = () => {
  //   cart.cartItems.forEach((item) =>
  //     dispatch(updateStock(item.stockID, { number: item.storeStock - item.quantity}))
  //   );
  // };

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        itemsPrice: cart.itemsPrice,
        paymentMethod: cart.paymentMethod,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
    // updateProductStock();
  };

  // Get unique seller names
  let sellers = cart.cartItems
    .reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.seller === current.seller)) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .map((product) => product.seller);

  // Show total price of products by seller
  let totalPriceBySeller = sellers.map((seller) => {
    return cart.cartItems
      .filter((product) => product.seller === seller)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  let shippingCost;
  let totalShippingCost = 0;
  let subTotalPrice;

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Shipping: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

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
                    <Card style={{ marginBlockStart: "1rem" }}>
                      <Card.Body>
                        <Card.Title
                          className="text-center"
                          style={{ color: "#698bc2" }}
                        >
                          {seller}
                        </Card.Title>
                      </Card.Body>
                      <ListGroup variant="flush" key={index}>
                        {cart.cartItems
                          .filter((cartItem) => cartItem.seller === seller)
                          .map((product) => {
                            shippingCost =
                              totalPriceBySeller[index] >= 100 ? 0 : 20;
                            subTotalPrice =
                              totalPriceBySeller[index] + shippingCost;
                            totalShippingCost += shippingCost;
                            return (
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

                                  <Col md={2}>${product.price}</Col>

                                  <Col md={3}>
                                    <p
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      {product.storeName}
                                    </p>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            );
                          })}
                        <Row className="justify-content-end">
                          <h6
                            style={{
                              width: "auto",
                              margin: "0.5rem",
                              color: "#698bc2",
                            }}
                          >
                            {shippingCost === 0
                              ? "Free Shipping"
                              : "Shipping: CHF 20"}
                          </h6>
                        </Row>
                        <Row className="justify-content-end">
                          <h6
                            style={{
                              width: "auto",
                              margin: "0.5rem",
                            }}
                          >
                            Subtotal: CHF {subTotalPrice}
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
                  <Col>Items:</Col>
                  <Col>CHF {cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>CHF {totalShippingCost}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>CHF {cart.itemsPrice + totalShippingCost}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;

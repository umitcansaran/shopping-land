import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import Message from "../../components/Message";
import {
  addToCart,
  emptyCart,
  removeFromCart,
} from "../../store/actions/cartActions";
import { listUsers } from "../../store/actions/userActions";
import isNumberDecimal from "../../utils/isNumberDecimal";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);
  const { users } = useSelector((state) => state.userList);

  let shippingCost;
  let totalShippingCost = 0;
  let subTotalPrice;

  useEffect(() => {
    if (users?.length === 0) {
      dispatch(listUsers());
    }
  }, [dispatch]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const hasOnlinePurchase = cartItems.find(
    (item) => item.orderType === "online"
  );

  const totalPrice = cartItems
    .reduce((acc, product) => acc + product.quantity * product.price, 0)
    .toFixed(2);

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
    }
    if (hasOnlinePurchase) {
      navigate("/shipping");
    } else {
      navigate("/payment");
    }
  };

  // Get unique seller names
  let sellers = cartItems
    .reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.seller === current.seller)) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .map((product) => product.seller);

  // Show total price of products by seller
  let totalPriceBySeller = sellers.map((seller) => {
    return cartItems
      .filter((product) => product.seller === seller)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  return (
    <Container fluid className="card-page-container">
      <Row className="m-3">
        <Col md={8}>
          <Row>
            <Col md={10}>
              <h1>Shopping Cart</h1>
            </Col>
            {cartItems.length > 1 && (
              <Col md={2} className="my-auto">
                <Button
                  style={{ width: "auto" }}
                  type="button"
                  variant="light"
                  onClick={() => dispatch(emptyCart())}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </Col>
            )}
          </Row>
          {cartItems.length === 0 ? (
            <Message variant="info">
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            sellers.map((seller, index) => {
              const sellerId = cartItems.find(
                (item) => item.seller === seller
              ).sellerId
              return (
                <Card style={{ marginBlockStart: "1rem" }}>
                  <Card.Title
                    className="text-center pt-3"
                    style={{ color: "#698bc2" }}
                  >
                    <Link to={`/seller/${sellerId}`}>{seller}</Link>
                  </Card.Title>
                  <ListGroup variant="flush" key={index}>
                    {cartItems
                      .filter((cartItem) => cartItem.seller === seller)
                      .map((product) => {
                        shippingCost =
                          totalPriceBySeller[index] >= 100 ? 0 : 20;
                        totalShippingCost += shippingCost;
                        subTotalPrice =
                          totalPriceBySeller[index] + shippingCost;
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

                                <Col md={3}>
                                  CHF {isNumberDecimal(Number(product.price))}
                                </Col>

                                <Col md={4}>
                                  <>
                                    <p>
                                      {product.orderType === "inStore"
                                        ? product.storeName
                                        : "Online"}
                                    </p>
                                    <Form.Control
                                      as="select"
                                      value={product.quantity}
                                      style={{ width: "auto" }}
                                      onChange={(e) =>
                                        dispatch(
                                          addToCart(
                                            product.id,
                                            Number(e.target.value),
                                            product.orderType,
                                            product.productStock,
                                            product.stockId,
                                            product.storeName,
                                            product.storeId
                                          )
                                        )
                                      }
                                    >
                                      {[
                                        ...Array(product.productStock).keys(),
                                      ].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                          {x + 1}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </>
                                </Col>
                                <Col md={1}>
                                  <Button
                                    style={{ width: "auto" }}
                                    type="button"
                                    variant="light"
                                    onClick={() =>
                                      removeFromCartHandler(product.id)
                                    }
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
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
                          Subtotal: CHF {isNumberDecimal(subTotalPrice)}
                        </h6>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              );
            })
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              {hasOnlinePurchase && (
                <ListGroup.Item>
                  <p style={{ textAlign: "center", margin: "0" }}>
                    Free shipping on orders over CHF 100.-
                  </p>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <h2>
                  Total Price (
                  {cartItems.reduce(
                    (acc, product) => acc + product.quantity,
                    0
                  )}
                  ) items
                </h2>
                CHF {isNumberDecimal(Number(totalPrice) + totalShippingCost)}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item>
              <Row className="justify-content-center">
                <Button
                  type="button"
                  className="blue-button mb-2"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </Row>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;

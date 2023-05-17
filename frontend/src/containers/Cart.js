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
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../store/actions/cartActions";

function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { quantity, id, storeName, storeStock, stockID, storeID, productInfo } =
    location.state ? location.state : 1;

  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (id) {
      dispatch(
        addToCart(
          id,
          quantity,
          storeName,
          storeStock,
          productInfo.seller_details.name,
          stockID,
          storeID
        )
      );
    }
  }, [
    dispatch,
    id,
    quantity,
    storeName,
    storeStock,
    stockID,
    storeID,
    productInfo,
  ]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/shipping");
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

  let shippingCost;
  let subTotalPrice;

  return (
    <Row className="m-3">
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          sellers.map((seller, index) => {
            return (
              <ListGroup variant="flush" key={index}>
                <Row className="justify-content-center">
                  <h4
                    style={{
                      textAlign: "center",
                      width: "auto",
                      margin: "1rem",
                      color: "#698bc2",
                    }}
                  >
                    {seller}
                  </h4>
                </Row>
                {cartItems
                  .filter((cartItem) => cartItem.seller === seller)
                  .map((product) => {
                    shippingCost = totalPriceBySeller[index] >= 100 ? 0 : 20;
                    subTotalPrice = totalPriceBySeller[index] + shippingCost;
                    return (
                      <ListGroup.Item key={product.id}>
                        <Row>
                          <Col md={2}>
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
                            <>
                              <p
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {product.storeName}
                              </p>
                              <Form.Control
                                as="select"
                                value={product.quantity}
                                onChange={(e) =>
                                  dispatch(
                                    addToCart(
                                      product.id,
                                      Number(e.target.value),
                                      product.storeName,
                                      product.storeStock,
                                      seller
                                    )
                                  )
                                }
                              >
                                {[...Array(product.storeStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </Form.Control>
                            </>
                          </Col>

                          <Col md={1}>
                            <Button
                              type="button"
                              variant="light"
                              onClick={() => removeFromCartHandler(product.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                <Row className="justify-content-end">
                  <h6
                    style={{
                      textAlign: "center",
                      width: "auto",
                      margin: "0.5rem",
                    }}
                  >
                    {shippingCost === 0 ? "Free Shipping" : "Shipping: CHF 20"}
                  </h6>
                </Row>
                <Row className="justify-content-end">
                  <h6
                    style={{
                      textAlign: "center",
                      width: "auto",
                      margin: "0.5rem",
                    }}
                  >
                    Subtotal: CHF {subTotalPrice}
                  </h6>
                </Row>
              </ListGroup>
            );
          })
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Total Price (
                {cartItems.reduce((acc, product) => acc + product.quantity, 0)})
                items
              </h2>
              CHF{" "}
              {cartItems.reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
              )}
            </ListGroup.Item>
          </ListGroup>
          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;

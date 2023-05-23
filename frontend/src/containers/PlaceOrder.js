import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../store/actions/orderActions";
import { ORDER_CREATE_RESET } from "../store/constants/orderConstants";
import { updateStock } from "../store/actions/stockActions";
import { listProductStocks } from "../store/actions/productActions";
import { PRODUCT_STOCKS_RESET } from "../store/constants/productConstants";

function PlaceOrderScreen() {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const { cartItems } = useSelector((state) => state.cart);
  const onlinePurchase = cartItems.find((item) => item.selectedOnline);
  const inStorePickup = cartItems.find((item) => item.storeID);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let shippingCost;
  let totalShippingCost = 0;
  let subTotalPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
    if (success) {
      navigate(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, cart, success, order, navigate]);

  const { stocks, loading: loadingStocks } = useSelector(
    (state) => state.productStocks
  );

  // !! Updating stock number in the backend !!
  //   const updateProductStock = () => {
  //     cart.cartItems.forEach(async (item) => {
  //       if (item.storeID) {
  //       console.log('idddd', item.id)
  //       await dispatch(listProductStocks(item.id));
  //       console.log('stocks', stocks)
  //     }
  //   }
  //     dispatch(updateStock(item.stockID, { number: item.storeStock - item.quantity}))
  //   );
  // };

  //   for (const item of cartItems) {
  //     console.log('idddd', item.id)
  //     await dispatch(listProductStocks(item.id));
  //     console.log('stocks', stocks)
  // }

  // const updateProductStock = async () => {
  //   for (const item of cartItems) {
  //     if (!item.storeID) {
  //       console.log(item.name)
  //       dispatch(listProductStocks(item.id));
  //       await loadingStocks
  //       console.log('stocks', stocks)
  //     }
  //   }
  // };

  // const allPromises = cartItems.forEach((item) => {
  //   console.log('stocks', stocks)
  //   return dispatch(listProductStocks(item.id));
  // });

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        paymentMethod: cart.paymentMethod,
        totalShippingPrice: totalShippingCost,
        totalPrice: cart.itemsPrice,
        shippingAddress: cart.shippingAddress,
      })
    );
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

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {onlinePurchase && (
              <ListGroup.Item>
                <h2>Shipping Address</h2>
                <p>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
            )}
            {inStorePickup && (
              <ListGroup.Item>
                <h2>Pickup Location(s)</h2>
                {cartItems.map((item) => {
                  if (!item.selectedOnline) {
                    return (
                      <p>
                        {item.seller} - {item.storeName}
                      </p>
                    );
                  }
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
                                      {product.quantity} x CHF {product.price}
                                    </Col>

                                    <Col md={3}>
                                      <p
                                        style={{
                                          textAlign: "center",
                                        }}
                                      >
                                        {product.storeName
                                          ? product.storeName
                                          : "Online"}
                                      </p>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <Row className="justify-content-end">
                                    <h6
                                      style={{
                                        textAlign: "center",
                                        width: "auto",
                                        margin: "0.5rem",
                                        color: "#698bc2",
                                      }}
                                    >
                                      {product.selectedOnline
                                        ? shippingCost === 0
                                          ? "Free Shipping"
                                          : "Shipping: CHF 20"
                                        : "Pick up in store"}
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
                                </ListGroup.Item>
                              </>
                            );
                          })}
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

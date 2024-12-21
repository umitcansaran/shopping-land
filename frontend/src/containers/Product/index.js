import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../../components/Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Container,
} from "react-bootstrap";
import {
  listProductDetails,
  listProductReviews,
  createProductReview,
} from "../../store/actions/productActions";
import { myDetails } from "../../store/actions/userActions";
import {
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_DETAILS_RESET,
} from "../../store/constants/productConstants";
import StocksCart from "./StocksCart";
import { addToCart } from "../../store/actions/cartActions";
import isNumberDecimal from "../../utils/isNumberDecimal";
import { listProductStocks } from "../../store/actions/stockActions";
import { PRODUCT_STOCKS_RESET } from "../../store/constants/stockConstants";

function Product() {
  const [quantity, setQuantity] = useState(0);
  const [selectedStore, setSelectedStore] = useState({});
  const [storeName, setStoreName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [stockId, setStockId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [orderType, setOrderType] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const {
    product,
    error,
    loading: loadingProduct,
  } = useSelector((state) => state.productDetails);
  const { stocks, loading: loadingStocks } = useSelector(
    (state) => state.productStocks
  );
  const { reviews } = useSelector((state) => state.productReviews);
  const { user } = useSelector((state) => state.myDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = useSelector((state) => state.productReviewCreate);

  const isLoggedInUserProduct = user?.id === product.seller ? true : false;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch({ type: PRODUCT_DETAILS_RESET });
    dispatch({ type: PRODUCT_STOCKS_RESET });
    dispatch(listProductDetails(params.id));
    dispatch(listProductStocks(params.id));
    dispatch(listProductReviews(params.id));
    dispatch(myDetails());
  }, [dispatch, params, successProductReview]);

  const totalStock = stocks.reduce((acc, stock) => acc + stock.number, 0);

  const inStoreOrderItemStock = (
    e,
    storeName,
    stockNumber,
    stockId,
    storeId
  ) => {
    setQuantity(Number(e.target.value));
    setStoreName(storeName);
    setProductStock(stockNumber);
    setStockId(stockId);
    setStoreId(storeId);
  };

  const onlineOrderItemStock = (stockNumber) => {
    setQuantity(stockNumber);
    setProductStock(totalStock);
  };

  const addToCartHandler = () => {
    if (orderType === "inStore") {
      dispatch(
        addToCart(
          product.id,
          quantity,
          orderType,
          productStock,
          stockId,
          storeName,
          storeId
        )
      );
    }
    if (orderType === "online") {
      dispatch(addToCart(product.id, quantity, orderType, productStock));
    }
    navigate("/cart");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(params.id, { rating, comment }));
  };

  return (
    <Container fluid className="product-page-container">
      {loadingProduct || loadingStocks ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Col className="mt-3">
          <Row>
            <Col md={4}>
              <Image
                className="rounded mx-auto d-block"
                src={product.image}
                alt={product.name}
                style={{
                  maxHeight: "25rem",
                  maxWidth: "25rem",
                  padding: "2rem",
                }}
                fluid
              />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 style={{ color: "#1e478a" }}>{product.brand}</h3>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>

                <ListGroup.Item>Product # {product.id}</ListGroup.Item>

                <ListGroup.Item>
                  Sold by{" "}
                  <Link
                    to={`/seller/${
                      product.sellerDetails && product.sellerDetails.id
                    }`}
                  >
                    {product.sellerDetails && product.sellerDetails.name}
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          CHF {isNumberDecimal(Number(product.price))}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {totalStock && totalStock > 0 ? (
                          <p
                            style={{
                              color: "#1e478a",
                              margin: "0",
                              padding: "0",
                            }}
                          >
                            In Stock
                          </p>
                        ) : (
                          "Out of Stock"
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {totalStock > 0 && (
                    <StocksCart
                      stocks={stocks}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      selectedStore={selectedStore}
                      setSelectedStore={setSelectedStore}
                      orderType={orderType}
                      setOrderType={setOrderType}
                      inStoreOrderItemStock={inStoreOrderItemStock}
                      onlineOrderItemStock={onlineOrderItemStock}
                      totalStock={totalStock}
                      isLoggedInUserProduct={isLoggedInUserProduct}
                    />
                  )}
                  {product.seller === user?.id && (
                    <ListGroup.Item>
                      <Message variant="danger">
                        Seller accounts can't buy products from their own
                        stores.
                      </Message>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row className="justify-content-center">
                      <Button
                        onClick={addToCartHandler}
                        className="btn-block btn-primary"
                        disabled={
                          (stocks && stocks.length === 0) || quantity === 0
                        }
                        type="button"
                      >
                        Add to Cart
                      </Button>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="pt-4">
            <Col md={6}>
              <h4>Reviews</h4>
              {reviews && reviews.length === 0 && (
                <Message variant="secondary">No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {reviews &&
                  reviews.map((review, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color="#f8e825" />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h4>Write a review</h4>
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="primary">Review Submitted</Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}

                  {userInfo ? (
                    user && user.profile.status === "CUSTOMER" ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="comment">
                          <Form.Label>Review</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>

                        <Button
                          disabled={loadingProductReview}
                          type="submit"
                          variant="primary"
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message variant="secondary">
                        Only users with a customer profile can write a review
                      </Message>
                    )
                  ) : (
                    <Message variant="primary">
                      Please <Link to="/login">login</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Col>
      )}
    </Container>
  );
}

export default Product;

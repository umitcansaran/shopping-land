import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Form, Button, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductsByUser } from "../../store/actions/productActions";
import { search } from "../../store/actions/searchAction";
import { listStoresByUser } from "../../store/actions/storeActions";
import { getProfileDetails } from "../../store/actions/userActions";
import { PROFILE_DETAILS_RESET } from "../../store/constants/userConstants";
import ProductCard from "../../components/ProductCard";
import "./index.css";
import Loader from "../../components/Loader";

function Seller() {
  const [value, setValue] = useState("");
  const [store, setStore] = useState("");

  const dispatch = useDispatch();
  const params = useParams();

  const { stores, loading: storesLoading } = useSelector(
    (state) => state.storesByUser
  );
  const { products } = useSelector((state) => state.productsByUser);
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profileDetails
  );

  useEffect(() => {
    dispatch({ type: PROFILE_DETAILS_RESET });
    dispatch(getProfileDetails(params.id));
    dispatch(listStoresByUser(params.id));
    dispatch(listProductsByUser(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (store !== "" && value === "") {
      dispatch(
        search({
          type: "products_in_store",
          store: store.id,
          searchString: "",
        })
      );
    }
    if (store !== "" && value !== "") {
      dispatch(
        search({
          type: "products_in_store",
          store: store.id,
          searchString: value,
        })
      );
    }
  }, [dispatch, store, value]);

  const storeSearchHandler = (e) => {
    setValue(e.target.value);
    if (store === "") {
      dispatch(
        search({
          type: "products_by_seller",
          seller_id: profile.id,
          searchString: e.target.value,
        })
      );
    }
  };

  const placeholder =
    `Search by brand or product name` + (store ? ` in ${store.name}` : "");

  return (
    <>
      <Row
        style={{
          backgroundColor: "#495b7a",
          height: "3rem",
          justifyContent: "center",
        }}
      >
        <Col sm={12} lg={5}>
          <Form
            className="d-flex justify-content-center my-2"
            style={{ height: "2rem" }}
          >
            <Form.Control
              placeholder={placeholder}
              aria-label="Search"
              value={value}
              onChange={(e) => storeSearchHandler(e)}
            />
          </Form>
        </Col>
      </Row>
      {storesLoading || profileLoading ? (
        <Loader />
      ) : (
        <>
          <Row
            className="mt-3 align-items-center pb-2"
            style={{ borderBottom: "solid 1px lightgrey" }}
          >
            <Col className="text-center justify-content-center" md={2}>
              <Image
                src={profile.image}
                style={{ width: "auto", maxWidth: "15rem", maxHeight: "5rem" }}
              />
            </Col>
            <Col md={9}>
              <ListGroup variant="flush" style={{ fontSize: "0.8rem" }}>
                <ListGroup.Item>
                  <strong>Industry: </strong>
                  {profile.industry}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Headquarter: </strong>
                  {profile.headquarter}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description: </strong>
                  {profile.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-3 px-2">
            <Col md={2} className="seller-sidebar">
              <strong>
                <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                  {store === ""
                    ? "Filter products by store"
                    : `You can search in store`}
                </p>
              </strong>

              {stores &&
                stores.map((sellerStore) => {
                  return (
                    <Row style={{ justifyContent: "center" }}>
                      <Button
                        onClick={() => setStore(sellerStore)}
                        className="seller-store-button"
                      >
                        {sellerStore.name}
                      </Button>
                    </Row>
                  );
                })}
              {store !== "" && (
                <Row style={{ justifyContent: "center" }}>
                  <Button
                    variant="secondary"
                    onClick={() => (
                      setStore(""), dispatch(listProductsByUser(params.id))
                    )}
                    className="m-2"
                    style={{ width: "5rem", backgroundColor: "white" }}
                  >
                    Back
                  </Button>
                </Row>
              )}
            </Col>
            <Col className="mx-1">
              <Row
                style={{ textAlign: "center" }}
                className="product-card-container"
              >
                {products &&
                  products.length === 0 &&
                  (value !== "" ? (
                    store !== "" ? (
                      <h5>No search results in {store.name} store!</h5>
                    ) : (
                      <h5>No search results in stocks!</h5>
                    )
                  ) : (
                    <h5>Currently no product to show!</h5>
                  ))}
                <Row className="product-card-row">
                  {products &&
                    products.map((product, index) => {
                      return <ProductCard product={product} key={index} />;
                    })}
                </Row>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Seller;

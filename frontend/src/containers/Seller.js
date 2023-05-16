import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Image,
  Container,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductsByUser } from "../store/actions/productActions";
import { search } from "../store/actions/searchAction";
import { listStoresByUser } from "../store/actions/storeActions";
import { getProfileDetails } from "../store/actions/userActions";
import { PROFILE_DETAILS_RESET } from "../store/constants/userConstants";
import ProductCard from "../components/ProductCard";
import SearchBox from "../components/SearchBox";
import { PRODUCT_LIST_RESET } from "../store/constants/productConstants";

export default function SellerScreen() {
  const [value, setValue] = useState("");
  const [store, setStore] = useState("");

  const dispatch = useDispatch();
  const params = useParams();

  const { stores } = useSelector((state) => state.storesByUser);
  const { products } = useSelector((state) => state.productsByUser);
  const { profile } = useSelector((state) => state.profileDetails);

  useEffect(() => {
    dispatch({ type: PROFILE_DETAILS_RESET });
    // dispatch({ type: PRODUCT_LIST_RESET });
    dispatch(getProfileDetails(params.id));
    dispatch(listStoresByUser(params.id));
    dispatch(listProductsByUser(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (store !== "" && value === "") {
      dispatch(
        search({
          type: "product_in_store",
          store: store.id,
          searchString: "",
        })
      );
    }
    if (store !== "" && value != "") {
      dispatch(
        search({
          type: "product_in_store",
          store: store.id,
          searchString: value,
        })
      );
    }
  }, [store, value]);

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
      {/* <SearchBox
        searchProps={{ type: "products_by_seller", seller_id: profile.id, searchString: value }}
        value={value}
        setValue={setValue}
        placeholder="Search for a product, brand.."
        width="50%"
      /> */}
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
              // type={searchProps.type}
              placeholder={placeholder}
              aria-label="Search"
              // style={{ width: width }}
              value={value}
              onChange={(e) => storeSearchHandler(e)}
            />
          </Form>
        </Col>
      </Row>
      <Container>
        <Row
          className="mt-3 justify-content-center pb-2"
          style={{ borderBottom: "solid 1px lightgrey" }}
        >
          <Col className="text-center align-items-center" md={5}>
            <Image
              src={profile.image}
              style={{ width: "auto", height: "6rem" }}
            />
          </Col>
          <Col md={7}>
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
      </Container>
      <Row className="mt-3 px-2">
        <Col md={2}>
          <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
            {store === ""
              ? "Filter products by store"
              : `You can search in store`}
          </p>
          {store !== "" && (
            <i
              class="fa-solid fa-x"
              onClick={() => (
                setStore(""), dispatch(listProductsByUser(params.id))
              )}
            ></i>
          )}
          {stores &&
            stores.map((sellerStore) => {
              return (
                <Row style={{ justifyContent: "center" }}>
                  <Button
                    onClick={() => setStore(sellerStore)}
                    style={{
                      width: "70%",
                    }}
                    variant={
                      store.name === sellerStore.name ? "secondary" : "light"
                    }
                    // className={'mx2' + (store.name === sellerStore.name) ? ' blue-button' : ''}
                    style={{ marginBottom: "0.3rem" }}
                  >
                    {sellerStore.name}
                  </Button>
                </Row>
              );
            })}
        </Col>
        <Col>
          <Row style={{ textAlign: "center" }}>
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
            {products &&
              products.map((product, index) => {
                return (
                  <Col
                    xs={6}
                    md={4}
                    lg={4}
                    xl={3}
                    className="gx-1 gy-1 product-card"
                  >
                    <ProductCard product={product} key={index} />
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </>
  );
}

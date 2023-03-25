import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  ListGroup,
  Form,
  Image,
  Container,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listReviews,
  listLatestProducts,
  listProductsByUser,
} from "../store/actions/productActions";
import { search } from "../store/actions/searchAction";
import { listStoresByUser } from "../store/actions/storeActions";
import { getProfileDetails } from "../store/actions/userActions";
import { PROFILE_DETAILS_RESET } from "../store/constants/userConstants";
import { CFormCheck } from "@coreui/react";
import ProductCard from "../components/ProductCard";
import SearchBox from "../components/SearchBox";

export default function SellerScreen() {
  const [value, setValue] = useState("");
  const [radioSearchValue, setRadioSearchValue] = useState("");
  const [storeName, setStoreName] = useState("");

  const dispatch = useDispatch();
  const params = useParams();

  const { stores } = useSelector((state) => state.storesByUser);
  const { products } = useSelector((state) => state.productsByUser);
  const { profile } = useSelector((state) => state.profileDetails);

  useEffect(() => {
    dispatch({ type: PROFILE_DETAILS_RESET });
    dispatch(getProfileDetails(params.id));
    dispatch(listStoresByUser(params.id));
    dispatch(listProductsByUser(params.id));
    dispatch(listLatestProducts());
    dispatch(listReviews());
  }, [dispatch, params.id]);

  const radioSearchHandler = (e) => {
    setRadioSearchValue(e.target.value);
    dispatch(
      search({
        type: "product_in_store",
        store: storeName,
        searchString: e.target.value,
      })
    );
  };

  const radioChange = (store) => {
    setStoreName(store);
    setRadioSearchValue("");
  };

  return (
    <>
      <SearchBox
        value={value}
        setValue={setValue}
        type="products_by_seller"
        seller_id={profile.id}
        placeholder="Search for a product, brand or retailer name.."
        color="#1e478a"
        width="50%"
      />
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
        <Col md={2} className="m-4">
          <strong>
            <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
              Select a store to search for a product id, brand or name..
            </p>
          </strong>
          <Form className="d-flex justify-content-center mb-3">
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{
                width: "100%",
                borderRadius: "20px 20px 20px 20px",
                borderColor: "#233fa6",
              }}
              value={radioSearchValue}
              onChange={(e) => radioSearchHandler(e)}
            />
          </Form>
          {stores &&
            stores.map((store) => {
              return (
                <CFormCheck
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  label={store.name}
                  onClick={(e) => {
                    radioChange(store.name);
                  }}
                  style={{ backgroundColor: "#233fa6" }}
                  className="my-2"
                />
              );
            })}
        </Col>
        <Col>
          <Row>
            {products &&
              products.map((product, index) => {
                return (
                  <Col sm={12} md={6} lg={4} xl={3} className="gx-3 gy-2">
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

import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { search } from "../../store/actions/searchAction";
import { listStoreStocks } from "../../store/actions/storeActions";
import { STORE_STOCKS_RESET } from "../../store/constants/storeConstants";
import Loader from "../../components/Loader";

export default function StoreStocks({ store }) {
  const [value, setValue] = useState("");

  const dispatch = useDispatch();

  const { stocks, loading } = useSelector((state) => state.storeStocks);

  useEffect(() => {
    if (value === "") {
      dispatch(listStoreStocks(store.id));
    }
    // dispatch({ type: STORE_STOCKS_RESET });
  }, [dispatch, value, store.id]);

  const searchHandler = (e, storeName) => {
    setValue(e.target.value);
    dispatch(
      search({
        type: "product_in_my_store",
        store: storeName,
        searchString: e.target.value,
      })
    );
  };

  return (
    <>
      <tr>
        <td colSpan="6">
          <Row className="d-flex justify-content-center">
            <Col md={12} xl={10}>
              <Row className="d-flex justify-content-center mb-2">
                <Col xs={10} sm={8} md={6} xl={6}>
                  <Form
                    className="d-flex justify-content-center my-1"
                    style={{ height: "2rem" }}
                  >
                    <Form.Control
                      type="search"
                      placeholder="Search for an ID, brand or product name"
                      aria-label="Search"
                      value={value}
                      onChange={(e) => searchHandler(e, store.name)}
                    />
                  </Form>
                </Col>
              </Row>
              <Row className="text-center" style={{ fontSize: "0.8rem" }}>
                <Col>
                  <strong>ID</strong>
                </Col>
                <Col>
                  <strong>BRAND</strong>
                </Col>
                <Col>
                  <strong>NAME</strong>
                </Col>
                <Col>
                  <strong>PRICE</strong>
                </Col>
                <Col>
                  <strong>CATEGORY</strong>
                </Col>
                <Col>
                  <strong>STOCK</strong>
                </Col>
              </Row>
              {stocks?.map((stock, index) => {
                return (
                  <Row
                    className="text-center my-1 py-1"
                    style={{
                      border: "solid 0.07rem lightgrey",
                      backgroundColor: "#f2f5fa",
                      borderRadius: "5px 5px 5px 5px",
                    }}
                  >
                    <Col>{stock.product_details.id}</Col>
                    <Col>{stock.product_details.brand}</Col>
                    <Col>{stock.product_details.name}</Col>
                    <Col>{stock.product_details.price}</Col>
                    <Col>{stock.product_details.category}</Col>
                    <Col>{stock.number}</Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </td>
      </tr>
    </>
  );
}

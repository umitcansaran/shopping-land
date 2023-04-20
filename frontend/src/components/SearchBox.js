import React, { useEffect } from "react";
import { Row, Form, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { search } from "../store/actions/searchAction";

export default function SearchBox({
  searchProps,
  placeholder,
  value,
  setValue,
  actionType,
}) {
  const dispatch = useDispatch();

  const { ...rest } = searchProps;
  rest["searchString"] = value;

  useEffect(() => {
    if (value.length > 1) {
      if (actionType) {
        dispatch({ type: actionType });
      }
      dispatch(search(rest));
    }
  }, [dispatch, value]);

  return (
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
            type={searchProps.type}
            placeholder={placeholder}
            aria-label="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Form>
      </Col>
    </Row>
  );
}

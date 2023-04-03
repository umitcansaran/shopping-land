import React, { useEffect } from "react";
import { Row, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { search } from "../store/actions/searchAction";

export default function SearchBox({
  searchProps,
  placeholder,
  value,
  setValue,
  width,
  actionType
}) {
  const dispatch = useDispatch();

  const { ...rest } = searchProps;
  rest["searchString"] = value;

  useEffect(() => {
    if (value.length > 1) {
      if (actionType) {
        dispatch({ type: actionType });
      }
      const timeout = setTimeout(() => {
        dispatch(search(rest));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, value]);

  return (
    <Row style={{ backgroundColor: "#495b7a", height: "3rem" }}>
      <Form
        className="d-flex justify-content-center my-2"
        style={{ height: "2rem" }}
      >
        <Form.Control
          type={searchProps.type}
          placeholder={placeholder}
          aria-label="Search"
          style={{ width: width }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form>
    </Row>
  );
}

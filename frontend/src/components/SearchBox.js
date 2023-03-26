import React from "react";
import { Row, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { search } from "../store/actions/searchAction";

export default function SearchBox({
  searchProps,
  placeholder,
  color,
  value,
  setValue,
  width,
}) {
  const dispatch = useDispatch();

  const { ...rest } = searchProps;

  const searchHandler = (e) => {
    setValue(e.target.value);
    rest["searchString"] = e.target.value;

    if (value.length < 2) {
      setTimeout(() => {
        dispatch(search(rest));
      }, 1000);
    }
  };

  return (
    <Row style={{ backgroundColor: color, height: "3rem" }}>
      <Form
        className="d-flex justify-content-center my-2"
        style={{ height: "2rem" }}
      >
        <Form.Control
          type={searchProps.type}
          placeholder={placeholder}
          aria-label="Search"
          style={{ width: width, borderRadius: "30px 30px 30px 30px" }}
          value={value}
          onChange={(e) => searchHandler(e)}
        />
      </Form>
    </Row>
  );
}

import React, { useEffect } from "react";
import { Row, Form, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { search } from "../store/actions/searchAction";
import useDebounce from "../utils/useDebounce";

function SearchBox({
  searchProps,
  value,
  setValue,
  placeholder,
  actionType,
}) {

  const dispatch = useDispatch();
  const debouncedSearchTerm = useDebounce(value, 500);

  const { ...rest } = searchProps;
  rest["searchString"] = value;

  useEffect(() => {
    if (actionType) {
      dispatch({ type: actionType });
    }
    if (debouncedSearchTerm) {
      dispatch(search(rest));
    }
  }, [dispatch, debouncedSearchTerm, actionType]);

  return (
    <Row
      style={{
        backgroundColor: "#495b7a",
        height: "3rem",
        justifyContent: "center",
      }}
    >
      <Col xs={10} sm={6} lg={5}>
        <Form
          className="d-flex justify-content-center my-2"
          style={{ height: "2rem" }}
        >
          <Form.Control
            type="text"
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

export default SearchBox

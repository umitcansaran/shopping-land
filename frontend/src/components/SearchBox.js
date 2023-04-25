import React from "react";
import { Row, Form, Col } from "react-bootstrap";

export default function SearchBox({ placeholder, value, searchHandler }) {
  return (
    <Row
      style={{
        backgroundColor: "#495b7a",
        height: "3rem",
        justifyContent: "center",
        margin: "0",
        padding: "0",
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
            onChange={(e) => searchHandler(e.target.value)}
          />
        </Form>
      </Col>
    </Row>
  );
}

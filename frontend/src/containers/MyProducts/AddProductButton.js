import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Row } from "react-bootstrap";

export default function AddProductButton() {
  const [select, setSelect] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <Row style={{ height: "2.5rem", marginBottom:'0.5rem' }}>
        <Nav variant="pills" className="d-flex justify-content-center">
          <Nav.Item>
            <Nav.Link
              className="d-flex align-items-center"
              style={{ height: "2rem", backgroundColor: "#99abc3" }}
              onClick={() => setSelect(!select)}
              eventKey="product"
            >
              Add Product
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      {select && navigate("add-product")}
    </>
  );
}

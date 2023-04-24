import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Row } from "react-bootstrap";

export default function AddStoreButton() {
  const [select, setSelect] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <Row style={{ backgroundColor: "#495b7a", height: "3rem" }}>
        <Nav variant="pills" className="d-flex justify-content-center">
          <Nav.Item>
            <Nav.Link
              className="d-flex align-items-center"
              style={{ height: "2rem", borderRadius: "30px 30px 30px 30px" }}
              onClick={() => setSelect(!select)}
              eventKey="product"
            >
              Add Store
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      {select && navigate("add-store")}
    </>
  );
}

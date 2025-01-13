import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Row } from "react-bootstrap";

export default function AddProductButton() {
  const [select, setSelect] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <Row style={{ height:'2.5rem', margin:'0', padding:'0' }}>
        <Nav variant="pills" className="d-flex justify-content-center" style={{ margin:'0', padding:'0'}}>
          <Nav.Item>
            <Nav.Link
              className="d-flex align-items-center "
              style={{ height: "2rem", backgroundColor: "#648dc3", color:'white' }}
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

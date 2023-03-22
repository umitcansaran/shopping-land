import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Row } from "react-bootstrap";

export default function AddProductButton() {


  const [ select, setSelect] = useState(false)

  const navigate = useNavigate()


    return (
      <>
        <Row style={{ backgroundColor:'#1e478a', height:'3rem' }}>
        <Nav variant="pills" className="d-flex justify-content-center">
          <Nav.Item>
            <Nav.Link className='d-flex align-items-center' style={{ height:'2rem', borderRadius: '30px 30px 30px 30px' }} onClick={() => setSelect(!select)} eventKey="product">Add Product</Nav.Link>
          </Nav.Item>
        </Nav>
        </Row>
      { select && (
        navigate('add-product')
      )}
    </>
    );
  }


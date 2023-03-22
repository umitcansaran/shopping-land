import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Nav, Form, Row, Col } from "react-bootstrap";
import { listProductCategories } from '../store/actions/categoriesActions'
import { myDetails } from '../store/actions/userActions'
import { createStore } from "../store/actions/storeActions";
import Map, { Marker, Popup } from "react-map-gl";
import AddProductScreen from '../screens/AddProductScreen'
 
import styled from "styled-components";
import AddressSuggestions from "../components/AddressSuggestions";
import context from "react-bootstrap/esm/AccordionContext";
import FormContainer from "../components/FormContainer";

export default function AddStoreButton() {

  const [ select, setSelect] = useState(false)

  const navigate = useNavigate()

    return (
      <>
        <Row style={{ backgroundColor:'#1e478a', height:'3rem' }}>
        <Nav variant="pills" className="d-flex justify-content-center">
          <Nav.Item>
            <Nav.Link className='d-flex align-items-center' style={{ height:'2rem', borderRadius: '30px 30px 30px 30px' }} onClick={() => setSelect(!select)} eventKey="product">Add Store</Nav.Link>
          </Nav.Item>
        </Nav>
        </Row>
      { select && (
        navigate('add-store')
      )}
    </>
    );
  }

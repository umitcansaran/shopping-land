import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import "./index.css";
import { login } from "../../store/actions/userActions";

function Login() {
  const [username, setUsername] = useState("InterDiscount");
  const [password, setPassword] = useState("django123");
  const [profile, setProfile] = useState("CUSTOMER");

  useEffect(() => {
    if (profile === "CUSTOMER") {
      setUsername("umit");
    }
    if (profile === "STORE_OWNER") {
      setUsername("InterDiscount");
    }
  }, [profile]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userLogin, navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <FormContainer>
      <Nav
        variant="pills"
        defaultActiveKey="customer"
        className="justify-content-center mt-3"
      >
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setProfile("CUSTOMER");
            }}
            eventKey="customer"
            style={{ width: "7.6rem", textAlign: "center" }}
          >
            Customer
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setProfile("STORE_OWNER");
            }}
            eventKey="store-owner"
            style={{ width: "7.6rem", textAlign: "center" }}
          >
            Seller
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Row className="login-btn">
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Row>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default Login;
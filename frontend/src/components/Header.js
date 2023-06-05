import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Navbar,
  Nav,
  Badge,
  Container,
  NavDropdown,
  Row,
  Image,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { myDetails, logout } from "../store/actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.myDetails);
  const { cartItems } = useSelector((state) => state.cart);

  const cartItemsQuantities = Object.values(cartItems).reduce(
    (accumulator, cartItem) => accumulator + cartItem.quantity,
    0
  );

  useEffect(() => {
    dispatch(myDetails());
  }, [dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const isMobile = window.innerWidth < 991;

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid className="mx-1">
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "Alexandria",
            color: "#495b7a",
            border: "solid 0.2rem #1e478a",
            padding: "0.2rem 0.7rem",
          }}
        >
          <strong>shopping-land.ch</strong>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            width: "2rem",
            backgroundImage:
              "url('https://shoppingland.s3.eu-central-1.amazonaws.com/menu.svg')",
          }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              className={isMobile ? "mt-2" : "ms-5 " + " header-nav-link"}
              to="/sellers"
              style={{ color: "rgb(70, 69, 69)" }}
            >
              <i className="fa-solid fa-store" style={{ color: "#1e478a" }}></i>{" "}
              Sellers
            </Nav.Link>
            <Nav.Link
              as={Link}
              className={isMobile ? "" : "ms-5" + " header-nav-link"}
              to="/map"
              style={{ color: "rgb(70, 69, 69)" }}
            >
              <i
                className="fa-solid fa-location-dot"
                style={{ color: "#1e478a" }}
              ></i>{" "}
              Find a Store
            </Nav.Link>
          </Nav>
          <Nav className="me-4">
            {user && user.profile.status === "CUSTOMER" && (
              <>
                <Row className="align-items-center">
                  <img
                    src={user && user.profile.image}
                    alt="customer-profile"
                    style={{ width: "3.3rem", height: "auto" }}
                  />
                </Row>
                <NavDropdown title={user.username} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/customer-orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            {user ? (
              user.profile.status === "STORE_OWNER" && (
                <>
                  <NavDropdown
                    title={
                      <Image
                        src={user && user.profile.image}
                        alt="retailer-profile"
                        style={{ maxHeight: "1.6rem", maxWidth: "4rem" }}
                      />
                    }
                    id="adminmenu"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/mystores">
                      <NavDropdown.Item>Stores</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/myproducts">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/seller-orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )
            ) : (
              <Nav.Link
                as={Link}
                className={isMobile ? "" : "ms-5" + " header-nav-link"}
                to="/login"
              >
                <i
                  class="fa-solid fa-user"
                  style={{ color: "#1e478a", marginRight: "0.3rem" }}
                ></i>
                Sign In
              </Nav.Link>
            )}
            <Nav.Link
              as={Link}
              className={isMobile ? "" : "ms-5" + " header-nav-link"}
              to="/cart"
              style={{ color: "rgb(70, 69, 69)" }}
            >
              <i
                className="fa-solid fa-cart-shopping"
                style={{ color: "#1e478a", marginRight: "0.3rem" }}
              ></i>
              Cart
              {cartItemsQuantities > 0 && (
                <Badge bg="primary" pill style={{ borderRadius: "0" }}>
                  {cartItemsQuantities}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

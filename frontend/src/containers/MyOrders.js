import React, { useState, useEffect } from "react";
import { Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listMyPurchases, listMySellerOrders } from "../store/actions/orderActions";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: loadingOrders, error: errorOrders, sellerOrders } = useSelector((state) => state.sellerOrderMyList);

  useEffect(() => {
    dispatch(listMySellerOrders());
  }, [dispatch, navigate]);

  console.log(sellerOrders)

  return (
    <Row className="justify-content-center">
      <Col md={9}>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : sellerOrders.length === 0 ? (
          <h2 className="text-center">You have no orders.</h2>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Sent</th>
                <th></th> 
              </tr>
            </thead>

            <tbody>
              {sellerOrders.map((sellerOrder) => (
                <tr key={sellerOrder.id}>
                  <td>{sellerOrder.id}</td>
                  <td>{sellerOrder.createdAt.substring(0, 10)}</td>
                  <td>{sellerOrder.customer.profile.name}</td>
                  <td>CHF {sellerOrder.totalPrice}</td>
                  <td>
                    {sellerOrder.isPaid ? (
                      sellerOrder.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>   
                    <LinkContainer to={`/seller-order/${sellerOrder.id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default MyOrders;

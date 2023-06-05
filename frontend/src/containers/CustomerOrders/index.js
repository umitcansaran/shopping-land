import React, { useState, useEffect } from "react";
import { Button, Row, Col, Table, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { listMyOrders } from "../../store/actions/orderActions";

function CustomerOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = useSelector((state) => state.purchaseMyList);

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch, navigate]);

  return (
    <Container fluid>
      <Col>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : orders.length === 0 ? (
          <h2 className="text-center">You have no orders.</h2>
        ) : (
          <Table striped responsive className="table-sm">
            <thead style={{ backgroundColor: "#f2f5fa" }}>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Payment Method</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ textAlign: "center" }}>
                  <td>{order.id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>CHF {order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <LinkContainer to={`/customer-order/${order.id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Container>
  );
}

export default CustomerOrders;

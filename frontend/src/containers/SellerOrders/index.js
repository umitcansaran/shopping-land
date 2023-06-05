import React, { useEffect } from "react";
import { Button, Col, Table, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { listMySellerOrders } from "../../store/actions/orderActions";

function SellerOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: loadingOrders,
    error: errorOrders,
    sellerOrders,
  } = useSelector((state) => state.sellerOrderMyList);

  useEffect(() => {
    dispatch(listMySellerOrders());
  }, [dispatch, navigate]);

  return (
    <Container fluid>
      <Col>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : sellerOrders.length === 0 ? (
          <h2 className="text-center">You have no orders.</h2>
        ) : (
          <Table hover responsive className="table-sm my-2">
            <thead style={{ backgroundColor: "#f2f5fa" }}>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Completed</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sellerOrders.map((sellerOrder) => (
                <tr key={sellerOrder.id} style={{ textAlign: "center" }}>
                  <td>{sellerOrder.id}</td>
                  <td>{sellerOrder.createdAt.substring(0, 10)}</td>
                  <td>CHF {sellerOrder.totalPrice}</td>
                  <td>
                    {sellerOrder.order.isPaid ? (
                      sellerOrder.order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {sellerOrder.isCompleted ? (
                      sellerOrder.completedAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/seller-order/${sellerOrder.id}`}>
                      <Button
                        className="blue-button"
                        variant={
                          !sellerOrder.order.isPaid ? "warning" : "primary"
                        }
                        disabled={!sellerOrder.order.isPaid}
                      >
                        {!sellerOrder.order.isPaid ? "Not Paid" : "Details"}
                      </Button>
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

export default SellerOrders;

import React, { useEffect } from "react";
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductStocks } from "../store/actions/productActions";
import { PRODUCT_STOCKS_RESET } from "../store/constants/productConstants";

function MyProductStocks({
  product,
  myStores,
  stockInput,
  setStockInput,
  stockInputHandler,
  saveHandler,
  deleteStockHandler,
}) {
  const dispatch = useDispatch();

  const { stocks } = useSelector((state) => state.productStocks);

  useEffect(() => {
    dispatch({ type: PRODUCT_STOCKS_RESET });
    dispatch(listProductStocks(product.id));
  }, [dispatch]);

  return (
    <tr>
      <td colSpan="7">
        {myStores &&
          myStores.map((store, index) => {
            const productStock = store.stocks.find(stock => stock.product === product.id)
            const stockNumber = productStock ? productStock.number : 0

            return (
              <>
                <Row className="d-flex justify-content-center">
                  <Col
                    md={8}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <ListGroup key={index} as="ol">
                      <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-center"
                        style={{ width: "30rem" }}
                      >
                        <div className="fw-bold">{store.name}</div>
                        { 
                          stockInput[index] ? (
                            <Form>
                              <Form.Group className="" controlId="formBasicEmail">
                                <Form.Control
                                  style={{
                                    width: "3rem",
                                    height: "1.3rem",
                                  }}
                                  type=""
                                  placeholder={stockNumber}
                                  onChange={(e) => {
                                    setStockInput({
                                      ...stockInput,
                                      [index]: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Group>
                            </Form>
                          ) : (
                            <Badge bg="primary" pill>
                             {stockNumber}
                            </Badge>
                            )
                        }
                      
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={4} className="d-flex">
                    {!stockInput[index] ? (
                      <Button
                        onClick={(e) => {
                          stockInputHandler(index);
                        }}
                        variant="primary"
                        className="btn-sm my-2"
                      >
                        <i className="fas fa-edit"> edit</i>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => saveHandler(index, productStock, product, store, stockNumber)}
                        variant="primary"
                        className="btn-sm my-2"
                        type="submit"
                      >
                        <i className="fa-regular fa-paper-plane-top">
                          validate
                        </i>
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteStockHandler(productStock)}
                      variant="danger"
                      className="btn-sm my-2 m-2"
                      type="submit"
                    >
                      <i className="fa-regular fa-paper-plane-top">delete</i>
                    </Button>
                  </Col>
                </Row>
              </>
            );
          })
          }
      </td>
    </tr>
  );
}

export default MyProductStocks;

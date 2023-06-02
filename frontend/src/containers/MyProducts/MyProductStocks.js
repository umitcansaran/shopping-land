import React, { useEffect } from "react";
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "./index.css";
import { PRODUCT_STOCKS_RESET } from "../../store/constants/stockConstants";

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

  useEffect(() => {
    dispatch({ type: PRODUCT_STOCKS_RESET });
  }, [dispatch]);

  return (
    <tr>
      <td colSpan="7">
        {myStores &&
          myStores.map((store, index) => {
            const productStock = store.stocks.find(
              (stock) => stock.product.id === product.id
            );
            const stockNumber = productStock ? productStock.number : 0;

            return (
              <>
                <Row
                  className="d-flex justify-content-center"
                  style={{ width: "90%" }}
                >
                  <Col
                    xs={8}
                    sm={8}
                    md={8}
                    xl={8}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <Col xs={12} sm={10} md={8} xl={6}>
                      <ListGroup key={index} as="ol">
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-center"
                        >
                          {store.name}
                          {stockInput[index] ? (
                            <Form>
                              <Form.Group controlId={index}>
                                <Form.Control
                                  style={{
                                    width: "3.5rem",
                                    height: "1.3rem",
                                  }}
                                  type="number"
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
                          ) : !stockNumber || stockNumber === 0 ? (
                            <Badge
                              className="red-badge"
                              style={{ width: "2.2rem", textAlign: "center" }}
                            >
                              {stockNumber}
                            </Badge>
                          ) : (
                            <Badge
                              className="green-badge"
                              style={{ width: "2.2rem", textAlign: "center" }}
                            >
                              {stockNumber}
                            </Badge>
                          )}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Col>
                  <Col xs={4} sm={4} md={4} xl={4} className="d-flex">
                    {!stockInput[index] ? (
                      <Button
                        onClick={(e) => {
                          stockInputHandler(index);
                        }}
                        className="btn-sm my-2 blue-button"
                      >
                        <i className="fas fa-edit d-none d-sm-block"> edit</i>
                        <i className="fas fa-edit d-sm-none"></i>
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          saveHandler(
                            index,
                            productStock,
                            product,
                            store,
                            stockNumber
                          )
                        }
                        className="btn-sm my-2 blue-button"
                        type="submit"
                      >
                        <i className="fa-regular fa-paper-plane-top d-none d-sm-block">
                          validate
                        </i>
                        <i class="fa-sharp fa-solid fa-square-check d-sm-none"></i>
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteStockHandler(productStock)}
                      className="btn-sm my-2 m-2 red-button"
                      type="submit"
                      disabled={stockNumber === 0}
                      style={{
                        backgroundColor:
                          stockNumber === 0 && "rgb(238, 103, 103)",
                        opacity: stockNumber === 0 && "0.3",
                      }}
                    >
                      <i className="fa-regular fa-paper-plane-top d-none d-sm-block">
                        delete
                      </i>
                      <i className="fa-solid fa-trash-can d-sm-none"></i>
                    </Button>
                  </Col>
                </Row>
              </>
            );
          })}
      </td>
    </tr>
  );
}

export default MyProductStocks;

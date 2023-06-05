import React from "react";
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap";

export default function StocksCart({
  stocks,
  quantity,
  setQuantity,
  selectedStore,
  setSelectedStore,
  orderType,
  setOrderType,
  inStoreOrderItemStock,
  onlineOrderItemStock,
  totalStock,
  isLoggedInUserProduct
}) {
  return (
    <>
          <ListGroup.Item>
        <Row>
          <Col>Buy Online:</Col>
        </Row>
        <Row className="my-2">
          <Col md={9}>
            <Button
              variant="light"
              style={{
                width: "100%",
                textAlign: "left",
                fontSize: "0.8rem",
                textTransform: "unset",
              }}
              onClick={() => {
                setQuantity(0);
                setOrderType("online");
                setSelectedStore({});
              }}
              disabled={totalStock === 0 || isLoggedInUserProduct}
            >
              <Row>
                <Col
                  className="d-flex justify-content-start align-items-center"
                  style={{ color: "#233fa6" }}
                >
                  Online
                </Col>
                <Col>
                  Stock{" "}
                  <Badge
                    bg={totalStock > 0 ? "success" : "danger"}
                    className="d-flex justify-content-start"
                  >
                    {totalStock}
                  </Badge>
                </Col>
              </Row>
            </Button>
          </Col>
          {orderType === "online" && (
            <Col md={3} className="d-flex align-items-center">
              <Form.Select
                as="select"
                value={quantity}
                onChange={(e) => onlineOrderItemStock(Number(e.target.value))}
              >
                <option key={0} value={0}>
                  0
                </option>
                {[...Array(totalStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </Form.Select>
            </Col>
          )}
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Pick Up In-Store:</Col>
        </Row>
        {stocks.map((stock, index) => {
          return (
            stock.number > 0 && (
              <Row className="my-2" key={index}>
                <Col md={9}>
                  <Button
                    variant="light"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontSize: "0.8rem",
                      textTransform: "unset",
                    }}
                    onClick={() => {
                      Object.keys(stocks).forEach((key) => {
                        setQuantity(0);
                        setOrderType("inStore");
                        selectedStore[key] = false;
                        setSelectedStore({
                          ...selectedStore,
                          [index]: true,
                        });
                      });
                    }}
                    disabled={stock.number === 0 || isLoggedInUserProduct} 
                  >
                    <Row>
                      <Col
                        className="d-flex justify-content-start align-items-center"
                        style={{ color: "#233fa6" }}
                      >
                        {stock.storeName}
                      </Col>
                      <Col>
                        Stock{" "}
                        <Badge
                          bg={stock.number > 0 ? "success" : "danger"}
                          className="d-flex justify-content-start"
                        >
                          {stock.number}
                        </Badge>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                {selectedStore[index] && (
                  <Col md={3} className="d-flex align-items-center">
                    <Form.Select
                      as="select"
                      value={quantity}
                      onChange={(e) =>
                        inStoreOrderItemStock(
                          e,
                          stock.storeName,
                          Number(stock.number),
                          stock.id,
                          stock.store
                        )
                      }
                    >
                      <option key={0} value={0}>
                        0
                      </option>
                      {[...Array(stock.number).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                )}
              </Row>
            )
          );
        })}
      </ListGroup.Item>

    </>
  );
}

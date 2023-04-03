import React from "react";
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap";

export default function StocksCart({ stocks, selectedStore, setSelectedStore, quantity, storeInfo }) {
  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col>Select a store:</Col>
        </Row>
        {stocks.map((stock, index) => {
          return (
            <>
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
                      Object.keys(stocks).forEach((key) => {
                        selectedStore[key] = false;
                        setSelectedStore({
                          ...selectedStore,
                          [index]: true,
                        });
                      });
                    }}
                  >
                    <Row>
                      <Col
                        className="d-flex justify-content-start align-items-center"
                        style={{ color: "#233fa6" }}
                      >
                        {stock.store_name}
                      </Col>
                      <Col>
                        Stock{" "}
                        <Badge
                          bg="success"
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
                        storeInfo(e, stock.store_name, Number(stock.number))
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
            </>
          );
        })}
      </ListGroup.Item>
    </>
  );
}

import React from "react";
import { Button, Row } from "react-bootstrap";

export default function ProductButtons({
  product,
  index,
  viewButton,
  viewStockHandler,
  closeStockHandler,
  deleteProductHandler,
}) {
  return (
    <tr>
      <td colSpan={5} className="d-table-cell d-sm-none">
        <Row style={{ justifyContent: "center" }}>
          {viewButton[index] ? (
            <Button
              onClick={() => {
                closeStockHandler(index);
              }}
              className="btn-block blue-button"
              style={{
                width: "5rem",
                height: "1.5rem",
                padding: "0",
              }}
            >
              <i className="fa-solid fa-angle-up"></i>
            </Button>
          ) : (
            <Button
              onClick={() => {
                viewStockHandler(index);
              }}
              className="blue-button"
              style={{
                width: "5rem",
                height: "1.5rem",
                padding: "0",
              }}
            >
              <i className="fa-solid fa-angle-down"></i>
            </Button>
          )}
          <Button
            onClick={() => {
              deleteProductHandler(product);
            }}
            className="red-button"
            style={{ width: "5rem", height: "1.5rem", padding: "0" }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </Row>
      </td>
    </tr>
  );
}

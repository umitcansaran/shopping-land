import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import "./DeletePopup.css";

function DeletePopup({
  setDeleteWindow,
  setDeleteConfirm,
  item: { type, details },
}) {
  return (
    <>
      <Row className="delete-popup">
        <Row className="box">
          {type === "product" && (
            <h2>
              Delete {details.brand} {details.name} ?
            </h2>
          )}
          {type === "store" && (
            <h2>
              Delete {details.name} Store ?
            </h2>
          )}
        </Row>
        <Row className="btn-container">
          <Button
            className="btn mb-1"
            onClick={() => {
              setDeleteConfirm("yes");
            }}
          >
            Yes
          </Button>
          <Button
            className="btn"
            onClick={() => {
              setDeleteWindow(false);
            }}
          >
            No
          </Button>
        </Row>
      </Row>
    </>
  );
}

export default DeletePopup;

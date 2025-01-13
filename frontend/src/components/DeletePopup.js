import React from "react";
import { Button, Row } from "react-bootstrap";
import "./DeletePopup.css";

function DeletePopup({
  setDeleteWindow,
  setDeleteConfirm,
  item: { type, details },
}) {
  return (
    <>
      <Row className="delete-popup">
        <Row>
          {type === "product" && (
            <h2>
              Delete {details.brand} {details.name}?
            </h2>
          )}
          {type === "store" && (
            <h2>
              Delete <strong>{details.name}</strong> Store?
            </h2>
          )}
          {type === "stock" && (
            <h2>
              Delete <strong>{details.storeName}</strong> Stock?
            </h2>
          )}
          {type === "account" && <h2>Delete Account?</h2>}
        </Row>
        <Row className="btn-container">
          <Button
            className="btn mb-1"
            onClick={() => {
              setDeleteConfirm(type);
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

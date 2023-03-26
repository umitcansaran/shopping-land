import React from "react";
import { Button, Row } from "react-bootstrap";
import "./DeletePopup.css";

function DeletePopup({ setDeleteWindow, setDeleteConfirm }) {
  return (
    <>
      <Row className="delete-popup success">
        <h2>Are you sure?</h2>
        <Button
          onClick={() => {
            setDeleteConfirm("yes");
          }}
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            setDeleteWindow(false);
          }}
        >
          No
        </Button>
      </Row>
    </>
  );
}

export default DeletePopup;

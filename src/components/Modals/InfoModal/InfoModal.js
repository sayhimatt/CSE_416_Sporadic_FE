import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./styles.css";

/**
 * Creates a modal which cannot be closed and has only one button
 */
const InfoModal = ({ title, body, buttonText, onButtonClicked, isVisible }) => {
  return (
    <Modal show={isVisible} backdrop="static" keyboard={false} style={{ top: "20%" }}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{body}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="confirm" onClick={onButtonClicked}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;

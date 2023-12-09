import React, { useState } from "react";
import "./Dashboard.css";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import BillByBillNumber from "./BillByBillNumber";
import BillByContactNumber from "./BillByContactNumber";

const DashboardPos = () => {
  const { storeNumber } = useParams();
  const navigate = useNavigate();
  const [showFindByIdModal, setShowFindByIdModal] = useState(false); 
  const [showFindByContactModal, setShowFindByContactModal] = useState(false); 


  const navigateToBilling = () => {
    navigate(`/pos-billing/${storeNumber}`);
  }

  const FindByIdModal = (props) => {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Find Bill By Bill Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillByBillNumber modalVisible={setShowFindByIdModal}/>
        </Modal.Body>
      </Modal>
    );
  }

  const FindByContactModal = (props) => {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Find Bill By Contact Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillByContactNumber modalVisible={setShowFindByContactModal}/>
        </Modal.Body>
      </Modal>
    );
  }

  const handleCloseFindByIdModal = () => {
    setShowFindByIdModal(false)
  }

  const handleCloseFindByContactModal = () => {
    setShowFindByContactModal(false)
  }

  return (
    <div >
      <FindByIdModal show={showFindByIdModal} onHide={handleCloseFindByIdModal}/>
      <FindByContactModal show={showFindByContactModal} onHide={handleCloseFindByContactModal}/>
      <Row className="justify-content-md-center">
        <Col  xs lg="2">
          <Button onClick={() => {setShowFindByIdModal(true)}}> Find Bill By Bill Number</Button>
        </Col>
        <Col  xs lg="2">
          <Button onClick={() => {setShowFindByContactModal(true)}}> Find Bill By Contact No</Button>
        </Col>
        <Col xs lg="2">
          <Button onClick={navigateToBilling}>New Bill</Button>
        </Col>
      </Row>

    </div>
  );
};

export default DashboardPos;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmployeeRegistrationForm from './EmployeeRegistrationForm';
import { Button, Col, Modal, Row, Tab, Tabs} from 'react-bootstrap';
import EmployeeEditForm from './EmployeeEditForm';
import AdminRegisterForm from './AdminRegisterForm';
import EmployeeList from './EmployeeList';

function DashboardScreen(props) {
    const user = useSelector((state) => state.user.userInfo);
    const [key, setKey] = useState("employees")
    const [modalShow, setModalShow] = useState(false)
    const [editShow, setEditShow] = useState(false)
    const [adminShow, setAdminShow] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(!user){
            navigateHome();
        }
        if( !["super_admin", "admin"].includes(user.userCred.role)){
            navigateHome();
        }
    },[user])


    return (
        <div>
            <Row >
                <Col>
                    <Button variant="primary" onClick={() => setModalShow(true)}>
                        Add Employee
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={() => setEditShow(true)}>
                        Edit Employee
                    </Button>
                </Col>
                {
                    user && user.userCred.role === "super_admin" ? 
                    <Col>
                    <Button variant="primary" onClick={() => setAdminShow(true)}>
                        Add New Employee
                    </Button>
                    </Col>
                    :
                    <div></div>
                }
                
            </Row>
            
  
            <AddEmployeeForm
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <EditEmployeeForm
              show={editShow}
              onHide={() => setEditShow(false)}
            />
            <AddNewAdminForm
              show={adminShow}
              onHide={() => setAdminShow(false)}
            />
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
            <Tab eventKey="employees" title="Employees">
                <EmployeeList access_token={user.access_token} />
            </Tab>
            <Tab eventKey="orders" title="Orders">
                <div>Orders</div>
            </Tab>
            </Tabs>
        </div>
    );
}

function AddEmployeeForm(props) {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeRegistrationForm/>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={props.onHide}>Register</Button>
        </Modal.Footer> */}
      </Modal>
    );
  }

function EditEmployeeForm(props) {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeEditForm/>
        </Modal.Body>
      </Modal>
    );
  }

function AddNewAdminForm(props) {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminRegisterForm/>
        </Modal.Body>
      </Modal>
    );
  }


export default DashboardScreen;
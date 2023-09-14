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
    const [adminShow, setAdminShow] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reload, setReload] = useState("dashboardReload")

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(!user){
            navigateHome();
        }
        else if( !["super_admin", "admin"].includes(user.userCred.role)){
            navigateHome();
        }
    },[user])


    return (
        <div>
            <Row >
                <Col>
                    <Button variant="primary" onClick={() => {
                      setModalShow(true);
                    }}>
                        Add Employee
                    </Button>
                </Col>
                {
                  !user? <div></div>:user.userCred.role === "super_admin" ? 
                    <Col>
                    <Button variant="primary" onClick={() => {
                      setAdminShow(true);
                    }}>
                        Add Admin
                    </Button>
                    </Col>
                    :
                    <div></div>
                }
            </Row>
            
  
            <AddEmployeeForm
              show={modalShow}
              onHide={() => {setModalShow(false);setReload();}}
            />
            <AddNewAdminForm
              show={adminShow}
              onHide={() => {setAdminShow(false);setReload();}}
            />
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
            <Tab eventKey="employees" title="Employees" >
                {!user? <div></div>:
                <EmployeeList access_token={user.access_token} key={reload}/>}
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
            Add New Admin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminRegisterForm/>
        </Modal.Body>
      </Modal>
    );
  }


export default DashboardScreen;
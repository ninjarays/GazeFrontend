import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {fetchAllUsers} from '../../features/dashboard/dashboardSlice';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import EmployeeEditForm from './EmployeeEditForm';
import ChangePasswordForm from './ChangePasswordForm';

const EmployeeList =(props)=>{
    const employeeState= useSelector((state)=> state.dashboard);
    const [editShow, setEditShow] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [reload, setReload] = useState(1)
    const [changePasswordShow, setChangePasswordShow] = useState(null);
    const dispatch =useDispatch();

    const EditEmployeeForm =(props) => {
      return (
          <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Employee
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmployeeEditForm data={editUser} closeForm={setEditShow}/>
          </Modal.Body>
        </Modal>
      );
    }
    
    const ChangePassword =(props) => {
      return (
          <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Change Password
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ChangePasswordForm data={editUser} closeForm={setChangePasswordShow}/>
          </Modal.Body>
        </Modal>
      );
    }

    useEffect(()=>{
      console.log("loading")
      dispatch(fetchAllUsers(props.access_token))
    },[reload])
    return(
      <div style={{ width: '100%'}}>
      <EditEmployeeForm
        show={editShow}
        onHide={() => {
          setEditShow(false);
          setReload(reload+1)
        }}
      />
      <ChangePassword
        show={changePasswordShow}
        onHide={() => {
          setChangePasswordShow(false);
        }}
      />
        <div>{!employeeState? <div></div>:
           employeeState.status==='loading' ?<div>loading</div>:
           employeeState.status==='fail'? <div>Error</div> :
          <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
             
             <Table striped bordered hover key={reload}> 
      <thead>
        <tr>
          <th>EmployeeID</th>
          <th>Employee Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Termination</th>
        </tr>
      </thead>
      <tbody>
          {employeeState.users.map((user) => (
        <tr  key={user._id}>
            <td >{user.employeeId}</td>
            <td>{user.employeeName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.terminationDate?.slice(0,10) || '-'}</td>
            <td>
              <Button variant="primary" onClick={() => {
                setEditUser(user);
                setEditShow(true);
              }}>
                Edit
              </Button>
            </td>
            <td>
              <Button variant="primary" onClick={() => {
                setEditUser(user);
                setChangePasswordShow(true);
              }}>
                Change_Password
              </Button>
            </td>
          </tr>

          ))}
      </tbody>

    </Table>
          </div>
        }</div>
      </div>
    )
}

export default EmployeeList;
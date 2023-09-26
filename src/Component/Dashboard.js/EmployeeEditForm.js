import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { editUser, refreshLoading, terminateUserError, terminateUserLoading, terminateUserSuccess } from '../../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';

const EmployeeEditForm = (props) => {
  const user = useSelector((state) => state.user.userInfo);
    const status = useSelector((state) => state.admin);
    const [show, setShow] = useState(false)
    const [variant, setVariant] = useState("light")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(!user || !["admin", "super_admin"].includes(user.userCred.role)){
            navigateHome();
        }
        else{
          dispatch(refreshLoading());
        }
    },[user])

  const [formData, setFormData] = useState({
    employeeName: props.data.employeeName,
    email: props.data.email,
    phoneNumber: props.data.phoneNumber,
    birthDate: props.data.birthDate.slice(0,10),
    joiningDate: props.data.joiningDate.slice(0,10),
    role: props.data.role,
    employeeId:props.data.employeeId
  });

  const resetForm = () => {
    setFormData({
        employeeName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        joiningDate: '',
        role: 'chef',
      })
  }

  useEffect(() => {
    if(status.editUser === "added"){
        setShow(true);
        setVariant("success");
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            dispatch(refreshLoading());
            props.closeForm(false)
        }, 2000)
    }
    else if(status.editUser === "error"){
        setShow(true);
        setVariant("danger")
        resetForm();
        setTimeout(() => {
            dispatch(refreshLoading());
        }, 2000)
    }
    else if(status.editUser === "loading"){
        console.log("loading is on");
    }
    else if(status.editUser === "idle"){
        setShow(false)
    }

},[status.editUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData["jwt"] = user.access_token
    dispatch(editUser(formData));
  };
  

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Done"}</Alert.Heading>
      </Alert> : <div></div>}
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="employeeName">
        <Form.Label>Employee Name</Form.Label>
        <Form.Control
          type="text"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="birthDate">
        <Form.Label>Birth Date</Form.Label>
        <Form.Control
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="joiningDate">
        <Form.Label>Joining Date</Form.Label>
        <Form.Control
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="role">
        <Form.Label>Role</Form.Label>
        <Form.Control
          as="select"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="chef">Chef</option>
          <option value="store_manager">Store Manager</option>
          <option value="employee">Employee</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form></>
  );
};

export default EmployeeEditForm;

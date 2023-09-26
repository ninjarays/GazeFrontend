import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshLoading, registerNewUser } from '../../features/admin/adminSlice';

const EmployeeRegisterForm = () => {
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
    employeeName: '',
    email: '',
    password: '',
    confirmPassword:"",
    phoneNumber: '',
    birthDate: '',
    joiningDate: '',
    role: 'chef',
  });

  const resetForm = () => {
    setFormData({
        employeeName: '',
        email: '',
        password: '',
        confirmPassword:"",
        phoneNumber: '',
        birthDate: '',
        joiningDate: '',
        role: 'chef',
      })
  }

  useEffect(() => {
    if(status.registerUser === "added"){
        setShow(true);
        setVariant("success");
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            dispatch(refreshLoading());
        }, 4500)
    }
    else if(status.registerUser === "error"){
        setShow(true);
        setVariant("danger")
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            console.log("dispaching");
            dispatch(refreshLoading());
        }, 4500)
    }
    else if(status.registerUser === "loading"){
        console.log("loading is on");
    }
    else if(status.registerUser === "idle"){
        setShow(false)
    }

},[status.registerUser])

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
    console.log(formData["jwt"]);
    dispatch(registerNewUser(formData));
    console.log(formData);
  };

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Employee Registered"}</Alert.Heading>
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

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
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

export default EmployeeRegisterForm;

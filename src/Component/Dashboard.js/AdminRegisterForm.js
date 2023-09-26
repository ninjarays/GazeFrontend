import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshLoading, registerNewAdmin } from '../../features/superAdmin/superAdminSlice';

const AdminRegisterForm = () => {
    const user = useSelector((state) => state.user.userInfo);
    const status = useSelector((state) => state.superAdmin);
    const [show, setShow] = useState(false)
    const [variant, setVariant] = useState("light")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(!user || !["super_admin"].includes(user.userCred.role)){
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
    role: 'admin',
    superPassword:''
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
        role: 'admin',
        superPassword:''
      })
  }

  useEffect(() => {
    if(status.registerAdmin === "added"){
        setShow(true);
        setVariant("success");
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            dispatch(refreshLoading());
            navigateHome();
        }, 1000)
    }
    else if(status.registerAdmin === "error"){
        setShow(true);
        setVariant("danger")
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            console.log("dispaching");
            dispatch(refreshLoading());
        }, 1000)
    }
    else if(status.registerAdmin === "loading"){
        console.log("loading is on");
    }
    else if(status.registerAdmin === "idle"){
        setShow(false)
    }

},[status.registerAdminr])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData["jwt"] = user.access_token;
    formData["superEmail"] = user.userCred.email;
    formData["store"] = 1;
    dispatch(registerNewAdmin(formData));
  };

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Admin Registered"}</Alert.Heading>
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

      <Form.Group controlId="superPassword">
        <Form.Label>Enter Your Password</Form.Label>
        <Form.Control
          type="password"
          name="superPassword"
          value={formData.superPassword}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form></>
  );
};

export default AdminRegisterForm;

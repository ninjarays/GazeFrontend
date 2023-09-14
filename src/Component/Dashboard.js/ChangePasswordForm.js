import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { changePasswordError, changePasswordLoading, changePasswordSuccess, editUser, refreshLoading } from '../../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';

const ChangePasswordForm = (props) => {
    const user = useSelector((state) => state.user.userInfo);
    const status = useSelector((state) => state.admin.changePassword);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();

    const resetForm = () => {
        setConfirmPassword("");
        setPassword("")
      }

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            dispatch(refreshLoading());
            props.closeForm(false)
        }, 2000)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger")
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            console.log("dispaching");
            dispatch(refreshLoading());
            
        }, 2000)
    }
    else if(status.status === "loading"){
        console.log("loading is on");
    }
    else if(status.status === "idle"){
        setShow(false)
    }

},[status.status])


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(changePasswordLoading());
    await axios.put('/api/admin/edit/password', {employeeId:props.data.employeeId, newPassword:password, confirmPassword:confirmPassword}, {
        headers:{"Authorization":`Bearer ${user.access_token}`},
    }).then((response) => {
        dispatch(changePasswordSuccess(response.data))
    }).catch((err) => {
        dispatch(changePasswordError(err.response.data.message))
    })
  };
  

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Password Changed"}</Alert.Heading>
      </Alert> : <div></div>}
      <Form onSubmit={handleSubmit}>
              <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
    </>
  );
};

export default ChangePasswordForm;

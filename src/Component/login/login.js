import { useEffect, useState } from "react"
import { useDispatch , useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';

import "./login.css"

import { loginUser, resetLoginState } from "../../features/user/userSlice"
import LoginTab from "./loginTab";

const Login= ()=>{
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");


    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.email) {
          errors.email = 'Email is required';
        }
        if (!data.password) {
          errors.password = 'Password is required';
        }
        return errors;
    };

    const navigateHome = () => {
        console.log("navigating home");
        navigate('/');
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
          });
    }

    useEffect(()=>{
        if(user.userInfo) {
            navigateHome();
        }
    },[user.userInfo])

    useEffect(() => {
        if(user.status === "success"){
            navigateHome();
        }
        else if(user.status === "error"){
            setShow(true);
            setVariant("danger")
            resetForm();
            console.log("loading off");
            setTimeout(() => {
                dispatch(resetLoginState());
            }, 2000)
        }
        else if(user.status === "loading"){
            console.log("loading is on");
        }
        else if(user.status === "idle"){
            setShow(false)
        }
    
    },[user.status])

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          dispatch(loginUser([formData.email, formData.password]))
          console.log('Login successful');
        }
    };


    return (
//  <div className="center"  >        
//     <Container >
//     {show?
//             <Alert variant={variant} onClose={() => setShow(false)} dismissible>
//                 <Alert.Heading>{user.error ? user.error : "Logged In"}</Alert.Heading>
//               </Alert> : <div></div>
//             }
//     <div className="login-container">
//       <Row className="justify-content-center">
//         <Col md={6} sm={12}>
//           <h1 style={{textAlign:"center",fontSize:"25px"}}>GAZE LOGIN</h1>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="email" >
//               <Form.Label>Email Address</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 isInvalid={!!errors.email}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.email}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group controlId="password" >
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 isInvalid={!!errors.password}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.password}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Button variant="primary"    type="submit">
//               Submit
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//       </div>
//     </Container>

//         </div>

        <LoginTab/>

    )
}

export default Login

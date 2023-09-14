import { useEffect, useState } from "react"
import { useDispatch , useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

import "./login.css"

import { loginUser, resetLoginState } from "../../features/user/userSlice"

const Login= ()=>{
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");



    const navigateHome = () => {
        console.log("navigating home");
        navigate('/');
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
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


    return (
        <>
        
        <div className="login">
            <h1>Gaze Login</h1>
            <input type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="button" onClick={() => dispatch(loginUser([email, password]))}>Login</div>    
        </div>
        {show?
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{user.error ? user.error : "Logged In"}</Alert.Heading>
              </Alert> : <div></div>
            }
        </>
    )
}

export default Login
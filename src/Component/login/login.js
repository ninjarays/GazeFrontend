import {useEffect, useState} from "react"
import { useDispatch } from 'react-redux';
import "./login.css"

import { loginUser } from "../../features/user/userSlice"

const Login= ()=>{
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [user,setUser] =useState({
      
    //     email:"",
    //     password:"",
        
    // })

    // const handleChange= e =>{
    //     const {name,value}=e.target

    //     setUser({
    //         ...user,
    //         [name]:value
    //     })
        
    //     // console.log(name,value)
    // }

    return (
        
        <div className="login">
            <h1>Gaze Login</h1>
            <input type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="button" onClick={() => dispatch(loginUser([email, password]))}>Login</div>    
        </div>
    )
}

export default Login
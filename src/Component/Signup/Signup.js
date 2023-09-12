import react,{useEffect, useState} from "react"
import "./Signup.css"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { registerNewUser } from "../../features/admin/adminSlice"


const Signup= ()=>{
    const user = useSelector((state) => state.user.userInfo);
    const status = useSelector((state) => state.admin.registerUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(status === "added"){
            console.log("loading off");
            navigateHome();
        }
        else if(status === "loading"){
            console.log("loading is on");
        }

    },[status])


    useEffect(() => {
        if(!user || !user.userCred.role === "admin"){
            navigateHome();
        }
    },[user])

    return (
        
        <div className="Signup">
            <h1>Gaze Signup</h1>
            <input type="text" name="name" value={name}  placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
            <input type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
            <input type="password" name="reEnterpassword" value={reEnterPassword} placeholder="Re-enter-Password" onChange={(e) => setReEnterPassword(e.target.value)}></input>
            <div className="button" onClick={()=>{
                console.log("clicked");
                dispatch(registerNewUser([name,email,password,reEnterPassword, user.userCred.role, user.token]));}}>Register</div>  
        </div>
    )
}

export default Signup
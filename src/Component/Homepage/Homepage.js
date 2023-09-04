import react from "react"
import "./Homepage.css"
import { useDispatch, useSelector } from "react-redux"
import { logOutUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const Homepage= ()=>{
    const user = useSelector((state) => state.user.userInfo)
    const navigate = useNavigate();
    const navigateLoginPage = () => {
        navigate('/login');
    };

    const navigateRegisterPage = () => {
        navigate('/register');
    };

    const dispatch = useDispatch();
    return (
        
        <div className ="homepage">
            <h1>Welcome</h1>
            {user?<div className ="button" onClick={() => dispatch(logOutUser())}>Logout</div>: <></>}

            {(user && user.userCred.role === "admin")?<div className ="button" onClick={navigateRegisterPage}>Register</div>: <></>}
            
            {!user?<div className ="button" onClick={navigateLoginPage}>Login</div>: <></>}
        </div>
    )
}

export default Homepage
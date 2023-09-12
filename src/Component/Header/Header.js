import React from 'react';
import "./Header.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../features/user/userSlice';

function Header() {
    const user = useSelector((state) => state.user.userInfo)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateLoginPage = () => {
        navigate('/login');
    };

    const navigateRegisterPage = () => {
        navigate('/register');
    };
    const navigateHomePage = () => {
        navigate('/');
    };
    return (
        <nav className="navbar" id="navbar">
        <div className="logo">
            <h1 className="name" onClick={navigateHomePage}>Gaze</h1>
        </div>

        <ul className="nav-links">
            {
                !user ? <div className="button" onClick={navigateLoginPage}>Login</div> :
                    <div className="button" onClick={() => dispatch(logOutUser())}>Logout</div> 
            }

            {!user ? <div></div> : <div>{user.userCred.role}</div> }
        </ul>


    </nav>
    );
}

export default Header;
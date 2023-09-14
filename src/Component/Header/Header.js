import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../features/user/userSlice';
import { Nav, Navbar } from 'react-bootstrap';

function Header() {
    const user = useSelector((state) => state.user.userInfo)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateLoginPage = () => {
        navigate('/login');
    };

    const navigateDashBoard = () => {
        navigate('/dashboard');
    };

    const navigateRegisterPage = () => {
        navigate('/register');
    };

    const navigateHomePage = () => {
        navigate('/');
    };
    return (
    //     <nav className="navbar" id="navbar">
    //     <div className="logo">
    //         <h1 className="name" onClick={navigateHomePage}>Gaze</h1>
    //     </div>

    //     <ul className="nav-links">
    //         {
    //             !user ? <div className="button" onClick={navigateLoginPage}>Login</div> :
    //                 <div className="button" onClick={() => dispatch(logOutUser())}>Logout</div> 
    //         }

    //         {!user ? <div></div> : <div>{user.userCred.role}</div> }
    //     </ul>
    // </nav>


    // <Navbar collapseOnSelect expand="lg" bg="light" variant="light" >
    //     <Navbar.Brand onClick={navigateHomePage}>Gaze</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //     <Navbar.Collapse id="responsive-navbar-nav">
    //         <Nav className="mr-auto">
    //             <Nav.Link onClick={navigateDashBoard}>Dashboard</Nav.Link>
    //         </Nav>
    //     </Navbar.Collapse>
    //     {user ? 
    //     <Navbar.Collapse className="justify-content-end">
    //         <Nav.Link onClick={() => dispatch(logOutUser())}>Logout</Nav.Link>
    //         <Navbar.Text>Signed in as: {user.userCred.role}</Navbar.Text>
    //     </Navbar.Collapse> 
    //     :
    //     <Navbar.Collapse className="justify-content-end">
    //         <Nav.Link onClick={navigateLoginPage}>Login</Nav.Link>
    //     </Navbar.Collapse>
    //     }   
    // </Navbar>

    
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" style={{paddingRight: "5%",paddingLeft:"5%", width:"100%"}}>
    <Navbar.Brand onClick={navigateHomePage}>Gaze</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
      {!user? <div></div> :  ["admin", "super_admin"].includes(user.userCred.role || null) ? 
        <Nav.Link onClick={navigateDashBoard}>Dashboard</Nav.Link>
        :
        <div></div>
        }
        {user ? 
        <Nav.Link onClick={() => dispatch(logOutUser())}>Logout</Nav.Link>
        :
        <Nav.Link onClick={navigateLoginPage}>Login</Nav.Link>
        }
      </Nav>
      {/* <Nav>
        {!user ? <div></div>:
        <Navbar.Text>Signed in as {user.userCred.role}</Navbar.Text>
        }
      </Nav> */}
    </Navbar.Collapse>
  </Navbar>
    );
}

export default Header;
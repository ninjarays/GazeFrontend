import './App.css';
import Homepage from "./Component/Homepage/Homepage"
import Login from "./Component/login/login"
import Signup from "./Component/Signup/Signup"
import {Routes, Route, BrowserRouter } from "react-router-dom"
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';
import AdminRoutes from './Component/Routes/AdminRoutes';
import { useDispatch, useSelector } from 'react-redux';
import EmployeeEditForm from './Component/Forms/EmployeeEditForm';
import EmployeeRegisterForm from './Component/Forms/EmployeeRegistrationForm';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // const navigate = useNavigate();
  // const navigateLoginPage = () => {
  //       navigate('/login');
  // };
  return (
    <div className="App">
      
      <BrowserRouter>
      <Header/>
          <Routes>
            <Route path='/' Component={Homepage}/>
            <Route path='/login' Component={Login}/>
            {/* <Route Component={<AdminRoutes/>}>
              <Route path='/register' element={<Signup/>} />
          </Route> */}
            {/* <Route path='/register' Component={Signup}/> */}
            <Route path='/register' Component={EmployeeRegisterForm}/>

          </Routes>
          <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

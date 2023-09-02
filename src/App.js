import './App.css';
import Homepage from "./Component/Homepage/Homepage"
import Login from "./Component/login/login"
import Signup from "./Component/Signup/Signup"
import {Routes, Route, BrowserRouter } from "react-router-dom"
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path='/' Component={Homepage}/>
            <Route path='/login' Component={Login}/>
            <Route path='/register' Component={Signup}/>
          </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;

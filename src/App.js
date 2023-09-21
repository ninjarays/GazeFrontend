import './App.css';
import Homepage from "./Component/Homepage/Homepage"
import Login from "./Component/login/login"
import {Routes, Route, BrowserRouter } from "react-router-dom"
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';
import AdminRoutes from './Component/Routes/AdminRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardScreen from './Component/Dashboard.js/DashboardScreen';
import RawMaterialsScreen from './Component/RawMaterials/RawMaterialsScreen';
import ProductsScreen from './Component/Products/ProductsScreen';

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
            {/* <Route Component={<AdminRoutes/>}> */}
            <Route path='/dashboard' element={<DashboardScreen/>}/>
            <Route path='/ingredients' element={<RawMaterialsScreen/>}/>
            <Route path='/products' element={<ProductsScreen/>}/>

            {/* </Route>  */}
            {/* <Route path='/register' Component={Signup}/>
            {/* <Route path='/register' Component={EmployeeRegisterForm}/> */}
            

          </Routes>
          <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

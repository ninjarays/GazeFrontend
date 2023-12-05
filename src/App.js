import './App.css';
import Homepage from "./Component/Homepage/Homepage"
import Login from "./Component/login/login"
import {Routes, Route, BrowserRouter } from "react-router-dom"
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardScreen from './Component/Dashboard.js/DashboardScreen';
import RawMaterialsScreen from './Component/RawMaterials/RawMaterialsScreen';
import ProductsScreen from './Component/Products/ProductsScreen';
import TrackingScreen from './Component/Tracking/TrackingScreen';
import OrderScreen from './Component/Orders/OrderScreen';
import BarcodeGenratorScreen from './Component/Barcode/BarcodeGenratorScreen';
import BudgetScreen from './Component/Budget/BudgetScreen';
import SalesScreen from './Component/Sales/SalesScreen';
import POSInventoryScreen from './Component/POSInventory/POSInventoryScreen';
import RawMaterialInventoryScreen from './Component/RawMaterialInventory/RawMaterialInventoryScreen';
import ManufacturnigScreen from './Component/Manufacturing/ManufacturnigScreen';
import LoginTab from './Component/login/loginTab';
import HeaderPOS from './POS/Header/Header';
import Billing from './POS/Billing/Billing';
import DashboardPos from './POS/Dashboard/Dashboard';
import Split from './POS/Billing/Split';

function App() {
  // const navigate = useNavigate();
  // const navigateLoginPage = () => {
  //       navigate('/login');
  // };
  const isPOSRoute = window.location.pathname.startsWith('/pos');
  const DefaultLayout = ({ children }) => (
    <div className="default-layout">
      <HeaderPOS/>
      {children}
      
    </div>
  );
  return (
    <div className="App">
      
      <BrowserRouter>
      {/* <Header/> */}
      {!isPOSRoute && <Header />}
        
          <Routes>
            <Route path='/' Component={Homepage}/>
            <Route path='/login' Component={Login}/>
            <Route path='/loginTab' element={<LoginTab/>}/>
            {/* <Route Component={<AdminRoutes/>}> */}
            <Route path='/dashboard' element={<DashboardScreen/>}/>
            <Route path='/tracking' element={<TrackingScreen/>}/>
            <Route path='/ingredients' element={<RawMaterialsScreen/>}/>
            <Route path='/products' element={<ProductsScreen/>}/>
            <Route path='/orders' element={<OrderScreen/>}/>
            <Route path='/barcode' element={<BarcodeGenratorScreen/>}/>
            <Route path='/budget' element={<BudgetScreen/>}/>
            <Route path='/sales' element={<SalesScreen/>}/>
            <Route path='/pos_inventory' element={<POSInventoryScreen/>}/>
            <Route path='/raw_material_inventory' element={<RawMaterialInventoryScreen/>}/>
            <Route path='/manufacture' element={<ManufacturnigScreen/>}/>
            {/* </Route>  */}
            {/* <Route path='/register' Component={Signup}/>
            {/* <Route path='/register' Component={EmployeeRegisterForm}/> */}
          <Route  path='/pos-billing/:storeNumber' element={<DefaultLayout><Billing/></DefaultLayout>}/>
          <Route path='/pos-dashboard/:storeNumber' element={<DefaultLayout><DashboardPos/></DefaultLayout>}/>  
          <Route path='/pos-dashboard/:storeNumber/split' element={<DefaultLayout><Split/></DefaultLayout>}/>

          </Routes>
          {/* <Footer/> */}
          {!isPOSRoute && <Footer />}
      </BrowserRouter>
      
    </div>
  );
}

export default App;

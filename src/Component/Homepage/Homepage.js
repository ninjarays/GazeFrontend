import react, { useEffect } from "react"
import "./Homepage.css"
import { useDispatch, useSelector } from "react-redux"
import { logOutUser } from "../../features/user/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "../Card/Card";
import { Button, Col, Row, Tab } from "react-bootstrap";

const Homepage= ()=>{
    const user = useSelector((state) => state.user.userInfo)
    const navigate = useNavigate();
    const navigateLoginPage = () => {
        navigate('/login');
        // return <Navigate to={"/login"}/>
    };

    const navigateDashboardPage = () => {
      navigate('/dashboard');
  };

    useEffect(()=>{
        if(!user) {
            navigateLoginPage();
        }
    },[user])

    // const dispatch = useDispatch();
    return (
      <div className="home-tabs">
       {user ? 
        <Row>

        {["admin", "super_admin"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/ingredients');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Raw Materials"
          title="INGREDIENTS"
          buttonText="Navigate"
          />
        </Col>: <div></div>}

        {["admin", "super_admin", "chef"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/products');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Productss"
          title="RECIPES"
          buttonText="Navigate"
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/tracking');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="TRACKING"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/orders');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="ORDERS"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/budget');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="BUDGET"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/sales');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="SALES"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/posInventory');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="POS Inventory"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ? <Col onClick={() => {navigate('/barcode');}}>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="BARCODE"
          //buttonText="Navigate.."
          />
        </Col>: <div></div>}

        {["admin", "super_admin","store_manager"].includes(user.userCred.role) ?   <> 
        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="PURCHASE"
          buttonText="Navigate.."
          />
        </Col>
      

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="FINANCE"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="PAYSLIP"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="MARKETING"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="OPERATIONS"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="PUBLIC RELATIONS"
          buttonText="Navigate.."
          />
        </Col>
        </>     : <div></div>}
      </Row>
      :
      <div></div>}
      </div>
      
    )
}

export default Homepage
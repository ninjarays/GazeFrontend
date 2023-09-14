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

      
    
       <Row>
        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Procurment"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Inventory"
          title="Procurment"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Manufacture"
          buttonText="Navigate.."
          />
        </Col>
        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Procurment"
          buttonText="Navigate.."
          />
        </Col>
      

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Finance"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Operations"
          buttonText="Navigate.."
          />
        </Col>

        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Sales"
          buttonText="Navigate.."
          />
        </Col>
        <Col>
        <Card
          imgSrc="https://picsum.photos/id/193/300/200"
          imgAlt="Card-one"
          title="Procurment"
          buttonText="Navigate.."
          />
        </Col>
      </Row>
      </div>
  
    )
}

export default Homepage
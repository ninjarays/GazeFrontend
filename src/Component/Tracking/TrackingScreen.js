import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row, Tab, Tabs} from 'react-bootstrap';
import TrackingList from '../Dashboard.js/TrackingList'
import { Route } from 'react-router-dom';
import TrackingInfoForm from './TrackingInfoForm';

const TrackingScreen = () => {

    const user = useSelector((state) => state.user.userInfo);
    const [key, setKey] = useState("employees")
    const [trackingShow, setTrackingShow] = useState(false)
    const [reload,setReload] =useState(0)
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    const navigateTracking=() =>{
        navigate('/tracking')
    }
    
    const handleNewTransaction=()=>{   
        setTrackingShow(false);
        setReload(reload+1);
    }

    useEffect(() => {
        if(!user){
            navigateHome();
            return ()=>{
            };
        }
        else{
            navigateTracking();
            return ()=>{};
        }
    },[user]);

    const AddTrackingInfo=(props)=>{
        return(
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add Tracking Info
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TrackingInfoForm reload={handleNewTransaction} />
            </Modal.Body>
          </Modal>
        );
    }
    

  return (
    <div style={{ width: '90%', paddingTop:'50px'}}>
    <Row>
        <Col>
            <Button  variant="primary" onClick={() => {
                      setTrackingShow(true);
                      console.log(trackingShow);
                    }}>
                Add Tracking Info
            </Button>        
        </Col>
    </Row>
    <AddTrackingInfo
         show={trackingShow}
         onHide={() => {setTrackingShow(false);console.log(trackingShow);}}
    />
    <Tabs>
        <Tab eventKey="tracking" title="Tracking">
                {!user? <div></div>:
                    <TrackingList access_token={user.access_token} reload={reload} />}
                </Tab>
        </Tabs>
       
    </div>
  )

};


export default TrackingScreen

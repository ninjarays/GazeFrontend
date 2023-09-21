import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {getTrackingFail,getTrackingLoading,getTrackingSucess, trackingRegistration, trackingrefresh} from '../../features/tracking/trackingSlice'
import axios from '../../config/axios';
//import { trackingRegistration } from './../../features/tracking/trackingSlice';


const TrackingInfoForm= (props)=>{

  const user = useSelector((state) => state.user.userInfo);
  const status=useSelector((state)=>state.tracking);
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("light");
  const [orderNumber,setOrderNumber] = useState("");
  const [trackingNumber,setTrackingNumber] = useState("");
  const[date,setDate]=useState("");
  const dispatch = useDispatch();
//   const navigate =useNavigate();


// const navigateHome = () => {
//     navigate('/');
// };

// const navigateTracking = () => {
//     navigate('/tracking');
// };


// useEffect(() => {

//   if(!user){
//       navigateTracking();
//   }
//   else{
//     navigateHome();
//   }
// },[user])

const [formData, setFormData] = useState({
  orderNumber:'',
  trackingNumber:'',
  date:'',
});



  const resetForm = () => {
    setFormData({
      orderNumber:'',
      trackingNumber:'',
      date:'',
    })
  }
  
  useEffect(()=>{

    if(status.newStatus==='added'){
      setShow(true);
      setVariant("success")
   
      resetForm();
      console.log("loading off");
      setTimeout(() => {
          dispatch(trackingrefresh());
          props.reload();
      }, 1500)
      
    }
    else if(status.newStatus==='error'){
      setShow(true);
      setVariant("danger")
      resetForm();
      console.log("loading off");
      setTimeout(() => {
          console.log("dispaching");
          dispatch(trackingrefresh());
      }, 1500)
    }

    else if(status.newStatus==='loading'){
      console.log("Loading is on");
    }

    else{
      setShow(false);
    }
      
    
  },[status.newStatus])

  const handleInputChange= (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit= (e)=>{
      e.preventDefault();
      formData["jwt"] = user.access_token
      
      console.log(formData["jwt"]);
      dispatch(trackingRegistration(formData));
      //console.log("date send")
      //console.log(formData);
      
  }

    return(
        <>
        {show?
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{status.error ? status.error : "Tacking Info added"}</Alert.Heading>
              </Alert> : <div></div>}
              <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="orderNumber">
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleInputChange}
                        required
                      />

                      </Form.Group>
                      
                      <Form.Group controlId="trackingNumber">
                        <Form.Label>Tracking Number </Form.Label>
                        <Form.Control
                          type="text"
                          name="trackingNumber"
                          value={formData.trackingNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      
                          {/* <Form.Group controlId="Date">
                            <Form.Label> Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="trackingDate"
                              value={formData.date}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group> */}

                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Form>
            </>
         
   );
}

export default TrackingInfoForm;
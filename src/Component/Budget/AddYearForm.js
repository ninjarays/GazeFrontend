import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {  rejectOrder, rejectOrderReset } from '../../features/orders/orderSlice';

function RejectOrderForm(props) {
    const [note, setNote] = useState("");
    const [show,setShow] = useState(false);
    const [variant,setVariant] = useState("success")
    const rejectStatus = useSelector((state) => state.orders.rejectOrder);
    const dispatch = useDispatch();

    useEffect(() => {
        if(rejectStatus.status === "idle"){
            setShow(false);

        }
        else if(rejectStatus.status === "error"){
            setVariant("danger")
            setShow(true);
            // Automatically hide the notification after 2 seconds
            const timeout = setTimeout(() => {
                dispatch(rejectOrderReset());
                setShow(false);
            }, 2000);
  
            // Clear the timeout when the component unmounts
            return () => clearTimeout(timeout);
        }
        else if(rejectStatus.status === "success"){
            setVariant("success")
            setShow(true);
            setTimeout(()=>{
                dispatch(rejectOrderReset());
                props.closeForm(false)
                props.reloadList();},2000);
        }
    },[rejectStatus.status])

    const handleReject = (e) => {
        e.preventDefault();
        const data = {
            token:props.token,
            id:props._id,
            note:note
        }
        console.log(data);
        dispatch(rejectOrder(data));
    }

    return(
        <>
        {show?
        <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{rejectStatus.error ? rejectStatus.error : "Order Rejected"}</Alert.Heading>
      </Alert> : <div></div>}
        <Form onSubmit={handleReject}>
                <Form.Group controlId={`note`}>
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      type="text"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      required
                    />
                </Form.Group>
                <Button variant="danger" type="submit">
                    Reject
                </Button>
        </Form>
        </>
    )
}

export default RejectOrderForm;
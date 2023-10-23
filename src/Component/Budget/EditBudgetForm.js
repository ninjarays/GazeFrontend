import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {  rejectOrder, rejectOrderReset } from '../../features/orders/orderSlice';
import { setMonthlyBudget, setMonthlyBudgetReset } from '../../features/budget/budgetSlice';

function EditBudgetForm(props) {
    const [budget, setBudget] = useState(props.budget);
    const [show,setShow] = useState(false);
    const [variant,setVariant] = useState("success")
    const status = useSelector((state) => state.budget.setMonthlyBudget);
    const dispatch = useDispatch();

    useEffect(() => {
        if(status.status === "idle"){
            setShow(false);

        }
        else if(status.status === "error"){
            setVariant("danger")
            setShow(true);
            // Automatically hide the notification after 2 seconds
            const timeout = setTimeout(() => {
                dispatch(setMonthlyBudgetReset());
                setShow(false);
            }, 2000);
  
            // Clear the timeout when the component unmounts
            return () => clearTimeout(timeout);
        }
        else if(status.status === "success"){
            setVariant("success")
            setShow(true);
            setTimeout(()=>{
                dispatch(setMonthlyBudgetReset());
                props.closeForm(false)
                props.reload();},2000);
        }
    },[status.status])

    const handleReject = (e) => {
        e.preventDefault();
        const data = {
            body:{
                storeId:props.storeId,
                monthName:props.monthName,
                monthlyBudget:budget,
                year:props.year
            },
            token:props.token,
        }
        console.log(data);
        dispatch(setMonthlyBudget(data));
    }

    return(
        <>
        {show?
        <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Budget Updated"}</Alert.Heading>
      </Alert> : <div></div>}
        <Form onSubmit={handleReject}>
                <Form.Group controlId={`budget`}>
                    <Form.Label>Monthly Budget ( {props.monthName} / {props.year})</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update
                </Button>
        </Form>
        </>
    )
}

export default EditBudgetForm;
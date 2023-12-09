import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { Alert, Button, Card, Col, Form, Row, Spinner  } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function CompleteBillForm({products, storeId, reload, modalVisible}) {
    const total = products.reduce((sum,product) => {
        sum += product.totalPrice ?? 0;
        return sum;
    },0);
    const [customerNumber, setCustomerNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [payment, setPayment] = useState([]);
    const [status, setStatus] = useState({status:"idle", error:null});
    const [paymentProcess, setPaymentProcess] = useState(0);
    const [selectedPaymentMethod, setSlectedPaymentMethod] = useState("");

    useEffect(() => {
        if(status.status === "success"){
            setTimeout(() => {
                modalVisible(false);
                reload();
            }, 2000)
        }
        else if(status.status === "error"){
            setTimeout(() => {
                modalVisible(false);
            }, 2000)
        }
    },[status])

    const goToPayment = (e) => {
        e.preventDefault();
        setPaymentProcess(1);
    }

    const goToCompleteBill = (e) => {
        e.preventDefault();
        setPayment([{method:selectedPaymentMethod,price:total}])
        setPaymentProcess(2);
        handleSubmit();
    }

    const handleSubmit = async () => {
        setStatus({status:"loading", error:null});

        const outProducts = []
        products.map((product) => {
            outProducts.push({
                productName: product.productName,
                quantity: product.quantity,
                price: product.totalPrice,
                productId:product.productId
            });
        })
        
        const data = {
          products:outProducts,
          storeId,
          payment:[{method:selectedPaymentMethod,price:total}],
          customerName: !customerName ? "-" : customerName,
          customerPhoneNumber: !customerNumber ? "-" : customerNumber
        }
        await axios.post('/api/pos/generate_bill', data, {})
          .then((response) => {
            setStatus({status:"success", error:null});
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    };

    const selectedPaymentStyle = {
        backgroundColor: '#3daeff', // Replace with your desired color
        color: '#fff', // Text color
    };

    const handleNameChange = (e) => {
        e.preventDefault();
        setCustomerName(e.target.value)
    }

    return (
        <div style={{padding:"10px"}}>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    {
                        paymentProcess === 0 
                        ?
                        <h2>Customer Information</h2>
                        :
                        paymentProcess === 1
                        ?
                        <h2>Payment</h2>
                        :
                        <div></div>
                    }
                </Col>
            </Row>
            <h4>Total : &#8377;{total?? ""}</h4>
            {paymentProcess === 0 
            ?
            <Form onSubmit={goToPayment} style={{padding:"10px"}}>
                    <Form.Group as={Row}>
                        <Form.Label >Customer Name</Form.Label>
                        <Form.Control 
                            type="text"
                            name="customerName"
                            value={customerName}
                            onChange={handleNameChange}
                            
                        />
                    </Form.Group>
                
                    <Form.Group as={Row}>
                        <Form.Label >Customer Number</Form.Label>
                        <Form.Control 
                            type="text"
                            name="customerNumber"
                            value={customerNumber}
                            onChange={(e) => {
                                e.preventDefault();
                                setCustomerNumber(e.target.value)}}
                            
                        />
                    </Form.Group>  
                
                <Button variant="success" type="submit">
                    Next
                </Button>
            </Form>
            : paymentProcess === 1
            ?
            <div>
                <Row >
                    <Col>
                        <Card style={selectedPaymentMethod === "cash" ? selectedPaymentStyle : {} }
                            onClick={() => setSlectedPaymentMethod("cash")}>
                            <Card.Body>
                                <Card.Title className="text-center">Cash</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted text-center">&#8377;{total}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={selectedPaymentMethod === "card" ? selectedPaymentStyle : {} }
                            onClick={() => setSlectedPaymentMethod("card")}>
                            <Card.Body>
                                <Card.Title className="text-center">Card</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted text-center">&#8377;{total}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={selectedPaymentMethod === "upi" ? selectedPaymentStyle : {} }
                            onClick={() => setSlectedPaymentMethod("upi")}>
                            <Card.Body>
                                <Card.Title className="text-center">UPI</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted text-center">&#8377;{total}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* <Col>
                        <Card 
                            style={selectedPaymentMethod === "split" ? selectedPaymentStyle : {} }
                            onClick={() => setSlectedPaymentMethod("split")}>
                            <Card.Body>
                                <Card.Title className="text-center">Split</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted text-center">{"Click"}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col> */}
                </Row>
                <Button onClick={goToCompleteBill} disabled={selectedPaymentMethod===""}>Complete</Button>
            </div>
            :
            <div>
                {
                    status.status === "loading" 
                    ?
                    <Spinner/>
                    :
                    status.status === "success" 
                    ?
                    <Row className="justify-content-md-center"><Alert variant='success'>Success</Alert></Row>
                    :status.status === "error" 
                    ?
                    <Row className="justify-content-md-center"><Alert variant='danger'>{status.error ?? "Something Went Wrong"}</Alert></Row>
                    :
                    <></>
                }
            </div>
            }
        </div>
    );
}

export default CompleteBillForm;
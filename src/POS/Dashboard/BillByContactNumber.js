import React, { useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import axios from '../../config/axios';

function BillByContactNumber(props) {
    const [contactNo, setContactNo] = useState(0)
    const [status, setStatus] = useState({status:"idle", error:null});
    const [bills, setBills] = useState(null);
    
    const getContact = async (e) => {
        e.preventDefault();
        setStatus({status:"loading", error:null});
        await axios.get(`/api/pos/get_bill_by_phoneNo/${contactNo}`)
          .then((response) => {
            setBills(response.data);
            setStatus({status:"success", error:null});
            console.log(bills);
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    }

    const handleContactNoChange = (e) => {
        e.preventDefault();
        setContactNo(e.target.value);
    }

    return (
        <div >
            <Form onSubmit={getContact} style={{padding:"10px"}}>
                    <Form.Group>
                        <Form.Control 
                            type="text"
                            name="contactNo"
                            value={contactNo}
                            onChange={handleContactNoChange}
                            placeholder={"Cantact Number"}
                        />
                    </Form.Group>
                <Button variant="success" type="submit">
                    Find
                </Button>
            </Form>
            <div style={{ width: '100%', overflow: 'auto' }}>
            {
                status.status === "loading" ?<Spinner/>
                :
                status.status === "success" ? 
                <Table bordered hover >
                    <thead>
                        <th>Bill No</th>
                        <th>StoreId</th>
                        <th>Customer Name</th>
                        <th>Contact Number</th>
                        <th>Time</th>
                        <th>Products</th>
                        <th>Payment</th>
                    </thead>
                    <tbody>
                    {
                        bills?.map((bill) => (
                            <tr>
                                <td>{bill?.billNo}</td>
                                <td>{bill?.storeId}</td>
                                <td>{bill?.customerName}</td>
                                <td>{bill?.customerPhoneNumber}</td>
                                <td>{bill?.billTime.slice(0,10)}</td>
                                <td>
                                    <Table bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            bill?.products.map((product) => (
                                                <tr>
                                                    <td>{product.productName}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>&#8377;{product.price}</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </td>
                                <td>
                                    <Table bordered hover>
                                        <tbody>
                                        {
                                            bill?.payment.map((m) => (
                                                <tr>
                                                    <td>{m.method}</td>
                                                    <td>&#8377;{m.price}</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </td>

                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                :
                status.status === "error" ? <Alert variant='danger'>{status.error ?? "Something Went Wrong"}</Alert>
                :
                <></>

            }
            </div>
        </div>
    );
}

export default BillByContactNumber;
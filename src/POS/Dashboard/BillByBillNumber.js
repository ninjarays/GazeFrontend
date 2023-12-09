import React, { useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import axios from '../../config/axios';

function BillByBillNumber({modalVisible}) {
    const [billNo, setBillNo] = useState(0)
    const [status, setStatus] = useState({status:"idle", error:null});
    const [bill, setBill] = useState(null);
    
    const getBill = async (e) => {
        e.preventDefault();
        setStatus({status:"loading", error:null});
        await axios.get(`/api/pos/get_bill_by_billNo/${billNo}`)
          .then((response) => {
            setBill(response.data)
            setStatus({status:"success", error:null});
            console.log(response);
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    }

    const handleBillNoChange = (e) => {
        e.preventDefault();
        setBillNo(e.target.value);
    }

    return (
        <div >
            <Form onSubmit={getBill} style={{padding:"10px"}}>
                    <Form.Group>
                        <Form.Control 
                            type="text"
                            name="billNo"
                            value={billNo}
                            onChange={handleBillNoChange}
                            placeholder={"Bill Number"}
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

export default BillByBillNumber;
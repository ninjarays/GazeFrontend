import React, { useEffect, useState } from 'react';
import { Button, Table , Modal, Form, Alert, Spinner } from 'react-bootstrap';
import QuotePDFGenerator from './RequestQuotePdf';
import UpdateIngredientPricesForm from './UpdateIngredientPricesForm';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';
import ViewOrderDetails from './ViewOrderDetails';
import RejectOrderForm from './RejectOrderForm';

function BudgetApprovalList({reload}) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const role = useSelector((state) => state.user.userInfo.userCred.role);
    const storeOrders = useSelector((state) => state.orders.getStoreOrders);
    const [viewMaterials, setViewMaterials] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [updatePrices, setUpdatePrices] = useState(false);
    const [enterRejectNote, setEnterRejectNote] = useState(false);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})

    const ViewRawMaterials =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Order Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ViewOrderDetails orderId={viewOrder?._id}/>
            </Modal.Body>
          </Modal>
        );
    }

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            reload();
            setTimeout(() => {
                setStatus({status:"idle", error:null});
                setShow(false)

            }, 1500)
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
            }, 2000)
        }
        else if(status.status === "loading"){
        }
        else if(status.status === "idle"){
            setShow(false)
        }
    },[status.status])
    
    const handleSendForApproval = async (id) => {
        const data = {
          _id:id,
        }
        setStatus({status:"loading", error:null});
        await axios.put('/api/orders/order_approval', data, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            setStatus({status:"success", error:null});
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    };

    const EnterRejectNote =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Rejection Reason
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <RejectOrderForm _id={viewOrder?._id ?? ""} token={token} closeForm={setEnterRejectNote} reloadList={reload}/>
            </Modal.Body>
          </Modal>
        );
    }

    return (
        <div style={{ width: '100%'}}>

        {show?
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{status.error ? status.error : "Order Approved"}</Alert.Heading>
            </Alert> 
            : 
            <div></div>
        }
        <ViewRawMaterials
            show={viewMaterials}
            onHide={() => {
                setViewMaterials(false);
            }}
        />

        <EnterRejectNote
            show={enterRejectNote}
            onHide={() => {
                setEnterRejectNote(false);
            }}
        />
       
       {storeOrders.status === "success" ? <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Requested By</th>
                        <th>Approved By</th>
                        <th>Products</th>
                        <th>Consumption Date</th>
                        <th>Request Date</th>
                        <th>Approval Date</th>
                        <th>Order Details</th>
                        <th>Send For Approval</th>
                        <th>Reject</th>
                    </tr>
                </thead>
                <tbody>
                {storeOrders.orders.filter((o) => o.status === 2 ).map((order) => (
                    <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>{order.employeeName}</td>
                        <td>{order.approvarName}</td>
                        <td>
                            <table>
                                <tbody >
                                    {order.products.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        <td>{`${order.consumptionDate.month} ${order.consumptionDate.year}`}</td>
                        <td>{order.requestDate.slice(0,10)}</td>
                        <td>{order.approvalDate.slice(0,10)}</td>
                        <td>
                            <Button onClick={() => {
                                setViewOrder(order);
                                setViewMaterials(true);
                            }}> Details</Button>
                        </td>
                        <td>
                            <Button onClick={() => {
                                handleSendForApproval(order._id);
                            }}>Approve</Button>
                        </td>
                        <td>{
                            ["admin","super_admin"].includes(role) ?
                            <Button variant='danger' onClick={async () => {
                                setViewOrder(order);
                                setEnterRejectNote(true);
                            }}>Reject</Button>
                            :
                            <Button variant='danger' onClick={async () => {
                            } } disabled>Reject</Button>    
                        }</td>
                    </tr>
                ))}
                </tbody>

            </Table>
        </div>
        :
        storeOrders.status === "loading" ?
        <Spinner animation="border" />
        :
        <div></div>}
        </div>
    );
}

export default BudgetApprovalList;
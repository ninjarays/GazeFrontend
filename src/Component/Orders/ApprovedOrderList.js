import React, { useEffect, useState } from 'react';
import { Button, Table , Modal, Form, Alert } from 'react-bootstrap';
import QuotePDFGenerator from './RequestQuotePdf';
import UpdateIngredientPricesForm from './UpdateIngredientPricesForm';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';

function ApprovedOrderList(props) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [viewMaterials, setViewMaterials] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [updatePrices, setUpdatePrices] = useState(false);
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
                Raw Materials
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Materials</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {viewOrder?.products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>
                            <table>
                                <tbody >
                                    {product.materials.map((material) => (
                                        <tr>
                                            <td>{material.name}</td>
                                            <td>{material.weight}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        </tr>
                    ))}
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        );
    }

    const closeEditPriceForm = () => {
        setUpdatePrices(false);
        props.reload();
    }

    const UpdatePricesModal =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Ingredient Prices
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UpdateIngredientPricesForm prices={viewOrder?.materialPrices} orderId={viewOrder?._id} closeForm={closeEditPriceForm}/>
            </Modal.Body>
          </Modal>
        );
    }

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
                setShow(false);
                props.reload();
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
        await axios.put('/api/orders/send_for_budget_approval', data, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            setStatus({status:"success", error:null});
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    };

    return (
        <div style={{ width: '100%'}}>

        {show?
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{status.error ? status.error : "Order Sent For Approval"}</Alert.Heading>
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

        <UpdatePricesModal
            show={updatePrices}
            onHide={() => {
             setUpdatePrices(false);
            }}
        />
       
        <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
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
                        <th>Materials</th>
                        <th>Quote Request</th>
                        <th>Update Prices</th>
                        <th>Send For Approval</th>
                    </tr>
                </thead>
                <tbody>
                {props.orders.map((order) => (
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
                            }}> View</Button>
                        </td>
                        <td>
                            <QuotePDFGenerator order={order}/>
                        </td>
                        <td>
                            <Button onClick={() => {
                                setViewOrder(order);
                                setUpdatePrices(true);
                            }}>Update Prices</Button>
                        </td>
                        <td>
                            <Button onClick={() => {
                                 handleSendForApproval(order._id);
                            }}>Send For Approval</Button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>
        </div>
        </div>
    );
}

export default ApprovedOrderList;
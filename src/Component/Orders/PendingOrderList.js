import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { approveOrder, approveOrderReset, deleteOrder, deleteOrderReset, rejectOrder, rejectOrderReset } from '../../features/orders/orderSlice';
import RejectOrderForm from './RejectOrderForm';
import EditOrderForm from './EditOrderForm';

function PendingOrderList(props) {
    const reloadList = () => {props.setReload()};
    const approveStatus = useSelector((state) => state.orders.approveOrder);
    const deleteStatus = useSelector((state) => state.orders.deleteOrder);
    const [viewMaterials, setViewMaterials] = useState(false);
    const [viewEditOrder, setViewEditOrder] = useState(false);
    const [viewNote, setViewNote] = useState(false);
    const [enterRejectNote, setEnterRejectNote] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [approveMessage, setApproveMessage] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const token = props.token;
    const dispatch = useDispatch();
        

    useEffect(() => {
        if(approveStatus.status === "idle"){
            setApproveMessage(false);
        }
        else if(approveStatus.status === "error"){
            setApproveMessage(true);
            // Automatically hide the notification after 2 seconds
            const timeout = setTimeout(() => {
                dispatch(approveOrderReset());
                setApproveMessage(false);
            }, 2000);
  
            // Clear the timeout when the component unmounts
            return () => clearTimeout(timeout);
        }
        else if(approveStatus.status === "success"){
            setTimeout(()=>{
                dispatch(approveOrderReset());
                reloadList()},2000);
        }
    },[approveStatus.status])

    useEffect(() => {
        if(deleteStatus.status === "idle"){
            setDeleteMessage(false);
        }
        else if(deleteStatus.status === "error"){
            setDeleteMessage(true);
            // Automatically hide the notification after 2 seconds
            const timeout = setTimeout(() => {
                dispatch(deleteOrderReset());
                setDeleteMessage(false);
            }, 2000);
  
            // Clear the timeout when the component unmounts
            return () => clearTimeout(timeout);
        }
        else if(deleteStatus.status === "success"){
            setTimeout(()=>{
                dispatch(deleteOrderReset());
                reloadList()},2000);
        }
    },[deleteStatus.status])

    const handleApprove = (id) => {
        const data = {
            token:props.token,
            id
        }
        dispatch(approveOrder(data));
    }

    const handleDelete = (id) => {
        const data = {
            token:props.token,
            id
        }
        dispatch(deleteOrder(data));
    }

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
                    {selectedOrder?.products.map((product,index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>
                            <table>
                                <tbody >
                                    {product.materials.map((material) => (
                                        <tr key={material.name}>
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

    const ViewNote =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Note
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {selectedOrder?.note ?? ""}
              </p>
            </Modal.Body>
          </Modal>
        );
    }

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
              <RejectOrderForm _id={selectedOrder?._id ?? ""} token={token} closeForm={setEnterRejectNote} reloadList={reloadList}/>
            </Modal.Body>
          </Modal>
        );
    }

    const EditOrderModal =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Edit Order
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditOrderForm 
              _id={selectedOrder?._id} 
              token={token} 
              closeForm={setViewEditOrder}  
              reloadList={reloadList}
              consumptionDate={selectedOrder?.consumptionDate}
              products={selectedOrder?.products.map((i) => {return {name:i.name, quantity:parseInt(i.quantity) }}) }
              />
            </Modal.Body>
          </Modal>
        );
    }

    return (
        <div style={{ width: '100%'}}>
        <Alert variant="danger" show={approveMessage}>
            {approveStatus.error?? ""}
        </Alert>

        <Alert variant="danger" show={deleteMessage}>
            {deleteStatus.error?? ""}
        </Alert>


        <ViewRawMaterials
            show={viewMaterials}
            onHide={() => {
                setViewMaterials(false);
            }}
        />
        <ViewNote
            show={viewNote}
            onHide={() => {
                setViewNote(false);
            }}
        />

        <EditOrderModal
            show={viewEditOrder}
            onHide={() => {
                setViewEditOrder(false);
            }}
        />

        <EnterRejectNote
            show={enterRejectNote}
            onHide={() => {
                setEnterRejectNote(false);
            }}
        />
        
        {  <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Requested By</th>
                        <th>Products</th>
                        <th>Target For Consumption Month</th>
                        <th>Request Date</th>
                        <th>Consumption Date</th>
                        <th>Materials</th>
                        <th>Edit</th>
                        {["admin","super_admin"].includes(props.role) && <th>Approve</th>}
                        <th>Reject</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {props.orders.map((order) => (
                    <tr key={order._id} style={{backgroundColor: order.status === 0? 'white':'#ffc9c9'}}>
                        <td>{order.orderId ?? "-"}</td>
                        <td>{order.employeeName}</td>
                        <td>
                            <table>
                                <tbody >
                                    {order.products.map((product) => (
                                        <tr key={product._key}>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            {!order.salesTarget ? <p>-</p>:<table>
                                <tbody >
                                    {order.salesTarget.map((product) => (
                                        <tr key={product._key}>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>}
                        </td>
                        <td>{order.requestDate.slice(0,10)}</td>
                        <td>{`${order.consumptionDate.month} ${order.consumptionDate.year}`}</td>
                        <td>
                            <Button onClick={() => {
                                setSelectedOrder(order);
                                setViewMaterials(true);
                            }}> View</Button>
                        </td>
                        
                        <td><Button onClick={() => {
                            setSelectedOrder(order);
                            setViewEditOrder(true);
                        }}>Edit</Button></td>

                        {["admin","super_admin"].includes(props.role) && 
                        <td><Button variant='success' onClick={async () => {
                                handleApprove(order._id);
                            }}>Approve</Button></td>
                        }

                        <td>
                            {order.status !== 0 ?
                            <Button onClick={async () => {
                                setSelectedOrder(order);
                                setViewNote(true);
                            }}>Note</Button>

                            :

                            ["admin","super_admin"].includes(props.role) ?
                            <Button variant='danger' onClick={async () => {
                                setSelectedOrder(order);
                                setEnterRejectNote(true);
                            }}>Reject</Button>
                            :
                            <Button variant='danger' onClick={async () => {
                                setSelectedOrder(order);
                                setEnterRejectNote(true);
                            } } disabled>Reject</Button>
                        }
                        </td>
                        <td><Button variant='danger' onClick={async () => {
                                handleDelete(order._id);
                            }}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>

            </Table>
        </div>}
        </div>
    );
}

export default PendingOrderList;
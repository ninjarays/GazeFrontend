import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal,Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import Pagination from 'react-bootstrap/Pagination';
import { getManufacturing } from '../../features/manufacturing/manufacturingSlice';
import EditManufactureOrder from './EditManufacuringOrderForm';
import ManufacturingOrderDetails from './ManufacturingOrderDetails';
import OrderBatchesDetail from './OrderBatchesDetail';





function PendingManufacturingList({reload,reloadValue,storeId}) {

    const token = useSelector((state) => state.user.userInfo);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const productsList = useSelector((state) => state.orders.getProducts);
    const productsOptions = productsList.products?.map((i) => {return {label:`${i.name}`,value:i.name}});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewEditOrder, setViewEditOrder] = useState(false);
    const [viewOrderBatches, setViewOrderBatches] = useState(false);
    const [completOrderStatus, setCompletOrderStatus] = useState({status:"idle", error:null});
    const [pendingManufacturingInfo, setpendingManufacturingInfo] = useState({data:[],status:"idle",error:null})
    const [viewManufacturingDetalModal,setViewManufacturingDetalModal] = useState(false);
    const [manufactureCompletedModal,setManufactureCompletedModal]= useState(false);


    useEffect(() => {
        if(pendingManufacturingInfo.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                // setStatus({status:"idle", error:null});
                setShow(false)
            }, 1500)
        }
        else if(pendingManufacturingInfo.status === "error"){
            setShow(true);
            setVariant("danger");
            setTimeout(() => {
                //setStatus({status:"idle", error:null});
                setShow(false)
        }, 2000)
        }
        else if(pendingManufacturingInfo.status === "loading"){
            setVariant("normal");
        }
        else if(pendingManufacturingInfo.status=== "idle"){
            setShow(false)
        }
    },[pendingManufacturingInfo.status]);

    useEffect(()=>{
        if(completOrderStatus.status==="success"){
            setTimeout(() => {      
                setCompletOrderStatus({status:"idle",error:null});
                reload();
                setManufactureCompletedModal(false);
            }, 3500)
        }
        else if(completOrderStatus.status==="error"){
            setTimeout(() => {      
                setCompletOrderStatus({status:"idle",error:null});
            }, 3500)
        }
    },[completOrderStatus])

    useEffect(() => {
        if(storeId!==""){
            getPendingManufacture();
        }
    }, [storeId,reloadValue])



    const getPendingManufacture = async () => {
        setpendingManufacturingInfo({data:[],status:"loading",error:null});
        await axios.get(`api/manufacture/get_all_manufacturing_order/${storeId}`, {
            headers:{"Authorization":`Bearer ${token.access_token}`},
        }).then((response) => {
            setpendingManufacturingInfo({data:response.data,status:"success",error:null});
        }).catch((err) => {
            setpendingManufacturingInfo({data:[],status:"error",error:err.response.data.message});
        })
    };

    const completManufactureingOrder = async (id) => {
        setCompletOrderStatus({status:"loading", error:null});
        await axios.post('api/manufacture/maufacture_completed', {id}, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            setCompletOrderStatus({status:"success", error:null});
        }).catch((err) => {
            setCompletOrderStatus({status:"error", error:err.response.data.message});
        })
    };

    const EditManufacturing =(props)=>{
        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Manufacturing Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditManufactureOrder 
                        storeId ={storeId}
                        order={selectedOrder}
                        productsOptions={productsOptions}     
                        closeForm={setViewEditOrder}
                        reload={reload}/>
                </Modal.Body>
            </Modal>
        );
    }
  
    const ManufacturingDetailModal =(props)=>{
        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Manufacturing Detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ManufacturingOrderDetails
                        id={selectedOrder?._id??""}
                        isDisable={selectedOrder?.status===1??false}
                        reload={reload}
                        closeForm={setViewManufacturingDetalModal}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    const OrderBatchesDetailModal =(props)=>{
        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Batches Detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OrderBatchesDetail order={selectedOrder}/>
                </Modal.Body>
            </Modal>
        );
    }
  
    const ManufacturingCompletedModal =(props)=>{
        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Complete Manufacturing 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                    <Button disabled={completOrderStatus.status!=="idle" || selectedOrder?.status!==1}
                        onClick={()=>{
                            completManufactureingOrder(selectedOrder?._id);
                        }}>
                        {completOrderStatus.status==="idle"?<h5><p>Confirm Accept</p></h5>:
                            completOrderStatus.status==="loading"?<Spinner/>:
                            completOrderStatus.status==="error"? <p>{completOrderStatus.error??"Something went wrong"}</p>:  
                            <p><h5>Success</h5></p>}
                    </Button>    
                </Modal.Body>
            </Modal>
        );
    }
  
    return (
<>
<EditManufacturing
                show={viewEditOrder}
                onHide={() => {
                    setViewEditOrder(false);
                }}
            />

<ManufacturingDetailModal
   show={viewManufacturingDetalModal}
   onHide={()=>{
    setViewManufacturingDetalModal(false);
   }}
/>

<ManufacturingCompletedModal
    show={manufactureCompletedModal}
    onHide={()=>{
        setManufactureCompletedModal(false);
    }}
/>

<OrderBatchesDetailModal
    show={viewOrderBatches}
    onHide={()=>{
        setViewOrderBatches(false);
    }}
/>
<div style={{ width: '100%', height: '600px', overflow: 'auto' }} >
            { pendingManufacturingInfo.status === "idle" ? <></>
            :
            pendingManufacturingInfo.status === "loading" ? <Spinner/>
            :
            pendingManufacturingInfo.status === "error" ? <Alert variant='danger'>{pendingManufacturingInfo.status.error ?? ""}</Alert>


            :
            <Table striped bordered hover>
                    <thead>
                    <tr>                        
                        <th>Requested By</th>
                        <th>Product</th>
                        <th>Production Month</th>
        
                        <th>Package Type</th>
                        <th>Package Quantity</th>
                        <th>Total Quantity</th>   
                        <th>Edit</th> 
                        <th>Accept</th>                    
                        
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                {pendingManufacturingInfo.data.map((order) => (
                    <tr key={order._id} style={{backgroundColor: order.status === 0? 'white':'#bcf7db'}}>
                        <td>{order.adminId}</td>
                        <td>{order.product}</td>
                        <td>{order.productionMonth.month} {order.productionMonth.year}</td>
                        
                        <td>{order.package.packageType} gm</td>
                        <td>{order.package.packageQuantity} </td>
                        <td>{order.weight} gm</td>
                        <td><Button disabled={order.status===1}
                        onClick={() => {
                            setSelectedOrder(order);
                            setViewEditOrder(true);
                        }}>Edit</Button></td>
                        <td>{
                            order.status===0 
                            ?
                            <Button 
                             onClick={() => {
                                setSelectedOrder(order);
                                setViewManufacturingDetalModal(true);
                            }}>Accept</Button>
                            :
                            <Button 
                             onClick={() => {
                                setSelectedOrder(order);
                                setViewOrderBatches(true);
                            }}>Details</Button>
                        }</td>
                       
                        <td><Button 
                        disabled={order.status===0}
                        onClick={() => {
                            setSelectedOrder(order);
                            setManufactureCompletedModal(true);
                        }}>Complete</Button></td>
                        
                    </tr>
                ))}
                </tbody>
                

            </Table>
            }
           
        </div>
</>
    
  )
}

export default PendingManufacturingList;
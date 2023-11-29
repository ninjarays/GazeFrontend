import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal,Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import Pagination from 'react-bootstrap/Pagination';
import { getManufacturing } from '../../features/manufacturing/manufacturingSlice';
import EditManufactureOrder from './EditManufacuringOrderForm';




function PendingManufacturingList({reload,reloadValue,storeId}) {

  const token = useSelector((state) => state.user.userInfo.access_token);
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("light");
  const [createOrderShow, setCreateOrderShow] = useState(false);
  const productsList = useSelector((state) => state.orders.getProducts);
  const productsOptions = productsList.products?.map((i) => {return {label:`${i.name}`,value:i.name}});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewEditOrder, setViewEditOrder] = useState(false);
  const [status, setStatus] = useState({status:"idle", error:null});
  const [pendingManufacturingInfo, setpendingManufacturingInfo] = useState({data:[],status:"idle",error:null})
  
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

const acceptManufactureingOrder = async (id) => {
  setStatus({status:"loading", error:null});
  await axios.put('/api/manufacture/manufacture_accepted', {id}, {
      headers:{"Authorization":`Bearer ${token}`},
  }).then((response) => {
      setStatus({status:"success", error:null});
  }).catch((err) => {
      setStatus({status:"error", error:err.response.data.message});
  })
};


useEffect(() => {
    if(storeId!==""){
        getPendingManufacture();
    }
    
}, [storeId,reloadValue])



const getPendingManufacture = async () => {
    setpendingManufacturingInfo({data:[],status:"loading",error:null});
    await axios.get(`api/manufacture/get_all_manufacturing_order/${storeId}`, {
        headers:{"Authorization":`Bearer ${token}`},
    }).then((response) => {
        setpendingManufacturingInfo({data:response.data,status:"success",error:null});
    }).catch((err) => {
        setpendingManufacturingInfo({data:[],status:"error",error:err.response.data.message});
    })
};


const EditManufacturing =(props)=>{
    return(
      <Modal
      {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
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
  

  return (

<>
<EditManufacturing
                show={viewEditOrder}
                onHide={() => {
                    setViewEditOrder(false);
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
                        <th>Production Year</th>
                        <th>Individual Package Type(gms)</th>
                        <th>Package Quantity</th>
                        <th>Total Quantity(gms)</th>   
                        <th>Edit</th>                     
                        <th>Accept Order</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                {pendingManufacturingInfo.data.map((order) => (
                    <tr key={order._id} >
                        <td>{order.adminId}</td>
                        <td>{order.product}</td>
                        <td>{order.productionMonth.month}</td>
                        <td>{order.productionMonth.year}</td>
                        <td>{order.package.packageType}</td>
                        <td>{order.package.packageQuantity}</td>
                        <td>{order.weight}</td>
                        <td><Button onClick={() => {
                            setSelectedOrder(order);
                            setViewEditOrder(true);
                        }}>Edit</Button></td>
                        <td><Button>Accept</Button></td>
                        <td><Button>Complete</Button></td>
                        
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
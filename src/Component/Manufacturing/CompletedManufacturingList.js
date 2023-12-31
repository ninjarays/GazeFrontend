import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Table,Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import Pagination from 'react-bootstrap/Pagination';
import OrderBatchesDetail from './OrderBatchesDetail';


const CompletedManufacturingList = ({reloadValue,storeId}) => {
  const token = useSelector((state) => state.user.userInfo);
  const [completManufacturingInfo, setcompletManufacturingInfo] = useState({data:[],status:"loading",error:null});
  const [viewOrderBatches, setViewOrderBatches] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
 
useEffect(() => {
  if(storeId!==""){
      getCompletManufacture();
  }
  
}, [storeId,reloadValue])

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

const getCompletManufacture = async () => {
  setcompletManufacturingInfo({data:[],status:"loading",error:null});
  await axios.get(`api/manufacture/get_completed_manufacture_order/${storeId}`, {
      headers:{"Authorization":`Bearer ${token.access_token}`},
  }).then((response) => {
      setcompletManufacturingInfo({data:response.data,status:"success",error:null});
  }).catch((err) => {
      setcompletManufacturingInfo({data:[],status:"error",error:err.response.data.message});
  })
};

  return (
    <>
    <OrderBatchesDetailModal
    show={viewOrderBatches}
    onHide={()=>{
        setViewOrderBatches(false);
    }}
/>
     <div style={{ width: '100%', height: '600px', overflow: 'auto' }} >
            {
            completManufacturingInfo.status === "loading" ? <Spinner/>
            :
            completManufacturingInfo.status === "error" ? <Alert variant='danger'>{completManufacturingInfo.status.error ?? ""}</Alert>


            :
        <Table striped bordered hover>
        <thead>
                    <tr>                        
                        <th>Requested By</th>
                        <th>Product</th>
                        <th>Production Month</th>
                        <th>Production Year</th>
                        <th>Packege Type</th>
                        <th>Package Quantity</th>
                        <th>Total Quantity</th> 
                        <th>Batches</th>
                    </tr>
                </thead>


                <tbody>

                {completManufacturingInfo.data.map((order) => (
                    <tr key={order._id} >
                        <td>{order.adminId}</td>
                        <td>{order.product}</td>
                        <td>{order.productionMonth.month}</td>
                        <td>{order.productionMonth.year}</td>
                        <td>{order.package.packageType}</td>
                        <td>{order.package.packageQuantity}</td>
                        <td>{order.weight}</td>
                        <td>
                          <Button 
                             onClick={() => {
                                setSelectedOrder(order);
                                setViewOrderBatches(true);
                          }}>Details</Button>
                        </td>
                        
                    </tr>
                ))}

                </tbody>

        </Table>
  }
  </div>
 
  
</>
  )
}

export default CompletedManufacturingList

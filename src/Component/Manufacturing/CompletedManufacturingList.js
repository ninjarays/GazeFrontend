// import React, { useEffect, useState } from 'react';
// import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from '../../config/axios';
// import Pagination from 'react-bootstrap/Pagination';
// const CompletedManufacturingList = ({reload,reloadValue,storeId}) => {

//   const token = useSelector((state) => state.user.userInfo.access_token);
//   const [show, setShow] = useState(false);
//   const [variant, setVariant] = useState("light");
//   const [createOrderShow, setCreateOrderShow] = useState(false);
//   const productsList = useSelector((state) => state.orders.getProducts);
//   const productsOptions = productsList.products?.map((i) => {return {label:`${i.name}`,value:i.name}});
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [viewEditOrder, setViewEditOrder] = useState(false);
//   const [status, setStatus] = useState({status:"idle", error:null});
//   const [completManufacturingInfo, setcompletManufacturingInfo] = useState({data:[],status:"idle",error:null})
  
//   useEffect(() => {
//     if(completManufacturingInfo.status === "success"){
//         setShow(true);
//         setVariant("success");
//         setTimeout(() => {
//            // setStatus({status:"idle", error:null});
//             setShow(false)
//         }, 1500)
//     }
//     else if(completManufacturingInfo.status === "error"){
//         setShow(true);
//         setVariant("danger");
//         setTimeout(() => {
//             //setStatus({status:"idle", error:null});
//             setShow(false)
//         }, 2000)
//     }
//     else if(completManufacturingInfo.status === "loading"){
//         setVariant("normal");
//     }
//     else if(completManufacturingInfo.status=== "idle"){
//         setShow(false)
//     }
// },[completManufacturingInfo.status]);

// useEffect(() => {
//   if(storeId!==""){
//       getPendingManufacture();
//   }
  
// }, [storeId,reloadValue])

// const getCompletManufacture = async () => {
//   setcompletManufacturingInfo({data:[],status:"loading",error:null});
//   await axios.get(`api/manufacture/get_completed_manufacture_order/${storeId}`, {
//       headers:{"Authorization":`Bearer ${token}`},
//   }).then((response) => {
//       setcompletManufacturingInfo({data:response.data,status:"success",error:null});
//   }).catch((err) => {
//       setcompletManufacturingInfo({data:[],status:"error",error:err.response.data.message});
//   })
// };

//   return (
//     <>
//      <div style={{ width: '100%', height: '600px', overflow: 'auto' }} >
//             { pendingManufacturingInfo.status === "idle" ? <></>
//             :
//             pendingManufacturingInfo.status === "loading" ? <Spinner/>
//             :
//             pendingManufacturingInfo.status === "error" ? <Alert variant='danger'>{pendingManufacturingInfo.status.error ?? ""}</Alert>


//             :
//         <Table striped bordered hover>
//         <thead>
//                     <tr>                        
//                         <th>Requested By</th>
//                         <th>Product</th>
//                         <th>Production Month</th>
//                         <th>Production Year</th>
//                         <th>Packege Type</th>
//                         <th>Package Quantity</th>
//                         <th>Total Quantity</th>                        
//                         {/* <th>Accept Order</th>
//                         <th>Completed</th> */}
//                     </tr>
//                 </thead>


//                 <tbody>

//                 {pendingManufacturingInfo.data.map((order) => (
//                     <tr key={order._id} >
//                         <td>{order.adminId}</td>
//                         <td>{order.product}</td>
//                         <td>{order.productionMonth.month}</td>
//                         <td>{order.productionMonth.year}</td>
//                         <td>{order.package.packageType}</td>
//                         <td>{order.package.packageQuantity}</td>
//                         <td>{order.weight}</td>
                        
                        
//                     </tr>
//                 ))}

//                 </tbody>

//         </Table>
//   }
//   </div>
 
  
// </>
//   )
// }

// export default CompletedManufacturingList

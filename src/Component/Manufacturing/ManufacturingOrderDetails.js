import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../config/axios';
import { Alert, Button, Col, Modal, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';


function  ManufacturingOrderDetails({id,reload,closeForm,isDisable}) {
    const user = useSelector((state) => state.user.userInfo);
    
    const [acceptStatus, setAcceptStatus]=useState({status:"idle",error:null});
    const [inventoryData, setInventoryData] = useState({data:[],status:"idle",error:null})

   useEffect(()=> {
    if(id!=="" && user.access_token){
        getAsyncInventory();
    }
    

   } ,[]);

   useEffect(()=>{
    if(acceptStatus.status==="success"){
        
        setTimeout(() => {      
            setAcceptStatus({status:"idle",error:null});
            reload();
            closeForm(false);
        }, 1500)
    }
    if(acceptStatus.status==="error"){
        setTimeout(() => {      
            setAcceptStatus({status:"idle",error:null});
        }, 1500)
    }

   },[acceptStatus])

    const getAsyncInventory = async () => {
       

        setInventoryData({data:[],status:"loading",error:null});
        await axios.get(`/api/manufacture/get_manufacturing_order_details/${id }`, {
            headers:{"Authorization":`Bearer ${user.access_token??""}`},
        }).then((response) => {
            
            setInventoryData({data:response.data,status:"success",error:null});
        }).catch((err) => {
           
            setInventoryData({data:[],status:"error",error:err.response.data.message});
        })
    };
    
    const  acceptManufacturingOrder= async ()=>{
        setAcceptStatus({status:"loading",error:null});
        await axios.put(`/api/manufacture/manufacture_accepted`,{_id:id,comparision:inventoryData.data}, {
            headers:{"Authorization":`Bearer ${user.access_token??""}`},
        }).then((response) => {
            
            setAcceptStatus({status:"success",error:null});
        }).catch((err) => {
           
            setAcceptStatus({status:"error",error:err.response.data.message});
        })
    }

    

    return (
    <>
        <div style={{ width: '90%', paddingTop:'50px'}}>
        <Button disabled={acceptStatus.status!=="idle" || isDisable}
        onClick={()=>{
            acceptManufacturingOrder();
            
        }}>
            {acceptStatus.status==="idle"?<h5><p>Accept</p></h5>:
        acceptStatus.status==="loading"?<Spinner/>:
        acceptStatus.status==="error"? <p>{acceptStatus.error??"Something went wrong"}</p>:  
        <p><h5>Success</h5></p>}
        </Button>
       
     
        <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            { inventoryData.status === "idle" ? <></>
            :
            inventoryData.status === "loading" ? <Spinner/>
            :
            inventoryData.status === "error" ? <Alert>{inventoryData.error ?? ""}</Alert>
            :
            <Table striped bordered hover>
                <thead>
                    <tr>
                      
                        <th>Procuct Name</th>
                        <th>Required</th>
                        <th>In Stock</th>
                        
                    </tr>
                </thead>
                <tbody>
                {inventoryData.data?.map((product,index) => (
                    <tr key={index} style={{backgroundColor: parseFloat(product.requiredQuantity) <= parseFloat(product.availableQuantity)? 'white':'#ffc9c9'}}>
                        
                        <td>{product.materialName}</td>
                        <td>{product.requiredQuantity}</td>
                        <td>{product.availableQuantity}</td>
                        
                    </tr>
                ))}
                </tbody>

            </Table>
            }
            
        </div>
        

        
        </div>
    </>
    );
}

export default  ManufacturingOrderDetails;
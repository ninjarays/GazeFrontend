import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import SelectStore from './SelectManufacturingStor';
import { getStoreIds } from '../../features/admin/adminSlice';
import PlaceManufactureOrder from './PlaceManufacturingOrderForm';
import { getProducts} from '../../features/orders/orderSlice';
import PendingManufacturingList from './PendingManufacturingList';
import CompletedManufacturingList from './CompletedManufacturingList';

function ManufacturnigScreen(props) {

  const user = useSelector((state) => state.user.userInfo);
  const storeOrders = useSelector((state) => state.orders.getStoreOrders);
  const productsList = useSelector((state) => state.orders.getProducts);
  const storeIdList = useSelector((state) => state.admin.storeIds);
  const navigate = useNavigate();
  const [storeId,setStoreId] = useState(null);  
  const [reload,setReload] = useState(1);
  const [selectStoreShow, setSelectStoreShow] = useState(false);
  const [createOrderShow, setCreateOrderShow] = useState(false);
  const [key, setKey] = useState("pending")
  const dispatch = useDispatch();


  useEffect(() => {
    if(!user){
        navigate("/login");
        return () => {};
    }
    else if(["admin" , "super_admin"].includes(user?.userCred?.role ?? "")){
        setStoreId(user?.userCred?.storeId ?? "");
        dispatch(getProducts(user.access_token));
        dispatch(getStoreIds(user.access_token));
        return () => {};
    }
    else if(user?.userCred?.role === "store_manager" ?? ""){
        setStoreId(user?.userCred?.storeId ?? "");
        dispatch(getProducts(user.access_token));
        return () => {};
    }
    else {
        navigate("/");
        return () => {};
    }
},[user])

  const incrementReload = () => {
    setReload(reload+1)
}




const StartManufacturingOrder = (props) => {
  return (
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton> 
        <Modal.Title id="contained-modal-title-vcenter" >
          Start Manufacturing Order
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user?<PlaceManufactureOrder
        storeId={storeId}
        closeForm={setCreateOrderShow} 
        products={productsList.products}
        reload={incrementReload} 
       
        /> :<div></div>
        }
      </Modal.Body>
    </Modal>
  );
}

const SelectStoreModal = (props) => {
  return (
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton> 
        <Modal.Title id="contained-modal-title-vcenter" >
          Select Store
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SelectStore 
        storeIdList={storeIdList.ids ? storeIdList.ids : [{_id:"Error",storeId:"Coudnt Get Ids"}]}
        closeForm = {setSelectStoreShow}
        selectStore={setStoreId}/>
      </Modal.Body>
    </Modal>
  );
}



  return (
   <>
      
        <div style={{display:'flex'}}>
                <h5 style={{marginTop:'auto', marginBottom:'auto'}}>{storeId ?? "store"}</h5>

                 <Button variant="primary" style={{width:"150px"}} onClick={() => {
                      setSelectStoreShow(true);
                    }}>
                        Change Store
                </Button>
          </div>      
       

<SelectStoreModal 
                show={selectStoreShow}
                onHide={() => {
                    setSelectStoreShow(false);
                    }}
        />     

<Row >
                <Col>
                    <Button variant="primary" style={{width:"200px"}} onClick={() => {
                      setCreateOrderShow(true);
                    }}>
                        Start Manufacturing 
                    </Button>
                </Col>
        </Row>

<StartManufacturingOrder
                show={createOrderShow}
                onHide={() => {
                    setCreateOrderShow(false);
                    incrementReload();}}
        />

  <Tabs
    id="manufacture_tab"
    activeKey={key}
    onSelect={(k) => setKey(k)}>

    <Tab eventKey="pending" title="Pending Maunfacturing Order">
         <PendingManufacturingList reload={incrementReload}  reloadValue={reload} storeId={storeId??""} />
    </Tab >

    <Tab eventKey="cpmpleted" title="Completed Order">
       {/* <CompletedManufacturingList/>   */}
    </Tab>
  </Tabs>
   
      
   </>
  )
}

export default ManufacturnigScreen

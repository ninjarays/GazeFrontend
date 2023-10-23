import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts, getStoreOrdersError, getStoreOrdersLoading, getStoreOrdersSuccess } from '../../features/orders/orderSlice';
import axios from '../../config/axios';
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import ApprovedOrderList from './ApprovedOrderList';
import PendingOrderList from './PendingOrderList';
import PlaceOrderForm from './PlaceOrderForm';
import SelectStore from './SelectStore';
import { getStoreIds } from '../../features/admin/adminSlice';

function OrderScreen(props) {
    const user = useSelector((state) => state.user.userInfo);
    const storeOrders = useSelector((state) => state.orders.getStoreOrders);
    const productsList = useSelector((state) => state.orders.getProducts);
    const storeIdList = useSelector((state) => state.admin.storeIds);
    const navigate = useNavigate();
    const [storeId,setStoreId] = useState(null);
    const [reload,setReload] = useState(1);
    const [createOrderShow, setCreateOrderShow] = useState(false);
    const [selectStoreShow, setSelectStoreShow] = useState(false);
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

    useEffect(() => {
    },[storeOrders.orders])

    useEffect(() => {
        if(storeId){
            getAsyncOrders();
        }
    }, [storeId,reload])

    const incrementReload = () => {
        setReload(reload+1)
    }

    const AddNewOrder = (props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton> 
              <Modal.Title id="contained-modal-title-vcenter" >
                Create Order
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {user?<PlaceOrderForm 
              storeId={storeId} 
              token={user.access_token} 
              closeForm={setCreateOrderShow} 
              productsOptions={productsList.products}
              setReload={incrementReload}/> :<div></div>
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

    const getAsyncOrders = async () => {
        dispatch(getStoreOrdersLoading());
        await axios.get(`/api/orders/get_store_orders/${storeId}`, {
            headers:{"Authorization":`Bearer ${user.access_token}`},
        }).then((response) => {
            dispatch(getStoreOrdersSuccess(response.data))
            
        }).catch((err) => {
            dispatch(getStoreOrdersError(err.response.data.message))
        })
    };

    return (
    <>
        {storeOrders.orders? 
        <div style={{ width: '90%', paddingTop:'50px'}}>
        <div style={{display:'flex'}}>
                <h5 style={{marginTop:'auto', marginBottom:'auto'}}>{storeId ?? "store"}</h5>

                {["admin" , "super_admin"].includes(user?.userCred?.role ?? "") && <Button variant="primary" style={{width:"150px"}} onClick={() => {
                      setSelectStoreShow(true);
                    }}>
                        Change Store
                </Button>}
                
        </div>
        <Row >
                <Col>
                    <Button variant="primary" style={{width:"200px"}} onClick={() => {
                      setCreateOrderShow(true);
                    }}>
                        Create Order
                    </Button>
                </Col>
        </Row>

        <AddNewOrder 
                show={createOrderShow}
                onHide={() => {
                    setCreateOrderShow(false);
                    incrementReload();}}
        />

        <SelectStoreModal 
                show={selectStoreShow}
                onHide={() => {
                    setSelectStoreShow(false);
                    }}
        />
        <Tabs
            id="orders_tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            <Tab eventKey="pending" title="Pending Orders" >
                {!user? <div></div>:
                <PendingOrderList 
                orders={storeOrders.orders.filter((o) => o.status < 1 )} 
                setReload={incrementReload} 
                token={user?.access_token}
                role={user?.userCred?.role ?? ""} />}
            </Tab>

            <Tab eventKey="approved" title="Approved Orders" >
                {!user? <div></div>:
                <ApprovedOrderList orders={storeOrders.orders.filter((o) => o.status === 1)}/>}
            </Tab>
        </Tabs>
        </div>
        : <p>Loading</p>}
    </>
    );
}

export default OrderScreen;
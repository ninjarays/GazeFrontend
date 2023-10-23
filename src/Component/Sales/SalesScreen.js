import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import SelectStore from '../Orders/SelectStore';
import { getStoreIds } from '../../features/admin/adminSlice';
import { addSalesYear, addSalesYearReset, getAllSalesYears } from '../../features/sales/salesSlice';
import SalesYears from './SalesYears';
import { getProducts } from '../../features/orders/orderSlice';

function SalesScreen(props) {
    const user = useSelector((state) => state.user.userInfo);
    const years = useSelector((state) => state.sales.getAllSalesYears);
    const addYearStatus = useSelector((state) => state.sales.addSalesYear);
    const storeIdList = useSelector((state) => state.admin.storeIds);
    const productsList = useSelector((state) => state.orders.getProducts);
    const navigate = useNavigate();
    const [storeId,setStoreId] = useState(null);
    const [reload,setReload] = useState(1);
    const [selectStoreShow, setSelectStoreShow] = useState(false);
    const [addYearShow, setAddYearShow] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!user){
            navigate("/login");
            return () => {};
        }
        else if(["admin" , "super_admin"].includes(user?.userCred?.role ?? "")){
            setStoreId(user?.userCred?.storeId ?? "");
            dispatch(getStoreIds(user.access_token));
            dispatch(getProducts(user.access_token));
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
    },[years.years])

    useEffect(() => {
        if(storeId){
            const data = {
                storeId:storeId ?? "",
                token:user.access_token ?? ""
            }
            dispatch(getAllSalesYears(data));
        }
    }, [storeId,reload])

    useEffect(() => {
        if(addYearStatus.status === "idle"){
        }
        else if(addYearStatus.status === "loading"){
            setAddYearShow(true)
        }
        else if(addYearStatus.status === "error"){
            const timeout = setTimeout(() => {
                dispatch(addSalesYearReset());
                setAddYearShow(false)
            }, 4000);
  
            return () => clearTimeout(timeout);
        }
        else if(addYearStatus.status === "success"){
            setTimeout(()=>{
                dispatch(addSalesYearReset());
                setAddYearShow(false)
                incrementReload();},4000);
        }
    },[addYearStatus.status])

    const incrementReload = () => {
        setReload(reload+1)
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

      const handleAddYear = () => {
        setAddYearShow(true);
        dispatch(addSalesYear({storeId,token:user.access_token}));
      }


      const AddYearModal = (props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton> 
              <Modal.Title id="contained-modal-title-vcenter" >
                Set Budget
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
                addYearStatus.status === "idle" ? <div></div>
                :
                addYearStatus.status === "loading" ? <Alert variant={"light"}>Loading</Alert>
                :
                addYearStatus.status === "error" ? <Alert variant={"danger"}>{addYearStatus.error ?? "Coudnt Add Year"}</Alert>
                :
                <Alert variant={"success"}>Added Year</Alert>
            }
              
            </Modal.Body>
          </Modal>
        );
      }

    return (
    <>
        {years.years? 
        <div style={{ width: '90%', paddingTop:'50px'}}>
        <div style={{display:'flex'}}>
                <h5 style={{marginTop:'auto', marginBottom:'auto'}}>{storeId ?? "store"}</h5>

                {["admin" , "super_admin"].includes(user?.userCred?.role ?? "") && <Button variant="primary" style={{width:"150px"}} onClick={() => {
                      setSelectStoreShow(true);
                    }}>
                        Change Store
                </Button>}
                
        </div>

        <SelectStoreModal 
                show={selectStoreShow}
                onHide={() => {
                    setSelectStoreShow(false);
                    }}
        />

        <AddYearModal 
                show={addYearShow}
                onHide={() => {
                    setAddYearShow(false);
                    }}
        />

        <SalesYears 
        data={years.years ?? []}
        reload={incrementReload}
        storeId={storeId ?? ""}
        token={user.access_token ?? ""}
        />

        <Button onClick={handleAddYear}>{addYearStatus === "loading" ?  "Loading" : "Add Next Year"}</Button>
        </div>
        : <p>Loading</p>}
    </>
    );
}

export default SalesScreen;
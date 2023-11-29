import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts, getStoreOrdersError, getStoreOrdersLoading, getStoreOrdersSuccess } from '../../features/orders/orderSlice';
import axios from '../../config/axios';
import { Alert, Button, Col, Modal, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import SelectStore from './SelectStore';
import { getStoreIds } from '../../features/admin/adminSlice';

function RawMaterialInventoryScreen() {
    const user = useSelector((state) => state.user.userInfo);
    const storeIdList = useSelector((state) => state.admin.storeIds);
    const navigate = useNavigate();
    const [inventory,setInventory] = useState({data:[],status:"idle",error:null})
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
            dispatch(getStoreIds(user.access_token));
            return () => {};
        }
        else if(user?.userCred?.role === "store_manager" ?? ""){
            setStoreId(user?.userCred?.storeId ?? "");
            return () => {};
        }
        else {
            navigate("/");
            return () => {};
        }
    },[user])

    useEffect(() => {
        if(storeId){
            getAsyncInventory();
        }
    }, [reload])

    useEffect(() => {
      incrementReload();
    }, [storeId])


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

    const getAsyncInventory = async () => {
        setInventory({data:[],status:"loading",error:null});
        await axios.get(`/api/raw_material_inventory/get_inventory/${storeId}`, {
            headers:{"Authorization":`Bearer ${user.access_token}`},
        }).then((response) => {
            console.log(response.data.rawMaterials);
            setInventory({data:response.data.rawMaterials,status:"success",error:null}); 
        }).catch((err) => {
            setInventory({data:[],status:"error",error:err.response.data.message});
        })
    };

    return (
    <>
      <div style={{ width: '90%', paddingTop:'20px'}}>
        <SelectStoreModal 
          show={selectStoreShow}
          onHide={() => {
            setSelectStoreShow(false);
          }}
        />
        <div style={{display:'flex'}}>
          <h5 style={{marginTop:'auto', marginBottom:'auto'}}>{storeId ?? "store"}</h5>
            {["admin" , "super_admin"].includes(user?.userCred?.role ?? "") && <Button variant="primary" style={{width:"150px"}} onClick={() => {
              setSelectStoreShow(true);
            }}>
              Change Store
            </Button>}
                
        </div>

        <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            { inventory.status === "idle" ? <></>
            :
            inventory.status === "loading" ? <Spinner/>
            :
            inventory.status === "error" ? <Alert>{inventory.error ?? ""}</Alert>
            :
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Stock(kg)</th>
                        <th>Batches [Batch No., Date, Weight]</th>
                    </tr>
                </thead>
                <tbody>
                {inventory.data.map((material) => (
                    <tr key={material._id} >
                        <td>{material.name}</td>
                        <td>{material.batches.reduce((acc, currentObject) => {
                            return acc + currentObject.weight;
                          }, 0)}</td>
                        <td>
                          <tbody>
                            {
                              material.batches.map((batch) => (
                                <tr>
                                  <td>{batch.batchId}</td>
                                  <td>{batch.date.slice(0,10)}</td>
                                  <td>{batch.weight} kg</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </td>
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

export default RawMaterialInventoryScreen;
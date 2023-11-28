import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { Alert, Button, Col, Modal, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import SelectStore from './SelectStore';
import CreatePOSStore from './CreatePOSStore';
import UpdatePOSInventory from './UpdatePOSInventory';

function POSInventoryScreen(props) {
    const user = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();
    const [storeId,setStoreId] = useState("");
    const [reload,setReload] = useState(1);
    const [updateInventoryShow, setUpdateInventoryShow] = useState(false);
    const [selectStoreShow, setSelectStoreShow] = useState(false);
    const [createStoreShow, setCreateStoreShow] = useState(false);
    const [inventoryData, setInventoryData] = useState({data:null,status:"idle",error:null})

    useEffect(() => {
        if(!user){
            navigate("/login");
            return () => {};
        }
        else if(["admin" , "super_admin"].includes(user?.userCred?.role ?? "")){
            // setStoreId(user?.userCred?.storeId ?? "");
            // dispatch(getProducts(user.access_token));
            // dispatch(getStoreIds(user.access_token));
            return () => {};
        }
        // else if(user?.userCred?.role === "store_manager" ?? ""){
        //     setStoreId(user?.userCred?.storeId ?? "");
        //     dispatch(getProducts(user.access_token));
        //     return () => {};
        // }
        else {
            navigate("/");
            return () => {};
        }
    },[user])

    useEffect(() => {
        if(storeId === ""){
            setSelectStoreShow(true)
            // getAsyncInventory();
        }
        else{
            getAsyncInventory();
        }
    }, [storeId,reload])
    
    const incrementReload = () => {
        setReload(reload+1)
    }

    const getAsyncInventory = async () => {
        setInventoryData({data:null,status:"loading",error:null});
        await axios.get(`/api/pos/get_pos_store/${storeId ?? ""}`, {
            headers:{"Authorization":`Bearer ${user.access_token}`},
        }).then((response) => {
            setInventoryData({data:response.data,status:"success",error:null});
        }).catch((err) => {
            setInventoryData({data:null,status:"error",error:err.response.data.message});
        })
    };
    
    const UpdateInventoryModal = (props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton> 
              <Modal.Title id="contained-modal-title-vcenter" >
                Update Inventory
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UpdatePOSInventory
                    reload = {incrementReload}
                    closeForm = {setUpdateInventoryShow}
                    storeId={storeId}
                />
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
              closeForm = {setSelectStoreShow}
              selectStore={setStoreId}/>
            </Modal.Body>
          </Modal>
        );
      }

      const CreateStoreModal = (props) => {
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
              <CreatePOSStore 
              closeForm = {setCreateStoreShow}
              selectStore={setStoreId}/>
            </Modal.Body>
          </Modal>
        );
      }


    return (
    <>
        <div style={{ width: '90%', paddingTop:'50px'}}>
        <div style={{display:'flex'}}>
            <h5 style={{marginTop:'auto', marginBottom:'auto'}}>{storeId ?? "store"}</h5>

            <Button variant="primary" style={{width:"150px"}} onClick={() => {
                    setSelectStoreShow(true);
                }}>
                Change Store
            </Button>
            <Button variant="primary" style={{width:"150px"}} onClick={() => {
                    setCreateStoreShow(true);
                }}>
                Create New POS Store
            </Button>
                
        </div>
        <Row >
            <Col>
                <Button variant="primary" style={{width:"200px"}} onClick={() => {
                    setUpdateInventoryShow(true);
                }}>
                    Update Inventory
                </Button>
            </Col>
        </Row>

        <UpdateInventoryModal 
            show={updateInventoryShow}
            onHide={() => {
                setUpdateInventoryShow(false);
                incrementReload();}
            }
        />

        <SelectStoreModal 
            show={selectStoreShow}
            onHide={() => {
                setSelectStoreShow(false);
            }}
        />
        <CreateStoreModal
            show={createStoreShow}
            onHide={() => {
                setCreateStoreShow(false);
            }}
        
        />
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
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>category</th>
                        <th>Stock</th>
                        <th>Offer</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                    </tr>
                </thead>
                <tbody>
                {inventoryData.data?.products.map((product) => (
                    <tr key={product._id} >
                        <td>{product.productBarcode}</td>
                        <td>{product.productName}</td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>{product.productOffer}</td>
                        <td>{product.costPrice}</td>
                        <td>{product.sellingPrice}</td>
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

export default POSInventoryScreen;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RawMaterialList from './rawMaterialsList';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import CreateRawMaterialForm from './CreateRawMaterial';

function RawMaterialsScreen(props) {
    const user = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rawMaterialShow, setRawMaterialShow] = useState(false);
    const [reload, setReload] = useState(1);

    const navigateHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if(!user){
            navigateHome();
            return () => {};
        }
        else if( !["super_admin", "admin"].includes(user.userCred.role)){
            navigateHome();
            return () => {};
        }
    },[user])

    const AddNewRawMaterial = (props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton> 
              <Modal.Title id="contained-modal-title-vcenter" >
                Add Raw Material
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {user?<CreateRawMaterialForm token={user.access_token} closeForm={setRawMaterialShow}/>:<div></div>}
            </Modal.Body>
          </Modal>
        );
      }

    return (
        <div>
            <Row >
                <Col>
                    <Button variant="primary" style={{width:"200px"}} onClick={() => {
                      setRawMaterialShow(true);
                    }}>
                        Add Raw Material
                    </Button>
                </Col>
            </Row>
            <AddNewRawMaterial 
                show={rawMaterialShow}
                onHide={() => {
                    setRawMaterialShow(false);
                    setReload();}}
            />
            {user?<RawMaterialList token={user.access_token}/>:<div></div>}
        </div>
    );
}

export default RawMaterialsScreen;
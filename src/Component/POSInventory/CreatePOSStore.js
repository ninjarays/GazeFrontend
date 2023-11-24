import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { Alert, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function CreatePOSStore({closeForm, _id}) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    const [storeId, setStoreId] = useState("");
    const [storeLocation, setStoreLocation] = useState("");

    const handleStoreIdChange = (e) => {
        setStoreId(e);
    };

    const handleStoreLocationChange = (e) => {
        setStoreLocation(e);
    };

    const handleCreateStore = async () => {
        setStatus({status:"loading", error:null});
        await axios.post('/api/pos/create_store', {storeId, storeLocation}, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            setStatus({status:"success", error:null});
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    };

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
                closeForm(false)
            }, 1500)
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
            }, 2000)
        }
        else if(status.status === "loading"){
        }
        else if(status.status === "idle"){
            setShow(false)
        }
    },[status.status])

    return (
        <div>
            {show?
                <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{status.error ? status.error : "Store Created Sucessfuly"}</Alert.Heading>
                </Alert> 
                : 
                <div></div>
            }

            <Form.Group controlId={`storeId`}>
                <Form.Label>Store Id</Form.Label>
                <Form.Control
                    type="text"
                    name="storeId"
                    value={storeId}
                    onChange={(e) => handleStoreIdChange(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId={`storeLocation`}>
                <Form.Label>Store Location</Form.Label>
                <Form.Control
                    type="text"
                    name="storeLocation"
                    value={storeLocation}
                    onChange={(e) => handleStoreLocationChange(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateStore}>
                    Create
            </Button>
            
        </div>
    );
}

export default CreatePOSStore;
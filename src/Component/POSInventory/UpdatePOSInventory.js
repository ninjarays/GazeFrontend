import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';

function UpdatePOSInventory({storeId, closeForm, reload}) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [file, setFile] = useState(null);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    const [disableSubmit, setDisableSubmit] = useState(false)

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
                reload();
                closeForm(false)
            }, 1500)
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
            if(status.error?.substring(0, 10) !== "Mismatched"){
                setTimeout(() => {
                    setStatus({status:"idle", error:status.error});
                }, 5000)
            }
            else{
                setDisableSubmit(true)
                setTimeout(() => {
                    setStatus({status:"idle", error:status.error});
                    closeForm(false)
                }, 7000)
            }
        }
        else if(status.status === "loading"){
        }
        else if(status.status === "idle"){
            setDisableSubmit(false);
            setShow(false);

        }
    },[status.status])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append('storeId', storeId);
            formData.append('file', file);
            setDisableSubmit(true)
            await axios.put('/api/pos/update_inventory', formData, {
                headers:{"Authorization":`Bearer ${token}`},
            }).then((response) => {
                setStatus({status:"success", error:null});
            }).catch((err) => {
                setStatus({status:"error", error:err.response?.data.message});
            })
    
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            {show?
                <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{status.status === "error" ? status.error ?? "Something Went Wrong" : "Inventory Updated"}</Alert.Heading>
                </Alert> 
                : 
                <div></div>
            }
            <Form onSubmit={handleFormSubmit}>
            <Form.Label>Store Id: {storeId}</Form.Label>
                <Form.Group controlId="file">
                <Form.Label>Excel File</Form.Label>
                <Form.Control 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={disableSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default UpdatePOSInventory;
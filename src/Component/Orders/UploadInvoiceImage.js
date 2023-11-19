import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { Alert, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function UploadInvoiceImage({closeForm, _id}) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    // const [image, setImage] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState("");


    // const handleImageChange = (e) => {
    //     setImage(e.target.files[0]);
    // };

    const handleInvoiceChange = (e) => {
        setInvoiceNumber(e);
    };

    const handleImageUpload = async () => {
    
        // const formData = new FormData();
        // formData.append('image', image);

        setStatus({status:"loading", error:null});
        // await axios.post('/api/orders/upload_invoice_image', formData, {
        //     headers:{"Authorization":`Bearer ${token}`},
        // }).then((response) => {
        //     setStatus({status:"success", error:null});
        // }).catch((err) => {
        //     setStatus({status:"error", error:err.response.data.message});
        // })
        await axios.post('/api/orders/upload_invoice_image', {_id, invoice:invoiceNumber}, {
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
            {/* <Form.Group>
                    <Form.Label>Choose an image:</Form.Label>
                    <Form.Control type="file" onChange={(e) => {
                        console.log("selecting");
                        e.preventDefault();
                        handleImageChange(e)}} />
            </Form.Group> */}
            {show?
                <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{status.error ? status.error : "Order Updated"}</Alert.Heading>
                </Alert> 
                : 
                <div></div>
            }

            <Form.Group controlId={`invoice`}>
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control
                    type="text"
                    name="invoice"
                    value={invoiceNumber}
                    onChange={(e) => handleInvoiceChange(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" onClick={handleImageUpload}>
                    Upload
            </Button>
            
        </div>
    );
}

export default UploadInvoiceImage;
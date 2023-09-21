import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { changePasswordError, changePasswordLoading, changePasswordSuccess, editUser, refreshLoading } from '../../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { createRawMaterialsError, createRawMaterialsLoading, createRawMaterialsReset, createRawMaterialsSuccess } from '../../features/rawMaterial/rawMaterialSlice';

const CreateRawMaterialForm = (props) => {
    const status = useSelector((state) => state.rawMaterials.createRawMaterials);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [englishName, setEnglishName] = useState("");
    const [hindiName, setHindiName] = useState("");
    const [expiryTime, setexpiryTime] = useState(0);
    const dispatch = useDispatch();

    const resetForm = () => {
        setEnglishName("");
        setHindiName("");
        setexpiryTime(0);
      }

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            dispatch(createRawMaterialsReset());
            props.closeForm(false)
        }, 1500)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger")
        resetForm();
        console.log("loading off");
        setTimeout(() => {
            console.log("dispaching");
            dispatch(createRawMaterialsReset());
            
        }, 2000)
    }
    else if(status.status === "loading"){
        console.log("loading is on");
    }
    else if(status.status === "idle"){
        setShow(false)
    }

},[status.status])


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createRawMaterialsLoading());
    await axios.post('/api/raw_materials/add_raw_material', {englishName:englishName, hindiName:hindiName, expiryTime:expiryTime}, {
        headers:{"Authorization":`Bearer ${props.token}`},
    }).then((response) => {
        dispatch(createRawMaterialsSuccess(response.data))
    }).catch((err) => {
        dispatch(createRawMaterialsError(err.response.data.message))
    })
  };
  

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Raw Material Added"}</Alert.Heading>
      </Alert> : <div></div>}
      <Form onSubmit={handleSubmit}>
              <Form.Group controlId="englishName">
              <Form.Label>English Name</Form.Label>
              <Form.Control
                type="text"
                name="englishName"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                required
              />
              </Form.Group>
              <Form.Group controlId="hindiName">
                <Form.Label>Hindi Name</Form.Label>
                <Form.Control
                  type="text"
                  name="hindiName"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="expiryTime">
                <Form.Label>Expiry in months</Form.Label>
                <Form.Control
                  type="number"
                  name="expiryTime"
                  value={expiryTime}
                  onChange={(e) => setexpiryTime(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
    </>
  );
};

export default CreateRawMaterialForm;

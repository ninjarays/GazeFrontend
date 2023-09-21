import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { changePasswordError, changePasswordLoading, changePasswordSuccess, editUser, refreshLoading } from '../../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { createRawMaterialsError, createRawMaterialsLoading, createRawMaterialsReset, createRawMaterialsSuccess } from '../../features/rawMaterial/rawMaterialSlice';

const EditRawMaterialForm = (props) => {
    const status = useSelector((state) => state.rawMaterials.createRawMaterials);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [_id, setId] = useState(props.data._id);
    const [newEnglishName, setNewEnglishName] = useState(props.data.englishName);
    const [newHindiName, setNewHindiName] = useState(props.data.hindiName);
    const [expiryTime, setexpiryTime] = useState(0);
    const dispatch = useDispatch();

    // const resetForm = () => {
    //     setEnglishName("");
    //     setNewEnglishName("");
    //     setNewHindiName("");
    //     setexpiryTime(0);
    //   }

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        // resetForm();
        // console.log("loading off");
        setTimeout(() => {
            dispatch(createRawMaterialsReset());
            props.closeForm(false);
            
        }, 1000)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger")
        // resetForm();
        // console.log("loading off");
        setTimeout(() => {
            console.log("dispaching");
            dispatch(createRawMaterialsReset());
            
        }, 1000)
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
    console.log(props);
    await axios.put('/api/raw_materials/edit_raw_material', {_id, newHindiName, newEnglishName ,expiryTime:expiryTime}, {
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
        <Alert.Heading>{status.error ? status.error : "Raw Material Edited"}</Alert.Heading>
      </Alert> : <div></div>}
      <Form onSubmit={handleSubmit}>
              <Form.Group controlId="newEglishName">
              <Form.Label>English Name</Form.Label>
              <Form.Control
                type="text"
                name="newEnglishName"
                value={newEnglishName}
                onChange={(e) => setNewEnglishName(e.target.value)}
                required
              />
              </Form.Group>
              <Form.Group controlId="newHindiName">
                <Form.Label>Hindi Name</Form.Label>
                <Form.Control
                  type="text"
                  name="newHindiName"
                  value={newHindiName}
                  onChange={(e) => setNewHindiName(e.target.value)}
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

export default EditRawMaterialForm;

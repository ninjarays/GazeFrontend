import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { deleteRawMaterial, deleteRawMaterialsReset, getRawMaterialsError, getRawMaterialsLoading, getRawMaterialsSuccess } from '../../features/rawMaterial/rawMaterialSlice';
import React, { useEffect, useState } from 'react';
import { Alert, Button,  Modal,  Table } from 'react-bootstrap';
import EditRawMaterialForm from './EditRawMaterial';

const RawMaterialList =(props)=>{
    const materials= useSelector((state)=> state.rawMaterials.getRawMaterials);
    const deleteStatus= useSelector((state)=> state.rawMaterials.deleteRawMaterials);
    const [editMaterial, setEditMaterial] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [reload, setReload] = useState(1);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const dispatch =useDispatch();
    const token = props.token;

    useEffect(() => {
      if(deleteStatus.status === "idle"){
          setDeleteMessage(false);
      }
      else if(deleteStatus.status === "error"){
          setDeleteMessage(true);
          // Automatically hide the notification after 2 seconds
          const timeout = setTimeout(() => {
              dispatch(deleteRawMaterialsReset());
              setDeleteMessage(false);
          }, 2000);

          // Clear the timeout when the component unmounts
          return () => clearTimeout(timeout);
      }
      else if(deleteStatus.status === "success"){
          setTimeout(()=>{
              dispatch(deleteRawMaterialsReset());
              },2000);
      }
  },[deleteStatus.status])

    const EditMaterialForm =(props) => {
      return (
          <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Raw Material
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <EmployeeEditForm data={editMaterial} closeForm={setShowForm}/> */}
            <EditRawMaterialForm token={`${token}`} data={editMaterial} closeForm={setShowForm} reloadList={setReload}/>
          </Modal.Body>
        </Modal>
      );
    }

    const DeleteConfirmation = () => {
      return(
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMaterial}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      );
      
    }

    useEffect(() => {
      console.log(showModal);
    }, [showModal])

    useEffect(()=>{
        getMaterials();
        console.log(materials);
      },[props.reload])

    const getMaterials = async () => {
        dispatch(getRawMaterialsLoading());
        await axios.get('/api/raw_materials/get_all_raw_materials', {
            headers:{"Authorization":`Bearer ${props.token}`},
        }).then((response) => {
            console.log(props.token);
            dispatch(getRawMaterialsSuccess(response.data))
            
        }).catch((err) => {
            dispatch(getRawMaterialsError(err.response.data.message))
        })
    }

    const handleDeleteMaterial = () => {
      const data = {_id:editMaterial._id, token:props.token}
      dispatch(deleteRawMaterial(data))
      handleCloseModal();
    }

    return(
      <div style={{ width: '100%'}}>
        <Alert variant="danger" show={deleteMessage}>
            {deleteStatus.error?? ""}
        </Alert>
      <EditMaterialForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setReload(reload+1)
          console.log(reload);
        }}
      />
      <DeleteConfirmation/>
        <div>{!materials? <div>Loading</div>:
           materials.status==='loading' ?<div>loading</div>:
           materials.status==='fail'? <div>Error</div> :
          
            <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
             <Table striped bordered hover> 
      <thead>
        <tr>
          <th>English Name</th>
          <th>Hindi Name</th>
          <th>Expiry</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody key={reload}>
          {!materials.rawMaterials? <div></div> :
          materials.rawMaterials.map((data) => (
        <tr  key={data._id}>
            <td >{data.englishName}</td>
            <td>{data.hindiName}</td>
            <td>{data.expiryTime}</td>
            <td>
              <Button variant="primary" onClick={() => {
                setEditMaterial(data);
                setShowForm(true);
              }}>
                Edit
              </Button>
            </td>
            <td>
              <Button variant="primary" onClick={() => {setEditMaterial(data);handleShowModal();}}>
                Delete
              </Button>
            </td>
          </tr>

          ))}
      </tbody>

    </Table>
    </div>
          
        }</div>
      </div>
    )
}

export default RawMaterialList;
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import React, { useEffect, useState } from 'react';
import { Button,  ListGroup,  Modal,  Table } from 'react-bootstrap';
import { deleteProduct, getProductsError, getProductsLoading, getProductsSuccess } from '../../features/products/productSlice';
import EditProductForm from './EditProduct';

const ProductsList =(props)=>{
    const products= useSelector((state)=> state.products.getProducts);
    const [editProduct, setEditProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [reload, setReload] = useState(1);
    const dispatch =useDispatch();
    const token = props.token;
    const employeeId = props.employeeId;
    const ingredientOptions = props.ingredientOptions;

    const EditProduct=(props) => {
      return (
          <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditProductForm 
              token={token} 
              user={employeeId} 
              data={editProduct} 
              recipe = {[editProduct?.recipe.map((i) => {return {name:i.name, percentage:i.percentage }})]}
              closeForm={setShowForm} 
              ingredientOptions={ingredientOptions}/>
            
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
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      );
    }

    useEffect(()=>{
        getProducts();
      },[props.reload])

    const getProducts = async () => {
        dispatch(getProductsLoading());
        await axios.get('/api/products/get_all_products', {
            headers:{"Authorization":`Bearer ${props.token}`},
        }).then((response) => {
            dispatch(getProductsSuccess(response.data))
            
        }).catch((err) => {
            dispatch(getProductsError(err.response.data.message))
        })
    }

    const handleDeleteProduct = () => {
      const data = {_id:editProduct._id, token:props.token}
      dispatch(deleteProduct(data))
      handleCloseModal();
    }

    return(
      <div style={{ width: '100%'}}>
      <EditProduct
        show={showForm}
        onHide={() => {
          setShowForm(false);
        }}
      />
      <DeleteConfirmation/>
        <div>{!products? <div>Loading</div>:
           products.status==='loading' ?<div>loading</div>:
           products.status==='fail'? <div>Error</div> :
          <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
             <Table striped bordered hover > 
      <thead>
        <tr>
          <th>Name</th>
          <th>Recipe</th>
          <th>Chef Id</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody key={reload}>
        
          {!products.products? <tr></tr> : 
          products.products.map((data) => (
        <tr  key={data._id}>
            <td >{data.name}</td>
            <td>
              <Table>
                <tbody >
                  {data.recipe.map((i) => (
                    <tr key={`${data.name}${i.name}`}>
                      <td>{i.name}</td>
                      <td>{i.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </td>
            {/* <td ><ListGroup>{data.recipe.map((i) => (
              <ListGroup.Item>
               {i.name}  {i.percentage}%
              </ListGroup.Item>
            ))}</ListGroup></td> */}
            <td>{data.chef}</td>
            <td>
              <Button variant="primary" onClick={() => {
                setEditProduct(data);
                setShowForm(true);
              }}>
                Edit
              </Button>
            </td>
            <td>
              <Button variant="primary" onClick={() => {setEditProduct(data);handleShowModal();}}>
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

export default ProductsList;
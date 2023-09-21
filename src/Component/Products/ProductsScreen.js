import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import ProductsList from './ProductsList';
import CreateProductForm from './CreateProduct';
import { getIngredients } from '../../features/products/productSlice';

function ProductsScreen() {
    const user = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();
    const [productShow, setProductShow] = useState(false);
    const [reload, setReload] = useState(1);
    const ingredientsList = useSelector((state) => state.products.getIngredients)
    const dispatch = useDispatch()

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
        else {
          dispatch(getIngredients(user.access_token))
        }
    },[user])

    const AddNewProduct = (props) => {
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
              {user?<CreateProductForm user={user.userCred.employeeId} token={user.access_token} closeForm={setProductShow} ingredientOptions={ingredientsList.ingredients}/> :<div></div>}
            </Modal.Body>
          </Modal>
        );
      }

    return (
        <div>
            <Row >
                <Col>
                    <Button variant="primary" style={{width:"200px"}} onClick={() => {
                      setProductShow(true);
                    }}>
                        Add Product
                    </Button>
                </Col>
            </Row>
            <AddNewProduct 
                show={productShow}
                onHide={() => {
                    setProductShow(false);
                    setReload();}}
            />
            {user?<ProductsList token={user.access_token} employeeId={user.userCred.employeeId} ingredientOptions={ingredientsList.ingredients}/>:<div></div>}
        </div>
    );
}

export default ProductsScreen;
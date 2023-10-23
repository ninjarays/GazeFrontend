import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { editOrderError, editOrderLoading, editOrderReset, editOrderSuccess } from '../../features/orders/orderSlice';
import { setMonthlySales, setMonthlySalesReset } from '../../features/sales/salesSlice';

const EditSalesForm = (props) => {
    const options = [{label:"error",value:"error"}]
    const dispatch = useDispatch();
    const status = useSelector((state) => state.sales.setMonthlySales);
    const productsList = useSelector((state) => state.orders.getProducts.products);
    const productsOptions = productsList.map((i) => {return {label:`${i.name}`,value:i.name}});
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    console.log(props.products);
    const [productsData, setProductsData] = useState(!props.products.length ? [{ name: '', quantity: 0 }] : props.products);

    const handleAddProduct = () => {
      setProductsData([...productsData, { name: '', quantity: 0 }]);
    };
  
    const handleRemoveProduct = (index) => {
      const updatedProducts = [...productsData];
      updatedProducts.splice(index, 1);
      setProductsData(updatedProducts);
    };
  
    const handleProductChange = (index, selectedOption) => {
      const updatedProducts = [...productsData];
      updatedProducts[index].name = selectedOption.value;
      setProductsData(updatedProducts);
    };

    const handleWeightChange = (index, quantity) => {
      const updatedProducts = [...productsData];
      updatedProducts[index].quantity = quantity;
      setProductsData(updatedProducts);
    };

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        setTimeout(() => {
            dispatch(setMonthlySalesReset());
            props.reload();
            props.closeForm(false)
        }, 1500)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger");
        setTimeout(() => {
            dispatch(setMonthlySalesReset());
        }, 2000)
    }
    else if(status.status === "loading"){
    }
    else if(status.status === "idle"){
        setShow(false)
    }

},[status.status])


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      body:{
        products:productsData,
        year:props.year,
        storeId:props.storeId,
        monthName:props.monthName
      },
      token:props.token
    }
    dispatch(setMonthlySales(data));
  };
  

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Order Edited"}</Alert.Heading>
      </Alert> : <div></div>}
      <Container>
      <Form onSubmit={handleSubmit}>
        {productsData.map((product, index) => (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`product${index}`}>
              <Form.Label>Product</Form.Label>
                <Select
                  options={productsOptions ?? options}
                  value = {
                    productsOptions.filter(option => 
                       option.value === product.name)
                 }
                  onChange={(selectedOption) =>
                    handleProductChange(index, selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Select a product..."
                />
              </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId={`weight${index}`}>
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={product.quantity}
                  onChange={(e) => handleWeightChange(index, e.target.value)}
                  required
                />
              </Form.Group>

            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                onClick={() => handleRemoveProduct(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
        <Button variant="success" type="submit">
          Save Sales Target
        </Button>
      </Form>
    </Container>
    </>
  );
};



export default EditSalesForm;

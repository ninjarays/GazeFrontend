import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { createOrderError, createOrderLoading, createOrderReset, createOrderSuccess } from '../../features/orders/orderSlice';

const PlaceOrderForm = (props) => {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.orders.createOrder);
    const productsOptions = props.productsOptions.map((i) => {return {label:`${i.name}`,value:i.name}});
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [productsData, setProductsData] = useState([
      { name: null, quantity: 0 },
    ]);
  
    const handleAddProduct = () => {
      setProductsData([...productsData, { name: '', quantity: 0 }]);
      console.log(productsData);
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
            dispatch(createOrderReset());
            props.setReload();
            props.closeForm(false)
        }, 1500)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger");
        setTimeout(() => {
            dispatch(createOrderReset());
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
      products:productsData,
      storeId:props.storeId
    }
    dispatch(createOrderLoading());
    await axios.post('/api/orders/create_order', data, {
        headers:{"Authorization":`Bearer ${props.token}`},
    }).then((response) => {
        dispatch(createOrderSuccess(response.data))
    }).catch((err) => {
        dispatch(createOrderError(err.response.data.message))
    })
  };
  

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Order Added"}</Alert.Heading>
      </Alert> : <div></div>}
      <Container>
      <Form onSubmit={handleSubmit}>
        {productsData.map((product, index) => (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`product${index}`}>
              <Form.Label>Product</Form.Label>
                <Select
                  options={productsOptions}
                  value={product.product}
                  onChange={(selectedOption) =>
                    handleProductChange(index, selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Select an ingredient..."
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
          Save Order
        </Button>
      </Form>
    </Container>
    </>
  );
};



export default PlaceOrderForm;

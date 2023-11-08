import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { editOrderError, editOrderLoading, editOrderReset, editOrderSuccess } from '../../features/orders/orderSlice';

const EditOrderForm = (props) => {
    const options = [{label:"error",value:"error"}]
    const dispatch = useDispatch();
    const status = useSelector((state) => state.orders.editOrder);
    const productsList = useSelector((state) => state.orders.getProducts.products);
    const productsOptions = productsList.map((i) => {return {label:`${i.name}`,value:i.name}});
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [productsData, setProductsData] = useState(props.products);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Adding 1 because months are zero-based

    const [selectedMonth, setSelectedMonth] = useState(props.consumptionDate.month);
    const [selectedYear, setSelectedYear] = useState(props.consumptionDate.year);

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

    const handleMonthChange = (e) => {
      setSelectedMonth(parseInt(e.target.value, 10));
    };
  
    const handleYearChange = (e) => {
      setSelectedYear(parseInt(e.target.value, 10));
    };

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        setTimeout(() => {
            dispatch(editOrderReset());
            props.reloadList();
            props.closeForm(false)
        }, 1500)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger");
        setTimeout(() => {
            dispatch(editOrderReset());
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
      _id:props._id,
      year:selectedYear,
      month:months[selectedMonth-1]
    }
    dispatch(editOrderLoading());
    await axios.put('/api/orders/edit_order', data, {
        headers:{"Authorization":`Bearer ${props.token}`},
    }).then((response) => {
        dispatch(editOrderSuccess(response.data))
    }).catch((err) => {
        dispatch(editOrderError(err.response.data.message))
    })
  };

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const availableYears = Array.from({ length: 6 }, (_, i) => currentYear + i);


  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Order Edited"}</Alert.Heading>
      </Alert> : <div></div>}
      <Container>
      <Form onSubmit={handleSubmit}>
      <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select Month</Form.Label>
                <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Select Year</Form.Label>
                <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
        </Row>
        {productsData.map((product, index) => (
          <Row key={`pdata${index}`}>
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



export default EditOrderForm;

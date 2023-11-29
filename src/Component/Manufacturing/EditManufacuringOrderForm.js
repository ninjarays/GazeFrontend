import React, { useState,useEffect } from 'react';
import { Form, Button, Col,Row, FormControl,Alert } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import axios from '../../config/axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EditManufactureOrder = ({ storeId,order,productsOptions,closeForm,reload }) => {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    const [createOrderShow, setCreateOrderShow] = useState(false);
    console.log(productsOptions);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Adding 1 because months are zero-based
    
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

  const [formData, setFormData] = useState({
    _id:order._id,
    storeId:storeId,
    product: {label:order.product,value:order.product},
    weightInput: order.weight,
    manufactureMonth:months.indexOf(order.productionMonth.month)+1,
    manufactureYear: order.productionMonth.year,
    weight: order.package.packageType,
    quantity: order.package.packageQuantity,
  });

  const handleProductChange = (selectedOption) => {
    setFormData({
      ...formData,
      product: selectedOption,
    //   weight: null,
    //   weightInput: '',
    });
  };

  const handlePacketWeightChange = (value) => {
    setFormData({
      ...formData,
      weight: value,
      weightInput:value * formData.quantity,
    });
  };

  const handleMonthChange = (e) => {
    e.preventDefault();

    setFormData({
      ...formData,
      manufactureMonth:e.target.value,
    });
  };

  const handleYearChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      manufactureYear: e.target.value,
    });
  };

  const handleWeightInputChange = (value) => {
    setFormData({
      ...formData,
      weightInput: value,
    });
  };

  const handleQuantityChange = (value) => {
    setFormData({
      ...formData,
      quantity:value,
      weightInput:value * formData.weight,
    });
  };
  
  useEffect(()=>{
    if(status.status === "success"){
      setShow(true);
      setVariant("success");
      
      setTimeout(() => {
       
          
          closeForm(false);
          reload();
          setShow(false)
      }, 1200)
  }
  else if(status.status === "error"){
      setShow(true);
      setVariant("danger");
      setTimeout(() => {
          setShow(false)
      }, 2000)
  }
  else if(status.status === "loading"){
      setVariant("normal");
  }
  else if(status.status=== "idle"){
      setShow(false)
  }
  })
  
  const availableYears = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const handleSubmit = async(e) => {
   
    e.preventDefault();
    
    
   
    setStatus({status:"loading", error:null});
    await axios.put('/api/manufacture/edit_manufacturing_order', {...formData,manufactureMonth:months[formData.manufactureMonth-1]}, {
       headers:{"Authorization":`Bearer ${token}`},
    }).then((response) => {
        setStatus({status:"success", error:null});
    }).catch((err) => {
        setStatus({status:"error", error:err.response.data.message});
    })
    console.log(storeId);
   console.log('Manufacturing Order Edited Data:', formData);

  


  };

  return (
    <>
    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Order Edited Sucessfully"}</Alert.Heading>
      </Alert> : <div></div>}
    <Form>
    <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select Month</Form.Label>
                <Form.Control as="select" value={formData.manufactureMonth} onChange={handleMonthChange}>
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
                <Form.Control as="select" value={formData.manufactureYear} onChange={handleYearChange}>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              
            </Col>
            </Row>
            <Form.Group controlId={`product`}>
              <Form.Label>Product</Form.Label>
                <Select
                  options={productsOptions}
                  value={formData.product}
                  onChange={(selectedOption) =>
                    handleProductChange(selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Select an ingredient..."
                />
              </Form.Group>

              {/* <Form.Group controlId={`weight`}>
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={formData.weightInput}
                  onChange={(e) => handleWeightInputChange( e.target.value)}
                  required
                />
              </Form.Group> */}

              <Form.Group controlId={`packetweight`}>
                <Form.Label>Each Packet Weight(gm)</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={(e) => handlePacketWeightChange( e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId={`quantity`}>
                <Form.Label>Number Of Packets</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange( e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId={`weight`}>
                <Form.Label>Weight(gm)</Form.Label>
                <Form.Control
                  type="text"
                  disabled={true}
                  value={formData.weightInput}
                  
                />
              </Form.Group>
               
             


      <Button variant="primary" onClick={handleSubmit}>
        Place Order
      </Button>
    </Form>
</>
    
  );
};

export default EditManufactureOrder;

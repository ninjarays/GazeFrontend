import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { createProductError, createProductLoading, createProductReset, createProductSuccess } from '../../features/products/productSlice';

const EditProductForm = (props) => {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.products.createProduct);
    const ingredientOptions = props.ingredientOptions.map((i) => {return {label:`${i.englishName}/${i.hindiName}`,value:i.englishName}})
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.data.name);
    const [variant, setVariant] = useState("light");
    const [loading,setLoading] = useState(false)
    const [ingredientData, setIngredientData] = useState(props.recipe[0]);
    const [reload, setReload] = useState(0);
  
    const handleAddIngredient = () => {
      setIngredientData([...ingredientData, { name: '', percentage: 0 }]);
    };
  
    const handleRemoveIngredient = (index) => {
      const updatedIngredients = [...ingredientData];
      updatedIngredients.splice(index, 1);
      setIngredientData(updatedIngredients);
    };
  
    const handleIngredientChange = (index, selectedOption) => {
      const updatedIngredients = [...ingredientData];
      updatedIngredients[index].name = selectedOption;
      setIngredientData(updatedIngredients);
    };

    const handleWeightChange = (index, percentage) => {
      const updatedIngredients = [...ingredientData];
      updatedIngredients[index].percentage = percentage;
      setIngredientData(updatedIngredients);
    };

  useEffect(() => {
    if(status.status === "success"){
        setShow(true);
        setVariant("success");
        setTimeout(() => {
            dispatch(createProductReset());
            props.closeForm(false)
        }, 1500)
    }
    else if(status.status === "error"){
        setShow(true);
        setVariant("danger");
        setTimeout(() => {
            dispatch(createProductReset());
            
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
      id:props.data._id,
      name:name,
      recipe:ingredientData,
      chef:props.user
    }
    dispatch(createProductLoading());
    await axios.put('/api/products/edit_product', data, {
        headers:{"Authorization":`Bearer ${props.token}`},
    }).then((response) => {
        dispatch(createProductSuccess(response.data))
    }).catch((err) => {
        dispatch(createProductError(err.response.data.message))
    })
  };
  

  return (
    <>

    {show?
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{status.error ? status.error : "Product Edited"}</Alert.Heading>
      </Alert> : <div></div>}
    {loading? <div>Loading</div>:
      <Container>
      <Form onSubmit={handleSubmit} key={reload}>
        <Row>
          <Col>
          <Form.Group controlId={`name`}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
        {ingredientData.map((ingredient, index) =>{
          return (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`ingredient${index}`}>
              <Form.Label>Ingredient</Form.Label>
                <Select
                  options={ingredientOptions}
                  // value={ingredient.name}
                  value = {
                    ingredientOptions.filter(option => 
                       option.value === ingredient.name)
                 }
                  onChange={(selectedOption) =>
                    handleIngredientChange(index, selectedOption.value)
                  }
                  isSearchable={true}
                  placeholder="Select Ingredient"
                />
              </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId={`percentage${index}`}>
                <Form.Label>Percentage (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="percentage"
                  value={ingredient.percentage}
                  onChange={(e) => handleWeightChange(index, e.target.value)}
                  required
                />
              </Form.Group>

            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                onClick={() => handleRemoveIngredient(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        )})}
        <Button variant="primary" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
        <Button variant="success" type="submit">
          Save Recipe
        </Button>
      </Form>
    </Container>
    }
    </>
  );
};



export default EditProductForm;

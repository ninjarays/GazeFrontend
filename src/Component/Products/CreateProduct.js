import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { createProductError, createProductLoading, createProductReset, createProductSuccess } from '../../features/products/productSlice';

const CreateProductForm = (props) => {
    const options = [{label:"i11",value:"i1"}]
    const dispatch = useDispatch();
    const status = useSelector((state) => state.products.createProduct);
    const ingredientOptions = props.ingredientOptions.map((i) => {return {label:`${i.englishName}/${i.hindiName}`,value:i.englishName}})
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [variant, setVariant] = useState("light");
    const [ingredientData, setIngredientData] = useState([
      { name: null, percentage: 0 },
    ]);

    const resetForm = () => {
      setIngredientData([]);
    }
  
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
      updatedIngredients[index].name = selectedOption.value;
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
      name:name,
      recipe:ingredientData,
      chef:props.user
    }
    dispatch(createProductLoading());
    await axios.post('/api/products/add_product', data, {
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
        <Alert.Heading>{status.error ? status.error : "Product Added"}</Alert.Heading>
      </Alert> : <div></div>}
      <Container>
      <Form onSubmit={handleSubmit}>
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
        {ingredientData.map((ingredient, index) => (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`ingredient${index}`}>
              <Form.Label>Ingredient</Form.Label>
                <Select
                  options={ingredientOptions}
                  value={ingredient.ingredient}
                  onChange={(selectedOption) =>
                    handleIngredientChange(index, selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Select an ingredient..."
                />
              </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId={`weight${index}`}>
                <Form.Label>Percentage (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
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
        ))}
        <Button variant="primary" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
        <Button variant="success" type="submit">
          Save Recipe
        </Button>
      </Form>
    </Container>
    </>
  );
};



export default CreateProductForm;

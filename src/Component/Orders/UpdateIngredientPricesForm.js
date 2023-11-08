import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from '../../config/axios';

function UpdateIngredientPricesForm({prices, orderId, closeForm}) {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    const [pricesData, setPricesData] = useState([...prices]);

    const handlePriceChange = (index, price) => {
        const updatedPrices = [...pricesData];
        const updatedPrice = {...updatedPrices[index]};
        updatedPrice.price = parseInt(price);
        updatedPrices[index] = updatedPrice;
        setPricesData(updatedPrices);
        console.log(pricesData);
    };

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
                closeForm(false)
            }, 1500)
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
            setTimeout(() => {
                setStatus({status:"idle", error:null});
            }, 2000)
        }
        else if(status.status === "loading"){
        }
        else if(status.status === "idle"){
            setShow(false)
        }
    },[status.status])
    
    
    const handleChangePrice = async () => {
        const data = {
          _id:orderId,
          materialPrices:pricesData
        }
        setStatus({status:"loading", error:null});
        await axios.put('/api/orders/update_prices', data, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            setStatus({status:"success", error:null});
        }).catch((err) => {
            setStatus({status:"error", error:err.response.data.message});
        })
    };
    
    return (
        <div>
            {show?
                <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{status.error ? status.error : "Order Updated"}</Alert.Heading>
                </Alert> 
                : 
                <div></div>
            }
            <Table bordered hover>
                <thead>
                    <th>Ingredient</th>
                    <th>Weigth (kg)</th>
                    <th>Prices</th>
                </thead>
                <tbody>
                    {
                        pricesData.map((p,index) => (
                            <tr>
                                <td>{p.materialName}</td>
                                <td>{p.weight}</td>
                                <td>
                                    <Form.Group controlId={`price`}>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={p.price}
                                            onChange={(e) => handlePriceChange(index,e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Button onClick={handleChangePrice}>Update Prices</Button>
        </div>
    );
}

export default UpdateIngredientPricesForm;
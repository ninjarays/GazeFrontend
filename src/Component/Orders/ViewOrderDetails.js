import React, { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';

function ViewOrderDetails({orderId}) {
    const [order, setOrder] = useState();
    const [budget, setBudget] = useState();
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const token = useSelector((state) => state.user.userInfo.access_token);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null});

    useEffect(() => {
        if(status.status === "success"){
            var cost = 0;
            var weight = 0;
            order?.order?.materialPrices.forEach( t => {
                cost += t.price;
                weight += t.weight;
            })
            setTotalCost(cost);
            setTotalWeight(weight);
            setVariant("success");
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
        }
        else if(status.status === "loading"){
        }
        else if(status.status === "idle"){
            setShow(false)
        }
    },[status.status])

    const getOrderDetails = async () => {
        setStatus({status:"loading", error:null});
        await axios.get(`/api/orders/get_order_budget_details/${orderId}`, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            console.log(response.data);
            setOrder(response.data);
            setStatus({status:"success", error:null});
        }).catch((err) => {
            console.log(err);
            setStatus({status:"error", error:err?.response.data.message});
        })
    };

    useEffect(() => {
        getOrderDetails()
    },[])

    return (
        <>
    {
        status.status === "idle" ? <div></div>
        :
        status.status === "error"  ? 
        <Alert variant={"danger"} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{status.error}</Alert.Heading>
        </Alert> 
        :
        status.status === "loading" ?
        <Spinner/>
        :
        <div>
            {show?
                <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{status.error ? status.error : "Product Edited"}</Alert.Heading>
                </Alert> 
                : 
                <div></div>
            }
            <h3>Budget</h3>
            <Table  bordered hover>
                <thead>
                    <th>Consumption Month </th>
                    <th>Budget</th>
                </thead>
                <tbody>
                    <tr>
                        <td>{order?.monthlyBudget?.monthName ?? ""} {order?.order?.consumptionDate.year ?? ""}</td>
                        <td>{order?.monthlyBudget?.monthlyBudget ?? ""}</td>
                     </tr>
                </tbody>
            </Table>
            <h3>Supplyer Quote</h3>
            <Table bordered hover>
                <thead>
                    <th>Ingredient</th>
                    <th>Weigth (kg)</th>
                    <th>Prices</th>
                </thead>
                <tbody>
                    {
                        order?.order?.materialPrices.map((p,index) => (
                            <tr>
                                <td>{p.materialName}</td>
                                <td>{p.weight}</td>
                                <td>{p.price}</td>
                            </tr>
                        ))
                    }
                    <tr>
                                <td><b>Total</b></td>
                                <td>{totalWeight}</td>
                                <td>{totalCost}</td>
                            </tr>
                </tbody>
            </Table>
            <h3>Product Details</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Materials</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {order?.order?.products.map((product,index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>
                            <table>
                                <tbody >
                                    {product.materials.map((material) => (
                                        <tr key={material.name}>
                                            <td>{material.name}</td>
                                            <td>{material.weight}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        </tr>
                    ))}
                </tbody>
              </Table>
            
        </div>
    }
        </>
    );
}

export default ViewOrderDetails;
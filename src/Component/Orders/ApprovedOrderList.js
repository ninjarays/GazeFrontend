import React, { useState } from 'react';
import { Button, Table , Modal } from 'react-bootstrap';

function ApprovedOrderList(props) {
    const [viewMaterials, setViewMaterials] = useState(false);
    const [viewOrder, setViewOrder] = useState(null)

    const ViewRawMaterials =(props) => {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Raw Materials
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Materials</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {viewOrder?.products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>
                            <table>
                                <tbody >
                                    {product.materials.map((material) => (
                                        <tr>
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
            </Modal.Body>
          </Modal>
        );
    }

    return (
        <div style={{ width: '100%'}}>
        <ViewRawMaterials
            show={viewMaterials}
            onHide={() => {
                setViewMaterials(false);
            }}
        />
       
        <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Requested By</th>
                        <th>Approved By</th>
                        <th>Products</th>
                        <th>Time</th>
                        <th>Materials</th>
                    </tr>
                </thead>
                <tbody>
                {props.orders.map((order) => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.employeeId}</td>
                        <td>{order.approvedBy}</td>
                        <td>
                            <table>
                                <tbody >
                                    {order.products.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}kg</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        <td>{order.date.slice(0,10)}</td>
                        <td>
                            <Button onClick={() => {
                                setViewOrder(order);
                                setViewMaterials(true);
                            }}> View</Button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>
        </div>
        </div>
    );
}

export default ApprovedOrderList;
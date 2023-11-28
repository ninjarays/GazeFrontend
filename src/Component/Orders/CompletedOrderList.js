import React, { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, Spinner } from 'react-bootstrap';
import ViewOrderDetails from './ViewOrderDetails';

const CompletedOrderList = ({ reloadValue, storeId }) => {
    const token = useSelector((state) => state.user.userInfo.access_token);
    const role = useSelector((state) => state.user.userInfo.userCred.role);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeValues, setActiveValues] = useState({currentItems:[], totalPages:0})
    // const [currentItems,setCurrentItems ]= useState([]);
    // const [totalPages,setTotalPages] = useState(0);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("light");
    const [status, setStatus] = useState({status:"idle", error:null})
    const [pages, setPages] = useState([]);
    const [viewMaterials, setViewMaterials] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);

    useEffect(()=>{
        console.log("hello");
        getCompletedOrders();
    },[currentPage,reloadValue]);

    useEffect(()=>{
        console.log("hi");
        handlePagesChange();
    },[activeValues]);

    useEffect(() => {
        if(status.status === "success"){
            setShow(true);
            setVariant("success");
            setTimeout(() => {
                setShow(false)
            }, 1500)
        }
        else if(status.status === "error"){
            setShow(true);
            setVariant("danger");
        }
        else if(status.status === "loading"){
            setVariant("normal");
        }
        else if(status.status === "idle"){
            setShow(false)
        }
    },[status.status])

    const getCompletedOrders =  async () => {
        console.log("getting completed order");
        setStatus({status:"loading", error:null});
        console.log(" Started getting completed order");
        await axios.get(`/api/orders/get_store_completed_orders?page=${currentPage}&limit=20&storeId=${storeId}`, {
            headers:{"Authorization":`Bearer ${token}`},
        }).then((response) => {
            console.log("got completed order");
            setActiveValues({
                currentItems:response?.data.orders, 
                totalPages:response?.data.totalPages
            })
            // setCurrentItems(response?.data.orders);
            // setTotalPages(response?.data.totalPages);
        }).catch((err) => {
            console.log("coudnt completed order");
            setStatus({status:"error", error:err.response?.data.message});
        })
    };

    const handlePagesChange = () => {
        let currentIndex = 0;
        let newPages = [];
        while(currentIndex < activeValues.totalPages){
            if(currentIndex > currentPage-5 || currentIndex< currentPage+5){
                newPages.push(currentIndex+1)
            }
            currentIndex +=1;
        }
        setPages(newPages);
        setStatus({status:"success", error:null});
    }

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
                Order Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ViewOrderDetails orderId={viewOrder?._id}/>
            </Modal.Body>
          </Modal>
        );
    }

    return (
    <div>
        <ViewRawMaterials
            show={viewMaterials}
            onHide={() => {
                setViewMaterials(false);
            }}
        />

        {show?
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{
                status.status === "error" 
                ? 
                status.error 
                : status.status === "loading" 
                ?
                "Completing Order...."
                :
                "Order History Fetched"
            }</Alert.Heading>
            </Alert> 
            : 
            <div></div>
        }
        {status.status === "loading" ? <Spinner/> 
        :
        status.status === "error" ? status.error
        :
        status.status === "idle" ? <></>
        :
        <Table>
            <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Requested By</th>
                    <th>Approved By</th>
                    <th>Products</th>
                    <th>Consumption Date</th>
                    <th>Request Date</th>
                    <th>Approval Date</th>
                    <th>Order Details</th>
                </tr>
            </thead>
            <tbody>
            {activeValues.currentItems.map((order) => (
                <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td>{order.employeeName}</td>
                    <td>{order.approvarName}</td>
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
                    <td>{`${order.consumptionDate.month} ${order.consumptionDate.year}`}</td>
                    <td>{order.requestDate.slice(0,10)}</td>
                    <td>{order.approvalDate.slice(0,10)}</td>
                    <td>
                        <Button onClick={() => {
                            setViewOrder(order);
                            setViewMaterials(true);
                        }}> Details</Button>
                    </td>     
                </tr>
            ))}
            </tbody>
        </Table>

        }
      
      <Pagination>
        {pages.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() =>{setCurrentPage(number);}}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
    );
};

export default CompletedOrderList;

import React, { useState, useEffect } from 'react';
import './Billing.css';
import Row from 'react-bootstrap/Row';
import axios from '../../config/axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
  const [data, setData] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const { storeNumber } = useParams();
  const navigate = useNavigate();
 
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (key === 'Enter') {
        handleAddProduct();
      } else if (isAlphanumeric(key)) {
        setInputCode((prevInput) => prevInput + key);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputCode]);

  const isAlphanumeric = (input) => /^[a-zA-Z0-9]$/.test(input);
  const handleQuantityChange = (index, change) => {
    const newData = [...data];
    newData[index].quantity += change;
    if (newData[index].quantity < 1) {
      newData.splice(index, 1);
    }
    setData(newData);
  };
    const getProductByCode = async (code) => {
      try {
        const response = await axios.get(`/api/pos/get_pos_store/${storeNumber}`);
        const products = response.data.products;
        const product = products.find((p) => p.productBarcode === code);
    
        if (product) {
          return {
            barcode: product.productBarcode,
            productName: product.productName,
            offer: product.productOffer,
            totalPrice: product.sellingPrice, 
          };
        } else {
          console.log(`Product not found for code: ${code}`);
          return null;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        return null;
      }
    };
  const handleAddProduct = async () => {
    const product = await getProductByCode(inputCode);
    if (product) {
      console.log('Product:', product);
      console.log('DAATA:', data);

      const existingProductIndex = data.findIndex((item) => item.barcode === product.barcode);
  
      if (existingProductIndex !== -1) {
        const newData = [...data];
        console.log(newData);
        console.log('Before update:', newData);
        newData[existingProductIndex].quantity ++;
        console.log('After update:', newData);
        setData(newData);
        console.log('Updated Product List:', newData);
      } else {
        const newData = [...data, { ...product, quantity: 1 }];
        setData(newData);
        console.log('Updated Product List:', newData);
      }
      
      setInputCode('');
    } else {
      console.log(`Product not found for code: ${inputCode}`);
      setShowModal(true);
    }
    setInputCode('');
  };

  const calculateTotalBill = () => {
    return data.reduce((total, item) => total + calculateTotalPrice(item), 0);
  };
  const calculateTotalPrice = (item) => {
    if (item.offer === 'NOPR') {
      return item.quantity * item.totalPrice; // No discount
    } else if (item.offer.startsWith('F')) {
      const discountPercentage = parseInt(item.offer.substring(1), 10);
      const discountedPrice = item.totalPrice * (1 - discountPercentage / 100);
      return item.quantity * discountedPrice;
    } 
    else if (item.offer.startsWith('B')) {
      const [, buyCount, getCount] = item.offer.match(/B(\d+)G(\d+)/) || [];
      if (buyCount && getCount) {
        const totalItemCount = parseInt(buyCount, 10) + parseInt(getCount, 10);
        const setsOfOffer = Math.floor(item.quantity / totalItemCount);
        const remainingItems = item.quantity % totalItemCount;
  
        const fullSetsPrice = setsOfOffer * parseInt(buyCount, 10) * item.totalPrice;
        const remainingItemsPrice = remainingItems * item.totalPrice;
  
        return fullSetsPrice + remainingItemsPrice;
      }
    }
   
  };
  const handleCancel = () => {
    
    setData([]);
  };
  const handleSplit = () => {
    navigate(`/pos-dashboard/${storeNumber}/split`);

  }
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className='body'>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Product not found </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='billing-tick-row'>
        <div className='head-title'>
          <div className='head-tile1'>Billing</div>
          <input
            type='text'
            placeholder='Enter alphanumeric code'
            value={inputCode}
            onKeyDown={(e) => {
              const { key } = e;
              if (key === 'Backspace') {
                 e.preventDefault();
                setInputCode((prevInput) => prevInput.slice(0, -1));
              } 
            }}
          />
          <div className='head-tile2'>Ticket #0000001</div>
        </div>
        <div className='table-billing'>
          <table>
            <thead>
              <tr className="title-row">
                <th className="d-flex align-items-start"><span className='span-th'>Barcode No.</span></th>
                <th className=""><span className='span-th'>Product Name</span></th>
                <th className=""><span className='span-th'>Qtty</span>
                </th><th className=""><span className='span-th'>Rate</span></th>
                <th className=""><span className='span-th'>Offer</span></th>
                <th className="d-flex justify-content-end"><span className='span-th'>Total Price</span></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.barcode}</td>
                  <td>{item.productName}</td>
                  <td>
                    <div className="quantity-container">
                      <button className='button-quantity' onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className='button-quantityPlus' onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                  </td>
                  <td>{item.totalPrice}</td>
                  <td>{item.offer}</td>
                  <td>{calculateTotalPrice(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Row className='button-row'>
        <div className=' btn bg-danger billing-button'  onClick={handleCancel} >Cancel</div>
        <div className='btn bg-success billing-button' >Cash</div>
        <div className='btn bg-success billing-button' >GPay</div>
        <div className='btn bg-success billing-button' onClick={handleSplit}>Split</div>
      </Row>
    </div>
  );
};

export default Billing;
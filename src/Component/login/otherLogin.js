import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';


const OtherLogin = () => {
  const [storeNumber, setStoreNumber] = useState('');
  const [storeIds, setStoreIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {

    axios.get('/api/pos/get_store_ids')
      .then(response => setStoreIds(response.data))
      .catch(error => console.error('Error fetching store IDs:', error));
  }, []);

  const handleSubmit = () => {
    const storeExists = storeIds.some(item => item.storeId === storeNumber);
    if (storeExists) {
      navigate(`/pos-billing/${storeNumber}`);
    } else {
      setErrorMessage('Wrong store ID. Please enter a valid store number.');
      // alert('Wrong store ID. Please enter a valid store number.');

    }
  };
  return (
    <div>
        <Container>
            <div className='login-container'>
<div className='pos-container'>
   <div className='pos-innercontainer'>
<div className='pos-box'>
    POS
</div>
<div className='d-flex justify-content-center'>
    <input type="text" placeholder="Enter Store Number" value={storeNumber}
                  onChange={(e) => setStoreNumber(e.target.value)} className='store-number-tex' /><Button onClick={handleSubmit}  className='submit-code'variant="success">Submit</Button>
   </div>
   {errorMessage && (
                <Alert variant="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}
   </div>
   
</div>
            </div>
        </Container>
    </div>
  )
}

export default OtherLogin
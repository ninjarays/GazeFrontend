import React from 'react'
import './Billing.css';
import Button from 'react-bootstrap/Button';

const Split = () => {
  return (
    <div className='body split'>
        <div className='split-box'>
           <div className='row2s d-flex flex-row '>
           <div className='split-text'>Payable Amount </div>
            <div className='split-text'>Amount Paid</div>
           </div>
            <div className='d-flex flex-row row2cash'>
            <div className='split-text'>Cash</div>
            <div className='split-text'>input</div>
            </div>
            <div className='d-flex flex-row  row2gpay'>
            <div className='split-text'>gpay</div>
            <div className='split-text'>input</div>
            </div>
            <div className='button-split'>
            <Button variant="danger">Cancel</Button>{' '}
            <Button variant="success">Enter</Button>
            </div>
        </div>
    </div>
  )
}

export default Split
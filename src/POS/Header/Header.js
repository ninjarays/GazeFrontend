import React, { useState, useEffect } from 'react';
import './header.css'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const HeaderPOS = () => {
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();
  const { storeNumber } = useParams();
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()}`;
      setCurrentDate(formattedDate);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDashboard = () => {
    navigate(`/pos-dashboard/${storeNumber}`);
  }
  return (
    <div className='nav0'>
        <div className='d-flex nav1'> 
            <div className='nav-t'> POS</div>
            <div className='date-box nav-t'><div>Date</div> <div className='date-nav'>{currentDate}</div></div>
        </div>
        <div className='d-flex nav2 '>
            <div className='nav-t' onClick={handleDashboard} style={{cursor:'pointer'}} > Dashboard</div>
            <div className='nav-t'>{storeNumber}</div>
        </div>
    </div>
  )
}

export default HeaderPOS
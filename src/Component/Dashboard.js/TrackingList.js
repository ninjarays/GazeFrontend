import { useDispatch, useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { getTrackingFail, getTrackingLoading, getTrackingSucess } from '../../features/tracking/trackingSlice';
import axios from '../../config/axios';



const TrackingList =(props)=>{
    const tracking =useSelector((state)=> state.tracking);
    const dispatch=useDispatch();
    const [reload, setReload] = useState(1)

    const getList = async()=>{
        console.log("loading")
        dispatch(getTrackingLoading());
    await axios.get('api/tracking/get_tracking_info', {
        headers:{"Authorization":`Bearer ${props.access_token}`},
    }).then((response) => {
        dispatch(getTrackingSucess(response.data))
    }).catch((err) => {
        dispatch(getTrackingFail(err.response.data.message))
    })

      }

    useEffect(()=>{getList()},[props.reload])


    // useEffect(()=>{
         
    // },[trackingState.status])
    return(
        <>
        {tracking.status==='idle'? <div></div>:
        tracking.status==='Loading'?<div>Loading</div>:
        tracking.status==="Failure"? <div >{tracking.error}</div>:
        <div>
            <Table striped bordered hover key={reload}>
                <thead>
                   <tr>
                     <th>Order Number</th>
                     <th>Tracking Number</th>
                     {/* <th>Date</th> */}
                   </tr> 
                </thead> 

                <tbody>
                    {tracking.tracking.map((info)=>(
                        <tr key={info.orderNumber}>
                            <td>
                                {info.orderNumber}
                            </td>
                            <td>
                                {info.trackingNumber}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>    
        </div>}
        </>
    )
}

export default TrackingList;
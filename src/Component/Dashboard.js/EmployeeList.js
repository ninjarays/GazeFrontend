import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {fetchAllUsers} from '../../features/dashboard/dashboardSlice';

const EmployeeList =(props)=>{
    const employeeState= useSelector((state)=> state.dashboard);
    const dispatch =useDispatch();



    useEffect(()=>{
      console.log("loading")
      dispatch(fetchAllUsers(props.access_token))
    },[])

    // useEffect(()=>{

    // },[employeeState.status])
    return(
        <div>{!employeeState? <div></div>:
           employeeState.status==='loading' ?<div>loading</div>:
           employeeState.status==='fail'? <div>Error</div> :
          <div>
             
        <ul>
          {employeeState.users.map((user) => (
            <li key={user.email}>{user.employeeName}</li>
          ))}
        </ul>
          </div>
        }</div>
    )
}

export default EmployeeList;
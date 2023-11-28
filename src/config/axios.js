import axios from "axios";
import { useSelector } from "react-redux";



export default axios.create({
    // baseURL: 'https://gaze-l2gd.onrender.com', 
    baseURL: 'http://localhost:5001', 
    // baseURL: 'https://inventory-test-c6wr.onrender.com',
    // withCredentials:true, 
});

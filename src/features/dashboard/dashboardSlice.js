// dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../config/axios";

// Define an initial state for the slice
const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

// Create an async thunk action for fetching all users using Axios
export const fetchAllUsers = createAsyncThunk(
  'dashboard/fetchAllUsers',
   async (info) => {
  try {
    const response = await axios.get('http://localhost:5001/api/admin/get_all_users',{
      headers:{"Authorization":`Bearer ${info}`}
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Create a slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'success';
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;

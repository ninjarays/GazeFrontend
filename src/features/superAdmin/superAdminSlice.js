import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    registerAdmin:"idle",
    error: null
}

export const registerNewUser = createAsyncThunk(
    'user/registerNewUser',
    async (userInfo) => {
        try {
            const response = await axios.post('http://localhost:5001/api/super_admin/register_admin', userInfo, {
                headers:{"Authorization":`Bearer ${userInfo["jwt"]}`},
            });
            return response.data
          } catch (error) {
            error["message"] = error.response.data.message;
            throw error
          }
    }
)

export const registerNewAdmin = createAsyncThunk(
    'user/registerNewAdmin',
    async (userInfo) => {
        try {
            const response = await axios.post('http://localhost:5001/api/super_admin/register_admin', userInfo, {
                headers:{"Authorization":`Bearer ${userInfo["jwt"]}`},
            });
            return response.data
          } catch (error) {
            error["message"] = error.response.data.message;
            throw error
          }
    }
)

const superAdminSlice = createSlice(
    {
        name:"superAdmin",
        initialState,
        reducers:{
            refreshLoading: ((state) => {
                state.registerAdmin = "idle";
                state.error = null;
            }),
        },
        extraReducers:(builder) => {
                builder
                  .addCase(registerNewAdmin.pending, (state) => {
                    state.registerAdmin = 'loading';
                  })
                  .addCase(registerNewAdmin.fulfilled, (state) => {
                    state.registerAdmin = 'added';
                    state.error = null
                  })
                  .addCase(registerNewAdmin.rejected, (state,action) => {
                    state.registerAdmin = 'error';
                    state.error = action.error.message;
                  })
            }
        
    }
)

export const {refreshLoading} = superAdminSlice.actions;

export default superAdminSlice.reducer;
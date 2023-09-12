import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    editUser:"idle",
    registerUser:"idle",
    changePassword:{status:"idle", error:null},
    error: null
}

export const registerNewUser = createAsyncThunk(
    'user/registerNewUser',
    async (userInfo) => {
        try {
            const response = await axios.post('http://localhost:5001/api/admin/register', userInfo, {
                headers:{"Authorization":`Bearer ${userInfo["jwt"]}`},
            });
            return response.data
          } catch (error) {
            error["message"] = error.response.data.message;
            throw error
          }
    }
)

export const editUser = createAsyncThunk(
    'user/editUser',
    async (userInfo) => {
        try {
            const response = await axios.post('http://localhost:5001/api/admin/edit/user', userInfo, {
                headers:{"Authorization":`Bearer ${userInfo["jwt"]}`},
            });
            return response.data
          } catch (error) {
            error["message"] = error.response.data.message;
            throw error
          }
    }
)

const adminSlice = createSlice(
    {
        name:"admin",
        initialState,
        reducers:{
            refreshLoading: ((state) => {
                state.registerUser = "idle";
                state.editUser = "idle"
                state.error = null;
            }),
            changePasswordLoading:(((state) => {
              state.changePassword.status = "loading";
          })),
            changePasswordSuccess:(((state) => {
              state.changePassword.status = "success";
          })),
            changePasswordError:(((state, action) => {
              state.changePassword.status = "error";
              state.changePassword.error = action.payload;
          })),
        },
        extraReducers:(builder) => {
                builder
                  .addCase(registerNewUser.pending, (state) => {
                    state.registerUser = 'loading';
                  })
                  .addCase(registerNewUser.fulfilled, (state) => {
                    state.registerUser = 'added';
                    state.error = null
                  })
                  .addCase(registerNewUser.rejected, (state,action) => {
                    state.registerUser = 'error';
                    state.error = action.error.message;
                  })
                  .addCase(editUser.pending, (state) => {
                    state.editUser = 'loading';
                  })
                  .addCase(editUser.fulfilled, (state) => {
                    state.editUser = 'added';
                    state.error = null
                  })
                  .addCase(editUser.rejected, (state,action) => {
                    state.editUser = 'error';
                    state.error = action.error.message;
                  });
            }
        
    }
)

export const {refreshLoading} = adminSlice.actions;

export default adminSlice.reducer;
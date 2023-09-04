import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    registerUser:"idle"
}

export const registerNewUser = createAsyncThunk(
    'user/registerNewUser',
    async (userInfo) => {
        console.log("in reducer");
        if(userInfo[2] === userInfo[3]){
            await axios.post('http://localhost:5001/api/users/admin/register', {name:userInfo[0],email:userInfo[1], password:userInfo[2]}, {
                headers:{"Authorization":`Bearer ${userInfo[5]}`}
            }).then(() => {
                console.log("registered");
            }).catch((err) => {
                console.log(err);
            })
        }
        
    }
)

const adminSlice = createSlice(
    {
        name:"admin",
        initialState,
        reducers:{},
        extraReducers:(builder) => {
                builder
                  .addCase(registerNewUser.pending, (state) => {
                    state.registerUser = 'loading';
                  })
                  .addCase(registerNewUser.fulfilled, (state) => {
                    state.registerUser = 'added';
                  })
                  .addCase(registerNewUser.rejected, (state) => {
                    state.registerUser = 'idle';
                  });
            }
        
    }
)

export default adminSlice.reducer;
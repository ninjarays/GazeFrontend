import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    status:"idle",
    userInfo:null
}

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (loginCred) => {
        const response = await axios.post('http://localhost:5001/api/users/login', {email:loginCred[0], password:loginCred[1]})

        return response.data;
    }
)

const userSlice = createSlice(
    {
        name:"user",
        initialState,
        reducers:{
            logOutUser: ((state) => {
                state.userInfo = null;
            }),
        },
        extraReducers:(builder) => {
                builder
                  .addCase(loginUser.pending, (state) => {
                    state.status = 'loading';
                  })
                  .addCase(loginUser.fulfilled, (state, action) => {
                    state.status = 'idle';
                    state.userInfo = action.payload;
                  })
                  .addCase(loginUser.rejected, (state,action) => {
                    state.status = 'idle';
                    state.userInfo = action.payload;
                  });
            }
        
    }
)

export const {logOutUser} = userSlice.actions;

export const getUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;
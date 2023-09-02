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
            logOutUser: ((state, payload) => {
                state.userInfo = null;
            }),
        },
        extraReducers:(builder) => {
                builder
                  .addCase(loginUser.pending, (state) => {
                    state.status = 'loading';
                    console.log("getting user");
                  })
                  .addCase(loginUser.fulfilled, (state, action) => {
                    state.status = 'idle';
                    state.userInfo = action.payload;
                    console.log("got user");
                  })
                  .addCase(loginUser.rejected, (state,action) => {
                    state.status = 'idle';
                    state.userInfo = action.payload;
                    console.log("error user");
                  });
            }
        
    }
)

export const {logOutUser} = userSlice.actions;

export const getUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;
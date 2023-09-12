import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    status:"idle",
    userInfo:null,
    error:null
}

// export const loginUser = createAsyncThunk(
//     'user/loginUser',
//     async (loginCred) => {
//         const response = await axios.post('http://127.0.0.1:5001/api/users/login', {email:loginCred[0], password:loginCred[1]})

//         return response.data;
//     }
// )

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginCred) => {
    try {
      const response = await axios.post('/api/users/login', {email:loginCred[0], password:loginCred[1]})
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
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
                    console.log("logging");
                    state.status = 'loading';
                  })
                  .addCase(loginUser.fulfilled, (state, action) => {
                    console.log("Logged In");
                    state.status = 'idle';
                    state.userInfo = action.payload;
                    state.error = null
                  })
                  .addCase(loginUser.rejected, (state,action) => {
                    state.status = 'idle';
                    state.error = action.error.message;
                  });
            }
        
    }
)

export const {logOutUser, login} = userSlice.actions;

export const getUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;
import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState ={
    getManufacturingOrder:{
        status:"idel",
        error:null,
        manufactuirngOrder:null,
    },   
}

export const getManufacturing = createAsyncThunk(
    'manufacture/getManufacturing',
    async ({token,storeId}) => {
      try {
        const response = await axios.get(`/api/manufacture/get_all_manufacturing_order/${storeId}`, {
          headers:{"Authorization":`Bearer ${token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  );

  const manufacturingSlice = createSlice(
        {
            name:"manufactureOrders",
            initialState,
            reducers:{

            },
            extraReducers:(builder)=>{
                builder
                .addCase(getManufacturing.pending, (state) => {
                    state.getManufacturing.status = 'loading';
                  })
                  .addCase(getManufacturing.fulfilled, (state, action) => {
                    state.getManufacturing = action.payload;
                    state.getManufacturing.status = "success"
                  })
                  .addCase(getManufacturing.rejected, (state,action) => {
                    state.getManufacturing.status = 'error';
                    state.getManufacturing.error = action.error.message;
                  })
            }
            }
        
    )

 export default manufacturingSlice.reducer;
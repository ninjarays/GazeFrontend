import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    getOneSalesYear:{
        status:"idle",
        year:null,
        error:null
    },
    getAllSalesYears:{
        status:"idle",
        years:null,
        error:null
    },
    addSalesYear:{
        status:"idle",
        error:null
    },
    setMonthlySales:{
      status:"idle",
      error:null
    }
}

export const addSalesYear = createAsyncThunk(
  'sales/addSalesYear',
  async (data) => {
    try {
      const response = await axios.post('/api/sales/add_sales_year', {storeId:data.storeId}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const setMonthlySales = createAsyncThunk(
    'sales/setMonthlySales',
    async (data) => {
      try {
        const response = await axios.put('/api/sales/set_monthly_sales', data.body, {
          headers:{"Authorization":`Bearer ${data.token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  )



export const getOneSalesYear = createAsyncThunk(
  'sales/getOneSalesYear',
  async (props) => {
    try {
      const response = await axios.get(`/api/sales/get_one_sales_year/${props.storeId}/${props.year}`, {
        headers:{"Authorization":`Bearer ${props.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const getAllSalesYears = createAsyncThunk(
    'sales/getAllSalesYears',
    async (props) => {
      try {
        const response = await axios.get(`/api/sales/get_all_sales_years/${props.storeId}` , {
          headers:{"Authorization":`Bearer ${props.token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  )

const salesSlice = createSlice(
    {
        name:"sales",
        initialState,
        reducers:{
            addSalesYearReset:(((state) => {
                state.addSalesYear.status = "idle";
                state.addSalesYear.error = null;
            })),
            setMonthlySalesReset:(((state) => {
                state.setMonthlySales.status = "idle";
                state.setMonthlySales.error = null;
            })),
            getOneSalesYearReset:(((state) => {
                state.getOneSalesYear.status = "idle";
                state.getOneSalesYear.error = null;
            })),
            getAllSalesYearsReset:(((state) => {
                state.getAllSalesYears.status = "idle";
                state.getAllSalesYears.error = null;
            })),
        },
        extraReducers:(builder) => {
            builder
              .addCase(addSalesYear.pending, (state) => {
                state.addSalesYear.status = 'loading';
              })
              .addCase(addSalesYear.fulfilled, (state) => {
                state.addSalesYear.status = "success"
              })
              .addCase(addSalesYear.rejected, (state,action) => {
                state.addSalesYear.status = 'error';
                state.addSalesYear.error = action.error.message;
              })
              .addCase(setMonthlySales.pending, (state) => {
                state.setMonthlySales.status = 'loading';
              })
              .addCase(setMonthlySales.fulfilled, (state) => {
                state.setMonthlySales.status = "success"
              })
              .addCase(setMonthlySales.rejected, (state,action) => {
                state.setMonthlySales.status = 'error';
                state.setMonthlySales.error = action.error.message;
              })
              .addCase(getOneSalesYear.pending, (state) => {
                state.getOneSalesYear.status = 'loading';
              })
              .addCase(getOneSalesYear.fulfilled, (state, action) => {
                state.getOneSalesYear.year = action.payload;
                state.getOneSalesYear.status = "success"
              })
              .addCase(getOneSalesYear.rejected, (state,action) => {
                state.getOneSalesYear.status = 'error';
                state.getOneSalesYear.error = action.error.message;
              })
              .addCase(getAllSalesYears.pending, (state) => {
                state.getAllSalesYears.status = 'loading';
              })
              .addCase(getAllSalesYears.fulfilled, (state, action) => {
                state.getAllSalesYears.years = action.payload;
                state.getAllSalesYears.status = "success"
              })
              .addCase(getAllSalesYears.rejected, (state,action) => {
                state.getAllSalesYears.status = 'error';
                state.getAllSalesYears.error = action.error.message;
              })
        }
        
    }
)

export const {addSalesYearReset , setMonthlySalesReset , getAllSalesYearsReset , getOneSalesYearReset } = salesSlice.actions;

export default salesSlice.reducer;
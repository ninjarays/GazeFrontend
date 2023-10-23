import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    getOneBudgetYear:{
        status:"idle",
        year:null,
        error:null
    },
    getAllBudgetYears:{
        status:"idle",
        years:null,
        error:null
    },
    addBudgetYear:{
        status:"idle",
        error:null
    },
    setMonthlyBudget:{
      status:"idle",
      error:null
    }
}

export const addBudgetYear = createAsyncThunk(
  'budget/addBudgetYear',
  async (data) => {
    try {
      const response = await axios.post('/api/budget/add_budget_year', {storeId:data.storeId}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const setMonthlyBudget = createAsyncThunk(
    'budget/setMonthlyBudget',
    async (data) => {
      try {
        const response = await axios.put('/api/budget/set_monthly_budget', data.body, {
          headers:{"Authorization":`Bearer ${data.token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  )



export const getOneBudgetYear = createAsyncThunk(
  'budget/getOneBudgetYear',
  async (props) => {
    try {
      const response = await axios.get(`/api/budget/get_one_budget_year/${props.storeId}/${props.year}`, {
        headers:{"Authorization":`Bearer ${props.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const getAllBudgetYears = createAsyncThunk(
    'budget/getAllBudgetYears',
    async (props) => {
      try {
        const response = await axios.get(`/api/budget/get_all_budget_years/${props.storeId}` , {
          headers:{"Authorization":`Bearer ${props.token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  )

const budgetSlice = createSlice(
    {
        name:"budget",
        initialState,
        reducers:{
            addBudgetYearReset:(((state) => {
                state.addBudgetYear.status = "idle";
                state.addBudgetYear.error = null;
            })),
            setMonthlyBudgetReset:(((state) => {
            state.setMonthlyBudget.status = "idle";
            state.setMonthlyBudget.error = null;
            })),
            getOneBudgetYearReset:(((state) => {
                state.getOneBudgetYear.status = "idle";
                state.getOneBudgetYear.error = null;
            })),
            getAllBudgetYearsReset:(((state) => {
                state.getAllBudgetYears.status = "idle";
                state.getAllBudgetYears.error = null;
            })),
        },
        extraReducers:(builder) => {
            builder
              .addCase(addBudgetYear.pending, (state) => {
                state.addBudgetYear.status = 'loading';
              })
              .addCase(addBudgetYear.fulfilled, (state) => {
                state.addBudgetYear.status = "success"
              })
              .addCase(addBudgetYear.rejected, (state,action) => {
                state.addBudgetYear.status = 'error';
                state.addBudgetYear.error = action.error.message;
              })
              .addCase(setMonthlyBudget.pending, (state) => {
                state.setMonthlyBudget.status = 'loading';
              })
              .addCase(setMonthlyBudget.fulfilled, (state) => {
                state.setMonthlyBudget.status = "success"
              })
              .addCase(setMonthlyBudget.rejected, (state,action) => {
                state.setMonthlyBudget.status = 'error';
                state.setMonthlyBudget.error = action.error.message;
              })
              .addCase(getOneBudgetYear.pending, (state) => {
                state.getOneBudgetYear.status = 'loading';
              })
              .addCase(getOneBudgetYear.fulfilled, (state, action) => {
                state.getOneBudgetYear.year = action.payload;
                state.getOneBudgetYear.status = "success"
              })
              .addCase(getOneBudgetYear.rejected, (state,action) => {
                state.getOneBudgetYear.status = 'error';
                state.getOneBudgetYear.error = action.error.message;
              })
              .addCase(getAllBudgetYears.pending, (state) => {
                state.getAllBudgetYears.status = 'loading';
              })
              .addCase(getAllBudgetYears.fulfilled, (state, action) => {
                state.getAllBudgetYears.years = action.payload;
                state.getAllBudgetYears.status = "success"
              })
              .addCase(getAllBudgetYears.rejected, (state,action) => {
                state.getAllBudgetYears.status = 'error';
                state.getAllBudgetYears.error = action.error.message;
              })
        }
        
    }
)

export const {addBudgetYearReset , setMonthlyBudgetReset , getAllBudgetYearsReset , getOneBudgetYearReset } = budgetSlice.actions;

export default budgetSlice.reducer;
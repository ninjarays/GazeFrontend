import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    getStoreOrders:{
        status:"idle",
        orders:null,
        error:null
    },
    createOrder:{
        status:"idle",
        error:null
    },
    editOrder:{
      status:"idle",
      error:null
  },
    getProducts:{
      products:null,
      status:"idle",
      error:null
    },
    approveOrder:{
        status:"idle",
        error:null
    },
    rejectOrder:{
      status:"idle",
      error:null
  },
    deleteOrder:{
    status:"idle",
    error:null
}
}

export const approveOrder = createAsyncThunk(
  'orders/approveOrder',
  async (data) => {
    try {
      const response = await axios.put('/api/orders/order_approval', {_id:data.id}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const rejectOrder = createAsyncThunk(
  'orders/rejectOrder',
  async (data) => {
    try {
      const response = await axios.put('/api/orders/order_reject', {_id:data.id,note:data.note}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (data) => {
    try {
      const response = await axios.put('/api/orders/delete_order', {_id:data.id}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (token) => {
    try {
      const response = await axios.get('/api/orders/get_products_list', {
        headers:{"Authorization":`Bearer ${token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

const orderSlice = createSlice(
    {
        name:"orders",
        initialState,
        reducers:{
          getStoreOrdersLoading:(((state) => {
            state.getStoreOrders.status = "loading";
        })),
          getStoreOrdersSuccess:(((state, action) => {
            state.getStoreOrders.status = "success";
            state.getStoreOrders.orders = action.payload;
        })),
          getStoreOrdersError:(((state, action) => {
            state.getStoreOrders.status = "error";
            state.getStoreOrders.error = action.payload;
        })),
          getStoreOrdersReset:(((state) => {
            state.getStoreOrders.status = "idle";
            state.getStoreOrders.error = null;
        })),
          createOrderLoading:(((state) => {
            state.createOrder.status = "loading";
        })),
          createOrderSuccess:(((state) => {
            state.createOrder.status = "success";
        })),
          createOrderError:(((state, action) => {
            state.createOrder.status = "error";
            state.createOrder.error = action.payload;
        })),
          createOrderReset:(((state) => {
            state.createOrder.status = "idle";
            state.createOrder.error = null;
        })),
          editOrderLoading:(((state) => {
          state.editOrder.status = "loading";
      })),
          editOrderSuccess:(((state) => {
          state.editOrder.status = "success";
      })),
          editOrderError:(((state, action) => {
          state.editOrder.status = "error";
          state.editOrder.error = action.payload;
      })),
          editOrderReset:(((state) => {
          state.editOrder.status = "idle";
          state.editOrder.error = null;
      })),
          approveOrderReset:(((state) => {
            state.approveOrder.status = "idle";
            state.approveOrder.error = null;
      })),
          rejectOrderReset:(((state) => {
            state.rejectOrder.status = "idle";
            state.rejectOrder.error = null;
      })),
          deleteOrderReset:(((state) => {
        state.deleteOrder.status = "idle";
        state.deleteOrder.error = null;
      })),

        },
        extraReducers:(builder) => {
            builder
              .addCase(approveOrder.pending, (state) => {
                state.approveOrder.status = 'loading';
              })
              .addCase(approveOrder.fulfilled, (state) => {
                state.approveOrder.status = "success"
              })
              .addCase(approveOrder.rejected, (state,action) => {
                state.approveOrder.status = 'error';
                state.approveOrder.error = action.error.message;
              })
              .addCase(rejectOrder.pending, (state) => {
                state.rejectOrder.status = 'loading';
              })
              .addCase(rejectOrder.fulfilled, (state) => {
                state.rejectOrder.status = "success"
              })
              .addCase(rejectOrder.rejected, (state,action) => {
                state.rejectOrder.status = 'error';
                state.rejectOrder.error = action.error.message;
              })
              .addCase(deleteOrder.pending, (state) => {
                state.deleteOrder.status = 'loading';
              })
              .addCase(deleteOrder.fulfilled, (state) => {
                state.deleteOrder.status = "success"
              })
              .addCase(deleteOrder.rejected, (state,action) => {
                state.deleteOrder.status = 'error';
                state.deleteOrder.error = action.error.message;
              })
              .addCase(getProducts.pending, (state) => {
                state.approveOrder.status = 'loading';
              })
              .addCase(getProducts.fulfilled, (state, action) => {
                state.getProducts.products = action.payload;
                state.getProducts.status = "success"
              })
              .addCase(getProducts.rejected, (state,action) => {
                state.getProducts.status = 'error';
                state.getProducts.error = action.error.message;
              })
        }
        
    }
)

export const {getStoreOrdersLoading , getStoreOrdersError , getStoreOrdersSuccess } = orderSlice.actions;

export const { getStoreOrdersReset , approveOrderReset , rejectOrderReset , deleteOrderReset } = orderSlice.actions

export const { createOrderError , createOrderLoading , createOrderReset , createOrderSuccess } = orderSlice.actions

export const { editOrderError , editOrderLoading , editOrderReset , editOrderSuccess } = orderSlice.actions

export default orderSlice.reducer;
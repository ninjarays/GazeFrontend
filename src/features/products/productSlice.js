import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    getProducts:{
        status:"idle",
        products:null,
        error:null
    },
    getIngredients:{
        status:"idle",
        ingredients:null,
        error:null
    },
    createProduct:{
        ingredients:null,
        status:"idle",
        error:null
    },
    deleteProduct:{
        status:"idle",
        error:null
    }
}

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (data) => {
    try {
      const response = await axios.put('/api/products/delete_product', {_id:data._id}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

export const getIngredients = createAsyncThunk(
    'product/getIngredients',
    async (token) => {
      try {
        const response = await axios.get('/api/products/get_ingredients', {
          headers:{"Authorization":`Bearer ${token}`},
      })
        return response.data
      } catch (error) {
        error["message"] = error.response.data.message;
        throw error
      }
    }
  )

const productSlice = createSlice(
    {
        name:"products",
        initialState,
        reducers:{
          getProductsLoading:(((state) => {
            state.getProducts.status = "loading";
        })),
          getProductsSuccess:(((state, action) => {
            state.getProducts.status = "success";
            state.getProducts.products = action.payload;
        })),
          getProductsError:(((state, action) => {
            state.getProducts.status = "error";
            state.getProducts.error = action.payload;
        })),
          getProductsReset:(((state) => {
            state.getProducts.status = "idle";
            state.getProducts.error = null;
        })),
          createProductLoading:(((state) => {
            state.createProduct.status = "loading";
        })),
          createProductSuccess:(((state, action) => {
            state.getProducts.products = action.payload;
            state.createProduct.status = "success";
        })),
          createProductError:(((state, action) => {
            state.createProduct.status = "error";
            state.createProduct.error = action.payload;
        })),
          createProductReset:(((state) => {
            state.createProduct.status = "idle";
            state.createProduct.error = null;
        })),
          deleteProductsReset:(((state) => {
            state.deleteProduct.status = "idle";
            state.deleteProduct.error = null;
        })),
          getIngredientsReset:(((state) => {
            state.getIngredients.status = "idle";
            state.getIngredients.error = null;
        })),

        },
        extraReducers:(builder) => {
            builder
              .addCase(deleteProduct.pending, (state) => {
                state.deleteProduct.status = 'loading';
              })
              .addCase(deleteProduct.fulfilled, (state, action) => {
                state.getProducts.products = action.payload;
                state.deleteProduct.status = "success"
              })
              .addCase(deleteProduct.rejected, (state,action) => {
                state.deleteProduct.status = 'error';
                state.deleteProduct.error = action.error.message;
              })
              .addCase(getIngredients.pending, (state) => {
                state.getIngredients.status = 'loading';
              })
              .addCase(getIngredients.fulfilled, (state, action) => {
                state.getIngredients.ingredients = action.payload;
                state.getIngredients.status = "success"
              })
              .addCase(getIngredients.rejected, (state,action) => {
                state.getIngredients.status = 'error';
                state.getIngredients.error = action.error.message;
              });
        }
        
    }
)

export const {getProductsError, getProductsLoading, getProductsReset, getProductsSuccess, getIngredientsReset} = productSlice.actions;

export const {createProductError, createProductLoading, createProductReset, createProductSuccess, deleteProductsReset} = productSlice.actions

export default productSlice.reducer;
import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
    getRawMaterials:{
        status:"idle",
        rawMaterials:null,
        error:null
    },
    createRawMaterials:{
        status:"idle",
        error:null
    },
    deleteRawMaterials:{
        status:"idle",
        error:null
    }
}

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterial/deleteMaterial',
  async (data) => {
    try {
      const response = await axios.put('/api/raw_materials/delete_raw_material', {_id:data._id}, {
        headers:{"Authorization":`Bearer ${data.token}`},
    })
      return response.data
    } catch (error) {
      error["message"] = error.response.data.message;
      throw error
    }
  }
)

const rawMaterialSlice = createSlice(
    {
        name:"rawMaterial",
        initialState,
        reducers:{
          getRawMaterialsLoading:(((state) => {
            state.getRawMaterials.status = "loading";
        })),
          getRawMaterialsSuccess:(((state, action) => {
            state.getRawMaterials.status = "success";
            state.getRawMaterials.rawMaterials = action.payload;
        })),
          getRawMaterialsError:(((state, action) => {
            state.getRawMaterials.status = "error";
            state.getRawMaterials.error = action.payload;
        })),
          getRawMaterialsReset:(((state) => {
            state.getRawMaterials.status = "idle";
            state.getRawMaterials.error = null;
        })),
          createRawMaterialsLoading:(((state) => {
            state.createRawMaterials.status = "loading";
        })),
          createRawMaterialsSuccess:(((state, action) => {
            state.createRawMaterials.status = "success";
            state.getRawMaterials.rawMaterials = action.payload
        })),
          createRawMaterialsError:(((state, action) => {
            state.createRawMaterials.status = "error";
            state.createRawMaterials.error = action.payload;
        })),
          createRawMaterialsReset:(((state) => {
            state.createRawMaterials.status = "idle";
            state.createRawMaterials.error = null;
        })),
          deleteRawMaterialsReset:(((state) => {
            state.deleteRawMaterials.status = "idle";
            state.deleteRawMaterials.error = null;
        })),

        },
        extraReducers:(builder) => {
            builder
              .addCase(deleteRawMaterial.pending, (state) => {
                state.deleteRawMaterials.status = 'loading';
              })
              .addCase(deleteRawMaterial.fulfilled, (state, action) => {
                state.getRawMaterials.rawMaterials = action.payload;
                state.deleteRawMaterials.status = "success"
              })
              .addCase(deleteRawMaterial.rejected, (state,action) => {
                state.deleteRawMaterials.status = 'error';
                state.deleteRawMaterials.error = action.error.message;
              })
        }
        
    }
)

export const {getRawMaterialsError, getRawMaterialsLoading, getRawMaterialsSuccess, getRawMaterialsReset} = rawMaterialSlice.actions;

export const {createRawMaterialsError, createRawMaterialsLoading, createRawMaterialsReset, createRawMaterialsSuccess, deleteRawMaterialsReset} = rawMaterialSlice.actions

export default rawMaterialSlice.reducer;
//TrackingSlice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../config/axios";

const initialState ={
    status:"idle",
    newStatus:"idle",
    error:null,
    tracking:null
}

export const trackingRegistration = createAsyncThunk(
    'tracking/trackingRegistration',

    async(userInfo)=>{
        
        try {
            console.log("sending")
            const response = await axios.post('/api/tracking/create_tracking', userInfo, {
                headers:{"Authorization":`Bearer ${userInfo["jwt"]}`},
            
            });
            console.log(response);
            return response.data
          } catch (error) {
            error["message"] = error.response.data.message;
            throw error
          }
    }
)

const trackingSlice = createSlice({
    name:'tracking',
    initialState,
    reducers:{
        getTrackingLoading: ((state)=>{
            state.status='Loading';
            state.error=null;
            state.tracking=null;
        }),

        getTrackingSucess:((state,action)=>{
            state.status="Sucessfull";
            state.error=null;
            state.tracking=action.payload
        }),

        getTrackingFail:((state,action)=>{
            state.status="Failure";
            state.error=action.payload;
            state.tracking=null
        }),
        
       trackingrefresh:((state)=>{
            state.newStatus="idle";
            state.error=null
       })

    },

    

    extraReducers:(builder) => {
        builder
          .addCase(trackingRegistration.pending, (state) => {
            state.newStatus= 'loading';
          })
          .addCase(trackingRegistration.fulfilled, (state) => {
            state.newStatus = 'added';
            state.error = null
          })
          .addCase(trackingRegistration.rejected, (state,action) => {
            state.newStatus = 'error';
            state.error = action.error.message;
          })
    }
})
export const{getTrackingFail,getTrackingLoading,getTrackingSucess,trackingrefresh}=trackingSlice.actions;
export default trackingSlice.reducer;
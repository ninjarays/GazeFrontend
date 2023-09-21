import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import superAdminReducer from "./features/superAdmin/superAdminSlice"
import dashboardReducer from "./features/dashboard/dashboardSlice"
import rawMaterialReducer from "./features/rawMaterial/rawMaterialSlice";
import productReducer from "./features/products/productSlice";

export const store = configureStore(
    {
        reducer : {
            user:userReducer,
            admin:adminReducer,
            superAdmin:superAdminReducer,
            dashboard:dashboardReducer,
            rawMaterials:rawMaterialReducer,
            products:productReducer,
        }
    }
);
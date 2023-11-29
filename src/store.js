import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import superAdminReducer from "./features/superAdmin/superAdminSlice"
import dashboardReducer from "./features/dashboard/dashboardSlice"
import rawMaterialReducer from "./features/rawMaterial/rawMaterialSlice";
import productReducer from "./features/products/productSlice";
import trackingReducer from "./features/tracking/trackingSlice"
import orderReducer from "./features/orders/orderSlice";
import budgetReducer from "./features/budget/budgetSlice";
import salesReducer from "./features/sales/salesSlice";
import manufacturingReduces from "./features/manufacturing/manufacturingSlice";

export const store = configureStore(
    {
        reducer : {
            user:userReducer,
            admin:adminReducer,
            superAdmin:superAdminReducer,
            dashboard:dashboardReducer,
            rawMaterials:rawMaterialReducer,
            products:productReducer,
            tracking:trackingReducer,
            orders:orderReducer,
            budget:budgetReducer,
            sales:salesReducer,
            manufacturing:manufacturingReduces
        }
    }
);
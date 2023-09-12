import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import superAdminReducer from "./features/superAdmin/superAdminSlice"
import dashboardReducer from "./features/dashboard/dashboardSlice"

export const store = configureStore(
    {
        reducer : {
            user:userReducer,
            admin:adminReducer,
            superAdmin:superAdminReducer,
            dashboard:dashboardReducer
        }
    }
);
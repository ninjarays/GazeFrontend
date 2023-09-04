import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore(
    {
        reducer : {
            user:userReducer,
            admin:adminReducer
        }
    }
);

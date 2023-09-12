import { useSelector } from "react-redux"
import { Navigate, Outlet} from "react-router-dom"

export default StoreManagerRoutes = () => {
    const user = useSelector((state) => state.user.userInfo)
    const role = user ? user.userCred.role : "unregistered"
    const roles = ["super-admin", "admin", "store-manager"]
  return (
    roles.includes(role) ? <Outlet/> : <Navigate to='/login'/>
    )
}
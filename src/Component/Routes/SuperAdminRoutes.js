import { useSelector } from "react-redux"
import { Navigate, Outlet} from "react-router-dom"

export default SuperAdminRoutes = () => {
    const user = useSelector((state) => state.user.userInfo)
    const role = user ? user.userCred.role : "unregistered"
  return (
      role === "super-admin" ? <Outlet/> : <Navigate to='/login'/>
    )
}
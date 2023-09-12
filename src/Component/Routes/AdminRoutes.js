import { useSelector } from "react-redux"
import { Navigate, Outlet} from "react-router-dom"

const AdminRoutes = () => {
    const user = useSelector((state) => state.user.userInfo)
    const role = user ? user.userCred.role : "unregistered"
    const roles = ["super-admin", "admin"]
  return (
      roles.includes(role) ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default AdminRoutes

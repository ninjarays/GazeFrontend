import { Navigate, Outlet} from "react-router-dom"

export default ChefRoutes = (role) => {
    const roles = ["super-admin", "admin","store-manager", "chef"]
  return (
    roles.includes(role) ? <Outlet/> : <Navigate to='/login'/>
    )
}
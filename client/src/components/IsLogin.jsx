import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
    const { currentUser}=useSelector((state)=>state.user)

  return (
    currentUser?currentUser.isAdmin?<Navigate to='/adminProfile'/>:<Navigate to='/profile'/>:<Outlet/>
  )
}

 'react'

import { Outlet } from "react-router"
import NavBar from "../pages/shared/NavBar"
import Footer from "../pages/shared/Footer"

export default function RootLayout() {
  return (
    <div>
       <NavBar></NavBar>  
       <Outlet></Outlet>
       <Footer></Footer>

    </div>
  )
}

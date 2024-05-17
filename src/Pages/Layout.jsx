import React from 'react'
import SideBar from '../Components/SideBar/SideBar'
import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <div className ="grid h-screen w-screen grid-cols-[100px,1fr] overflow-hidden transition-all md:grid-cols-[240px,1fr]"> 
        <SideBar />
        <div className="overflow-auto bg-bg">
        <div className=" mx-auto max-w-screen-lg">
            <Outlet />
        </div>
        </div>
    </div>
  )
}

export default Layout
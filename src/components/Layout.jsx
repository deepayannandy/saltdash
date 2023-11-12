import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
function Layout() {
  
  return (
    <div className='flex flex-row bg-neutral-100 h-screen '>      
      <div className='p-4'>{<Outlet/>}</div>
    </div>
  )
}

export default Layout

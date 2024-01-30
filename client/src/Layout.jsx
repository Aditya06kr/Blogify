import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='whole'>
    <Header />
    <div id="main">
        <Outlet/>
    </div>
    </div>
  )
}

export default Layout
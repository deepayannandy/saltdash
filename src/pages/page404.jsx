import React from 'react'
import LogoImg from '../assets/logo.png'
const Page404 = () => {
  console.log("404")
  return (
    <div className='flex items-center justify-center bg-white shadow-md rounded font-2xl p-10'>
      <img className='p-5  ' src={LogoImg} alt=''/>
      Bad Request! This Page does not exist.
    </div>

  )
}

export default Page404
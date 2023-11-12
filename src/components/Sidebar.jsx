import {React, useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DASHBOARD_SIDEBAR_LINKS } from '../consts/navigation'
import LogoImg from '../assets/logo.png'
import miniLogoImg from '../assets/mini-logo.png'
import classNames from 'classnames'
import { BsArrowLeftShort } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
const linkClasses ='flex items-center gap-2 font-light px-3 py-2 hover:bg-orange-600 hover:no-underline active:bg-orange-200 rounded-md text-white'

function Sidebar() {
  const [open, setOpen] = useState(false);
  const {pathname} = useLocation()
  const navigate= useNavigate();
  const { isLogin , setisLogin}=useStateContext();
  function logout(){
    localStorage.clear();
    setisLogin(false);
    navigate('/Login');
  }
  
  return (
    <div className={`bg-gray-700  p-3 flex flex-col text-white relative duration-300 ${open ? "w-72" : "w-20"}`} style={{height: "100vh", position: "fixed", zIndex:"999", left: "0", top:"0"}} >
    <BsArrowLeftShort className={`bg-white text-gray-700 text-3xl rounded-full absolute -right-3  shadow-5xl shadow-inner top-20 border border-teal-300 cursor-pointer ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />
        <div className={`flex items-center gap-3 px-1 py-3 duration-300 `}>
        <img className='' src={open?LogoImg:miniLogoImg} alt=''/>
        </div>
        <div className={`flex-1 py-8 flex flex-col gap-0.5 duration-300 `}>
          {DASHBOARD_SIDEBAR_LINKS.map((item) =>(
            <Link to={item.path} className={classNames (pathname === item.path ? 'bg-orange-600 text-white' : '' , linkClasses)}>
      <span className={`${open?"text-xl":"text-2xl"}`}>{item.icon}</span>
      { open?item.label:""}
    </Link>
          ))}
        </div>
        <div className={`flex flex-col gap-0.5 pt-2 border-t border-gray-300 duration-300 `}>
          <button onClick={logout}>Log Out</button>
        </div>
    </div>
  )
}


export default Sidebar

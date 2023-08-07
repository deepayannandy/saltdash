import React,{useEffect}  from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {Dashboard,Appointment,Services, Customers, Login, ForgotPassword,AddAppointment,AddClients,AddEmployees,AddMemberships,AddPackages,AddServices,Membership,Packages,Employees, page404} from "./pages"
import { Header,Sidebar } from './components';
import { useStateContext } from './contexts/ContextProvider';
import Page404 from './pages/page404';

const App = () => {
    const { isLogin , setisLogin}=useStateContext();
  useEffect(()=>{
  if (localStorage.getItem('userinfo')){
    setisLogin(true);
  }
  }
  )
  return (
    <div>
        <BrowserRouter>
            <div className='flex relative bg-neutral-100 w-screen h-screen'>
        {isLogin?
          <Sidebar/>
        :<div/>}
      <div className='flex-1'>
      {isLogin?
          <Header/>
        :<div/>}
        <div className= {isLogin? 'p-4':""}>
            <Routes>
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path='/appointment' element={<Appointment/>}/>
              <Route path='/services' element={<Services/>}/>
              <Route path='/customers' element={<Customers/>}/>
              <Route path='/Login' element={<Login/>}/>
              <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
              <Route path='/AddAppointment' element={<AddAppointment/>}/>
              <Route path='/addcustomers' element={<AddClients/>}/>
              <Route path='/AddEmployees' element={<AddEmployees/>}/>
              <Route path='/AddMemberships' element={<AddMemberships/>}/>
              <Route path='/AddPackages' element={<AddPackages/>}/>
              <Route path='/AddServices' element={<AddServices/>}/>
              <Route path='/Membership' element={<Membership/>}/>
              <Route path='/Packages' element={<Packages/>}/>
              <Route path='/Employees' element={<Employees/>}/>
              <Route path='*' element={<Page404/>}/>
            </Routes>
            </div>
            </div>
            </div>
        </BrowserRouter>
    </div>
  )
}

export default App
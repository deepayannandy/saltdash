import React , { useEffect, useState,useRef } from 'react';
import '../index.css';
import { ScheduleComponent, Inject,  Day, Month, Week,  } from '@syncfusion/ej2-react-schedule';
import { useNavigate,createSearchParams,Link } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert';


function Appointment() {
  const [userid, setuserid] = React.useState([]);
  const navigate= useNavigate();
  const scheduleObj = useRef(null);
  const [appointments, setappointments] = React.useState([]);
  const navigatetoadd=()=>{
    navigate({pathname:"/addappointment", search:createSearchParams({id: "new"}).toString()});
  }
  function handel(event){
    console.log(event)
  }
  useEffect(()=>{
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })
  const onActionBegin = (args) => {
    console.log(args)
    if (args.requestType === 'eventRemove') {
      console.log(args)
      axios.delete("https://devapi.saltworld.co/api/schedule/"+args.data[0].sid).then((response)=>{
             swal("Poof! "+args.data.title+" has been deleted!", {
              icon: "success",
            })
            getschedules();
    }).catch((e)=>{
      swal(e, {
        icon: "error",
      })
    });
    }
    if (args.requestType === 'eventChange') {
      console.log(args.data)
      axios.patch('https://devapi.saltworld.co/api/schedule/'+ args.data.sid, args.data, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+args.data.title+" has been successfully updated!", {
                icon: "success",
              })
              getschedules();
    
            }).catch((error)=>{
                if(error.response){
                    if(error.response.data["message"]!=undefined){
                    swal("Oho! \n"+error.response.data["message"], {
                      icon: "error",
                    })
                    }
                }
            })
      }
    }
  const getschedules= ()=>
    {
      axios.get("https://devapi.saltworld.co/api/schedule/").then((response)=>{
          let schedule=[]
          for (let id in response.data){
            schedule.push({sid : response.data[id]._id,Subject: response.data[id].title,StartTime:new Date(response.data[id].startdatetime),EndTime:new Date(response.data[id].enddatetime),Location:response.data[id].location})
          }
          console.log(schedule)
          setappointments(schedule);
      })
    }
    useEffect(()=>{
      getschedules()
    },[])
    return (
      <div className="w-full">
        <div className='flex-direction: column'> 
        <span className='p-4 font-weight: inherit; text-2xl'>Appoinments</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
      </div>
      <ScheduleComponent height={'650px'} ref={scheduleObj} actionBegin={onActionBegin.bind(this)} enablePersistence= "true" currentView='Day'  timezone='Asia/Calcutta' width='100%' views= {['Day','Week', 'Month',]} resourceHeaderTemplate={handel} eventSettings={{ dataSource:appointments }} selectedDate={new Date()}  > 
        <Inject services={[Day,Week, Month]} />
        
      </ScheduleComponent>  
      </div>
    );
  }

   

export default Appointment;
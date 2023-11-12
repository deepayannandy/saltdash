import React , { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate ,useSearchParams} from 'react-router-dom'
import { Input,Header,InputSelect,MembershipCard,InputSelectFilter, InputSearch} from '../form_components'
import swal from 'sweetalert';
import { BsArrowLeftShort } from 'react-icons/bs'



function AddAppointment() {
  const navigate= useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const [userid, setuserid] = React.useState([]);
  const [ScheduleDate, setScheduleDate] = React.useState([]);
  const [ServiceCategory, setServiceCategory] = React.useState([]);
  const [personcount, setpersoncount] = React.useState(1);
  const [Duration, setDuration] = React.useState([]);
  const [ResourceType, setResourceType] = React.useState([]);
  const [clientlist, setclientlist] = React.useState([]);
  const [clientData, setclientData] = React.useState([]);
  const [selectedClient,setselectedClient]=React.useState(null);
  const [services,setservices]=React.useState([]);
  const [selectedservices,setselectedservices]=React.useState(null);
  const [ismembership,setismembership]=React.useState(false);
  const [rdata] =  useSearchParams();
  const [webservices,setwebservices]=React.useState([]);
  const [searchdata,setsearchdata]=React.useState([]);
  const [time,settime]=React.useState([]);
  const [existingschedule,setexistingschedule]=React.useState(null);
  const [branchs, setbranchs] = React.useState([]);
  const getbranchList= ()=>
    {
      axios.get("https://devapi.saltworld.co/api/branchs/").then((response)=>{
          let cllist=[]
          for (let client in response.data){
              cllist.push(response.data[client].BranchName)
          }
          console.log(cllist)
          setbranchs(cllist);
      })
    }
    useEffect(()=>{
      getbranchList()
    },[])
  useEffect(()=>{
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })
    const getclientlist= ()=>
    {
      axios.get("https://devapi.saltworld.co/api/clients/").then((response)=>{
          let cllist=[]
          for (let client in response.data){
              cllist.push({label: response.data[client].FirstName+" "+response.data[client].LastName+" ("+response.data[client].MobileNumber+")",value:response.data[client]._id})
          }
          console.log(cllist)
          setclientlist(cllist);
      })
    }
    useEffect(()=>{
      getclientlist()
    },[])

    const getsercicedata= ()=>
    {
      if(rdata.get("id")!="new"){
      axios.get("https://devapi.saltworld.co/api/services/"+rdata.get("id").toString()).then((response)=>{
        setScheduleDate(response.data.ScheduleDate);
        setServiceCategory(response.data.ServiceCategory)
        setDuration(response.data.Duration)
        setResourceType(response.data.ResourceType)
      }).catch((e)=>{
        swal("Oho! \n"+e, {
          icon: "error",
        })
      })
    }
    }
    useEffect(()=>{
      getsercicedata()
    },[])
   
  const navigateback=()=>{
   navigate("/services")
  }
const inputs=[
  {
      id:1,
      name:"Date",
      type:"date",
      placeholder:"Date",
      value:ScheduleDate,
      onChange:((event)=>{
        setScheduleDate(event.target.value)})
  },
  {
      id:2,
      name:"personcount",
      type:"number",
      placeholder:"Person Count",
      value:personcount,
      onChange:((event)=>{
        setpersoncount(event.target.value)})
  },

  {
      id:3,
      name:"Duration",
      type:"number",
      placeholder:"Duration",
      value:Duration,
      onChange:((event)=>{
        setDuration(event.target.value)})
  },
  {
    id:4,
    name:"Time",
    type:"time",
    placeholder:"Time",
    value:time,
    onChange:((event)=>{
      settime(event.target.value)})
},
  ,]
  const handleSubmit=async (e)=>{
    seterrormessage("")
    e.preventDefault();
    const data= new FormData(e.target)
    let recievedData=Object.fromEntries(data.entries());
    recievedData.agentid=userid;
    recievedData.startdatetime=ScheduleDate+" "+time;
    recievedData.resource=selectedservices.ResourceType;
    recievedData.clientname=selectedClient.FirstName+" "+selectedClient.LastName;
    console.log(recievedData)
    swal({
      title: "Are you sure?",
      text: "You want to user this timeslot "+ScheduleDate+" "+time,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
    if(rdata.get("id")=="new") {
      axios.post('https://devapi.saltworld.co/api/schedule/', recievedData, {
        headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
        }).then((data) => {
          swal("Yes! The appointment for "+recievedData.clientname+" has been successfully booked on "+recievedData.startdatetime, {
            icon: "success",
          })
            navigate('/appointment');

        }).catch((error)=>{
            if(error.response){ 
                seterrormessage(error.response.data);
                if(error.response.data["message"]!=undefined){
                seterrormessage(error.response.data["message"]);
                swal("Oho! \n"+error.response.data["message"], {
                  icon: "error",
                })
                }
            }
        })}
        else{
          axios.patch('https://devapi.saltworld.co/api/schedule/'+rdata.get("id"), recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+recievedData.ServiceName+" has been successfully updated!", {
                icon: "success",
              })
                navigate('/appointment');
    
            }).catch((error)=>{
                if(error.response){ 
                    seterrormessage(error.response.data);
                    if(error.response.data["message"]!=undefined){
                    seterrormessage(error.response.data["message"]);
                    swal("Oho! \n"+error.response.data["message"], {
                      icon: "error",
                    })
                    }
                }
            })
        }})
  }
  function handleinputchange(event){
    console.log(event)
    if(event.length){
    axios.get("https://devapi.saltworld.co/api/clients/search/"+event).then((response)=>{
          let cllist=[]
          for (let client in response.data){
              cllist.push({label: response.data[client].FirstName+" "+response.data[client].LastName+" ("+response.data[client].MobileNumber+")",value:response.data[client]._id})
          }
          console.log(cllist)
          setclientlist(cllist);
      })}
      else{
        axios.get("https://devapi.saltworld.co/api/clients/").then((response)=>{
          let cllist=[]
          for (let client in response.data){
              cllist.push({label: response.data[client].FirstName+" "+response.data[client].LastName+" ("+response.data[client].MobileNumber+")",value:response.data[client]._id})
          }
          console.log(cllist)
          setclientlist(cllist);
      })
      }
  }
  function handelclientselect(event){
    console.log(event.value)
    axios.get("https://devapi.saltworld.co/api/clients/"+event.value).then((response)=>{
      let data=response.data;
          console.log(data)
          setclientData(data);
          setselectedClient(data);
    
    if(data.Memberships!=null){
      let servislist=[]
      data.Memberships.services.map((element)=>{servislist.push(element.ServiceName+" ("+data.Memberships.MembershipName+")")})
      setservices(servislist)
      setismembership(true)
      setselectedservices(data.Memberships.services[0])
      setDuration(data.Memberships.services[0].Duration)
    }
    else{
      setismembership(false)
      axios.get("https://devapi.saltworld.co/api/services/").then((response)=>{
        let servislist=[]
        let webservislist=[]
        response.data.forEach(element => {
          servislist.push(element.ServiceName)
          webservislist.push(element)
        });
        setservices(servislist)
        setwebservices(webservislist)
        setselectedservices(webservislist[0])
        setDuration(webservislist[0].Duration)
      }).catch((e)=>{
        swal("Oho! \n"+e, {
          icon: "error",
        })
      })
      setservices([])
    }
  })

  }
  function handelserviceselect(event){
    if(ismembership==true){
    setselectedservices(selectedClient.Memberships.services.at(services.indexOf(event.target.value)))
    setDuration(selectedClient.Memberships.services.at(services.indexOf(event.target.value)).Duration)}
    else{
      setselectedservices(webservices.at(services.indexOf(event.target.value)))
      console.log(webservices.at(services.indexOf(event.target.value)))
      setDuration(webservices.at(services.indexOf(event.target.value)).Duration)
    }
  }
  function searchSlots (){
    console.log("Date: "+ScheduleDate+" "+time+" Type: "+selectedservices.ResourceType+" Duration: "+ Duration)
    axios.get("https://devapi.saltworld.co/api/schedule/existing/"+ScheduleDate+" "+time+"&"+selectedservices.ResourceType+"&"+Duration).then((response)=>{
      let avschedule=[]
      for (let client in response.data){
        avschedule.push(response.data[client])
      }
      console.log(avschedule)
      setexistingschedule(avschedule);
      })
  }
  return (
    <div className="  justify-center">
      { errormessage.length>0?
        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 " role="alert">
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
          </div>:<div/>}
        <form onSubmit={handleSubmit} className=' bg-white p-8 px-8 rounded-lg'>
        <BsArrowLeftShort style={{left:"107px",}} className="text-gray-700 text-3xl mt-5  absolute left-23.1 top-20 cursor-pointer " onClick={() => navigate(-1)} />
        <Header title={rdata.get("id")=="new"? "Schedule an Appointment":"Reschedule"}/>
        <div className=' grid justify-items-stretch grid-cols-3 gap-4'>
        <div class="col-span-2 ..."> <InputSearch options={clientlist} value="Select" name="Client" placeholder="Client" onchange={handelclientselect} defaultvalue={searchdata} onInputChange={handleinputchange} /></div>
        {selectedClient!=null? selectedClient.Memberships!=undefined? <MembershipCard title={selectedClient.Memberships.MembershipName}  ></MembershipCard>: <MembershipCard title={"No Membership found"}/>:<div/>}
        </div>
       <div className=' grid justify-items-stretch grid-cols-5 gap-4'>
        <InputSelect name="SelectedService" placeholder="Service" options={services} onchange={ handelserviceselect }></InputSelect>
        <Input key={inputs[2].id} {...inputs[2]}></Input>
        <Input key={inputs[0].id} {...inputs[0]}></Input>
        <Input key={inputs[3].id} {...inputs[3]}></Input>
        <button className='w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="button" onClick={searchSlots}>Search Available Slots</button>
        </div>
        <div className=' grid justify-items-stretch grid-cols-4 gap-1'>
        {existingschedule!=null? existingschedule.map((schedule)=>(<MembershipCard title={schedule.title} />)) :<div/>}
        </div>
          <div className=' grid justify-items-stretch grid-cols-3 gap-4'>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <InputSelect name="location" placeholder="Branch" options={branchs}></InputSelect>
          </div>
          
            <button className='w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="submit">{rdata.get("id")=="new"? ismembership==true?"Deduct from Membership & Schedule":"Schedule":"Reschedule"}</button>
       
        </form>

        
      </div>
      
      
  )
}

export default AddAppointment

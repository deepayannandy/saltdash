import React , { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate ,useSearchParams} from 'react-router-dom'
import { Input,Header,InputSelect} from '../form_components'
import swal from 'sweetalert';


function AddServices() {
  const navigate= useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const [userid, setuserid] = React.useState([]);
  const [servicename, setservicename] = React.useState([]);
  const [ServiceCategory, setServiceCategory] = React.useState([]);
  const [Duration, setDuration] = React.useState([]);
  const [ServiceCost, setServiceCost] = React.useState([]);
  const [SellingCost, setSellingCost] = React.useState([]);
  const [ServiceDescription, setServiceDescription] = React.useState([]);
  const [Taxrate, setTaxrate] = React.useState([]);
  const [Branch, setBranch] = React.useState([]);
  const [ResourceType, setResourceType] = React.useState([]);
  const [HsnCode, setHsnCode] = React.useState([]);
  const [branchs, setbranchs] = React.useState([]);
  const [rdata] =  useSearchParams();
  

  useEffect(()=>{
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })
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

    const getsercicedata= ()=>
    {
      if(rdata.get("id")!="new"){
      axios.get("https://devapi.saltworld.co/api/services/"+rdata.get("id").toString()).then((response)=>{
        setservicename(response.data.ServiceName);
        setServiceCategory(response.data.ServiceCategory)
        setServiceCost(response.data.ServiceCost)
        setDuration(response.data.Duration)
        setHsnCode(response.data.HsnCode)
        setSellingCost(response.data.SellingCost)
        setTaxrate(response.data.Taxrate)
        setBranch(response.data.Branch)
        setServiceDescription(response.data.ServiceDescription)
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
      name:"ServiceName",
      type:"text",
      placeholder:"Service Name",
      value:servicename,
      onChange:((event)=>{
        setservicename(event.target.value)})
  },
  {
      id:2,
      name:"ServiceCategory",
      type:"text",
      placeholder:"Service Category",
      value:ServiceCategory,
      onChange:((event)=>{
        setServiceCategory(event.target.value)})
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
      name:"ServiceCost",
      type:"number",
      placeholder:"Service Cost", 
      value:ServiceCost,
      onChange:((event)=>{
        setServiceCost(event.target.value)})
  },
  {
      id:5,
      name:"SellingCost",
      type:"number",
      placeholder:"Selling Cost",
      value:SellingCost,
      onChange:((event)=>{
        setSellingCost(event.target.value)})
  },
  {
      id:6,
      name:"Taxrate",
      type:"text",
      placeholder:"Tax rate",
      value:Taxrate,
      onChange:((event)=>{
        setTaxrate(event.target.value)})
  },
  {
    id:7,
    name:"HsnCode",
    type:"text",
    placeholder:"HSN Code",
    value:HsnCode,
    onChange:((event)=>{
      setHsnCode(event.target.value)})
  },
  ,]
  const handleSubmit=async (e)=>{
    seterrormessage("")
    e.preventDefault();
    const data= new FormData(e.target)
    let recievedData=Object.fromEntries(data.entries());
    recievedData.userid=userid;
    console.log(recievedData)
    if(rdata.get("id")=="new") {
      axios.post('https://devapi.saltworld.co/api/services/', recievedData, {
        headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
        }).then((data) => {
          swal("Yes! "+recievedData.ServiceName+" has been successfully added!", {
            icon: "success",
          })
            navigate('/services');

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
          axios.patch('https://devapi.saltworld.co/api/services/'+rdata.get("id"), recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+recievedData.ServiceName+" has been successfully updated!", {
                icon: "success",
              })
                navigate('/services');
    
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
        }
  }
  return (
    <div className="  justify-center">
      { errormessage.length>0?
        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 " role="alert">
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
          </div>:<div/>}
        <form onSubmit={handleSubmit} className=' bg-white p-8 px-8 rounded-lg'>
        <Header category="Page" title={rdata.get("id")=="new"? "Crearte a new service":"Edit Service"}/>
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <label class="block text-gray-700 text-sm font-bold mb-2">ServiceDescription</label>
          <textarea name="ServiceDescription" value={ServiceDescription} onChange={((event)=>{ setServiceDescription(event.target.value)})} placeholder="Service Description" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"/>
          <div className=' grid justify-items-stretch grid-cols-6 gap-4'>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          <Input key={inputs[5].id} {...inputs[5]}></Input>
          <Input key={inputs[6].id} {...inputs[6]}></Input>
          </div>
          {rdata.get("id")=="new"? <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <InputSelect name="Branch" placeholder="Branch" options={branchs}></InputSelect>
          <InputSelect name="ResourceType" placeholder="ResourceType" options={["FLOAT TANK", "SALT CAVE", "SAUNA"]}></InputSelect>
          </div>:
          <div className='pt-4 grid justify-items-stretch grid-cols-2 gap-4'>
           <p className="text-lg text-slate-700">Branch: {Branch}</p>
           <p className="text-lg text-slate-700">ResourceType: {ResourceType}</p>
           </div>
          }
            <button className='w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="submit">{rdata.get("id")=="new"? "Submit":"Update"}</button>
        </form>
        
      </div>
      
      
  )
}

export default AddServices

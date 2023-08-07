import React , { useEffect, useState } from 'react';
import axios from 'axios'
import { Input,Header,InputSelect} from '../form_components'
import { useNavigate ,useSearchParams} from 'react-router-dom'
import swal from 'sweetalert';

function AddClients() {
  const navigate= useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const [userid, setuserid] = React.useState([]);
  const [branchs, setbranchs] = React.useState([]);
  const [clienttype, setclienttype] = React.useState("Individual");
  const [rdata] =  useSearchParams();
  const  [FirstName, setFirstName]= React.useState([]);
  const  [LastName, setLastName]= React.useState([]);
  const  [Email, setEmail]= React.useState([]);
  const  [MobileNumber, setMobileNumber]= React.useState([]);
  const  [DateofBirth, setDateofBirth]= React.useState([]);
  const  [Anniversary, setAnniversary]= React.useState([]);
  const  [Occupation, setOccupation]= React.useState([]);
  const  [ClientSource, setClientSource]= React.useState([]);
  const  [gender, setgender]= React.useState([]);
  const  [PAN, setPAN]= React.useState([]);
  const  [GST, setGST]= React.useState([]);
  const  [CompanyLegalName, setCompanyLegalName]= React.useState([]);
  const  [CompanyTradeName, setCompanyTradeName]= React.useState([]);
  const  [BillingAddress, setBillingAddress]= React.useState([]);
  const  [ShippingAddress, setShippingAddress]= React.useState([]);
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
    const getclientsdata= ()=>
    {
      if(rdata.get("id")!="new"){
      axios.get("https://devapi.saltworld.co/api/clients/"+rdata.get("id").toString()).then((response)=>{
        setFirstName(response.data.FirstName);
        setLastName(response.data.LastName)
        setEmail(response.data.Email)
        setMobileNumber(response.data.MobileNumber)
        setDateofBirth(response.data.DateofBirth)
        setAnniversary(response.data.Anniversary)
        setOccupation(response.data.Occupation)
        setGST(response.data.GST)
        setPAN(response.data.PAN)
        setclienttype(response.data.ClientType)
        setClientSource(response.data.ClientSource)
        setCompanyLegalName(response.data.CompanyLegalName)
        setCompanyTradeName(response.data.CompanyTradeName)
        setgender(response.data.Gender)
        setShippingAddress(response.data.ShippingAddress)
        setBillingAddress(response.data.BillingAddress)
      }).catch((e)=>{
        swal("Oho! \n"+e, {
          icon: "error",
        })
      })
    }
    }
    useEffect(()=>{
      getclientsdata()
    },[])
const inputs=[
  {
      id:1,
      name:"FirstName",
      type:"text",
      placeholder:"First Name",
      value:FirstName,
      onChange:((event)=>{
        setFirstName(event.target.value)})
  },
  {
      id:2,
      name:"LastName",
      type:"text",
      placeholder:"Last Name",
      value:LastName,
      onChange:((event)=>{
        setLastName(event.target.value)})
  },
  {
      id:3,
      name:"MobileNumber",
      type:"text",
      placeholder:"MobileNumber",
      value:MobileNumber,
      onChange:((event)=>{
        setMobileNumber(event.target.value)})
  },
  {
      id:4,
      name:"Email",
      type:"text",
      placeholder:"Email", 
      value:Email,
      onChange:((event)=>{
        setEmail(event.target.value)})
  },
  {
      id:5,
      name:"DateofBirth",
      type:"date",
      placeholder:"DateofBirth",
      value:DateofBirth,
      onChange:((event)=>{
        setDateofBirth(event.target.value)})
  },
  {
      id:6,
      name:"Anniversary",
      type:"date",
      placeholder:"Anniversary",
      value:Anniversary,
      onChange:((event)=>{
        setAnniversary(event.target.value)})
  },
  {
    id:7,
    name:"Occupation",
    type:"text",
    placeholder:"Occupation",
    value:Occupation,
      onChange:((event)=>{
        setOccupation(event.target.value)})
  },
  {
    id:8,
    name:"ClientSource",
    type:"text",
    placeholder:"ClientSource",
    value:ClientSource,
      onChange:((event)=>{
        setClientSource(event.target.value)})
  },
  {
    id:8,
    name:"PAN",
    type:"text",
    placeholder:"PAN",
    value:PAN,
    onChange:((event)=>{
      setPAN(event.target.value)})
  },
  {
    id:8,
    name:"GST",
    type:"text",
    placeholder:"GST",
    value:GST,
    onChange:((event)=>{
      setGST(event.target.value)})
  },
  {
    id:8,
    name:"CompanyLegalName",
    type:"text",
    placeholder:"CompanyLegalName",
    value:CompanyLegalName,
    onChange:((event)=>{
      setCompanyLegalName(event.target.value)})
  },
  {
    id:8,
    name:"CompanyTradeName",
    type:"text",
    placeholder:"CompanyTradeName",
    value:CompanyTradeName,
    onChange:((event)=>{
      setCompanyTradeName(event.target.value)})
  },

  ,]
  const handleSubmit=async (e)=>{
    seterrormessage("")
    e.preventDefault();
    const data= new FormData(e.target)
    let recievedData=Object.fromEntries(data.entries());
    recievedData.userid=userid;
    console.log(recievedData)
    if(rdata.get("id")=="new"){
    axios.post('https://devapi.saltworld.co/api/clients/', recievedData, {
        headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
        }).then((data) => {
          swal("Yes! "+recievedData.FirstName+" has been successfully registered!", {
            icon: "success",
          })
            navigate('/customers');
        }).catch((error)=>{
            if(error.response){
                seterrormessage(error.response.data);
                if(error.response.data["message"]!=undefined){
                seterrormessage(error.response.data["message"]);
                }
            }
        })}
        else{
          axios.patch('https://devapi.saltworld.co/api/clients/'+rdata.get("id"), recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! user data for "+recievedData.FirstName+" has been successfully updated!", {
                icon: "success",
              })
                navigate('/customers');
    
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
  const setService =(e)=>{
    setclienttype(e.target.value);
  }
  return (
    <div className="  justify-center">
      { errormessage.length>0?
        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 " role="alert">
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
          </div>:<div/>}
        <form onSubmit={handleSubmit} className=' bg-white p-8 px-8 rounded-lg'>
        <Header category="Page" title= {rdata.get("id")=="new"?"Crearte a new Client":"Edit Client Details"} />
        <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
        </div>
          
          <div className=' grid justify-items-stretch grid-cols-5 gap-4'>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          <Input key={inputs[5].id} {...inputs[5]}></Input>
          {rdata.get("id")=="new"?<InputSelect name="Gender" placeholder="Gender" options={["Male","Female","Others"]}></InputSelect>:<Input  name ="Gneder" type= "text" placeholder="Gneder" value ={gender}></Input>}
          </div>
          <div className=' grid justify-items-stretch grid-cols-3 gap-4'>
          <Input key={inputs[6].id} {...inputs[6]}></Input>
          <Input key={inputs[7].id} {...inputs[7]}></Input>
          {rdata.get("id")=="new"?
          <div>
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Client Type
            </label>
              <div class="relative">
                <select name="ClientType" onChange = {setService} class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2" id="grid-state">
                { ["Individual","Business"].map((option)=>(
                              <option>{option}</option>
                          ))
                      }
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                 <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
               </div>
              </div>
            </div>:<Input  name ="ClientType" type= "text" placeholder="Client Type" value ={clienttype}></Input>}
          </div>
          {
            clienttype=="Business"? <div className=' grid justify-items-stretch grid-cols-4 gap-4'>
            <Input key={inputs[8].id} {...inputs[8]}></Input>
            <Input key={inputs[9].id} {...inputs[9]}></Input>
            <Input key={inputs[10].id} {...inputs[10]}></Input>
            <Input key={inputs[11].id} {...inputs[11]}></Input>
            </div>:<div/>
          }
          <div className='grid justify-items-stretch grid-cols-2 pt-3 gap-4'>
          <dev className="flex">
          <label class="block text-gray-700 text-sm font-bold mb-2">Billing Address</label>
          <textarea name="BillingAddress" placeholder="BillingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={BillingAddress} onChange={((event)=>{setBillingAddress(event.target.value)})}/>
          </dev>
          <dev className="flex">
          <label class="block text-gray-700 text-sm font-bold mb-2">Shipping Address</label>
          <textarea name="ShippingAddress" placeholder="ShippingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={ShippingAddress} onChange={((event)=>{setShippingAddress(event.target.value)})}/>
          </dev>
          </div>
          <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <InputSelect name="ParentBranchId" placeholder="Branch" options={branchs}></InputSelect>
          </div>
            <button className='w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="submit">{rdata.get("id")=="new"?"SUBMIT":"Update"}</button>
        </form>
        
      </div>
      
      
  )
}

export default AddClients

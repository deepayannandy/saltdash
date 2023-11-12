import React , { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate ,useSearchParams} from 'react-router-dom'
import { Input,Header,InputSelect} from '../form_components'
import swal from 'sweetalert';
import { BsArrowLeftShort } from 'react-icons/bs'
function AddPackages() {
  const state = {
    button: 1
  };
  const editing ={allowEditing: true};
  const navigate= useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport',  'Edit'];
  const [userid, setuserid] = React.useState([]);
  const [branchs, setbranchs] = React.useState([]);
  const [services, setservices] = React.useState([]);
  const [servicename, setservicename] = React.useState([]);
  const [selectedservice, setselectedservice] = React.useState([]);
  const [srs, setsrs] = React.useState(new Map());
  const [rdata] =  useSearchParams();

  const [PackageName, setPackageName] = React.useState([]);
  const [ServiceCategory, setServiceCategory] = React.useState([]);
  const [Duration, setDuration] = React.useState([]);
  const [ServiceCost, setServiceCost] = React.useState([]);
  const [SellingCost, setSellingCost] = React.useState([]);
  const [PackageDescription, setPackageDescription] = React.useState([]);
  const [Taxrate, setTaxrate] = React.useState([]);
  const [Branch, setBranch] = React.useState([]);
  const [HsnCode, setHsnCode] = React.useState([]);

  let selected=""
  var service= new Map()
  useEffect(()=>{
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })
  const getservicedata= ()=>
  {
    axios.get("https://devapi.saltworld.co/api/services/",).then((response)=>{
      setservices(response.data);
      let servicen=["Select"]
      console.log( response.data)
      for (let id in response.data){
        console.log( response.data[id])
        service.set(response.data[id].ServiceName,response.data[id])
        servicen.push(response.data[id].ServiceName)
    }
    setservicename(servicen)
    console.log(service)
    setsrs(service)
    })
  }
  useEffect(()=>{
    getservicedata()
  },[])

  const getsercicedata= ()=>
  {
    if(rdata.get("id")!="new"){
    axios.get("https://devapi.saltworld.co/api/servicepackages/"+rdata.get("id").toString()).then((response)=>{
      console.log(response.data.ServiceName)
      setPackageName(response.data.PackageName);
      setServiceCategory(response.data.ServiceCategory)
      setServiceCost(response.data.ServiceCost)
      setDuration(response.data.Duration)
      setHsnCode(response.data.HsnCode)
      setSellingCost(response.data.SellingCost)
      setTaxrate(response.data.Taxrate)
      setBranch(response.data.Branch)
      setPackageDescription(response.data.PackageDescription)
      setselectedservice(response.data.ServicesId)
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

  useEffect(()=>{
    if (!localStorage.getItem('userinfo')){
      // console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    console.log(token)
    })
    const getbranchList= ()=>
    {
      axios.get("https://devapi.saltworld.co/api/branchs/").then((response)=>{
          let cllist=[]
          for (let client in response.data){
              cllist.push(response.data[client].BranchName)
          }
          // console.log(cllist)
          setbranchs(cllist);
      })
    }
    useEffect(()=>{
      getbranchList()
    },[])
    const inputs=[
      {
          id:1,
          name:"PackageName",
          type:"text",
          placeholder:"Package Name",
          value:PackageName,
          onChange:((event)=>{
            setPackageName(event.target.value)})
      },
      {
          id:2,
          name:"ServiceCost",
          type:"number",
          placeholder:"ServiceCost",
          value:ServiceCost,
          onChange:((event)=>{
            setServiceCost(event.target.value)})
      },
      {
        id:3,
        name:"SellingCost",
        type:"number",
        placeholder:"SellingCost",
        value:SellingCost,
          onChange:((event)=>{
            setSellingCost(event.target.value)})
    },
    {
      id:4,
      name:"HsnCode",
      type:"text",
      placeholder:"HSN Code",
      value:HsnCode,
          onChange:((event)=>{
            setHsnCode(event.target.value)})
    },
    {
      id:5,
      name:"Taxrate",
      type:"number",
      placeholder:"Tax",
      value:Taxrate,
          onChange:((event)=>{
            setTaxrate(event.target.value)})
    },
      {
          id:6,
          name:"Duration",
          type:"number",
          placeholder:"Duration",
          value:Duration,
          onChange:((event)=>{
            setDuration(event.target.value)})
      },
      ,]
      const handleSubmit=async (e)=>{
        seterrormessage("")
        e.preventDefault();
        if (state.button === 2) {
          console.log("Button Submit clicked!");
        
        console.log(e)
        const data= new FormData(e.target)
        let recievedData=Object.fromEntries(data.entries());
        recievedData.ServicesId=selectedservice
        console.log(recievedData)
        if(rdata.get("id")=="new"){
        axios.post('https://devapi.saltworld.co/api/servicepackages', recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+recievedData.PackageName+" has been successfully Added!", {
                icon: "success",
              })
                navigate('/packages');
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
              axios.patch('https://devapi.saltworld.co/api/servicepackages/'+rdata.get("id"), recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+recievedData.PackageName+" has been successfully Updated!", {
                icon: "success",
              })
                navigate('/packages');
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
      }
      const setService =(e)=>{
        selected=e.target.value;
      }
      const addequipments=(e)=>{
        if(selected.length>1 &&  selected!="Select"){
        console.log(selected)
        console.log(srs)
        console.log(srs.get(selected))
        setselectedservice([...selectedservice,srs.get(selected)])
        }
      }
      function removeservice(service){
        let newlist=selectedservice.filter(li=> li.ServiceName!== service)
        setselectedservice(newlist)
      }
  return (
    // <div className="flex flex-row gap-1">
    <div className="  justify-center">
      { errormessage.length>0?
        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 " role="alert">
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
          </div>:<div/>}
        <form onSubmit={handleSubmit} className=' bg-white p-8 px-8 rounded-lg'>
        <BsArrowLeftShort style={{left:"107px"}} className="text-gray-700 text-3xl mt-5 absolute left-23.1 top-20 cursor-pointer" onClick={() => navigate(-1)} />
        <Header title= {rdata.get("id")=="new"? "Create a new Package":"Edit Package"} />
        <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <InputSelect name="Branch" placeholder="Package Branch" options={branchs}></InputSelect>
          
          </div>
          <div className=''><label class="block text-gray-700 text-sm font-bold mb-2">Package Description</label>
          <textarea name="PackageDescription" value={PackageDescription} onChange={((event)=>{ setPackageDescription(event.target.value)})} placeholder="Package Description" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"/>
          </div>
          <div className=' grid justify-items-stretch grid-cols-4 gap-4'>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          
          </div>
          <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <div>
          
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Select Service
            </label>
            <div class="relative">
              <select name="SelectService" onChange = {setService} class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2" id="grid-state">
              { servicename.map((option)=>(
                              <option>{option}</option>
                          ))
                      }
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <button className='w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="button" onClick={addequipments}>Add</button>
          </div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Added Services</label>
          <div class="p-1">
          <table class="w-5/6  border">
          <thead>
            <tr>
            <th class="font-bold py-2 px-4 border-b border-l border-r text-left">Service Name</th>
            <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">Duration</th>
            <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">Price</th>
            <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          { selectedservice.map((sr)=>(
                                    <tr>
                                        <td class="border border-slate-700 ...">{sr.ServiceName}</td>
                                        <td class="border border-slate-700 ...">{sr.Duration}</td>
                                        <td class="border border-slate-700 ...">{sr.SellingCost}</td>
                                        <td class="border border-slate-700 ..."><button
      type="delete"
      style={{ background: "#B22222" }}
      className="button text-white py-1 px-2 capitalize rounded-2xl text-md"
      onClick={()=>{removeservice(sr.ServiceName)}}
    >
     Remove
    </button></td></tr>))
                    }
          </tbody>
          </table>
      </div>
      <button className='w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' onClick={() => (state.button = 2)} type="submit">{rdata.get("id")=="new"? "Submit" : "Update"}</button> 
          
      </form>
      </div>
  )
  
}

export default AddPackages

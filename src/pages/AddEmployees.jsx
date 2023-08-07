import React , { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate ,useSearchParams} from 'react-router-dom'
import { Input,Header,InputSelect} from '../form_components'
import swal from 'sweetalert';

function AddEmployees() {
  const editing ={allowEditing: true};
  const navigate= useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport',  'Edit'];
  const [userid, setuserid] = React.useState([]);
  const [branchs, setbranchs] = React.useState([]);
  const [rdata] =  useSearchParams();
  const [firstname, setfirstname] = React.useState([]);
  const [lastname, setlastname] = React.useState([]);
  const [email, setemail] = React.useState([]);
  const [mob, setmob] = React.useState([]);
  useEffect(()=>{
    
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })

  useEffect(()=>{
    
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    console.log(token)
    })
    const navigatetoadd=()=>{
      navigate("/addservices");
    }
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
    const getuserdata= ()=>
    {
      if(rdata.get("id")!="new"){
      axios.get("https://devapi.saltworld.co/api/user/"+rdata.get("id").toString()).then((response)=>{
        setfirstname(response.data.FirstName);
        setlastname(response.data.LastName)
        setemail(response.data.email)
        setmob(response.data.mobile)
      }).catch((e)=>{
        swal("Oho! \n"+e, {
          icon: "error",
        })
      })
    }
    }
    useEffect(()=>{
      getuserdata()
    },[])
    const inputs=[
      {
          id:1,
          name:"FirstName",
          type:"text",
          placeholder:"First Name",
          value:firstname,
          onChange:((event)=>{
            setfirstname(event.target.value)})
      },
      {
          id:2,
          name:"LastName",
          type:"text",
          placeholder:"LastName",
          value:lastname,
          onChange:((event)=>{
            setlastname(event.target.value)})
      },
      {
          id:3,
          name:"email",
          type:"text",
          placeholder:"Email",
          value:email,
          onChange:((event)=>{
            setemail(event.target.value)})
      },
      {
        id:4,
        name:"mobile",
        type:"text",
        placeholder:"mobile", 
        value:mob,
          onChange:((event)=>{
            setmob(event.target.value)})
    },
      {
          id:4,
          name:"password",
          type:"text",
          placeholder:"Password", 
      }
      ,]
      const handleSubmit=async (e)=>{
        seterrormessage("")
        e.preventDefault();
        const data= new FormData(e.target)
        let recievedData=Object.fromEntries(data.entries());
        console.log(recievedData)
        if(rdata.get("id")=="new"){
        axios.post('https://devapi.saltworld.co/api/user/register', recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! "+recievedData.FirstName+" has been successfully registered!", {
                icon: "success",
              })
              navigate('/employees');
            }).catch((error)=>{
              if(error.response){ 
                seterrormessage(error.response.data);
                if(error.response.data!=undefined){
                seterrormessage(error.response.data["message"]);
                swal("Oho! \n"+error.response.data["message"], {
                  icon: "error",
                })
                }
                }
            })}
        else{
          axios.patch('https://devapi.saltworld.co/api/user/'+rdata.get("id"), recievedData, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! user data for "+recievedData.FirstName+" has been successfully updated!", {
                icon: "success",
              })
                navigate('/employees');
    
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
    // <div className="flex flex-row gap-1">
    <div className="  justify-center">
      { errormessage.length>0?
        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 " role="alert">
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
          </div>:<div/>}
        <form onSubmit={handleSubmit} className=' bg-white p-8 px-8 rounded-lg'>
        {rdata.get("id")=="new"?  <Header category="Page" title="Crearte a new user" />: <Header category="Page" title="Edit User Details" />}
        <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          </div>
          <div className=' grid justify-items-stretch grid-cols-4 gap-4'>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <InputSelect name="UserBranch" placeholder="User Branch" options={branchs}></InputSelect>
          <InputSelect name="UserType" placeholder="User Type" options={["Admin", "Employee", "Branch Admin"]}></InputSelect>
          </div>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          <div className=' grid justify-items-stretch grid-cols-2 gap-4'>
          
          </div>
            <button className='w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg' type="submit">{rdata.get("id")=="new"? "Submit":"Update"}</button>
        </form>
        
      </div>
  )
}

export default AddEmployees

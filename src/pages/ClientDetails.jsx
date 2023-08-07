import React , { useEffect, useState } from 'react';
import axios from 'axios'
import swal from 'sweetalert';
import { useNavigate ,useSearchParams} from 'react-router-dom'
import { Header,Shows,} from '../form_components'
import Divider from '@mui/material/Divider';

function ClientDetails() {
    const navigate= useNavigate();
    const [clienttype, setclienttype] = React.useState("Individual");
    const [rdata] =  useSearchParams();
    const  [FirstName, setFirstName]= React.useState("");
    const  [LastName, setLastName]= React.useState("");
    const  [Email, setEmail]= React.useState("");
    const  [MobileNumber, setMobileNumber]= React.useState("");
    const  [DateofBirth, setDateofBirth]= React.useState("");
    const  [Anniversary, setAnniversary]= React.useState("");
    const  [Occupation, setOccupation]= React.useState("");
    const  [ClientSource, setClientSource]= React.useState("");
    const  [gender, setgender]= React.useState("");
    const  [PAN, setPAN]= React.useState("");
    const  [GST, setGST]= React.useState("");
    const  [CompanyLegalName, setCompanyLegalName]= React.useState("");
    const  [CompanyTradeName, setCompanyTradeName]= React.useState("");
    const  [BillingAddress, setBillingAddress]= React.useState("");
    const  [ShippingAddress, setShippingAddress]= React.useState("");
    const deleteclientdata=()=>{
        swal({
            title: "Are you sure?",
            text: "You want to delete "+FirstName,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
               axios.delete("https://devapi.saltworld.co/api/clients/"+rdata.get("id"),).then((response)=>{
               swal("Poof! "+FirstName+" has been deleted!", {
                icon: "success",
              })
              navigate('/customers');
      }).catch((e)=>{
        swal(e, {
          icon: "error",
        })
      })}})
      }

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
      return (
        <div class="grid grid-flow-row-auto grid-cols-3  gap-4 w-auto">
            <div class="col-span-2 border bg-white rounded-md shadow-md p-5 ">
               <div className='flow-root'>
                    <div className='float-left'><Header category="" title= " Client Details" /> </div>
                    <button type="button" onClick={deleteclientdata} class=" float-right text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">Delete</button>
                </div> 
                    <div class="grid py-3  grid-flow-row-dense grid-cols-4 gap-2 grid-rows-2 ...">
                        <Shows placeholder="Client Name:" value={FirstName+" "+LastName}/>
                        <div class="col-span-2"> <Shows span={2} placeholder="Email:" value={Email}/></div>  
                        <Shows placeholder="MobileNumber:" value={MobileNumber}/>
                        <Shows placeholder="Date of Birth:" value={DateofBirth}/>
                        <Shows placeholder="Anniversary:" value={Anniversary}/>
                        <Shows placeholder="Occupation:" value={Occupation}/>
                        <Shows placeholder="ClientType:" value={clienttype}/>
                    </div>
                    {clienttype!=="Individual"? <div><Divider/><p className=" py-2 text-xl font-bold tracking-tight text-slate-900"> Businss Details </p></div>:<div/>}
                    {clienttype!=="Individual"? 
                        <div class="grid py-3 grid-flow-row-dense grid-cols-4 gap-2 grid-rows-1 ...">
                            <Shows placeholder="PAN:" value={PAN}/>
                            <Shows placeholder="GST:" value={GST}/>
                            <Shows placeholder="Company Legal Name:" value={CompanyLegalName}/>
                            <Shows placeholder="Company Trade Name:" value={CompanyTradeName}/>
                        </div>:
                        <div/>
                        }
                    <div><Divider/><p className=" py-2 text-xl font-bold tracking-tight text-slate-900"> Address </p></div>
                    <div className='grid grid-cols-2 gap-3  items-center'>
                        <div className='items-center'>
                        <label class="block text-gray-700 text-sm font-bold mb-2">ShippingAddress:</label>
                        <textarea name="ShippingAddress" placeholder="ShippingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={ShippingAddress}/>
                        </div>
                        <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">BillingAddress:</label>
                        <textarea name="BillingAddress" placeholder="BillingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={BillingAddress}/>
                        </div>
                    </div>
               
            </div>
            <div class="col-span-1 border bg-white rounded-md shadow-md  p-5"> 
            <Header category="" title= "Purchase History" />
            <Divider className='p-1'/>
            <label class="block text-gray-700 text-sm  py-2  font-bold mb-2">No data found !</label>
            </div>
        </div>
      );
  }
     
  
  export default ClientDetails;
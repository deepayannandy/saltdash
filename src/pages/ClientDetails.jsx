import React, { useEffect, useState } from 'react';
import axios from 'axios'
import swal from 'sweetalert';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header, Shows, } from '../form_components'
import Divider from '@mui/material/Divider';
import { AppBar, Tab, Tabs } from "@material-ui/core"
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
  Filter,
  Sort, ContextMenu,
  Edit,
  Toolbar,
  InfiniteScroll,
  Resize, ExcelExport, PdfExport, Search
} from '@syncfusion/ej2-react-grids';
import { BsArrowLeftShort } from 'react-icons/bs'

function ClientDetails() {
  let grid;
  const toolbarOptions = ['Search', 'ExcelExport', 'PdfExport'];
  const navigate = useNavigate();
  const [clienttype, setclienttype] = React.useState("Individual");
  const [rdata] = useSearchParams();
  const [FirstName, setFirstName] = React.useState("");
  const [LastName, setLastName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [MobileNumber, setMobileNumber] = React.useState("");
  const [DateofBirth, setDateofBirth] = React.useState("");
  const [Anniversary, setAnniversary] = React.useState("");
  const [Occupation, setOccupation] = React.useState("");
  const [ClientSource, setClientSource] = React.useState("");
  const [gender, setgender] = React.useState("");
  const [PAN, setPAN] = React.useState("");
  const [GST, setGST] = React.useState("");
  const [CompanyLegalName, setCompanyLegalName] = React.useState("");
  const [CompanyTradeName, setCompanyTradeName] = React.useState("");
  const [BillingAddress, setBillingAddress] = React.useState("");
  const [ShippingAddress, setShippingAddress] = React.useState("");
  const [tabindex, settabindex] = React.useState(0);
  const [servicedata, setservicedata] = React.useState([]);
  const showQR = (props) => (
    <div className='flex'><button
      name="buttonedit"
      style={{ background: "#008000" }}
      className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
    >
      Edit
    </button>
      <div className='w-5' />
      <button
        name="buttondelete"
        style={{ background: "#B22222" }}
        className="edititem text-white py-1 px-2 capitalize rounded-2xl text-md"
      >
        Delete
      </button>
    </div>
  );
  const deleteclientdata = () => {
    swal({
      title: "Are you sure?",
      text: "You want to delete " + FirstName,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete("https://devapi.saltworld.co/api/clients/" + rdata.get("id"),).then((response) => {
            swal("Poof! " + FirstName + " has been deleted!", {
              icon: "success",
            })
            navigate('/customers');
          }).catch((e) => {
            swal(e, {
              icon: "error",
            })
          })
        }
      })
  }

  const getclientsdata = () => {
    if (rdata.get("id") != "new") {
      axios.get("https://devapi.saltworld.co/api/clients/" + rdata.get("id").toString()).then((response) => {
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
      }).catch((e) => {
        swal("Oho! \n" + e, {
          icon: "error",
        })
      })
    }
  }
  useEffect(() => {
    getclientsdata()
  }, [])
  function handletabchange(e, val) {
    settabindex(val)
  }
  return (
    <div class="grid grid-flow-row-auto grid-cols-3  gap-4 w-auto" style={{
      overflow: "scroll",
      position: "fixed",
      height: "100vh",
      paddingBottom: "80px",
    }}>
      <div class="col-span-3 border bg-white rounded-md shadow-md p-5 ">
      <BsArrowLeftShort style={{left:"107px"}} className="text-gray-700 text-3xl  absolute left-23.1 top-20 cursor-pointer" onClick={() => navigate(-1)} />
        <div className='flow-root'>
          <div className='float-left'><Header title=" Client Details" /> </div>
          <button type="button" onClick={deleteclientdata} class=" float-right text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">Delete</button>
        </div>
        <div class="grid py-3  grid-flow-row-dense grid-cols-4 gap-2 grid-rows-2 ...">
          <Shows placeholder="Client Name:" value={FirstName + " " + LastName} />
          <div class="col-span-2"> <Shows span={2} placeholder="Email:" value={Email} /></div>
          <Shows placeholder="MobileNumber:" value={MobileNumber} />
          <Shows placeholder="Date of Birth:" value={DateofBirth} />
          <Shows placeholder="Anniversary:" value={Anniversary} />
          <Shows placeholder="Occupation:" value={Occupation} />
          <Shows placeholder="ClientType:" value={clienttype} />
        </div>
        {clienttype !== "Individual" ? <div><Divider /><p className=" py-2 text-xl font-bold tracking-tight text-slate-900"> Businss Details </p></div> : <div />}
        {clienttype !== "Individual" ?
          <div class="grid py-3 grid-flow-row-dense grid-cols-4 gap-2 grid-rows-1 ...">
            <Shows placeholder="PAN:" value={PAN} />
            <Shows placeholder="GST:" value={GST} />
            <Shows placeholder="Company Legal Name:" value={CompanyLegalName} />
            <Shows placeholder="Company Trade Name:" value={CompanyTradeName} />
          </div> :
          <div />
        }
        <div><Divider /><p className=" py-2 text-xl font-bold tracking-tight text-slate-900"> Address </p></div>
        <div className='grid grid-cols-2 gap-3  items-center'>
          <div className='items-center'>
            <label class="block text-gray-700 text-sm font-bold mb-2">ShippingAddress:</label>
            <textarea name="ShippingAddress" placeholder="ShippingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={ShippingAddress} />
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">BillingAddress:</label>
            <textarea name="BillingAddress" placeholder="BillingAddress" className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={BillingAddress} />
          </div>
        </div>
        <AppBar position="static" color='bg-teal-600'>
          <Tabs value={tabindex} onChange={handletabchange}>
            <Tab label="Memberships" />
            <Tab label="Purchases" />
            <Tab label="Recent Appointments" />
            <Tab label="Credits" />
          </Tabs>
        </AppBar>
        <div className={tabindex == 0 ? "visible" : "hidden"}>
          <div className='flex-row g p-2 gap-2'>
            <span className='p-4 font-weight: inherit; text-2xl'>Memberships</span>
            <div className="pt-2"> <GridComponent dataSource={servicedata}
              allowPaging={true}
              ref={g => grid = g}
              pageSettings={{ pageSize: 10 }}
              // editSettings={editing}
              toolbar={toolbarOptions}
              // actionComplete={actionComplete}
              // toolbarClick={toolbarClick}
              // recordClick={recordClick}
              // height= {500}
              // width= {950}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                <ColumnDirective field='MembershipName' headerText='Membership Name' width='80' />
                <ColumnDirective field='ServiceCategory' headerText='Start Date' width='80' />
                <ColumnDirective field='ServiceDescription' headerText='End Date' width='80' />
                <ColumnDirective field='Duration' headerText='isValid' width='100' />
                <ColumnDirective field='ServiceCost' headerText='Total Scession' width='80' />
                <ColumnDirective field='SellingCost' headerText='Scession Left' width='80' />
                <ColumnDirective field='HsnCode' headerText='Hsn Code' width='80' />
                <ColumnDirective field='IncludeTax' headerText='Cost' width='80' />
                <ColumnDirective field='_id' headerText='Action' minWidth='100' width='80' maxWidth='300' isPrimaryKey={true} template={showQR} />
              </ColumnsDirective>
              <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport, Search, Resize]} />
            </GridComponent>
            </div>
          </div>
        </div>
        <div className={tabindex == 1 ? "visible" : "hidden"}>
          <div className='flex-row g p-2 gap-2'>
            <span className='p-4 font-weight: inherit; text-2xl'>Purchases</span>
            <div className="pt-2"> <GridComponent dataSource={servicedata}
              allowPaging={true}
              ref={g => grid = g}
              pageSettings={{ pageSize: 10 }}
              // editSettings={editing}
              toolbar={toolbarOptions}
              // actionComplete={actionComplete}
              // toolbarClick={toolbarClick}
              // recordClick={recordClick}
              // height= {500}
              // width= {950}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                <ColumnDirective field='MembershipName' headerText='Invoice N0.' width='80' />
                <ColumnDirective field='ServiceCategory' headerText='Purchase Date' width='80' />
                <ColumnDirective field='ServiceDescription' headerText='Qnt' width='80' />
                <ColumnDirective field='Duration' headerText='Total Value' width='100' />
                <ColumnDirective field='ServiceCost' headerText='Mode of Payment' width='80' />
                <ColumnDirective field='_id' headerText='Action' minWidth='100' width='80' maxWidth='300' isPrimaryKey={true} template={showQR} />
              </ColumnsDirective>
              <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport, Search, Resize]} />
            </GridComponent>
            </div>
          </div>
        </div>
        <div className={tabindex == 2 ? "visible" : "hidden"}>
          <div className='flex-row g p-2 gap-2'>
            <span className='p-4 font-weight: inherit; text-2xl'>Recent Appointments</span>
            <div className="pt-2"> <GridComponent dataSource={servicedata}
              allowPaging={true}
              ref={g => grid = g}
              pageSettings={{ pageSize: 10 }}
              // editSettings={editing}
              toolbar={toolbarOptions}
              // actionComplete={actionComplete}
              // toolbarClick={toolbarClick}
              // recordClick={recordClick}
              // height= {500}
              // width= {950}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                <ColumnDirective field='ServiceCost' headerText='Appointment Details' width='80' />
                <ColumnDirective field='MembershipName' headerText='Date' width='80' />
                <ColumnDirective field='ServiceCategory' headerText='Start Time' width='80' />
                <ColumnDirective field='ServiceDescription' headerText='End Time' width='80' />
                <ColumnDirective field='Duration' headerText='Person Count' width='100' />
                <ColumnDirective field='_id' headerText='Action' minWidth='100' width='80' maxWidth='300' isPrimaryKey={true} template={showQR} />
              </ColumnsDirective>
              <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport, Search, Resize]} />
            </GridComponent>
            </div>
          </div>
        </div>
        <div className={tabindex == 3 ? "visible" : "hidden"}>
          <div className='flex-row g p-2 gap-2'>
            <span className='p-4 font-weight: inherit; text-2xl'>Credits</span>
            <div className="pt-2"> <GridComponent dataSource={servicedata}
              allowPaging={true}
              ref={g => grid = g}
              pageSettings={{ pageSize: 10 }}
              // editSettings={editing}
              toolbar={toolbarOptions}
              // actionComplete={actionComplete}
              // toolbarClick={toolbarClick}
              // recordClick={recordClick}
              // height= {500}
              // width= {950}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                <ColumnDirective field='ServiceCost' headerText='Issue Date' width='80' />
                <ColumnDirective field='MembershipName' headerText='Expire Date' width='80' />
                <ColumnDirective field='ServiceCategory' headerText='Credit Amount' width='80' />
                <ColumnDirective field='ServiceDescription' headerText='Status' width='80' />
                <ColumnDirective field='Duration' headerText='Generate on behalf' width='100' />
                <ColumnDirective field='_id' headerText='Action' minWidth='100' width='80' maxWidth='300' isPrimaryKey={true} template={showQR} />
              </ColumnsDirective>
              <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport, Search, Resize]} />
            </GridComponent>
            </div>
          </div>
        </div>

      </div>
      {/* <div class="col-span-1 border bg-white rounded-md shadow-md  p-5"> 
            <Header category="" title= "Purchase History" />
            <Divider className='p-1'/>
            <label class="block text-gray-700 text-sm  py-2  font-bold mb-2">No data found !</label>
            </div> */}
    </div>
  );
}


export default ClientDetails;
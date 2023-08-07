import React , { useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
  Edit,
  Toolbar,
  InfiniteScroll,
  Resize
} from '@syncfusion/ej2-react-grids';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Membership() {
  const navigate= useNavigate();
  const editing = {allowDeleting: true };
  const [membershipdata, setmembershipdata] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport',  'Edit'];
  let grid;
  const navigatetoadd=()=>{
    navigate("/addmemberships");
  }
  useEffect(()=>{
    
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    console.log(token)
    })
  const getdata= ()=>
  {
    axios.get("https://devapi.saltworld.co/api/memberships/",).then((response)=>{
      setmembershipdata(response.data);
      console.log(response.data);
    })
  }
  useEffect(()=>{
    getdata()
  },[])

  return (
    <div className=" flex-row gap-1">
       <div className='flex-direction: column'> 
        <span className='p-4 font-weight: inherit; text-2xl'>All Memberships</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
      </div>
      <div >
        
      <GridComponent dataSource={membershipdata}
       allowPaging={true}
       ref={g => grid = g}
       pageSettings={{ pageSize: 10 }}
       editSettings={editing}
       toolbar={toolbarOptions}
      //  actionComplete={actionComplete}
      //  toolbarClick={toolbarClick}
       // height= {500}
       // width= {950}
       enableInfiniteScrolling= {true}
       infiniteScrollSettings= {{ initialBlocks: 5 }}
       allowResizing= {true}
      >
        <ColumnsDirective>
          {/* <ColumnDirective field='MembershipId' headerText='Membership Id' minWidth= '100' width= '150' maxWidth= '300' /> */}
          <ColumnDirective field='MembershipName' headerText='Name' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='MembershipDescription' headerText='Description' minWidth= '100' width= '150' maxWidth= '300' />
          {/* <ColumnDirective field='ServicePackage' headerText='Service Package' minWidth= '100' width= '150' maxWidth= '300'/>
          <ColumnDirective field='ServiceId' headerText='Service Id' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='SessionType' headerText='Session Type' minWidth= '100' width= '150' maxWidth= '300' /> */}
          <ColumnDirective field='count' headerText='Number Of Sessions' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='isunlimited' headerText='is Unlimited' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='validity' headerText='Validity' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='MembershipCost' headerText='Original Price' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='SellingCost' headerText='Selling Price' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='HsnCode' headerText='Hsn Code' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='Taxrate' headerText='Tax Rate' minWidth= '100' width= '150' maxWidth= '300' />
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, InfiniteScroll,  Resize]} />
      </GridComponent>
      </div>
    </div>
  )
}

export default Membership

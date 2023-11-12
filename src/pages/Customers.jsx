import React , { useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
  Filter,
  Sort,ContextMenu,
  Edit,
  Toolbar,
  InfiniteScroll,
  Resize,ExcelExport, PdfExport,Search
} from '@syncfusion/ej2-react-grids';
import { useNavigate,createSearchParams,Link } from 'react-router-dom'
import axios from 'axios'
import { closest } from '@syncfusion/ej2-base';
import swal from 'sweetalert';

function Customers() {
  const navigate= useNavigate();
  const editing = {allowDeleting: true };
  const [servicedata, setservicedata] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport','Delete'];
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
    axios.get("https://devapi.saltworld.co/api/clients/",).then((response)=>{
      setservicedata(response.data);
      console.log(response.data);
    })
  }
  useEffect(()=>{
    getdata()
  },[])
  const navigatetoadd=()=>{
    navigate({pathname:"/addcustomers", search:createSearchParams({id: "new"}).toString()});
  }
  const showQR = (props) => (
    <div className='flex'><button
      name="buttonedit"
      style={{ background: "#008000" }}
      className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
    >
     Edit
    </button>
    <div className='w-5'/>
    <button
      name="buttonshow"
      style={{ background: "#3F88D1" }}
      className="edititem text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
     Show More
    </button>
    </div>
  );
  let grid;
  const toolbarClick = (args) => {
    if (grid) {
      if (args.item.id.includes('pdfexport')) {
        console.log("pdfexport")
        const exportProperties = {
          pageOrientation: 'Landscape',
          pageSize: 'A4',
          fileName: 'UserData.pdf'
      };
        grid.pdfExport(exportProperties);
      }
      if (args.item.id.includes('excelexport')) {
        console.log("excelexport")
        const exportProperties = {
          pageOrientation: 'Landscape',
          pageSize: 'A4',
          fileName: 'UserData.xlsx'
      };
        grid.excelExport(exportProperties);
      }
    }
  }

  const recordClick = (args) => {
    if(args.target.name=="buttonedit"){
      let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
      navigate({pathname:"/addcustomers", search:createSearchParams({id: rowObj.data._id}).toString()});
    }
    if (args.target.name=="buttonshow") {
      let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
      navigate({pathname:"/customerdetails", search:createSearchParams({id: rowObj.data._id}).toString()});
       
    }
  }

    const actionComplete=(args)=>{
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        
    }
      // if(args.requestType=="save"){
      //   console.log("Save data");
      //   console.log(args.data);
      //   axios.post('https://tilapi.pocsofclients.com/api/user/register/dashboard/', args.data, {
      //     headers: { 'Content-type': 'application/json; charset=UTF-8' }
      // }).then((data) => console.log(data))
      // }
      // if(args.requestType=="save" && args.action=="edit"){
      //   console.log("Save data");
      //   console.log(args.data);
      //   axios.patch('https://tilapi.pocsofclients.com/api/user/'+args.data._id, args.data, {
      //     headers: { 'Content-type': 'application/json; charset=UTF-8' }
      // }).then((data) => console.log(data))
      // }
      if(args.requestType=='delete'){
        axios.delete('https://devapi.saltworld.co/api/clients/'+args.data[0]._id, {
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
      }).then((data) => 
      {console.log("refresh");
      }).catch((e)=>{
        console.log(e)
        console.log("Failed")
      })
      console.log(args.data[0]._id)
      }
    }
  return (
    <div className="flex-row g gap-2">
      <div className='flex-direction: column'> 
        <span className='p-4 font-weight: inherit; text-2xl'>All Clients</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
      </div>
      <div className="flex  mt-4 flex-row gap-2 ">
      <GridComponent dataSource={servicedata}
        allowPaging={true}
        ref={g => grid = g}
        pageSettings={{ pageSize: 10 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        actionComplete={actionComplete}
        toolbarClick={toolbarClick}
        // height= {500}
        // width= {950}
        enableInfiniteScrolling= {true}
        infiniteScrollSettings= {{ initialBlocks: 5 }}
        allowResizing= {true}
        recordClick={recordClick}
      >
        <ColumnsDirective>
          {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
          <ColumnDirective field='FirstName' headerText='FirstName' width='100' />
          <ColumnDirective field='LastName' headerText='LastName' width='80' />
          <ColumnDirective field='MobileNumber' headerText='Mobile' width='80' />
          <ColumnDirective field='Email' headerText='Email' width='80'/>
          <ColumnDirective field='Gender' headerText='Gender' width='100'/>
          <ColumnDirective field='DateofBirth' headerText='DOB' width='80' />
          <ColumnDirective field='Anniversary' headerText='Anniversary' width='80' />
          <ColumnDirective field='Occupation' headerText='Occupation' width='80'/>
          <ColumnDirective field='ClientType' headerText='ClientType' width='80'/>
          <ColumnDirective field='ParentBranchId' headerText='ParentBranchId' width='80'/>
          <ColumnDirective field='_id' headerText='Action' minWidth= '100' width= '120' maxWidth= '300' isPrimaryKey={true} template={showQR}/>
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, InfiniteScroll,Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport,Search, Resize]} />
      </GridComponent>
      </div>
      
    </div>
  )
}

export default Customers

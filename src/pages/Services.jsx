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



function Services() {
  const navigate= useNavigate();
  const editing = {allowDeleting: true };
  const [servicedata, setservicedata] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport','Delete'];
  let grid;

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
    axios.get("https://devapi.saltworld.co/api/services/",).then((response)=>{
      setservicedata(response.data);
      console.log(response.data);
    })
  }
  useEffect(()=>{
    getdata()
  },[])
  const navigatetoadd=()=>{
    navigate({pathname:"/addservices", search:createSearchParams({id: "new"}).toString()});
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
      name="buttondelete"
      style={{ background: "#B22222" }}
      className="edititem text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
     Delete
    </button>
    </div>
  );

  const recordClick = (args) => {
    if(args.target.name=="buttonedit"){
      let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
      navigate({pathname:"/addservices", search:createSearchParams({id: rowObj.data._id}).toString()});
    }
    if (args.target.name=="buttondelete") {
        let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
        console.log(rowObj.data._id);
        swal({
          title: "Are you sure?",
          text: "You want to delete "+rowObj.data.ServiceName,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
             axios.delete("https://devapi.saltworld.co/api/services/"+rowObj.data._id,).then((response)=>{
        
             swal("Poof! "+rowObj.data.ServiceName+" has been deleted!", {
              icon: "success",
            })
            getdata();
    }).catch((e)=>{
      swal(e, {
        icon: "error",
      })
    });
            
          } else {
            
          }
        });
       
    }
  }

  
 
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

    const actionComplete=(args)=>{
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        
    }
      if(args.requestType=="save" && args.action=="edit"){
        console.log("Save data");
        console.log(args.data);
        axios.patch('https://tilapi.pocsofclients.com/api/user/'+args.data._id, args.data, {
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
      }).then((data) => console.log(data))
      }
      if(args.requestType=='delete'){
        axios.delete('https://devapi.saltworld.co/api/services/'+args.data[0]._id, {
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
        <span className='p-4 font-weight: inherit; text-2xl'>All Services</span>
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
        recordClick={recordClick}
        // height= {500}
        // width= {950}
        enableInfiniteScrolling= {true}
        infiniteScrollSettings= {{ initialBlocks: 5 }}
        allowResizing= {true}
      >
        <ColumnsDirective>
          {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
          <ColumnDirective field='ServiceName' headerText='Name' width='80' />
          <ColumnDirective field='ServiceCategory' headerText='Category' width='80' />
          <ColumnDirective field='ServiceDescription' headerText='Description' width='80' />
          <ColumnDirective field='Duration' headerText='Duration' width='100'/>
          <ColumnDirective field='ServiceCost' headerText='Service Cost' width='80' />
          <ColumnDirective field='SellingCost' headerText='Selling Cost' width='80' />
          <ColumnDirective field='Taxrate' headerText='Tax rate' width='80'/>
          <ColumnDirective field='HsnCode' headerText='Hsn Code' width='80'/>
          <ColumnDirective field='ResourceType' headerText='Resource Type' width='80'/>
          <ColumnDirective field='IncludeTax' headerText='Include Tax' width='80'/>
          <ColumnDirective field='_id' headerText='Action' minWidth= '100' width= '80' maxWidth= '300' isPrimaryKey={true} template={showQR}/>
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, InfiniteScroll,Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport,Search, Resize]} />
      </GridComponent>
      </div>
      
    </div>
  )
}

export default Services

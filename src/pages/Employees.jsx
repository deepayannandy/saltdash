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

function Employees() {
  const [userid, setuserid] = React.useState([]);
  const navigate= useNavigate();
  const [empdata, setempdata] = React.useState([]);
  const toolbarOptions = ['Search','ExcelExport','PdfExport', 'Delete'];
  const editing = {allowDeleting: true };

  useEffect(()=>{
    
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    setuserid(token)
    })

  const getdata= ()=>
  {
    axios.get("https://devapi.saltworld.co/api/user/getall/get",).then((response)=>{
      setempdata(response.data);
      console.log(response.data);
    })
  }
  useEffect(()=>{
    getdata()
  },[])
  useEffect(()=>{
    
    if (!localStorage.getItem('userinfo')){
      console.log("try")
      navigate('/Login');
    }
    let token= localStorage.getItem('userinfo');
    console.log(token)
    })
    const navigatetoadd=()=>{
      navigate({pathname:"/addemployees", search:createSearchParams({id: "new"}).toString()});
    }
  
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
    if (args.target.name === "buttonstatus") {
      let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
      swal({
        title: "Are you sure?",
        text: "You want to deactivate "+rowObj.data.FirstName+" "+rowObj.data.LastName,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          axios.patch('https://devapi.saltworld.co/api/user/'+rowObj.data._id, {UserStatus : !rowObj.data.UserStatus}, {
            headers: { 'Content-type': 'application/json; charset=UTF-8','auth-token':userid}
            }).then((data) => {
              swal("Yes! user data for "+rowObj.data.FirstName+" has been successfully updated!", {
                icon: "success",
              })
              getdata()
    
            }).catch((error)=>{
                if(error.response){ 
                    if(error.response.data["message"]!=undefined){
                    swal("Oho! \n"+error.response.data["message"], {
                      icon: "error",
                    })
                    }
                }
            })
}
  else{
    
  }
})
    }


    if(args.target.name=="buttonedit"){
      let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
      navigate({pathname:"/addemployees", search:createSearchParams({id: rowObj.data._id}).toString()});
    }
    if (args.target.name=="buttondelete") {
        let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
        console.log(rowObj.data._id);
        swal({
          title: "Are you sure?",
          text: "You want to delete "+rowObj.data.FirstName+" "+rowObj.data.LastName,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
             axios.delete("https://devapi.saltworld.co/api/user/"+rowObj.data._id,).then((response)=>{
             swal("Poof! "+rowObj.data.FirstName+" "+rowObj.data.LastName+" has been deleted!", {
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

    const actionComplete=(args)=>{
      
    }
    
    const showstate = (props) => (
      <button
      name="buttonstatus"
      style={{ background: props.UserStatus==true?"#008000":"#FFA500" }}
      className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
    >
   {props.UserStatus==true?"Active":"on Hold"}
    </button>
    );
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
  return (
    // <div className="flex flex-row gap-1">
      <div >
         <div className='flex-direction: column'> 
        <span className='p-4 font-weight: inherit; text-2xl'>All Users</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
      </div>
      <div className="flex  mt-4 flex-row gap-2 w-full">
      <GridComponent 
        ref={g => grid = g}
        dataSource={empdata}
        allowPaging={true}
        id="gridcomp"
        pageSettings={{ pageSize: 6 }}
        editSettings={editing}
        actionComplete={actionComplete}
        recordClick={recordClick}
        toolbarClick={toolbarClick}
        toolbar={toolbarOptions}
        allowExcelExport={true}
        allowPdfExport={true}
        // width= {950}
        enableInfiniteScrolling= {true}
        infiniteScrollSettings= {{ initialBlocks: 5 }}
        allowResizing= {true}
      >
        <ColumnsDirective>
          {/* <ColumnDirective field='_id' headerText='User Id' minWidth= '100' width= '150' maxWidth= '300'/> */}
          <ColumnDirective field='FirstName' headerText='First Name' minWidth= '100' width= '150' maxWidth= '300'/>
          <ColumnDirective field='LastName' headerText='Last Name' minWidth= '100' width= '150' maxWidth= '300'/>
          <ColumnDirective field='UserType' headerText='User Type' minWidth= '100' width= '80' maxWidth= '300'/>
          <ColumnDirective field='UserStatus' headerText='User Status' minWidth= '100' width= '60' maxWidth= '300' template={showstate}/>
          <ColumnDirective field='email' headerText='Login Account' minWidth= '100' width= '180' maxWidth= '300'/>
          <ColumnDirective field='UserBranch' headerText='Branch Id' minWidth= '100' width= '150' maxWidth= '300'/>
          <ColumnDirective field='_id' headerText='Action' minWidth= '100' width= '120' maxWidth= '300' isPrimaryKey={true} template={showQR}/>
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, InfiniteScroll,Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport,Search, Resize]} />
      </GridComponent>
      </div>
    </div>
  )
}

export default Employees

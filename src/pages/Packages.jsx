import React , { useEffect, useState } from 'react';
import axios from 'axios'
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
import { useNavigate ,createSearchParams } from 'react-router-dom'
import { closest } from '@syncfusion/ej2-base';
import swal from 'sweetalert';


function Packages() {
  const navigate= useNavigate();
  const [packagedata, setpackagedata] = React.useState([]);
  const editing ={allowEditing: true};
  const toolbarOptions = ['Search','ExcelExport','PdfExport'];
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
    axios.get("https://devapi.saltworld.co/api/servicepackages/",).then((response)=>{
      setpackagedata(response.data);
      console.log(response.data);
    })
  }
  useEffect(()=>{
    getdata()
  },[])
  const navigatetoadd=()=>{
    navigate({pathname:"/addpackages",search:createSearchParams({id: "new"}).toString() });
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
      navigate({pathname:"/addpackages", search:createSearchParams({id: rowObj.data._id}).toString()});
    }
    if (args.target.name=="buttondelete") {
        let rowObj = grid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));
        console.log(rowObj.data._id);
        swal({
          title: "Are you sure?",
          text: "You want to delete "+rowObj.data.PackageName,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
             axios.delete("https://devapi.saltworld.co/api/servicepackages/"+rowObj.data._id,).then((response)=>{
             swal("Poof! "+rowObj.data.PackageName+" has been deleted!", {
              icon: "success",
            })
            getdata();
    }).catch((error)=>{
      if(error.response.data["message"]!=undefined){
        swal("Oho! \n"+error.response.data["message"], {
          icon: "error",
        })
        }
    });
            
          } else {
            
          }
        });
       
    }
  }
  return (
    <div className=" h-3/4 pb-10">
      <div className='flex-direction: column'> 
        <span className='p-4 font-weight: inherit; text-2xl'>All Packages</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
      </div>
      <div className='h-3/4' >
      <GridComponent dataSource={packagedata}
        allowPaging={true}
        ref={g => grid = g}
        pageSettings={{ pageSize: 10 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        recordClick={recordClick}
        // height= {90}
        // width= {950}
        enableInfiniteScrolling= {true}
        infiniteScrollSettings= {{ initialBlocks: 10 }}
        allowResizing= {true}
      >
        <ColumnsDirective>
          <ColumnDirective field='PackageName' headerText='Name' width='80' />
          <ColumnDirective field='PackageDescription' headerText='Description' width='80' />
          <ColumnDirective field='ServiceCost' headerText='ServiceCost' width='100'/>
          <ColumnDirective field='SellingCost' headerText='SellingCost' width='80' />
          <ColumnDirective field='_id' headerText='Action' minWidth= '100' width= '80' maxWidth= '300' isPrimaryKey={true} template={showQR}/>
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, InfiniteScroll,  Resize]} />
      </GridComponent>
      </div>
    </div>
  )
}

export default Packages

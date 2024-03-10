import React, { useEffect } from "react";
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
  Edit,
  Toolbar,
  InfiniteScroll,
  Resize,
} from "@syncfusion/ej2-react-grids";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

function Membership() {
  const navigate = useNavigate();
  const editing = { allowDeleting: true };
  const [membershipData, setMembershipData] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Edit"];
  const token = localStorage.getItem("userinfo");
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  let grid;

  const navigatetoadd = () => {
    navigate("/addmemberships");
  };

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getMembershipData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/memberships/`, {
        headers: { "auth-token": token },
      });
      setMembershipData(response.data);
    } catch {
      swal("Oho! Something went wrong", {
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getMembershipData();
  }, []);

  return (
    <div className=" flex-row gap-1">
      <div className="flex-direction: column">
        <span className="p-4 font-weight: inherit; text-2xl">
          All Memberships
        </span>
        <button
          type="button"
          onClick={navigatetoadd}
          class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Add New
        </button>
      </div>
      <div>
        <GridComponent
          dataSource={membershipData}
          allowPaging={true}
          ref={(g) => (grid = g)}
          pageSettings={{ pageSize: 10 }}
          editSettings={editing}
          toolbar={toolbarOptions}
          //  actionComplete={actionComplete}
          //  toolbarClick={toolbarClick}
          // height= {500}
          // width= {950}
          enableInfiniteScrolling={true}
          infiniteScrollSettings={{ initialBlocks: 5 }}
          allowResizing={true}
        >
          <ColumnsDirective>
            {/* <ColumnDirective field='MembershipId' headerText='Membership Id' minWidth= '100' width= '150' maxWidth= '300' /> */}
            <ColumnDirective
              field="name"
              headerText="Name"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="description"
              headerText="Description"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            {/* <ColumnDirective field='ServicePackage' headerText='Service Package' minWidth= '100' width= '150' maxWidth= '300'/>
          <ColumnDirective field='ServiceId' headerText='Service Id' minWidth= '100' width= '150' maxWidth= '300' />
          <ColumnDirective field='SessionType' headerText='Session Type' minWidth= '100' width= '150' maxWidth= '300' /> */}
            <ColumnDirective
              field="count"
              headerText="Number Of Sessions"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="isUnlimited"
              headerText="is Unlimited"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="validity"
              headerText="Validity"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="cost"
              headerText="Original Price"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="sellingCost"
              headerText="Selling Price"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="hsnCode"
              headerText="Hsn Code"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="taxRate"
              headerText="Tax Rate"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
          </ColumnsDirective>
          <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default Membership;

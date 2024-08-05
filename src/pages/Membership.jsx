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
import { useNavigate, createSearchParams } from "react-router-dom";
import swal from "sweetalert";

function Membership() {
  const navigate = useNavigate();
  const editing = { allowDeleting: true };
  const [membershipData, setMembershipData] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport",];
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

  const showQR = () => (
    <div className="flex">
      <button
        name="buttonedit"
        style={{ background: "#008000" }}
        className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
      >
        Edit
      </button>
      <div className="w-5" />
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
    if (args.target.name === "buttonedit") {
      navigate({
        pathname: "/addmemberships",
        search: createSearchParams({ id: args.rowData._id }).toString(),
      });
    }
    if (args.target.name === "buttondelete") {
      swal({
        title: "Are you sure?",
        text: "You want to delete " + args.rowData.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete(
              `${baseUrl}/api/memberships/` +
                args.rowData._id,
              {
                headers: { "auth-token": token },
              }
            )
            .then(() => {
              swal("Poof! " + args.rowData.name + " has been deleted!", {
                icon: "success",
              });
              getMembershipData();
            })
            .catch((error) => {
              if (error.response.data["message"] !== undefined) {
                swal("Oho! \n" + error.response.data["message"], {
                  icon: "error",
                });
              }
            });
        }
      });
    }
  };

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
          recordClick={recordClick}
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
              field="isUnlimited"
              headerText="is Unlimited"
              minWidth="10"
              width="60"
              maxWidth="300"
            />
            <ColumnDirective
              field="validity"
              headerText="Validity"
              minWidth="70"
              width="60"
              maxWidth="80"
            />
            <ColumnDirective
              field="cost"
              headerText="Original Price"
              minWidth="100"
              width="100"
              maxWidth="300"
            />
            <ColumnDirective
              field="sellingCost"
              headerText="Selling Price"
              minWidth="100"
              width="100"
              maxWidth="300"
            />
            <ColumnDirective
              field="hsnCode"
              headerText="Hsn Code"
              minWidth="100"
              width="60"
              maxWidth="300"
            />
            <ColumnDirective
              field="taxRate"
              headerText="Tax Rate"
              minWidth="100"
              width="60"
              maxWidth="300"
            />
            <ColumnDirective
              field="_id"
              headerText="Action"
              minWidth="100"
              width="120"
              maxWidth="300"
              isPrimaryKey={true}
              template={showQR}
            />
          </ColumnsDirective>
          <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default Membership;

import React, { useEffect } from "react";
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
  Filter,
  Sort,
  ContextMenu,
  Edit,
  Toolbar,
  InfiniteScroll,
  Resize,
  ExcelExport,
  PdfExport,
  Search,
} from "@syncfusion/ej2-react-grids";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

function Employees() {
  const [userId, setUserId] = React.useState([]);
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Delete"];
  const editing = { allowDeleting: true };
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getEmployeeData = () => {
    axios.get(`${baseUrl}/api/user`, {
      headers: {
        "auth-token": token
      }
    }).then((response) => {
      setEmployeeData(response.data);
    });
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  const navigateToAdd = () => {
    navigate({
      pathname: "/addemployees",
      search: createSearchParams({ id: "new" }).toString(),
    });
  };

  let grid;
  const toolbarClick = (args) => {
    if (grid) {
      if (args.item.id.includes("pdfexport")) {
        const exportProperties = {
          pageOrientation: "Landscape",
          pageSize: "A4",
          fileName: "UserData.pdf",
        };
        grid.pdfExport(exportProperties);
      }
      if (args.item.id.includes("excelexport")) {
        const exportProperties = {
          pageOrientation: "Landscape",
          pageSize: "A4",
          fileName: "UserData.xlsx",
        };
        grid.excelExport(exportProperties);
      }
    }
  };

  const recordClick = (args) => {
    if (args.target.name === "buttonstatus") {
      swal({
        title: "Are you sure?",
        text:
          "You want to deactivate " +
          args.rowData.FirstName +
          " " +
          args.rowData.LastName,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch(
              `${baseUrl}/api/user/` + args.rowData._id,
              { userStatus: !args.rowData.userStatus },
              {
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "auth-token": token,
                },
              }
            )
            .then(() => {
              swal(
                "Yes! user data for " +
                  args.rowData.FirstName +
                  " has been successfully updated!",
                {
                  icon: "success",
                }
              );
              getEmployeeData();
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.data["message"] != undefined) {
                  swal("Oho! \n" + error.response.data["message"], {
                    icon: "error",
                  });
                }
              }
            });
        }
      });
    }

    if (args.target.name == "buttonedit") {
      navigate({
        pathname: "/addemployees",
        search: createSearchParams({ id: args.rowData._id }).toString(),
      });
    }
    if (args.target.name == "buttondelete") {
      swal({
        title: "Are you sure?",
        text:
          "You want to delete " +
          args.rowData.firstName +
          " " +
          args.rowData.lastName,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete(`${baseUrl}/api/user/` + args.rowData._id)
            .then(() => {
              swal(
                "Poof! " +
                  args.rowData.firstName +
                  " " +
                  args.rowData.lastName +
                  " has been deleted!",
                {
                  icon: "success",
                }
              );
              getEmployeeData();
            })
            .catch((e) => {
              swal(e, {
                icon: "error",
              });
            });
        }
      });
    }
  };

  const showState = (props) => (
    <button
      name="buttonstatus"
      style={{
        background: props.UserStatus === true ? "#008000" : "#FFA500",
      }}
      className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
    >
      {props.UserStatus === true ? "Active" : "on Hold"}
    </button>
  );

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

  return (
    // <div className="flex flex-row gap-1">
    <div>
      <div className="flex-direction: column">
        <span className="p-4 font-weight: inherit; text-2xl">All Users</span>
        <button
          type="button"
          onClick={navigateToAdd}
          class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Add New
        </button>
      </div>
      <div className="flex  mt-4 flex-row gap-2 w-full">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={employeeData}
          allowPaging={true}
          id="gridcomp"
          pageSettings={{ pageSize: 6 }}
          editSettings={editing}
          recordClick={recordClick}
          toolbarClick={toolbarClick}
          toolbar={toolbarOptions}
          allowExcelExport={true}
          allowPdfExport={true}
          // width= {950}
          enableInfiniteScrolling={true}
          infiniteScrollSettings={{ initialBlocks: 5 }}
          allowResizing={true}
        >
          <ColumnsDirective>
            {/* <ColumnDirective field='_id' headerText='User Id' minWidth= '100' width= '150' maxWidth= '300'/> */}
            <ColumnDirective
              field="firstName"
              headerText="First Name"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="lastName"
              headerText="Last Name"
              minWidth="100"
              width="150"
              maxWidth="300"
            />
            <ColumnDirective
              field="userType"
              headerText="User Type"
              minWidth="100"
              width="80"
              maxWidth="300"
            />
            <ColumnDirective
              field="userStatus"
              headerText="User Status"
              minWidth="100"
              width="60"
              maxWidth="300"
              template={showState}
            />
            <ColumnDirective
              field="email"
              headerText="Login Account"
              minWidth="100"
              width="180"
              maxWidth="300"
            />
            <ColumnDirective
              field="userBranch"
              headerText="Branch Id"
              minWidth="100"
              width="150"
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
          <Inject
            services={[
              Page,
              Edit,
              Toolbar,
              InfiniteScroll,
              Resize,
              Sort,
              ContextMenu,
              Filter,
              ExcelExport,
              Edit,
              PdfExport,
              Search,
              Resize,
            ]}
          />
        </GridComponent>
      </div>
    </div>
  );
}

export default Employees;

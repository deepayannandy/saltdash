import React, { useEffect, useState } from "react";
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
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { closest } from "@syncfusion/ej2-base";
import swal from "sweetalert";

function Customers() {
  const navigate = useNavigate();
  const editing = { allowDeleting: true };
  const [clientData, setClientData] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", ];

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getClientData = () => {
    axios
      .get(`${baseUrl}/api/clients/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setClientData(response.data);
      });
  };

  useEffect(() => {
    getClientData();
  }, []);

  const navigateToAdd = () => {
    navigate({
      pathname: "/addcustomers",
      search: createSearchParams({ id: "new" }).toString(),
    });
  };

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
    if (args.target.name == "buttonedit") {
      navigate({
        pathname: "/addcustomers",
        search: createSearchParams({ id: args.rowData._id }).toString(),
      });
    }
    if (args.target.name == "buttonshow") {
      navigate({
        pathname: "/customerdetails",
        search: createSearchParams({ id: args.rowData._id }).toString(),
      });
    }
  };

  const actionComplete = (args) => {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
    }

    if (args.requestType == "delete") {
      axios
        .delete(`${baseUrl}/api/clients/` + args.data[0]._id, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then(() => {
          swal("Client has been successfully deleted!", {
            icon: "success",
          });
        })
        .catch(() => {
          swal("Something went wrong!", {
            icon: "error",
          });
        });
    }
  };

  return (
    <div className="flex-row g gap-2">
      <div className="flex-direction: column">
        <span className="p-4 font-weight: inherit; text-2xl">All Clients</span>
        <button
          type="button"
          onClick={navigateToAdd}
          class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Add New
        </button>
      </div>
      <div className="flex  mt-4 flex-row gap-2 ">
        <GridComponent
          dataSource={clientData}
          allowPaging={true}
          ref={(g) => (grid = g)}
          pageSettings={{ pageSize: 10 }}
          editSettings={editing}
          toolbar={toolbarOptions}
          actionComplete={actionComplete}
          toolbarClick={toolbarClick}
          // height= {500}
          // width= {950}
          enableInfiniteScrolling={true}
          infiniteScrollSettings={{ initialBlocks: 5 }}
          allowResizing={true}
          recordClick={recordClick}
        >
          <ColumnsDirective>
            {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
            <ColumnDirective
              field="firstName"
              headerText="FirstName"
              width="100"
            />
            <ColumnDirective
              field="lastName"
              headerText="LastName"
              width="80"
            />
            <ColumnDirective
              field="mobileNumber"
              headerText="Mobile"
              width="80"
            />
            <ColumnDirective field="email" headerText="Email" width="80" />
            <ColumnDirective field="gender" headerText="Gender" width="100" />
            <ColumnDirective field="birthDate" headerText="DOB" width="80" />
            <ColumnDirective
              field="anniversary"
              headerText="Anniversary"
              width="80"
            />
            <ColumnDirective
              field="occupation"
              headerText="Occupation"
              width="80"
            />
            <ColumnDirective field="type" headerText="ClientType" width="80" />
            <ColumnDirective
              field="parentBranchId"
              headerText="ParentBranchId"
              width="80"
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

export default Customers;

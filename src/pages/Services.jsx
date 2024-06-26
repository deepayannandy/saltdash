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

function Services() {
  const navigate = useNavigate();
  const editing = { allowDeleting: true };
  const [serviceData, setServiceData] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Delete"];
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");
  let grid;

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/services/`, {
        headers: { "auth-token": token },
      });
      setServiceData(response.data);
    } catch (error) {
      swal("Oho! \n" + error, {
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigateToAdd = () => {
    navigate({
      pathname: "/addservices",
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
        pathname: "/addservices",
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
            .delete(`${baseUrl}/api/services/` + args.rowData._id, {
              headers: { "auth-token": token },
            })
            .then(() => {
              swal("Poof! " + args.rowData.name + " has been deleted!", {
                icon: "success",
              });

              getData();
            })
            .catch((error) => {
              swal("Oho! \n" + error, {
                icon: "error",
              });
            });
        }
      });
    }
  };

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

  const actionComplete = (args) => {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
    }
    if (args.requestType === "save" && args.action === "edit") {
      axios.patch(
        `https://tilapi.pocsofclients.com/api/user/` + args.data._id,
        args.data,
        {
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
    }
    if (args.requestType === "delete") {
      axios.delete(`${baseUrl}/api/services/` + args.data[0]._id, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
    }
  };

  return (
    <div className="flex-row g gap-2">
      <div className="flex-direction: column">
        <span className="p-4 font-weight: inherit; text-2xl">All Services</span>
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
          dataSource={serviceData}
          allowPaging={true}
          ref={(g) => (grid = g)}
          pageSettings={{ pageSize: 10 }}
          editSettings={editing}
          toolbar={toolbarOptions}
          actionComplete={actionComplete}
          toolbarClick={toolbarClick}
          recordClick={recordClick}
          // height= {500}
          // width= {950}
          enableInfiniteScrolling={true}
          infiniteScrollSettings={{ initialBlocks: 5 }}
          allowResizing={true}
        >
          <ColumnsDirective>
            {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
            <ColumnDirective field="name" headerText="Name" width="80" />
            <ColumnDirective
              field="category"
              headerText="Category"
              width="80"
            />
            <ColumnDirective
              field="description"
              headerText="Description"
              width="80"
            />
            <ColumnDirective
              field="duration"
              headerText="Duration"
              width="100"
            />
            <ColumnDirective
              field="cost"
              headerText="Service Cost"
              width="80"
            />
            <ColumnDirective
              field="sellingCost"
              headerText="Selling Cost"
              width="80"
            />
            <ColumnDirective field="taxRate" headerText="Tax rate" width="80" />
            <ColumnDirective field="hsnCode" headerText="Hsn Code" width="80" />
            <ColumnDirective
              field="resourceType"
              headerText="Resource Type"
              width="80"
            />
            <ColumnDirective
              field="includeTax"
              headerText="Include Tax"
              width="80"
            />
            <ColumnDirective
              field="_id"
              headerText="Action"
              minWidth="100"
              width="80"
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

export default Services;

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
import { SyncLoader } from "react-spinners";

function Customers() {
  const navigate = useNavigate();
  const editing = { allowDeleting: true };
  const [clientData, setClientData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const toolbarOptions = ["ExcelExport", "PdfExport"];

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getClientData = (page) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/clients/?size=10&page=${page}`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setClientData(response.data.clients);
        setPageCount(response.data.numberOfPages);
        setTotalData(response.data.numberOfItems);
        setIsLoading(false);
      });
  };
  const getClientFilteredData = (key) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/clients/search/${key}`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setClientData(response.data);
        setPageCount(response.data.length / 10);
        setTotalData(response.data.length);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getClientData(1);
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

  const nextPage = () => {
    if (currentPage + 1 < pageCount) {
      console.log(currentPage + 1);
      getClientData(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage - 1 > 0) {
      console.log(currentPage - 1);
      getClientData(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const searchChange = (e) => {
    const key = e.target.value;
    if (key.length > 2) {
      console.log("Search with:", key);
      getClientFilteredData(key);
      setCurrentPage(1);
    }
    if (key.length === 0) {
      console.log("Resetting Filter");
      getClientData(1);
      setCurrentPage(1);
    }
    setSearch(key);
  };

  const actionComplete = (args) => {
    if (args.requestType === "searching") {
      console.log(args.searchString);
    }
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
      <div className=" h-screen">
        <div className="flex flex-direction: column justify-between pb-2">
          <div>
            <span className="p-4 font-weight: inherit; text-2xl">
              All Clients
            </span>
            <button
              type="button"
              onClick={navigateToAdd}
              class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Add New
            </button>
          </div>
          <div className="w-[300px]">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={search}
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                placeholder="Search Name, Mobile, Email..."
                onChange={searchChange}
                required
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <SyncLoader
              color="#00897B"
              className=""
              loading={isLoading}
              size={15}
            />
          </div>
        ) : (
          <>
            <GridComponent
              dataSource={clientData}
              ref={(g) => (grid = g)}
              pageSettings={{
                pageSize: 10,
                pageCount: pageCount,
              }}
              allowPaging={false}
              editSettings={editing}
              toolbar={toolbarOptions}
              actionComplete={actionComplete}
              toolbarClick={toolbarClick}
              height={460}
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
                <ColumnDirective
                  field="gender"
                  headerText="Gender"
                  width="100"
                />
                <ColumnDirective
                  field="birthDate"
                  headerText="DOB"
                  width="80"
                />
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
                <ColumnDirective
                  field="type"
                  headerText="ClientType"
                  width="80"
                />
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
                  Resize,
                ]}
              />
            </GridComponent>
            <div className="flex mt-2 justify-between">
              <button
                onClick={prevPage}
                class="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  class="w-3.5 h-3.5 me-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                Previous
              </button>
              <span class="text-sm text-gray-700 p-2">
                Showing{" "}
                <span class="font-semibold text-teal-600 ">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span class="font-semibold text-teal-600 ">
                  {currentPage * 10}
                </span>{" "}
                of <span class="font-semibold text-teal-600 ">{totalData}</span>{" "}
                Entries
              </span>
              <button
                onClick={nextPage}
                class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
                <svg
                  class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Customers;

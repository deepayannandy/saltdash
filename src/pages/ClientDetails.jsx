import React, { useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header, Shows, Input, InputSelect } from "../form_components";
import Divider from "@mui/material/Divider";
import { AppBar, Tab, Tabs } from "@material-ui/core";
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
import { BsArrowLeftShort } from "react-icons/bs";
import Card from "../components/Card";
import { TextField } from "@mui/material";

function ClientDetails() {
  let grid;
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport"];
  const navigate = useNavigate();
  const [clientType, setClientType] = React.useState("Individual");
  const [paramsData] = useSearchParams();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [anniversary, setAnniversary] = React.useState("");
  const [occupation, setOccupation] = React.useState("");
  const [source, setSource] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [pan, setPAN] = React.useState("");
  const [gst, setGST] = React.useState("");
  const [companyLegalName, setCompanyLegalName] = React.useState("");
  const [companyTradeName, setCompanyTradeName] = React.useState("");
  const [billingAddress, setBillingAddress] = React.useState("");
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);
  const [serviceData, setServiceData] = React.useState([]);
  const [membershipData, setMembershipData] = React.useState([]);
  const [appointmentData, setAppointmentData] = React.useState([]);
  const [clientNotes, setClientNotes] = React.useState([]);
  const [showNotes, setShowNotes] = React.useState(true);
  const [note, setNote] = React.useState("");

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

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

  const holdAndResumeActionButtons = () => (
    <div className="flex">
      <button
        name="buttonhold"
        style={{ background: "#B22222" }}
        className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
      >
        Hold
      </button>
      <div className="w-5" />
      <button
        name="buttondelete"
        style={{ background: "#008000" }}
        className="edititem text-white py-1 px-2 capitalize rounded-2xl text-md"
      >
        Resume
      </button>
    </div>
  );

  const rescheduleActionButtons = () => (
    <div className="flex">
      <button
        name="buttonreschedule"
        style={{ background: "#B22222" }}
        className="edititem text-white py-1 px-2  capitalize rounded-2xl text-md"
      >
        Reschedule
      </button>
      <div className="w-5" />
    </div>
  );

  const deleteClientData = () => {
    swal({
      title: "Are you sure?",
      text: "You want to delete " + firstName,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/api/clients/` + paramsData.get("id"), {
            headers: {
              "auth-token": token,
            },
          })
          .then(() => {
            swal("Poof! " + firstName + " has been deleted!", {
              icon: "success",
            });
            navigate("/customers");
          })
          .catch((e) => {
            swal(e, {
              icon: "error",
            });
          });
      }
    });
  };

  const getClientsData = () => {
    if (paramsData.get("id") !== "new") {
      axios
        .get(`${baseUrl}/api/clients/` + paramsData.get("id").toString(), {
          headers: {
            "auth-token": token,
          },
        })
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setMobileNumber(response.data.mobileNumber);
          setBirthDate(response.data.birthDate);
          setAnniversary(response.data.anniversary);
          setOccupation(response.data.occupation);
          setGST(response.data.gst);
          setPAN(response.data.pan);
          setClientType(response.data.type);
          setSource(response.data.source);
          setCompanyLegalName(response.data.companyLegalName);
          setCompanyTradeName(response.data.companyTradeName);
          setGender(response.data.gender);
          setShippingAddress(response.data.shippingAddress);
          setBillingAddress(response.data.billingAddress);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  const getClientMembershipData = () => {
    if (paramsData.get("id") !== "new") {
      axios
        .get(
          `${baseUrl}/api/client_memberships/` +
            paramsData.get("id").toString(),
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          setMembershipData(response.data);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  const getAppointmentScheduleData = () => {
    if (paramsData.get("id") !== "new") {
      axios
        .get(
          `${baseUrl}/api/appointments/client/` +
            paramsData.get("id").toString(),
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          setAppointmentData(response.data);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  const getClientNotesData = () => {
    if (paramsData.get("id") !== "new") {
      axios
        .get(`${baseUrl}/api/notes/` + paramsData.get("id").toString(), {
          headers: { "auth-token": token },
        })
        .then((response) => {
          setClientNotes(response.data);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    getClientsData();
    if (tabIndex === 0) {
      getClientMembershipData();
    } else if (tabIndex === 4) {
      getClientNotesData();
    }
  }, []);

  function handleTabChange(e, newTabIndex) {
    if (newTabIndex === 0) {
      getClientMembershipData();
    } else if (newTabIndex === 2) {
      getAppointmentScheduleData();
    } else if (newTabIndex === 4) {
      getClientNotesData();
      setShowNotes(true);
    }
    setTabIndex(newTabIndex);
  }

  const getCardBackgroundColor = (index) => {
    if (index % 2 === 0) {
      return "#a7ffeb";
    }
    return "#64ffda";
  };

  const gridCellInfo = (args) => {
    if (args.column.field === "status") {
      args.cell.style.color =
        args.data.status === "Completed"
          ? "grey"
          : args.data.status === "Upcoming"
          ? "blue"
          : "green";
    }
  };

  const handleNoteFormSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const formData = { note: formElements.note.value };

    axios
      .post(
        `${baseUrl}/api/notes/` + paramsData.get("id").toString(),
        formData,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        }
      )
      .then(() => {
        swal("Note added", {
          icon: "success",
        });
        setTabIndex(4);
        setShowNotes(true);
        getClientNotesData();
      })
      .catch((error) => {
        swal(error.response?.data ?? error.message, {
          icon: "failed",
        });
        setTabIndex(4);
      });
  };

  return (
    <div
      class="grid grid-flow-row-auto grid-cols-3  gap-4"
      style={{
        overflow: "scroll",
        position: "fixed",
        height: "100vh",
        width: "93.9%",
        paddingBottom: "80px",
      }}
    >
      <div class="col-span-3 border bg-white rounded-md shadow-md p-5 ">
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl top-20 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="flow-root">
          <div className="float-left">
            <Header title=" Client Details" />{" "}
          </div>
          <button
            type="button"
            onClick={deleteClientData}
            class=" float-right text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700"
          >
            Delete
          </button>
        </div>
        <div class="grid py-3  grid-flow-row-dense grid-cols-4 gap-2 grid-rows-2 ...">
          <Shows
            placeholder="Client Name:"
            value={firstName + " " + lastName}
          />
          <div class="col-span-2">
            {" "}
            <Shows span={2} placeholder="email:" value={email} />
          </div>
          <Shows placeholder="Mobile Number:" value={mobileNumber} />
          <Shows placeholder="Date of Birth:" value={birthDate} />
          <Shows placeholder="Anniversary:" value={anniversary} />
          <Shows placeholder="Occupation:" value={occupation} />
          <Shows placeholder="ClientType:" value={clientType} />
        </div>
        {clientType !== "Individual" ? (
          <div>
            <Divider />
            <p className=" py-2 text-xl font-bold tracking-tight text-slate-900">
              {" "}
              Business Details{" "}
            </p>
          </div>
        ) : (
          <div />
        )}
        {clientType !== "Individual" ? (
          <div class="grid py-3 grid-flow-row-dense grid-cols-4 gap-2 grid-rows-1 ...">
            <Shows placeholder="PAN:" value={pan} />
            <Shows placeholder="GST:" value={gst} />
            <Shows placeholder="Company Legal Name:" value={companyLegalName} />
            <Shows placeholder="Company Trade Name:" value={companyTradeName} />
          </div>
        ) : (
          <div />
        )}
        <div>
          <Divider />
          <p className=" py-2 text-xl font-bold tracking-tight text-slate-900">
            {" "}
            Address{" "}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3  items-center">
          <div className="items-center">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Shipping Address:
            </label>
            <textarea
              name="shippingAddress"
              placeholder="shippingAddress"
              className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={shippingAddress}
            />
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Billing Address:
            </label>
            <textarea
              name="billingAddress"
              placeholder="billingAddress"
              className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={billingAddress}
            />
          </div>
        </div>
        <AppBar position="static" color="bg-teal-600">
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Memberships" />
            <Tab label="Purchases" />
            <Tab label="Recent Appointments" />
            <Tab label="Credits" />
            <Tab label="Notes" />
          </Tabs>
        </AppBar>
        <div className={tabIndex === 0 ? "visible" : "hidden"}>
          <div className="flex-row g p-2 gap-2">
            <span className="p-4 font-weight: inherit; text-2xl">
              Memberships
            </span>
            <div className="pt-2">
              {" "}
              <GridComponent
                dataSource={membershipData}
                allowPaging={true}
                //ref={(g) => (grid = g)}
                pageSettings={{ pageSize: 10 }}
                // editSettings={editing}
                toolbar={toolbarOptions}
                //actionComplete={actionComplete}
                // toolbarClick={toolbarClick}
                //recordClick={recordClick}
                // height= {500}
                // width= {950}
                enableInfiniteScrolling={true}
                infiniteScrollSettings={{ initialBlocks: 5 }}
                allowResizing={true}
              >
                <ColumnsDirective>
                  {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                  <ColumnDirective
                    field="name"
                    headerText="Membership Name"
                    width="80"
                  />
                  <ColumnDirective
                    field="startDate"
                    headerText="Start Date"
                    width="80"
                  />
                  <ColumnDirective
                    field="endDate"
                    headerText="End Date"
                    width="80"
                  />
                  <ColumnDirective
                    field="duration"
                    headerText="isValid"
                    width="100"
                  />
                  <ColumnDirective
                    field="count"
                    headerText="Total Session"
                    width="80"
                  />
                  <ColumnDirective
                    field="countLeft"
                    headerText="Session Left"
                    width="80"
                  />
                  <ColumnDirective
                    field="hsnCode"
                    headerText="Hsn Code"
                    width="80"
                  />
                  <ColumnDirective field="cost" headerText="Cost" width="80" />
                  <ColumnDirective
                    field="_id"
                    headerText="Action"
                    minWidth="100"
                    width="80"
                    maxWidth="300"
                    isPrimaryKey={true}
                    template={holdAndResumeActionButtons}
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
        </div>
        <div className={tabIndex === 1 ? "visible" : "hidden"}>
          <div className="flex-row g p-2 gap-2">
            <span className="p-4 font-weight: inherit; text-2xl">
              Purchases
            </span>
            <div className="pt-2">
              {" "}
              <GridComponent
                dataSource={serviceData}
                allowPaging={true}
                ref={(g) => (grid = g)}
                pageSettings={{ pageSize: 10 }}
                // editSettings={editing}
                toolbar={toolbarOptions}
                // actionComplete={actionComplete}
                // toolbarClick={toolbarClick}
                // recordClick={recordClick}
                // height= {500}
                // width= {950}
                enableInfiniteScrolling={true}
                infiniteScrollSettings={{ initialBlocks: 5 }}
                allowResizing={true}
              >
                <ColumnsDirective>
                  {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                  <ColumnDirective
                    field="MembershipName"
                    headerText="Invoice N0."
                    width="80"
                  />
                  <ColumnDirective
                    field="ServiceCategory"
                    headerText="Purchase Date"
                    width="80"
                  />
                  <ColumnDirective
                    field="ServiceDescription"
                    headerText="Qnt"
                    width="80"
                  />
                  <ColumnDirective
                    field="Duration"
                    headerText="Total Value"
                    width="100"
                  />
                  <ColumnDirective
                    field="ServiceCost"
                    headerText="Mode of Payment"
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
        </div>
        <div className={tabIndex === 2 ? "visible" : "hidden"}>
          <div className="flex-row g p-2 gap-2">
            <span className="p-4 font-weight: inherit; text-2xl">
              Recent Appointments
            </span>
            <div className="pt-2">
              {" "}
              <GridComponent
                dataSource={appointmentData}
                allowPaging={true}
                //ref={(g) => (grid = g)}
                pageSettings={{ pageSize: 10 }}
                // editSettings={editing}
                toolbar={toolbarOptions}
                // actionComplete={actionComplete}
                // toolbarClick={toolbarClick}
                // recordClick={recordClick}
                // height= {500}
                // width= {950}
                enableInfiniteScrolling={true}
                infiniteScrollSettings={{ initialBlocks: 5 }}
                allowResizing={true}
                queryCellInfo={gridCellInfo}
              >
                <ColumnsDirective>
                  {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                  <ColumnDirective
                    field="title"
                    headerText="Appointment Details"
                    width="80"
                  />
                  <ColumnDirective field="date" headerText="Date" width="80" />
                  <ColumnDirective
                    field="startTime"
                    headerText="Start Time"
                    width="80"
                  />
                  <ColumnDirective
                    field="endTime"
                    headerText="End Time"
                    width="80"
                  />
                  <ColumnDirective
                    field="personCount"
                    headerText="Person Count"
                    width="100"
                  />
                  <ColumnDirective
                    field="status"
                    headerText="Status"
                    width="100"
                  />
                  <ColumnDirective
                    field="_id"
                    headerText="Action"
                    minWidth="100"
                    width="80"
                    maxWidth="300"
                    isPrimaryKey={true}
                    template={rescheduleActionButtons}
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
        </div>
        <div className={tabIndex === 3 ? "visible" : "hidden"}>
          <div className="flex-row g p-2 gap-2">
            <span className="p-4 font-weight: inherit; text-2xl">Credits</span>
            <div className="pt-2">
              {" "}
              <GridComponent
                dataSource={serviceData}
                allowPaging={true}
                ref={(g) => (grid = g)}
                pageSettings={{ pageSize: 10 }}
                // editSettings={editing}
                toolbar={toolbarOptions}
                // actionComplete={actionComplete}
                // toolbarClick={toolbarClick}
                // recordClick={recordClick}
                // height= {500}
                // width= {950}
                enableInfiniteScrolling={true}
                infiniteScrollSettings={{ initialBlocks: 5 }}
                allowResizing={true}
              >
                <ColumnsDirective>
                  {/* <ColumnDirective field='_id' headerText='Service Id' width='80' /> */}
                  <ColumnDirective
                    field="ServiceCost"
                    headerText="Issue Date"
                    width="80"
                  />
                  <ColumnDirective
                    field="MembershipName"
                    headerText="Expire Date"
                    width="80"
                  />
                  <ColumnDirective
                    field="ServiceCategory"
                    headerText="Credit Amount"
                    width="80"
                  />
                  <ColumnDirective
                    field="ServiceDescription"
                    headerText="Status"
                    width="80"
                  />
                  <ColumnDirective
                    field="Duration"
                    headerText="Generate on behalf"
                    width="100"
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
        </div>
        <div className={tabIndex === 4 ? "visible" : "hidden"}>
          {showNotes ? (
            <div>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                style={{ marginTop: 10 }}
              >
                Add Note
              </button>
              <br></br>
              {clientNotes.map((clientNote, index) => (
                <Card
                  note={clientNote.note}
                  date={clientNote.date}
                  color={getCardBackgroundColor(index)}
                />
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleNoteFormSubmit}
              className=" bg-white p-8 px-8 rounded-lg"
              style={{ marginTop: 5, padding: 2 }}
            >
              <Header title={"Add New Note"} />
              <div className=" grid justify-items-stretch grid-cols-2 gap-4">
                <TextField
                  id="note"
                  label="Note"
                  rows={4}
                  placeholder="Tell me something"
                  multiline
                />
                <button
                  className="w-[100px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
                  type="submit"
                  style={{ height: 50, marginTop: 75 }}
                >
                  SUBMIT
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* <div class="col-span-1 border bg-white rounded-md shadow-md  p-5"> 
            <Header category="" title= "Purchase History" />
            <Divider className='p-1'/>
            <label class="block text-gray-700 text-sm  py-2  font-bold mb-2">No data found !</label>
            </div> */}
    </div>
  );
}

export default ClientDetails;

import React, { useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate, useSearchParams, createSearchParams} from "react-router-dom";
import {
  Header,
  Shows,
  Input,
  InputSelect,
  InputSearch,
} from "../form_components";
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
import cCard from "../components/Card";
import { TextField } from "@mui/material";
import { format } from "date-fns";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

function ClientDetails() {
  let grid;
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport"];
  const navigate = useNavigate();
  const [clientType, setClientType] = React.useState("Individual");
  const [paramsData] = useSearchParams();
  const [ClientId, setClientId] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [alternate_email, set_alternate_Email] = React.useState([]);
  const [alternate_mobileNumber, set_alternate_MobileNumber] = React.useState(
    []
  );
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
  const [showMemberships, setShowMemberships] = React.useState(true);
  const [paidAmount, setPaidAmount] = React.useState("");
  const [count, setCount] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [membershipList, setMembershipList] = React.useState([]);
  const [selectedMembership, setSelectedMembership] = React.useState("Select");
  const [allMembershipData, setAllMembershipData] = React.useState([]);

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
        className="edititem text-white py-1 px-2  capitalize rounded-2xl text-xs"
      >
        Hold
      </button>
      <div className="w-5" />
      <button
        name="buttondelete"
        style={{ background: "#008000" }}
        className="edititem text-white py-1 px-2 capitalize rounded-2xl text-xs"
      >
        Resume
      </button>
      <div className="w-5" />
      <button
        name="buttondelete"
        style={{ background: "#B22222" }}
        className="edititem text-white py-1 px-2 capitalize rounded-2xl text-xs"
      >
        Remove
      </button>
    </div>
  );
  const recordClick = (args) => {
    if (args.target.name === "buttonreschedule") {
      console.log(args.rowData)
      navigate({
        pathname: "/addappointment",
        search: createSearchParams({ id: args.rowData._id, clientId: args.rowData.clientId, }).toString(),
      });
    }
  }

  const rescheduleActionButtons = () => (
    <div className="flex">
      <button
        name="buttonreschedule"
        style={{ background: "#008000" }}
        className="editbooking text-white py-1 px-2  capitalize rounded-2xl text-md"
      >
        Manage
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
  const bookClientappointment = () => {
    swal({
      title: "Are you sure?",
      text: "You want to book an appointment for " + firstName,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate({
          pathname: "/addappointment",
          search: createSearchParams({
            id: "new",
            ClientId: ClientId,
          }).toString(),
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
          setClientId(response.data._id)
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setMobileNumber(response.data.mobileNumber);
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
          set_alternate_MobileNumber(response.data.alternate_mobileNumber);
          set_alternate_Email(response.data.alternate_email);
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
            paramsData.get("id").toString()+`&all`,
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          console.log(">>>");
          console.log(response.data);
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
      getMembershipList();
    } else if (tabIndex === 4) {
      getClientNotesData();
    }
  }, []);

  function handleTabChange(e, newTabIndex) {
    if (newTabIndex === 0) {
      getClientMembershipData();
      setShowMemberships(true);
      getMembershipList();
      setSelectedMembership("Select");
      setPaidAmount("");
      setCount("");
      setStartDate("");
      setEndDate("");
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

  const handleMembershipRemove= async (membershipid)=>{
    console.log( `lets remove ${membershipid} ${paramsData.get("id").toString()}`)
    swal({
      title: "Are you sure?",
      text: `You want to delete the selected membership`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((submit) => {
      if (submit) {
    axios
    .delete(
      `${baseUrl}/api/client_memberships/${membershipid}&${paramsData.get("id").toString()}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "auth-token": token,
        },
      }
    )
    .then(() => {
      swal("Membership removed successfully", {
        icon: "success",
      });
      getClientMembershipData()
    })
    .catch((error) => {
      swal(error.response?.data ?? error.message, {
        icon: "failed",
      });
    });
  }
    });

  }

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

  const getMembershipList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/memberships/`, {
        headers: { "auth-token": token },
      });

      setAllMembershipData(response.data);
      const membershipListData = [];
      for (const data of response.data) {
        membershipListData.push({
          label: data.name,
          value: data._id,
        });
      }
      setMembershipList(membershipListData);
    } catch {
      swal("Oho! Something went wrong", {
        icon: "error",
      });
    }
  };

  const addMemberships = () => {
    const data = {
      membershipId: selectedMembership.value,
      paidAmount: paidAmount,
      countLeft: count,
      startDate: startDate,
      endDate: endDate,
    };
    const membershipName = selectedMembership.label;

    swal({
      title: "Are you sure?",
      text: `You want to add ${membershipName} membership`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((submit) => {
      if (submit) {
        axios
          .post(
            `${baseUrl}/api/client_memberships/${paramsData
              .get("id")
              .toString()}`,
            data,
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "auth-token": token,
              },
            }
          )
          .then(() => {
            swal(
              `Yes! The ${membershipName} membership has been successfully added`,
              {
                icon: "success",
              }
            );
            getClientMembershipData();
            setSelectedMembership("Select");
            setPaidAmount("");
            setCount("");
            setStartDate("");
            setEndDate("");
            setShowMemberships(true);
          })
          .catch((error) => {
            swal("Oho! \n" + error, {
              icon: "error",
            });
            setSelectedMembership("Select");
            setPaidAmount("");
            setCount("");
            setStartDate("");
            setEndDate("");
            setShowMemberships(true);
          });
      }
    });
  };

  const handleMembershipSelect = (event) => {
    setSelectedMembership(event);
    const membership = allMembershipData.find((membershipDetails) => membershipDetails._id === event.value);
    if (membership) {
      const currentDate = new Date();
      const startDate = format(currentDate, "yyyy-MM-dd");
      const endDate = membership.validity ? currentDate.setDate(
        currentDate.getDate() + membership.validity
      ): currentDate;
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      setPaidAmount(membership.sellingCost);
      setStartDate(startDate);
      setEndDate(formattedEndDate);
    }
  }

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    const membership = allMembershipData.find(
      (membershipDetails) => membershipDetails._id === selectedMembership.value
    );
    if (membership) {
      const startDate = new Date(value);
      const endDate = membership.validity
        ? startDate.setDate(startDate.getDate() + membership.validity)
        : startDate;
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      setEndDate(formattedEndDate);
    }
  }

  return (
    <div
      className="grid grid-flow-row-auto grid-cols-3  gap-4"
      style={{
        overflow: "scroll",
        position: "fixed",
        height: "100vh",
        width: "93.9%",
        paddingBottom: "80px",
      }}
    >
      <div className="col-span-3 border bg-white rounded-md shadow-md p-5 ">
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
            className=" float-right text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={bookClientappointment}
            className=" float-right text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700"
          >
            Book an appointment
          </button>
        </div>
        <div className="grid py-3  grid-flow-row-dense grid-cols-4 gap-2 grid-rows-2 ...">
          <Shows
            placeholder="Client Name:"
            value={firstName + " " + lastName}
          />
          <div className="col-span-1">
            {" "}
            <Shows span={1} placeholder="Email:" value={email} />
          </div>
          <Shows placeholder="Alternate Email:" value={alternate_email} />
          <Shows placeholder="Mobile Number:" value={mobileNumber} />
          <Shows
            placeholder="Alternate Mobile Number:"
            value={alternate_mobileNumber}
          />
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
          <div className="grid py-3 grid-flow-row-dense grid-cols-4 gap-2 grid-rows-1 ...">
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
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

            <label className="block text-gray-700 text-sm font-bold mb-2">
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
        <Divider/>
        <div className="pt-5"/>
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
            {showMemberships ? (
              <div className="pt-2">
                <span className="p-4 font-weight: inherit; text-2xl">
                  Memberships
                </span>
                <button
                  type="button"
                  onClick={() => setShowMemberships(false)}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  style={{ marginTop: 10 }}
                >
                  Add Membership
                </button>
                <div className="grid grid-cols-3 gap-2">
                {
                  membershipData.map(
                    membership=> <Card className="mt-6 w-96 shadow-[rgba(75,75,75,0.40)_0px_3px_8px]">
                    <CardBody>
                      <Typography variant="h5" color="blue-gray" className="mb-2">
                       {membership.name}
                      {new Date() < new Date(membership.endDate) ? <span class="bg-blue-100 text-teal-600 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-teal-800 ms-3">Active</span>:  <span class="bg-blue-100 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-red-600 ms-3">Exp</span>}
                      </Typography>
                      <Typography>
                      {membership.description}
                      </Typography>
                      <div className=" mt-2">
                      {membership.services.map(service=> <div className="flex items-center">Service: {service.name} <span class= {service.sessions<5 ?"bg-blue-100  text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded  ms-3":"bg-blue-100  text-teal-600 text-xs font-semibold px-2.5 py-0.5 rounded  ms-3"}>Qnt: {service.sessions}</span>  </div>)}
                      </div >
                      <div className="grid grid-cols-2 gap-2 mt-1">
                      <div class="flex flex-col items-center justify-center">
                        <dt class="mb-1 text-1xl font-extrabold">{membership.startDate.split("T")[0]}</dt>
                        <dd class="text-gray-500 dark:text-gray-400">Start Date</dd>
                      </div>
                      <div class="flex flex-col items-center justify-center">
                        <dt class="mb-1 text-1xl font-extrabold">{membership.endDate.split("T")[0]}</dt>
                        <dd class="text-gray-500 dark:text-gray-400">End Date</dd>
                      </div>
                      </div>
                      <div class="flex mt-4 md:mt-6">
                        <button  class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Pause</button>
                        <button class="py-2 px-4 ms-2 text-sm font-medium text-white focus:outline-none bg-teal-600 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Resume</button>
                        <button onClick={()=>handleMembershipRemove(membership._id)} class="py-2 px-4 ms-2 text-sm font-medium text-red-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Remove</button>
                      </div>
                    </CardBody>
                  </Card>
                  )
                }
                </div>
              </div>
            ) : (
              <div className="grid justify-items-stretch grid-cols-4 gap-4">
                <InputSearch
                  name="selectedMembership"
                  placeholder="Memberships"
                  options={membershipList}
                  value={selectedMembership}
                  onchange={(event) => handleMembershipSelect(event)}
                ></InputSearch>
                <Input
                  name="paidAmount"
                  type="number"
                  value={paidAmount}
                  placeholder="Paid Amount"
                  disabled={true}
                  onChange={(event) => setPaidAmount(event.target.value)}
                ></Input>
                <Input
                  name="startDate"
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(event) =>
                    handleChangeStartDate(event.target.value)
                  }
                ></Input>
                <Input
                  name="endDate"
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  disabled={true}
                  onChange={(event) => setEndDate(event.target.value)}
                ></Input>
                <button
                  type="button"
                  onClick={() => addMemberships()}
                  className="text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemberships(true)}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Back
                </button>
              </div>
            )}
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
                pageSettings={{ pageSize: 10 }}
                toolbar={toolbarOptions}
                enableInfiniteScrolling={true}
                infiniteScrollSettings={{ initialBlocks: 5 }}
                allowResizing={true}
                queryCellInfo={gridCellInfo}
                recordClick={recordClick}
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
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                style={{ marginTop: 10 }}
              >
                Add Note
              </button>
              <br></br>
              {clientNotes.map((clientNote, index) => (
                <cCard
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
      {/* <div className="col-span-1 border bg-white rounded-md shadow-md  p-5"> 
            <Header category="" title= "Purchase History" />
            <Divider className='p-1'/>
            <label className="block text-gray-700 text-sm  py-2  font-bold mb-2">No data found !</label>
            </div> */}
    </div>
  );
}

export default ClientDetails;

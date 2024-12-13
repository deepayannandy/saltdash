import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams,createSearchParams } from "react-router-dom";
import {
  Input,
  Header,
  InputSelect,
  MembershipCard,
  InputSearch,
} from "../form_components";
import swal from "sweetalert";
import { BsArrowLeftShort } from "react-icons/bs";
import { format } from "date-fns";
import _ from "lodash";
import {SyncLoader} from "react-spinners";

function AddAppointment() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [disableAction, setDisableAction] = React.useState(false);
  const [isCancelled, setIsCancelled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [personCount, setPersonCount] = React.useState(1);
  const [clientList, setClientList] = React.useState([]);
  const [membershipList, setMembershipList] = React.useState([]);
  const [servicesList, setServicesList] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedMembership, setSelectedMembership] = React.useState("Select");
  const [cancelledOn, setCancelledOn] = React.useState("");
  const [cancelledBy, setCancelledBy] = React.useState("");
  const [clientData, setClientData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [isClientSelected, setIsClientSelected] = React.useState(false);
  const [isMembership, setIsMembership] = React.useState(false);
  const [isReschedule, setIsReschedule] = React.useState(false);
  const [pathParams] = useSearchParams();
  const [branches, setBranches] = React.useState([]);
  const [location, setLocation] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState([
    {
      service: { label: "Select", value: "" },
      duration: "",
      scheduleDate: "",
      time: "",
    },
  ]);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getBranchList = () => {
    axios
      .get(`${baseUrl}/api/branches/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        const branchList = [];
        for (const branch in response.data) {
          branchList.push(response.data[branch].BranchName);
        }
        setBranches(branchList);
      });
  };

  useEffect(() => {
    getBranchList();
    if (pathParams.get("startTime")) {
      const newAppointments = [];
      for (const appointment of scheduledAppointments) {
        appointment.scheduleDate = format(
          new Date(pathParams.get("startTime")),
          "yyyy-MM-dd"
        );
        appointment.time = format(
          new Date(pathParams.get("startTime")),
          "HH:mm"
        );
        newAppointments.push(appointment);
      }
      setScheduledAppointments(newAppointments);
    }

    getClientList();
    getScheduleData();
  }, []);

  const getClientList = () => {
    setIsLoading(true)
    pathParams.get("id") === "new"?
    axios
      .get(`${baseUrl}/api/clients/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setIsLoading(false)
        const clientListData = [];
        for (const client of response.data) {
          clientListData.push({
            label:
              client.firstName +
              " " +
              client.lastName +
              " (" +
              client.mobileNumber +
              ")",
            value: client._id,
          });
          if(pathParams.get("ClientId")){
            if(client._id===pathParams.get("ClientId")){
              setSelectedClient(
              { label:client.firstName +
                " " +
                client.lastName +
                " (" +
                client.mobileNumber +
                ")",
                value: client._id,})
              setIsClientSelected(true);
              fetchMemberships(client._id);
              setIsReschedule(true);
            }
            
          }
        }
        setClientList(clientListData);
       
      }):setIsLoading(false);
  };

  const getScheduleData = async () => {
    if (pathParams.get("id") !== "new") {
      try {
        const appointmentResponse = await axios.get(
          `${baseUrl}/api/appointments/by-appointment/` + pathParams.get("id").toString(),
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        if (appointmentResponse.data) {
          console.log(appointmentResponse.data)
          setSelectedClient(
            { label:appointmentResponse.data.client.firstName +
              " " +
              appointmentResponse.data.client.lastName +
              " (" +
              appointmentResponse.data.client.mobileNumber +
              ")",
              value: appointmentResponse.data.client._id,}
          )
          setBranches([appointmentResponse.data.appointmentData.branch])
          setPersonCount(appointmentResponse.data.appointmentData.personCount)
          const appointmentData = {
            scheduleDate: format(
              new Date(appointmentResponse.data.appointmentData.startDateTime),
              "yyyy-MM-dd"
            ),
            time: format(
              new Date(appointmentResponse.data.appointmentData.startDateTime),
              "HH:mm"
            ),
            duration: appointmentResponse.data.appointmentData.duration,
          };
          if(appointmentResponse.data.appointmentData.isCancelled) {
            setDisableAction(true)
            setIsCancelled(true)
            setCancelledOn(appointmentResponse.data.appointmentData.cancelledOn)
            setCancelledBy(appointmentResponse.data.appointmentData.cancelledBy)
          }
          if(appointmentResponse.data.appointmentData.serviceId==="historical Data"){
            setErrorMessages("On historical data Rescheduling is not possible!")
            setDisableAction(true)
            appointmentData.service = {
              label: appointmentResponse.data.appointmentData.title.split(" for")[0],
              value: "historical Data",
            };
          }else{
          appointmentData.service = {
                label: appointmentResponse.data.serviceName.name,
                value: appointmentResponse.data.serviceName._id,
              };
            }
          setScheduledAppointments([appointmentData])
          
          // setIsReschedule(true);
          // setPersonCount(appointmentResponse.data.appointmentData.personCount);
          // setLocation(appointmentResponse.data.appointmentData.branch);
          // console.log(ppointmentResponse.data)
          // if (pathParams.get("clientId")) {
          //   const clientDetails = {
          //     label:
          //       appointmentResponse.data.client.firstName +
          //       " " +
          //       appointmentResponse.data.client.lastName +
          //       " (" +
          //       appointmentResponse.data.client.mobileNumber +
          //       ")",
          //     value: appointmentResponse.data.client._id,
          //   };
          //   await handelClientSelect(clientDetails);

          //   if (appointmentResponse.data.membership) {
          //     setIsMembership(true);
          //     setSelectedMembership({
          //       label: appointmentResponse.data.membership.name,
          //       value: appointmentResponse.data.membership._id,
          //     });
          //   }

          //   appointmentData.service = {
          //     label: appointmentResponse.data.service.name,
          //     value: appointmentResponse.data.service._id,
          //   };

          //   setScheduledAppointments([appointmentData]);
          //   setLocation(appointmentResponse.data.service);
          //   //setDuration(appointmentResponse.data.service.duration);
          //   if (appointmentResponse.data.services) {
          //     const servicesData = [];
          //     for (const service of appointmentResponse.data.services) {
          //       servicesData.push({
          //         label: service.name,
          //         value: service._id,
          //       });
          //     }
          //     setServicesList(servicesData);
          //   }
          // }
         }
      } catch (error) {
        swal("Oho! Appointment\n" + error, {
          icon: "error",
        });
      }
    }
  };

  const inputs = [
    {
      id: 1,
      name: "personCount",
      type: "number",
      placeholder: "Person Count",
      value: personCount,
      onChange: (event) => {
        setPersonCount(event.target.value);
      },
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessages("");
    e.preventDefault();
    const data = new FormData(e.target);
    const receivedData = Object.fromEntries(data.entries());
    setIsLoading(true)
    const appointmentData = [];
    for (const appointment of scheduledAppointments) {
      if (appointment.duration) {
        const data = {
          membershipId: receivedData.selectedMembership,
          personCount: receivedData.personCount,
          branch: receivedData.location,
          serviceId: appointment.service.value,
          startDateTime: appointment.scheduleDate + " " + appointment.time,
          duration: appointment.duration,
        };
        appointmentData.push(data);
      }
    }

    console.log(appointmentData)
    console.log(appointmentData.length)
    if(appointmentData.length<1){
      swal("Oho! Something went wrong", {
        icon: "error",
      });
    }
    else{
    const clientName = selectedClient.label;
    swal({
      title: "Are you sure?",
      text: `You want to ${
        pathParams.get("id") !== "new"
          ? "update this appointment"
          : "add these appointments"
      }`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((submit) => {
      if (submit) {
        if (pathParams.get("id") === "new") {
          axios
            .post(
              `${baseUrl}/api/appointments/${selectedClient.value}`,
              {
                appointmentData,
              },
              {
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "auth-token": token,
                },
              }
            )
            .then(() => {
              setIsLoading(false)
              swal(
                "Yes! The appointment for " +
                  clientName +
                  " has been successfully booked",
                {
                  icon: "success",
                }
              );
              navigate("/appointment");
            })
            .catch((error) => {
              setIsLoading(false)
              if (error.response) {
                setErrorMessages(error.response.data);
                if (error.response.data["message"] !== undefined) {
                  setErrorMessages(error.response.data["message"]);
                  swal("Oho! \n" + error.response.data["message"], {
                    icon: "error",
                  });
                }
              }
            });
        } else {
          axios
            .patch(
              `${baseUrl}/api/appointments/` + pathParams.get("id"),
              {
                ...appointmentData[0],
                clientId: selectedClient.value,
              },
              {
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "auth-token": token,
                },
              }
            )
            .then(() => {
              setIsLoading(false)
              swal(
                "Yes! The appointment for " +
                  clientName +
                  " has been successfully rescheduled on " +
                  appointmentData[0].startDateTime,
                {
                  icon: "success",
                }
              );
              navigate("/appointment");
            })
            .catch((error) => {
              setIsLoading(false)
              if (error.response) {
                setErrorMessages(error.response.data);
                if (error.response.data["message"] !== undefined) {
                  setErrorMessages(error.response.data["message"]);
                  swal("Oho! \n" + error.response.data["message"], {
                    icon: "error",
                  });
                }
              }
            });
        }
      }
    });
    
  }
  };

  async function fetchMemberships(clientid){
    try {
      const response = await axios.get(
        `${baseUrl}/api/clients/` + clientid,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.data) {
        const data = response.data;
        setClientData(data);
        getClientMembershipData(clientid);

        try {
          const servicesResponse = await axios.get(`${baseUrl}/api/services/`, {
            headers: {
              "auth-token": token,
            },
          });
          if (servicesResponse.data) {
            const servicesData = [];
            for (const service of servicesResponse.data) {
              servicesData.push({ label: service.name, value: service._id });
            }
            setServicesList(servicesData);
            setServicesData(servicesResponse.data);
          }
        } catch (error) {
          swal("Oho! \n" + error, {
            icon: "error",
          });
        }
      }
    } catch (error) {
      swal("Oho! \n" + error, {
        icon: "error",
      });
    }
  }
  const getClientMembershipData = (clientId) => {
    if(clientId!=null)
      axios
        .get(
          `${baseUrl}/api/client_memberships/` +
          clientId+`&active`,
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          console.log(">>>");
          console.log(response.data);
          const membershipData = [];
          const data=response.data;
        if (data.length) {
          setIsMembership(true);
          for (const clientMembership of data) {
            if( new Date() < new Date(clientMembership.endDate))
            {membershipData.push({
              label: clientMembership.name,
              value: clientMembership._id,
            });}
          }
          setMembershipList(membershipData);
        } else {
          setIsMembership(false);
        }
         
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });

        console.log("notable to call get memberships")
  };
  async function handelClientSelect(event) {
    setSelectedClient({ label: event.label, value: event.value });
    setIsClientSelected(true);

    setScheduledAppointments([
      {
        service: { label: "Select", value: "" },
        duration: "",
        scheduleDate: pathParams.get("startTime")
          ? format(new Date(pathParams.get("startTime")), "yyyy-MM-dd")
          : "",
        time: pathParams.get("startTime")
          ? format(new Date(pathParams.get("startTime")), "HH:mm")
          : "",
      },
    ]);

    setLocation("");
    setPersonCount(1);
    fetchMemberships(event.value);
    
  }

  function handelMembershipSelect(event) {
    setSelectedMembership(event);
    const servicesData = [];
    if (clientData.clientMemberships) {
      const clientMembership = clientData.clientMemberships.find(
        (clientMembership) => clientMembership._id === event.value
      );

      for (const service of clientMembership.services) {
        servicesData.push({ label: service.name, value: service._id });
      }
      setServicesList(servicesData);
    }
  }

  function handelServiceSelect(event, appointmentIndex) {
    const newScheduleAppointments = [...scheduledAppointments];
    newScheduleAppointments[appointmentIndex]["service"] = event;

    let service;
    if (isMembership) {
      if (clientData.clientMemberships) {
        for (const clientMembership of clientData.clientMemberships) {
          service = clientMembership.services.find(
            (service) => service._id === event.value
          );
          if (service) {
            break;
          }
        }
      }
    }

    if (servicesData && !service) {
      service = servicesData.find((service) => service._id === event.value);
      console.log("I am called")
    }
    console.log(service.sessions)
    if (service.sessions===0 && selectedMembership!=="Select"){
      swal("Oho! \nNo more session left for "+service.name, {
        icon: "error",
      });
      
      setErrorMessages(`No more session left for ${service.name} please don't make and appointment for this service`)
      newScheduleAppointments[appointmentIndex]["duration"] = 0;
    }
    else if (service) {
      newScheduleAppointments[appointmentIndex]["duration"] = service.duration;
      setLocation(service.branch);
    }
    setScheduledAppointments(newScheduleAppointments);
  }

  const handleInputChange = (event, fieldName, appointmentIndex) => {
    const newScheduleAppointments = [...scheduledAppointments];
    newScheduleAppointments[appointmentIndex][fieldName] = event.target.value;
    setScheduledAppointments(newScheduleAppointments);
  };

  const addMultipleAppointments = () => {
    const newScheduleAppointments = [...scheduledAppointments];
    newScheduleAppointments.push({
      service: { label: "Select", value: "" },
      duration: "",
      scheduleDate: "",
      time: "",
    });
    setScheduledAppointments(newScheduleAppointments);
  };

  const removeAppointment = (appointmentIndex) => {
    const appointments = [...scheduledAppointments];
    appointments.splice(appointmentIndex, 1);
    setScheduledAppointments(appointments);
  };

  function handleLocationChange(event) {
    event.preventDefault();
    setLocation(event.target.value);
  }

  const deleteAppointment = (e) => {
    setErrorMessages("");
    e.preventDefault();

    swal({
      title: "Are you sure?",
      text: `You want to delete this appointment`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((submit) => {
      if (submit) {
        axios
          .delete(`${baseUrl}/api/appointments/` + pathParams.get("id"), {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "auth-token": token,
            },
            data: {
              clientId: selectedClient.value,
            },
          })
          .then(() => {
            swal(
              "Yes! The appointment for " +
                selectedClient.label +
                " has been deleted",
              {
                icon: "success",
              }
            );
            navigate("/appointment");
          })
          .catch((error) => {
            if (error.response) {
              setErrorMessages(error.response.data);
              if (error.response.data["message"] !== undefined) {
                setErrorMessages(error.response.data["message"]);
                swal("Oho! \n" + error.response.data["message"], {
                  icon: "error",
                });
              }
            }
          });
      }
    });
  };
  const noShow = (e) => {
    setErrorMessages("");
    e.preventDefault();

    swal({
      title: "Are you sure?",
      text: `You want to make this appointment "No Show"`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      closeOnClickOutside: true,
      closeOnEsc: true,
    }).then((submit) => {
      if (submit) {
        axios
          .delete(`${baseUrl}/api/appointments/noShow/` + pathParams.get("id"), {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "auth-token": token,
            },
            data: {
              clientId: selectedClient.value,
            },
          })
          .then(() => {
            swal(
              "Yes! The appointment for " +
                selectedClient.label +
                " has been deleted",
              {
                icon: "success",
              }
            );
            navigate("/appointment");
          })
          .catch((error) => {
            if (error.response) {
              setErrorMessages(error.response.data);
              if (error.response.data["message"] !== undefined) {
                setErrorMessages(error.response.data["message"]);
                swal("Oho! \n" + error.response.data["message"], {
                  icon: "error",
                });
              }
            }
          });
      }
    });
  };
  const navigateToClient = () => {
    console.log("Hello I am clicked")
    navigate({
      pathname: "/customerdetails",
      search: createSearchParams({ id: selectedClient.value }).toString(),
    });
  }

  return (
    <div className="  justify-center">
      {isLoading?<div className=" h-screen flex items-center justify-center"> 
    <SyncLoader color="#00897B" className="" loading={isLoading} size={15}/> 
    </div>
    :  
      <div>{errorMessages.length > 0 ? (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 "
          role="alert"
        >
          <p className="font-bold">Something Went Wrong</p>
          <p>{errorMessages}</p>
        </div>
      ) : (
        <div />
      )}
      <form onSubmit={handleSubmit} className=" bg-white p-8 px-8 rounded-lg">
      {errorMessages.length > 0 ? <BsArrowLeftShort
          style={{ left: "107px", top: "160px"} }
          className="text-gray-700 text-3xl mt-5  absolute left-23.1 top-20 cursor-pointer "
          onClick={() => navigate(-1)}
        />:<BsArrowLeftShort
        style={{ left: "107px"} }
        className="text-gray-700 text-3xl mt-5  absolute left-23.1 top-20 cursor-pointer "
        onClick={() => navigate(-1)}
      />}
        <Header
          title={
             pathParams.get("id") === "new"
              ? "Schedule an Appointment"
              : "Reschedule"
          }></Header>
        <div className=" grid justify-items-stretch grid-cols-3 gap-4 pb-4">
          <div className="col-span-2 ...">
            <InputSearch
              options={clientList}
              value={selectedClient}
              name="selectedClient"
              placeholder="Client"
              onchange={handelClientSelect}
              isDisabled={pathParams.get("id") !== "new"?true:false}
            />
          </div>
          {pathParams.get("id") === "new" ? (
          ""
        ) : 
          <button onClick={navigateToClient} id="showMore" class="mt-6  ml-6 bg-transparent hover:bg-green-500 max-h-10 max-w-xs text-green-700 text-xs font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
            Show More
          </button>}
          {isClientSelected ? (
            isMembership ? (
              <InputSearch
                name="selectedMembership"
                placeholder="Memberships"
                options={membershipList}
                value={selectedMembership}
                onchange={handelMembershipSelect}
              ></InputSearch>
            ) : (
              <MembershipCard title={"No Membership found"} />
            )
          ) : (
            <div />
          )}
        </div>

        {scheduledAppointments.map((appointment, appointmentIndex) => (
          <div className="grid justify-items-stretch grid-cols-5 gap-4">
            <InputSearch
              name="selectedService"
              placeholder="Service"
              options={servicesList}
              value={appointment.service}
              isDisabled={pathParams.get("id") !== "new"?true:false}
              onchange={(event) => handelServiceSelect(event, appointmentIndex)}
            ></InputSearch>
            <Input
              name="duration"
              type="number"
              placeholder="Duration"
              disabled={pathParams.get("id") !== "new"?true:false}
              value={appointment.duration}
              onChange={(event) =>
                handleInputChange(event, "duration", appointmentIndex)
              }
            ></Input>
            <Input
              name="date"
              type="date"
              placeholder="Date"
              value={appointment.scheduleDate}
              onChange={(event) =>
                handleInputChange(event, "scheduleDate", appointmentIndex)
              }
            ></Input>
            <Input
              name="time"
              type="time"
              placeholder="Time"
              value={appointment.time}
              onChange={(event) =>
                handleInputChange(event, "time", appointmentIndex)
              }
            ></Input>

            {pathParams.get("id") === "new" ? (
              appointmentIndex === scheduledAppointments.length - 1 ? (
                <button
                  style={{ marginTop: "28px" }}
                  className="w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
                  type="button"
                  onClick={() => addMultipleAppointments()}
                >
                  Add +
                </button>
              ) : (
                <button
                  style={{ marginTop: "28px", backgroundColor: "red" }}
                  className="w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
                  type="button"
                  onClick={() => removeAppointment(appointmentIndex)}
                >
                  Remove -
                </button>
              )
            ) : (
              <div />
            )}
          </div>
        ))}

        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <InputSelect
            name="location"
            placeholder="Branch"
            value={location}
            options={branches}
            onchange={handleLocationChange}
          ></InputSelect>
           
        </div>
        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
        {isCancelled?<Input
              name="Cancelled on"
              type="text"
              placeholder="Cancelled on"
              disabled={true}
              value={cancelledOn.split("T")[0]}
            ></Input>
             :<div/>}
             {isCancelled?<Input
              name="Cancelled by"
              type="text"
              disabled={true}
              placeholder="Cancelled by"
              value={cancelledBy}
            ></Input>
             :<div/>}
              {isCancelled?<Input
              name="Status"
              type="text"
              disabled={true}
              placeholder="Status"
              value="Cancelled"
            ></Input>
             :<div/>}
          </div>

        <button
          className={disableAction? "w-[400px] my-5 py-2 bg-gray-300  text-white font-semibold rounded-lg":"w-[400px] my-5 py-2  bg-teal-600  text-white font-semibold rounded-lg"}
          type="submit"
          disabled={disableAction}
        >
          {pathParams.get("id") === "new"
            ? selectedMembership === "Select"
              ? "Schedule": "Deduct from Membership & Schedule"
            : "Reschedule"}
        </button>

        {pathParams.get("id") === "new" ? (
          ""
        ) : (
          <button
            className={disableAction? "w-[400px] my-5 py-2  bg-gray-300  text-white font-semibold rounded-lg":"w-[400px] my-5 py-2  bg-teal-600  text-white font-semibold rounded-lg"}
            style={{ margin: 10 }}
            onClick={ deleteAppointment}
            disabled={disableAction}
          >
            Delete
          </button>
        )}
        {pathParams.get("id") === "new" ? (
          ""
        ) : (
        <button
            className={disableAction? "w-[400px] my-5 py-2  bg-gray-300  text-white font-semibold rounded-lg":"w-[400px] my-5 py-2  bg-teal-600  text-white font-semibold rounded-lg"}
            style={{ margin: 10 }}
            onClick={ noShow}
            disabled={disableAction}
          >
            No Show
          </button>)}
      </form>
      </div>}
    </div>
  );
}

export default AddAppointment;

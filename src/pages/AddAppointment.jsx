import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
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

function AddAppointment() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [personCount, setPersonCount] = React.useState(1);
  const [clientList, setClientList] = React.useState([]);
  const [membershipList, setMembershipList] = React.useState([]);
  const [servicesList, setServicesList] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedMembership, setSelectedMembership] = React.useState("Select");
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
    axios
      .get(`${baseUrl}/api/clients/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
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
        }
        setClientList(clientListData);
      });
  };

  const getScheduleData = async () => {
    if (pathParams.get("id") !== "new") {
      try {
        const appointmentResponse = await axios.get(
          `${baseUrl}/api/appointments/` + pathParams.get("id").toString(),
          {
            params: {
              clientId: pathParams.get("clientId").toString(),
            },
            headers: {
              "auth-token": token,
            },
          }
        );

        if (appointmentResponse.data) {
          const appointmentData = {
            scheduleDate: format(
              new Date(appointmentResponse.data.startDateTime),
              "yyyy-MM-dd"
            ),
            time: format(
              new Date(appointmentResponse.data.startDateTime),
              "HH:mm"
            ),
            duration: appointmentResponse.data.service.duration,
          };

          setIsReschedule(true);
          setPersonCount(appointmentResponse.data.personCount);
          setLocation(appointmentResponse.data.branch);

          if (pathParams.get("clientId")) {
            const clientDetails = {
              label:
                appointmentResponse.data.client.firstName +
                " " +
                appointmentResponse.data.client.lastName +
                " (" +
                appointmentResponse.data.client.mobileNumber +
                ")",
              value: appointmentResponse.data.client._id,
            };
            await handelClientSelect(clientDetails);

            if (appointmentResponse.data.membership) {
              setIsMembership(true);
              setSelectedMembership({
                label: appointmentResponse.data.membership.name,
                value: appointmentResponse.data.membership._id,
              });
            }

            appointmentData.service = {
              label: appointmentResponse.data.service.name,
              value: appointmentResponse.data.service._id,
            };

            setScheduledAppointments([appointmentData]);
            setLocation(appointmentResponse.data.service);
            //setDuration(appointmentResponse.data.service.duration);
            if (appointmentResponse.data.services) {
              const servicesData = [];
              for (const service of appointmentResponse.data.services) {
                servicesData.push({
                  label: service.name,
                  value: service._id,
                });
              }
              setServicesList(servicesData);
            }
          }
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
  };

  async function handelClientSelect(event) {
    setSelectedClient({ label: event.label, value: event.value });
    setIsClientSelected(true);

    setScheduledAppointments([
      {
        service: { label: "Select", value: "" },
        duration: "",
        scheduleDate: pathParams.get("startTime") ? format(
          new Date(pathParams.get("startTime")),
          "yyyy-MM-dd"
        ) : "",
        time: pathParams.get("startTime") ? format(
          new Date(pathParams.get("startTime")),
          "HH:mm"
        ) : "",
      },
    ]);

    setLocation("");
    setPersonCount(1);

    try {
      const response = await axios.get(
        `${baseUrl}/api/clients/` + event.value,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.data) {
        const data = response.data;
        setClientData(data);
        const membershipData = [];
        if (data.clientMemberships.length) {
          setIsMembership(true);
          for (const clientMembership of data.clientMemberships) {
            membershipData.push({
              label: clientMembership.membership.name,
              value: clientMembership.membershipId,
            });
          }
          setMembershipList(membershipData);
        } else {
          setIsMembership(false);

          try {
            const servicesResponse = await axios.get(
              `${baseUrl}/api/services/`,
              {
                headers: {
                  "auth-token": token,
                },
              }
            );
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
      }
    } catch (error) {
      swal("Oho! \n" + error, {
        icon: "error",
      });
    }
  }

  function handelMembershipSelect(event) {
    setSelectedMembership(event);
    const servicesData = [];
    if (clientData.clientMemberships) {
      const clientMembership = clientData.clientMemberships.find(
        (clientMembership) => clientMembership.membershipId === event.value
      );

      for (const service of clientMembership.membership.services) {
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
          service = clientMembership.membership.services.find(
            (service) => service._id === event.value
          );
          if (service) {
            break;
          }
        }
      }
    } else {
      if (servicesData) {
        service = servicesData.find((service) => service._id === event.value);
      }
    }

    if (service) {
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

  const deleteMembership = (e) => {
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

  return (
    <div className="  justify-center">
      {errorMessages.length > 0 ? (
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
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl mt-5  absolute left-23.1 top-20 cursor-pointer "
          onClick={() => navigate(-1)}
        />
        <Header
          title={
            pathParams.get("id") === "new"
              ? "Schedule an Appointment"
              : "Reschedule"
          }
        />
        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
          <div className="col-span-2 ...">
            <InputSearch
              options={clientList}
              value={selectedClient}
              name="selectedClient"
              placeholder="Client"
              onchange={handelClientSelect}
              isDisabled={isReschedule}
            />
          </div>
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
              onchange={(event) => handelServiceSelect(event, appointmentIndex)}
            ></InputSearch>
            <Input
              name="duration"
              type="number"
              placeholder="Duration"
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

        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          type="submit"
        >
          {pathParams.get("id") === "new"
            ? isMembership === true
              ? "Deduct from Membership & Schedule"
              : "Schedule"
            : "Reschedule"}
        </button>

        {pathParams.get("id") === "new" ? (
          ""
        ) : (
          <button
            className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
            style={{ margin: 10 }}
            onClick={deleteMembership}
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
}

export default AddAppointment;

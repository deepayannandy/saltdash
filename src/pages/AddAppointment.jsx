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
  const [userId, setUserId] = React.useState([]);
  const [scheduleDate, setScheduleDate] = React.useState([]);
  const [serviceCategory, setServiceCategory] = React.useState([]);
  const [personCount, setPersonCount] = React.useState(1);
  const [duration, setDuration] = React.useState([]);
  const [clientList, setClientList] = React.useState([]);
  const [membershipList, setMembershipList] = React.useState([]);
  const [servicesList, setServicesList] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedMembership, setSelectedMembership] = React.useState("Select");
  const [selectedServices, setSelectedServices] = React.useState("Select");
  const [clientData, setClientData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [isClientSelected, setIsClientSelected] = React.useState(false);
  const [isMembership, setIsMembership] = React.useState(false);
  const [isReschedule, setIsReschedule] = React.useState(false);
  const [pathParams] = useSearchParams();
  const [webServices, setWebServices] = React.useState([]);
  const [time, setTime] = React.useState([]);
  const [existingSchedule, setExistingSchedule] = React.useState(null);
  const [branches, setBranches] = React.useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [clientId, setClientId] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState([]);

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
      setScheduleDate(
        format(new Date(pathParams.get("startTime")), "yyyy-MM-dd")
      );
      setTime(format(new Date(pathParams.get("startTime")), "HH:mm"));
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
          setIsReschedule(true);
          setScheduleDate(
            format(
              new Date(appointmentResponse.data.startDateTime),
              "yyyy-MM-dd"
            )
          );
          setTime(
            format(new Date(appointmentResponse.data.startDateTime), "HH:mm")
          );
          setClientId(appointmentResponse.data.clientId);
          setPersonCount(appointmentResponse.data.personCount);
          setDuration(appointmentResponse.data.service.duration);
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

            setSelectedServices({
              label: appointmentResponse.data.service.name,
              value: appointmentResponse.data.service._id,
            });
            setLocation(appointmentResponse.data.service);
            setDuration(appointmentResponse.data.service.duration);
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
      name: "date",
      type: "date",
      placeholder: "Date",
      value: scheduleDate,
      onChange: (event) => {
        setScheduleDate(event.target.value);
      },
    },
    {
      id: 2,
      name: "personCount",
      type: "number",
      placeholder: "Person Count",
      value: personCount,
      onChange: (event) => {
        setPersonCount(event.target.value);
      },
    },

    {
      id: 3,
      name: "duration",
      type: "number",
      placeholder: "duration",
      value: duration,
      onChange: (event) => {
        setDuration(event.target.value);
      },
    },
    {
      id: 4,
      name: "time",
      type: "time",
      placeholder: "Time",
      value: time,
      onChange: (event) => {
        setTime(event.target.value);
      },
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessages("");
    e.preventDefault();
    const data = new FormData(e.target);
    const receivedData = Object.fromEntries(data.entries());

    const appointmentData = [];
    if (scheduledAppointments.length) {
      for (const appointment of scheduledAppointments) {
        const data = {
          membershipId: receivedData.selectedMembership,
          personCount: receivedData.personCount,
          branch: receivedData.location,
          serviceId: appointment.serviceId,
          startDateTime: appointment.scheduleDate + " " + appointment.time,
          duration: appointment.duration,
        };
        appointmentData.push(data);
      }
    } else {
      const data = {
        membershipId: receivedData.selectedMembership,
        personCount: receivedData.personCount,
        branch: receivedData.location,
        serviceId: receivedData.selectedService,
        startDateTime: receivedData.date + " " + receivedData.time,
        duration: receivedData.duration,
      };
      appointmentData.push(data);
    }

    const client = clientList.find(
      (list) => list.value === receivedData.selectedClient
    );

    const clientName = client.label;

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
              `${baseUrl}/api/appointments/${receivedData.selectedClient}`,
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
              { ...appointmentData[0], clientId: receivedData.selectedClient },
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
                  receivedData.startDateTime,
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
  // function handleInputChange(event) {
  //   if (event.length) {
  //     axios
  //       .get(`${baseUrl}/api/clients/search/` + event, {
  //         headers: {
  //           "auth-token": token,
  //         },
  //       })
  //       .then((response) => {
  //         let clientList = [];
  //         for (let client in response.data) {
  //           clientList.push({
  //             label:
  //               response.data[client].firstName +
  //               " " +
  //               response.data[client].lastName +
  //               " (" +
  //               response.data[client].mobileNumber +
  //               ")",
  //             value: response.data[client]._id,
  //           });
  //         }
  //         setClientList(clientList);
  //       });
  //   } else {
  //     axios
  //       .get(`${baseUrl}/api/clients/`, {
  //         headers: {
  //           "auth-token": token,
  //         },
  //       })
  //       .then((response) => {
  //         let clientList = [];
  //         for (let client in response.data) {
  //           clientList.push({
  //             label:
  //               response.data[client].firstName +
  //               " " +
  //               response.data[client].lastName +
  //               " (" +
  //               response.data[client].mobileNumber +
  //               ")",
  //             value: response.data[client]._id,
  //           });
  //         }
  //         setClientList(clientList);
  //       });
  //   }
  // }
  async function handelClientSelect(event) {
    setSelectedClient({ label: event.label, value: event.value });
    setIsClientSelected(true);

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

  function handelServiceSelect(event) {
    setSelectedServices(event);
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
      setLocation(service.branch);
      setDuration(service.duration);
    }
  }

  const addMultipleAppointments = (event) => {
    if (selectedServices && scheduleDate && duration && time) {
      const isAppointmentAlreadyAdded = scheduledAppointments.some(
        (appointment) => appointment.serviceName === selectedServices.label
      );
      if (isAppointmentAlreadyAdded) {
        swal("Oho! \n" + `Appointment already added for this service`, {
          icon: "error",
        });
      } else {
        const appointment = {
          id: _.uniqueId(selectedServices.value),
          serviceName: selectedServices.label,
          serviceId: selectedServices.value,
          duration,
          scheduleDate,
          time,
        };
        setScheduledAppointments([...scheduledAppointments, appointment]);
      }
    }
  };

  const deleteAppointment = (id) => {
    const appointments = scheduledAppointments.filter(
      (appointment) => appointment.id !== id
    );
    setScheduledAppointments(appointments);
  };

  function handleLocationChange(event) {
    event.preventDefault();
    setLocation(event.target.value);
  }

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
              //isDisabled={isReschedule}
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
        <div className=" grid justify-items-stretch grid-cols-5 gap-4">
          <InputSearch
            name="selectedService"
            placeholder="Service"
            options={servicesList}
            value={selectedServices}
            onchange={handelServiceSelect}
          ></InputSearch>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          {pathParams.get("id") === "new" ? (
            <button
              className="w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
              type="button"
              onClick={addMultipleAppointments}
            >
              Add
            </button>
          ) : (
            <div />
          )}
        </div>
        {pathParams.get("id") === "new" ? (
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Added Appointments
            </label>
            <div class="p-1">
              <table class="w-5/6  border">
                <thead>
                  <tr>
                    <th class="font-bold py-2 px-4 border-b border-l border-r text-left">
                      Service Name
                    </th>
                    <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">
                      Duration
                    </th>
                    <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">
                      Date
                    </th>
                    <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">
                      Time
                    </th>
                    <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledAppointments.map((appointment) => (
                    <tr>
                      <td class="border border-slate-700 ...">
                        {appointment.serviceName}
                      </td>
                      <td class="border border-slate-700 ...">
                        {appointment.duration}
                      </td>
                      <td class="border border-slate-700 ...">
                        {appointment.scheduleDate}
                      </td>
                      <td class="border border-slate-700 ...">
                        {appointment.time}
                      </td>
                      <td class="border border-slate-700 ...">
                        <button
                          style={{ background: "#B22222" }}
                          type="button"
                          className="text-white py-1 px-2 capitalize rounded-2xl text-md"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* <tr>
            <td class=" py-2 px-4 border-b border-l border-r  text-left">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td class=" py-2 px-4 border-b border-l border-r  text-left">Malcolm Lockyer</td>
            <td class=" py-2 px-4 border-b border-l border-r  text-left">1961</td>
          </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className=" grid justify-items-stretch grid-cols-4 gap-1">
          {existingSchedule !== null ? (
            existingSchedule.map((schedule) => (
              <MembershipCard title={schedule.title} />
            ))
          ) : (
            <div />
          )}
        </div>
        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
          <Input key={inputs[1].id} {...inputs[1]}></Input>
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
      </form>
    </div>
  );
}

export default AddAppointment;

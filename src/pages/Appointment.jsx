import React, { useEffect, useState } from "react";
import "../index.css";
import {
  ScheduleComponent,
  Inject,
  Day,
  Month,
  Week,
} from "@syncfusion/ej2-react-schedule";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputSearch } from "../form_components";
import { format, addDays } from "date-fns";

function Appointment() {
  const today = new Date();
  const sevenDaysFromToday = addDays(today, 7);

  // Initialize state for start and end dates
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(sevenDaysFromToday);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isCalendarView, setCalendarView] = useState(true);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");
  const currentView = localStorage.getItem("currentView");

  const navigateToAddAppointment = (args) => {
    if (args.startTime >= new Date()) {
      navigate({
        pathname: "/addappointment",
        search: createSearchParams({
          id: "new",
          startTime: args.startTime,
        }).toString(),
      });
    } else {
      swal({
        title: "Are you sure?",
        text: "You want to add appointment for past date",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((submit) => {
        if (submit) {
          navigate({
            pathname: "/addappointment",
            search: createSearchParams({
              id: "new",
              startTime: args.startTime,
            }).toString(),
          });
        }
      });
    }
  };

  const handleOnEventClick = (args) => {
    if (args.event.StartTime >= new Date()) {
      swal({
        title: "Are you sure?",
        text: "You want to edit this appointment",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((submit) => {
        if (submit) {
          navigate({
            pathname: "/addappointment",
            search: createSearchParams({
              clientId: args.event.clientId,
              id: args.event.sid,
            }).toString(),
          });
        }
      });
    } else {
      swal({
        title: "Are you sure?",
        text: "You want to edit this appointment of past date",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: true,
        closeOnEsc: true,
      }).then((submit) => {
        if (submit) {
          navigate({
            pathname: "/addappointment",
            search: createSearchParams({
              clientId: args.event.clientId,
              id: args.event.sid,
            }).toString(),
          });
        }
      });
    }
  };

   const onNavigation = (args) => { 
     localStorage.setItem("currentView", args.currentView);
  } 

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getSchedules = (params = {}) => {
    let url = `${baseUrl}/api/appointments/`;
    if (Object.keys(params).length > 0) {
      url = `${baseUrl}/api/appointments/searchbydate/${formatDate(
        params.startDate
      )}&${formatDate(params.endDate)}&${params.location.value}`;
    }
    axios
      .get(url, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        const appointment = [];
        for (const id in response.data) {
          appointment.push({
            sid: response.data[id]._id,
            clientId: response.data[id].clientId,
            Subject: response.data[id].title,
            StartTime: new Date(response.data[id].startDateTime),
            EndTime: new Date(response.data[id].endDateTime),
            location: response.data[id].branch,
          });
        }
        setAppointments(appointment);
      });
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const handleToggleSwitchForCalenderTableView = () => {
    getSchedules();
    if (isCalendarView === true) {
      getLocations();
    }
    setCalendarView(!isCalendarView);
  };

  const formatDate = (orgDate) => {
    const originalDate = new Date(orgDate);
    return format(originalDate, "yyyy-MM-dd hh:mm:ss");
  };

  // Function to check if a date is 7 or more days from today
  const isDateSelectable = (date) => {
    const sevenDayFromStartDate = addDays(startDate, 7);
    return date >= sevenDayFromStartDate;
  };

  const handleSearchForCalenderTable = () => {
    let valid = true;
    if (startDate === null) {
      valid = false;
      alert("Please select Start Date");
    }
    if (endDate === null) {
      valid = false;
      alert("Please select End Date");
    }
    if (!location) {
      valid = false;
      alert("Please select location");
    }
    if (valid === true) {
      getSchedules({
        startDate: startDate,
        endDate: endDate,
        location: location,
      });
    }
  };

  const [locationList, setLocationList] = React.useState([]);
  const [location, setLocation] = React.useState("");

  const getLocations = () => {
    axios
      .get(`${baseUrl}/api/branches/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        const locationArr = [];
        response.data.map((item) => {
          let hash = {};
          hash["label"] = item.BranchName;
          hash["value"] = item.BranchName;
          locationArr.push(hash);
        });
        setLocationList(locationArr);
      });
  };

  return (
    <div className="w-full">
      <div className="flex-direction: column">
        <span className="p-4 font-weight: inherit; text-2xl">Appointments</span>
        <button
          type="button"
          onClick={navigateToAddAppointment}
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Add New
        </button>
        <div
          className="relative inline-flex toggleButton"
          style={{ top: "8px" }}
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              checked={isCalendarView}
              onChange={handleToggleSwitchForCalenderTableView}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isCalendarView ? "Calendar" : "Table"}
            </span>
          </label>
        </div>
      </div>

      {isCalendarView ? (
        <ScheduleComponent
          position={"fixed"}
          overflow={"scroll"}
          height={"570px"}
          currentView={currentView}
          timezone="Asia/Calcutta"
          views={["Day", "Week", "Month"]}
          eventSettings={{
            dataSource: appointments,
            allowEditing: false,
            allowAdding: false,
            allowDeleting: false,
          }}
          showQuickInfo={false}
          selectedDate={new Date()}
          cellClick={navigateToAddAppointment.bind(this)}
          eventClick={handleOnEventClick.bind(this)}
          navigating={(args) => onNavigation(args)}
        >
          <Inject services={[Day, Week, Month]} />
        </ScheduleComponent>
      ) : (
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ paddingRight: "10px" }}>
              <label className="datePick">Start Date: </label>
              <DatePicker
                showIcon
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                maxDate={endDate}
                className="inputDateClass"
                isClearable
              />
            </div>
            <div style={{ paddingRight: "10px" }}>
              <label>End Date: </label>
              <DatePicker
                showIcon
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={startDate}
                className="inputDateClass"
                isClearable
                filterDate={isDateSelectable}
              />
            </div>
            <div className="col-span-2 ... selctbox_for_location">
              {" "}
              <label style={{ display: "block" }}>location: </label>
              <InputSearch
                options={locationList}
                name="location"
                placeholder="location"
                onchange={(location) => setLocation(location)}
                defaultValue={""}
                value={location}
                isClearable={true}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSearchForCalenderTable}
              style={{
                borderRadius: "20px",
                background: "#0d9488",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              Search
            </button>
          </div>
          <div className="flex  mt-4 flex-row gap-2 ">
            <GridComponent
              dataSource={appointments}
              allowPaging={true}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="Subject"
                  headerText="subject"
                  width="80"
                />
                <ColumnDirective
                  field="StartTime"
                  headerText="startTime"
                  width="80"
                />
                <ColumnDirective
                  field="EndTime"
                  headerText="endTime"
                  width="80"
                />
                <ColumnDirective
                  field="location"
                  headerText="location"
                  width="100"
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
      )}
    </div>
  );
}

export default Appointment;
import React, { useEffect, useState, useRef } from 'react';
import '../index.css';
import { ScheduleComponent, Inject, Day, Month, Week, } from '@syncfusion/ej2-react-schedule';
import { useNavigate, createSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert';
import {
  GridComponent, ColumnDirective, ColumnsDirective, Page, Filter, Sort, ContextMenu, Edit, Toolbar, InfiniteScroll, Resize, ExcelExport, PdfExport, Search
} from '@syncfusion/ej2-react-grids';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputSearch } from '../form_components'

function Appointment() {
  const [userid, setuserid] = React.useState([]);
  const navigate = useNavigate();
  const scheduleObj = useRef(null);
  const [appointments, setappointments] = React.useState([]);
  const [isCalendarView, setCalendarView] = useState(true);
  const navigatetoadd = () => {
    navigate({ pathname: "/addappointment", search: createSearchParams({ id: "new" }).toString() });
  }
  function handel(event) {
    console.log(event)
  }
  useEffect(() => {
    if (!localStorage.getItem('userinfo')) {
      console.log("try")
      navigate('/Login');
    }
    let token = localStorage.getItem('userinfo');
    setuserid(token)
  })
  const onActionBegin = (args) => {
    console.log(args)
    if (args.requestType === 'eventRemove') {
      console.log(args)
      axios.delete("https://devapi.saltworld.co/api/schedule/" + args.data[0].sid).then((response) => {
        swal("Poof! " + args.data.title + " has been deleted!", {
          icon: "success",
        })
        getschedules();
      }).catch((e) => {
        swal(e, {
          icon: "error",
        })
      });
    }
    if (args.requestType === 'eventChange') {
      console.log(args.data)
      axios.patch('https://devapi.saltworld.co/api/schedule/' + args.data.sid, args.data, {
        headers: { 'Content-type': 'application/json; charset=UTF-8', 'auth-token': userid }
      }).then((data) => {
        swal("Yes! " + args.data.title + " has been successfully updated!", {
          icon: "success",
        })
        getschedules();

      }).catch((error) => {
        if (error.response) {
          if (error.response.data["message"] != undefined) {
            swal("Oho! \n" + error.response.data["message"], {
              icon: "error",
            })
          }
        }
      })
    }
  }
  const getschedules = (params = {}) => {
    let url = "https://devapi.saltworld.co/api/schedule/"
    if (Object.keys(params).length > 0) {
      url = `https://devapi.saltworld.co/api/schedule/searchbydate/${formatDate(params.startDate)}&${formatDate(params.endDate)}&${params.location.value}`
    }
    axios.get(url).then((response) => {
      let schedule = []
      for (let id in response.data) {
        schedule.push({ sid: response.data[id]._id, Subject: response.data[id].title, StartTime: new Date(response.data[id].startdatetime), EndTime: new Date(response.data[id].enddatetime), Location: response.data[id].location })
      }
      // console.log(schedule)
      setappointments(schedule);
    })
  }
  useEffect(() => {
    getschedules()
  }, [])

  const handleToggleSwitchForCalenderTableView = () => {
    getschedules()
    if (isCalendarView == true) {
      getLocations()
    }
    setCalendarView(!isCalendarView);
  };

  const formatDate = (orgDate) => {
    const originalDate = new Date(orgDate);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} 00:00:00`;
    return formattedDate
  }

  const today = new Date();
  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 7);

  // Initialize state for start and end dates
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(sevenDaysFromToday);

  // Function to check if a date is 7 or more days from today
  const isDateSelectable = (date) => {
    return date >= sevenDaysFromToday;
  };

  const handleSearchForCalenderTable = () => {
    let valid = true
    if (startDate == null) {
      valid = false
      alert("Please select Start Date")
    }
    if (endDate == null) {
      valid = false
      alert("Please select End Date")
    }
    if (Object.keys(location).length == 0) {
      valid = false
      alert("Please select Location")
    }
    if (valid == true) {
      getschedules({ "startDate": startDate, "endDate": endDate, "location": location })
    }

  }

  const [locationList, setLocationList] = React.useState([]);
  const [location, setLocation] = React.useState({});

  const getLocations = () => {
    axios.get("https://devapi.saltworld.co/api/branchs/").then((response) => {
      let locationArr = []
      response.data.map((item) => {
        let hash = {}
        hash["label"] = item.BranchName
        hash["value"] = item.BranchName
        locationArr.push(hash)
      })
      setLocationList(locationArr)
    })
  }
  const handelLocationselect = (event) => {
    //console.log(event)
    setLocation(event)

  }

  return (
    <div className="w-full">
      <div className='flex-direction: column'>
        <span className='p-4 font-weight: inherit; text-2xl' >Appoinments</span>
        <button type="button" onClick={navigatetoadd} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-small rounded-full text-sm px-5 py-2.5 mr-4 mb-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add New</button>
        <div className='relative inline-flex toggleButton' style={{ top: "8px" }}>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" checked={isCalendarView} onChange={handleToggleSwitchForCalenderTableView} class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isCalendarView ? 'Calendar' : 'Table'}</span>
          </label>
        </div>

      </div>

      {isCalendarView ? <ScheduleComponent style={{
        position: 'fixed',
        overflow: 'scroll',
      }} height={'570px'} ref={scheduleObj} actionBegin={onActionBegin.bind(this)} enablePersistence="true" currentView='Day' timezone='Asia/Calcutta' views={['Day', 'Week', 'Month',]} resourceHeaderTemplate={handel} eventSettings={{ dataSource: appointments }} selectedDate={new Date()}  >
        <Inject services={[Day, Week, Month]} />

      </ScheduleComponent> :
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ paddingRight: "10px" }}>
              <label className='datePick'>Start Date: </label>
              <DatePicker
                showIcon
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                maxDate={endDate}
                className='inputDateClass'
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
                className='inputDateClass'
                isClearable
              // filterDate={isDateSelectable}
              />
            </div>
            <div class="col-span-2 ... selctbox_for_location">  <label style={{ display: "block" }}>Location: </label><InputSearch options={locationList} name="Location" placeholder="Location" onchange={handelLocationselect} defaultvalue={[]} value={location} />
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSearchForCalenderTable} style={{ borderRadius: "20px", background: "#0d9488", paddingBottom: "5px", paddingTop: "5px" }}>
              Search
            </button>
          </div>
          <div className="flex  mt-4 flex-row gap-2 ">
            <GridComponent dataSource={appointments}
              allowPaging={true}
              enableInfiniteScrolling={true}
              infiniteScrollSettings={{ initialBlocks: 5 }}
              allowResizing={true}
            >
              <ColumnsDirective>
                <ColumnDirective field='Subject' headerText='Subject' width='80' />
                <ColumnDirective field='StartTime' headerText='StartTime' width='80' />
                <ColumnDirective field='EndTime' headerText='EndTime' width='80' />
                <ColumnDirective field='Location' headerText='Location' width='100' />
              </ColumnsDirective>
              <Inject services={[Page, Edit, Toolbar, InfiniteScroll, Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport, Search, Resize]} />
            </GridComponent>
          </div>
        </div>
      }
    </div>
  );
}



export default Appointment;
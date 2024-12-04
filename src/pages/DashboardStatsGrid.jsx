import React, { useEffect } from "react";
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from "react-icons/io5";
import { FaCalendarCheck } from "react-icons/fa";
import axios from "axios";


function DashboardStatsGrid() {
  const [totalClient, setTotalClient] = React.useState(0);
  const [totalAppointments, setTotalAppointments] = React.useState(0);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

  const getClientData = () => {
    axios
      .get(`${baseUrl}/api/dashboard/`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setTotalClient(response.data.clientCount);
        setTotalAppointments(response.data.todaysAppointments);
      });
  };

  // const getTodaysAppointments = () => {
  //   axios
  //     .get(`${baseUrl}/api/appointments/byday/${new Date().toLocaleDateString("en-US").replaceAll("/","-")}`, {
  //       headers: {
  //         "auth-token": token,
  //       },
  //     })
  //     .then((response) => {
  //       setTotalAppointments(response.data.length);
  //     });
  // };
  useEffect(() => {
    getClientData();
    // getTodaysAppointments();
  }, []);

  return (
    <div className="flex gap-4 ">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-white font-light">Total Sales</span>
          <div className="flex items-center">
            <strong className="text-xl text-white font-semibold">₹0</strong>
            <span className="text-sm text-white pl-2">0</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-600">
          <IoPieChart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-white font-light">Total Expenses</span>
          <div className="flex items-center">
            <strong className="text-xl text-white font-semibold">₹0</strong>
            <span className="text-sm text-white pl-2">0</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-white font-light">Total Customers</span>
          <div className="flex items-center">
            <strong className="text-xl text-white font-semibold">{totalClient}</strong>
            {/* <span className="text-sm text-white pl-2">0</span> */}
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
          <FaCalendarCheck className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-white font-light">Total Appointments</span>
          <div className="flex items-center">
            <strong className="text-xl text-white font-semibold">{totalAppointments}</strong>
            <span className="text-sm text-white pl-2">Today</span>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
}
function BoxWrapper({ children }) {
  return (
    <div className="bg-orange-600 rounded-lg p-4 flex-1 border border-gray-300 shadow-lg flex items-center">
      {children}
    </div>
  );
}
export default DashboardStatsGrid;

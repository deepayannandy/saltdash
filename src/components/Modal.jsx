import React from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import Input from "../form_components/Input";

const Modal = (prop) => {
  const [services, setServices] = React.useState(prop.memData.services ?? []);
  const [endDate, setEndDate] = React.useState(
    prop.memData.endDate.toString().split("T")[0]
  );
  // eslint-disable-next-line no-undef
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(services);
    const updatedServiceList = {
      enddate: new Date(endDate),
      updatedServiceList: services,
    };
    axios
      .patch(
        `${baseUrl}/api/client_memberships/${prop.cliendtId}&${prop.memData._id}`,
        updatedServiceList,
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      });
  };
  const handleChange = (e, i) => {
    console.log("E value", e.target.value);
    let value = parseInt(e.target.value);
    let index = parseInt(e.target.name);
    console.log("THIS IS SERVICESSSSSS", services[index].sessions);
    let updatedService = services;
    console.log("THIS IS VALUEEE", value);
    if (value > 0 && value < updatedService[i].totalSessions + 1) {
      updatedService[i].sessions = value;
      setServices([...updatedService]);
    }

    console.log("UPDATED LIST", updatedService);
    console.log(services[index].sessions);
  };

  console.log("this is service", services);
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[800px] h-[620px] bg-white p-2 rounded-xl flex-col">
        <div className="my-2 " />
        <div className="flex flex-col sm:flex-row justify-between pl-4 pr-4 items-center mt-4 text-sm text-gray-700">
          <span className=" font-bold text-xl text-gray-600  text-left">
            {prop.header} {prop.memData.name}
          </span>
          <button
            className="text-white text-xl place-self-end"
            onClick={prop.onClose}
          >
            <X color="#303030" />
          </button>
        </div>
        <hr className="my-4 h-0.5 border-t-0 bg-neutral-200 opacity-100 " />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 pl-4 pr-4">
            <div className=" pr-4 pl-4">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <Input
                type="Date"
                name="serviceName"
                disabled={false}
                id="dateOfCommissioning"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                className="block appearance-none w-full max-h-14 bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required=""
              />
            </div>
            {services.map((services, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 pl-4 pr-4">
                <div>
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Service Name
                  </label>
                  <Input
                    type="text"
                    name="serviceName"
                    disabled={true}
                    id="dateOfCommissioning"
                    value={services.name}
                    className="block appearance-none w-full max-h-14 bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Balance
                  </label>
                  <Input
                    type="number"
                    name={i}
                    id="wheelDiameter"
                    onChange={(e) => {
                      handleChange(e, i);
                    }}
                    value={services.sessions}
                    className="block appearance-none w-full max-h-14 bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    required=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row-reverse py-6 pr-4">
            <button className="bg-transparent hover:bg-green-500 text-[#22943c] font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

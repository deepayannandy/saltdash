import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Header, InputSelect } from "../form_components";
import { BsArrowLeftShort } from "react-icons/bs";

function AddMemberships() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Edit"];
  const [branches, setBranches] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [serviceName, setServiceName] = React.useState([]);
  const [selectedService, setSelectedService] = React.useState([]);
  const [srs, setSrs] = React.useState(new Map());
  const [count, setCount] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [pathParams] = useSearchParams();

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  let service = new Map();
  const token = localStorage.getItem("userinfo");

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  const getServiceData = () => {
    axios
      .get(`${baseUrl}/api/services/`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setServices(response.data);
        let servicesList = ["Select"];
        for (let services in response.data) {
          service.set(response.data[services].name, response.data[services]);
          servicesList.push(response.data[services].name);
        }
        setServiceName(servicesList);
        setSrs(service);
      });
  };

  useEffect(() => {
    getServiceData();
  }, []);


  const getBranchList = () => {
    axios
      .get(`${baseUrl}/api/branches/`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        const clientList = [];
        for (let client in response.data) {
          clientList.push(response.data[client].BranchName);
        }
        setBranches(clientList);
      });
  };

  useEffect(() => {
    getBranchList();
  }, []);

  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      placeholder: "Membership Name",
    },
    {
      id: 2,
      name: "cost",
      type: "number",
      placeholder: "Membership Cost",
    },
    {
      id: 3,
      name: "sellingCost",
      type: "number",
      placeholder: "Selling Cost",
    },
    {
      id: 4,
      name: "hsnCode",
      type: "text",
      placeholder: "HSN Code",
    },
    {
      id: 5,
      name: "taxRate",
      type: "number",
      placeholder: "Tax",
    },
    {
      id: 6,
      name: "count",
      type: "number",
      value: count,
      onChange: handleCountChange,
      placeholder: "Count",
    },
    {
      id: 7,
      name: "isUnlimited",
      type: "checkbox",
    },
    {
      id: 8,
      name: "validity",
      type: "number",
      placeholder: "Validity",
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const data = new FormData(e.target);
    let receivedData = Object.fromEntries(data.entries());
    receivedData.serviceIds = selectedService.map((service) => service._id);
    receivedData.isUnlimited = isUnlimited;
    axios
      .post(`${baseUrl}/api/memberships`, receivedData, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "auth-token": token,
        },
      })
      .then(() => {
        navigate("/membership");
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data);
          if (error.response.data["message"] !== undefined) {
            setErrorMessage(error.response.data["message"]);
          }
        }
      });
  };

  const addEquipments = (e) => {
    if (selectedServiceName.length > 1 && selectedServiceName !== "Select") {
      const serviceWithCount = srs.get(selectedServiceName);
      serviceWithCount.count = count;
      setCount(0);
      setSelectedService([...selectedService, serviceWithCount]);
    }
  };

  return (
    // <div className="flex flex-row gap-1">
    <div className="  justify-center">
      {errorMessage.length > 0 ? (
        <div
          class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 "
          role="alert"
        >
          <p class="font-bold">Something Went Wrong</p>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div />
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 px-8 rounded-lg">
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl mt-5 absolute left-23.1 top-20 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Header
          title={
            pathParams.get("id") === "new"
              ? "Create a new Membership"
              : "Edit membership"
          }
        />
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <InputSelect
            name="branch"
            placeholder="Membership Branch"
            options={branches}
          ></InputSelect>
        </div>
        <div className="">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Membership Description
          </label>
          <textarea
            name="description"
            placeholder="Membership Description"
            className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className=" grid justify-items-stretch grid-cols-6 gap-4">
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          <Input key={inputs[7].id} {...inputs[7]}></Input>
          {/* <Input key={inputs[6].id} {...inputs[6]}></Input> */}
          <div class="flex items-center">
            <input
              name="isUnlimited"
              value={isUnlimited}
              onChange={() => {
                setIsUnlimited(!isUnlimited);
              }}
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            ></input>
            <label
              for="checked-checkbox"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Is Unlimited
            </label>
          </div>
        </div>
        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
          <div>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-state"
            >
              Select Service
            </label>
            <div class="relative">
              <select
                name="SelectService"
                onChange={(event) => setSelectedServiceName(event.target.value)}
                class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
                id="grid-state"
              >
                {serviceName.map((option) => (
                  <option>{option}</option>
                ))}
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <Input key={inputs[5].id} {...inputs[5]}></Input>
          <button
            className="w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
            type="button"
            onClick={addEquipments}
          >
            Add
          </button>
        </div>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Added Services
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
                  Price
                </th>
                <th class="font-bold py-2 px-4 border-b border-l border-r  text-left">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedService.map((sr) => (
                <tr>
                  <td class="border border-slate-700 ...">{sr.name}</td>
                  <td class="border border-slate-700 ...">{sr.duration}</td>
                  <td class="border border-slate-700 ...">{sr.sellingCost}</td>
                  <td class="border border-slate-700 ...">{sr.count}</td>
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
        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          type="submit"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default AddMemberships;

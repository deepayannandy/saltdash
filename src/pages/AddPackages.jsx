import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Header, InputSelect } from "../form_components";
import swal from "sweetalert";
import { BsArrowLeftShort } from "react-icons/bs";
function AddPackages() {
  const state = {
    button: 1,
  };
  const editing = { allowEditing: true };
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Edit"];
  const [userId, setUserId] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [serviceName, setServiceName] = React.useState([]);
  const [selectedService, setSelectedService] = React.useState([]);
  const [srs, setSrs] = React.useState(new Map());
  const [pathParams] = useSearchParams();
  const [packageName, setPackageName] = React.useState([]);
  const [serviceCategory, setServiceCategory] = React.useState([]);
  const [duration, setDuration] = React.useState([]);
  const [serviceCost, setServiceCost] = React.useState([]);
  const [sellingCost, setSellingCost] = React.useState([]);
  const [packageDescription, setPackageDescription] = React.useState([]);
  const [taxRate, setTaxRate] = React.useState([]);
  const [branch, setBranch] = React.useState('');
  const [hsnCode, setHsnCode] = React.useState([]);

  let selected = "";
  let service = new Map();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");

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
        const serviceArray = ["Select"];
        for (const id in response.data) {
          service.set(response.data[id].name, response.data[id]);
          serviceArray.push(response.data[id].name);
        }
        setServiceName(serviceArray);
        setSrs(service);
      });
  };

  useEffect(() => {
    getServiceData();
    getServicePackageData();
    getBranchList();
  }, []);

  const getServicePackageData = () => {
    if (pathParams.get("id") !== "new") {
      axios
        .get(
          `${baseUrl}/api/servicepackages/` + pathParams.get("id").toString(),
          {
            headers: { "auth-token": token },
          }
        )
        .then((response) => {
          setPackageName(response.data.PackageName);
          setServiceCategory(response.data.ServiceCategory);
          setServiceCost(response.data.ServiceCost);
          setDuration(response.data.Duration);
          setHsnCode(response.data.HsnCode);
          setSellingCost(response.data.SellingCost);
          setTaxRate(response.data.Taxrate);
          setBranch(response.data.Branch);
          setPackageDescription(response.data.PackageDescription);
          setSelectedService(response.data.ServicesId);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  const getBranchList = () => {
    axios
      .get(`${baseUrl}/api/branches/`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        const branchList = [];
        for (const branchData in response.data) {
          branchList.push(response.data[branchData].BranchName);
        }
        setBranches(branchList);
      });
  };

  const inputs = [
    {
      id: 1,
      name: "PackageName",
      type: "text",
      placeholder: "Package Name",
      value: packageName,
      onChange: (event) => {
        setPackageName(event.target.value);
      },
    },
    {
      id: 2,
      name: "ServiceCost",
      type: "number",
      placeholder: "serviceCost",
      value: serviceCost,
      onChange: (event) => {
        setServiceCost(event.target.value);
      },
    },
    {
      id: 3,
      name: "SellingCost",
      type: "number",
      placeholder: "sellingCost",
      value: sellingCost,
      onChange: (event) => {
        setSellingCost(event.target.value);
      },
    },
    {
      id: 4,
      name: "HsnCode",
      type: "text",
      placeholder: "HSN Code",
      value: hsnCode,
      onChange: (event) => {
        setHsnCode(event.target.value);
      },
    },
    {
      id: 5,
      name: "Taxrate",
      type: "number",
      placeholder: "Tax",
      value: taxRate,
      onChange: (event) => {
        setTaxRate(event.target.value);
      },
    },
    {
      id: 6,
      name: "duration",
      type: "number",
      placeholder: "duration",
      value: duration,
      onChange: (event) => {
        setDuration(event.target.value);
      },
    },
    ,
  ];
  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    if (state.button === 2) {
      const data = new FormData(e.target);
      const receivedData = Object.fromEntries(data.entries());
      receivedData.ServicesId = selectedService;
      if (pathParams.get("id") === "new") {
        axios
          .post(`${baseUrl}/api/servicepackages`, receivedData, {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "auth-token": token,
            },
          })
          .then((data) => {
            swal(
              "Yes! " +
                receivedData.packageName +
                " has been successfully Added!",
              {
                icon: "success",
              }
            );
            navigate("/packages");
          })
          .catch((error) => {
            if (error.response) {
              setErrorMessage(error.response.data);
              if (error.response.data["message"] !== undefined) {
                setErrorMessage(error.response.data["message"]);
                swal("Oho! \n" + error.response.data["message"], {
                  icon: "error",
                });
              }
            }
          });
      } else {
        axios
          .patch(
            `${baseUrl}/api/servicepackages/` + pathParams.get("id"),
            receivedData,
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "auth-token": token,
              },
            }
          )
          .then(() => {
            swal(
              "Yes! " +
                receivedData.packageName +
                " has been successfully Updated!",
              {
                icon: "success",
              }
            );
            navigate("/packages");
          })
          .catch((error) => {
            if (error.response) {
              setErrorMessage(error.response.data);
              if (error.response.data["message"] !== undefined) {
                setErrorMessage(error.response.data["message"]);
                swal("Oho! \n" + error.response.data["message"], {
                  icon: "error",
                });
              }
            }
          });
      }
    }
  };

  const setService = (e) => {
    selected = e.target.value;
  };

  const addEquipments = () => {
    if (selected.length > 1 && selected !== "Select") {
      setSelectedService([...selectedService, srs.get(selected)]);
    }
  };

  function removeService(service) {
    const newList = selectedService.filter((li) => li.name !== service);
    setSelectedService(newList);
  }

  return (
    // <div className="flex flex-row gap-1">
    <div className="  justify-center">
      {errorMessage.length > 0 ? (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 "
          role="alert"
        >
          <p className="font-bold">Something Went Wrong</p>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div />
      )}
      <form onSubmit={handleSubmit} className=" bg-white p-8 px-8 rounded-lg">
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl mt-5 absolute left-23.1 top-20 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Header
          title={
            pathParams.get("id") === "new"
              ? "Create a new Package"
              : "Edit Package"
          }
        />
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <InputSelect
            name="Branch"
            placeholder="Package branch"
            value={branch}
            options={branches}
            onchange={(event) => setBranch(event.target.value)}
          ></InputSelect>
        </div>
        <div className="">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Package Description
          </label>
          <textarea
            name="PackageDescription"
            value={packageDescription}
            onChange={(event) => {
              setPackageDescription(event.target.value);
            }}
            placeholder="Package Description"
            className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className=" grid justify-items-stretch grid-cols-4 gap-4">
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
        </div>
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <div>
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Select Service
            </label>
            <div className="relative">
              <select
                name="SelectService"
                onChange={setService}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
                id="grid-state"
              >
                {serviceName.map((option) => (
                  <option key={option.name}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <button
            className="w-[200px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
            type="button"
            onClick={addEquipments}
          >
            Add
          </button>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Added Services
        </label>
        <div className="p-1">
          <table className="w-5/6  border">
            <thead>
              <tr>
                <th className="font-bold py-2 px-4 border-b border-l border-r text-left">
                  Service Name
                </th>
                <th className="font-bold py-2 px-4 border-b border-l border-r  text-left">
                  Duration
                </th>
                <th className="font-bold py-2 px-4 border-b border-l border-r  text-left">
                  Price
                </th>
                <th className="font-bold py-2 px-4 border-b border-l border-r  text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedService.map((service) => (
                <tr>
                  <td className="border border-slate-700 ...">
                    {service.name}
                  </td>
                  <td className="border border-slate-700 ...">
                    {service.duration}
                  </td>
                  <td className="border border-slate-700 ...">
                    {service.sellingCost}
                  </td>
                  <td className="border border-slate-700 ...">
                    <button
                      type="delete"
                      style={{ background: "#B22222" }}
                      className="button text-white py-1 px-2 capitalize rounded-2xl text-md"
                      onClick={() => {
                        removeService(service.name);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          onClick={() => (state.button = 2)}
          type="submit"
        >
          {pathParams.get("id") === "new" ? "Submit" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AddPackages;

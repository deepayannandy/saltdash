import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Header, InputSelect } from "../form_components";
import swal from "sweetalert";
import { BsArrowLeftShort } from "react-icons/bs";

function AddServices() {
  const navigate = useNavigate();
  const [apicalled, setapicalled] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState([]);
  const [userId, setUserId] = React.useState('');
  const [serviceName, setServiceName] = React.useState([]);
  const [serviceCategory, setServiceCategory] = React.useState([]);
  const [duration, setDuration] = React.useState([]);
  const [serviceCost, setServiceCost] = React.useState([]);
  const [sellingCost, setSellingCost] = React.useState([]);
  const [serviceDescription, setServiceDescription] = React.useState([]);
  const [taxRate, setTaxRate] = React.useState([]);
  const [branch, setBranch] = React.useState([]);
  const [resourceType, setResourceType] = React.useState([]);
  const [hsnCode, setHsnCode] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [pathParams] = useSearchParams();

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
        let branchList = [];
        for (const client in response.data) {
          branchList.push(response.data[client].BranchName);
        }
        setBranches(branchList);
      });
  };

  useEffect(() => {
    getBranchList();
  }, []);

  const getServiceData = () => {
    if (pathParams.get("id") !== "new") {
      axios
        .get(`${baseUrl}/api/services/` + pathParams.get("id").toString(), {
          headers: {
            "auth-token": token,
          },
        })
        .then((response) => {
          setapicalled(true);
          setServiceName(response.data.name);
          setServiceCategory(response.data.category);
          setServiceCost(response.data.cost);
          setDuration(response.data.duration);
          setHsnCode(response.data.hsnCode);
          setSellingCost(response.data.sellingCost);
          setTaxRate(response.data.taxRate);
          setBranch(response.data.branch);
          setServiceDescription(response.data.description);
          setResourceType(response.data.resourceType);
          console.log("api called");
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    if(!apicalled)getServiceData();
  }, );

  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      placeholder: "Service Name",
      value: serviceName,
      onChange: (event) => {
        setServiceName(event.target.value);
      },
    },
    {
      id: 2,
      name: "category",
      type: "text",
      placeholder: "Service Category",
      value: serviceCategory,
      onChange: (event) => {
        setServiceCategory(event.target.value);
      },
    },

    {
      id: 3,
      name: "duration",
      type: "number",
      placeholder: "Duration (min)",
      value: duration,
      onChange: (event) => {
        setDuration(event.target.value);
      },
    },
    {
      id: 4,
      name: "cost",
      type: "number",
      placeholder: "Service Cost",
      value: serviceCost,
      onChange: (event) => {
        setServiceCost(event.target.value);
      },
    },
    {
      id: 5,
      name: "sellingCost",
      type: "number",
      placeholder: "Selling Cost",
      value: sellingCost,
      onChange: (event) => {
        setSellingCost(event.target.value);
      },
    },
    {
      id: 6,
      name: "taxRate",
      type: "text",
      placeholder: "Tax rate",
      value: taxRate,
      onChange: (event) => {
        setTaxRate(event.target.value);
      },
    },
    {
      id: 7,
      name: "hsnCode",
      type: "text",
      placeholder: "HSN Code",
      value: hsnCode,
      onChange: (event) => {
        setHsnCode(event.target.value);
      },
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const data = new FormData(e.target);
    let receivedData = Object.fromEntries(data.entries());
    receivedData.userId = userId;
    if (pathParams.get("id") === "new") {
      axios
        .post(`${baseUrl}/api/services/`, receivedData, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then(() => {
          swal(
            "Yes! " +
              receivedData.serviceName +
              " has been successfully added!",
            {
              icon: "success",
            }
          );
          navigate("/services");
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
          `${baseUrl}/api/services/` + pathParams.get("id"),
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
              receivedData.serviceName +
              " has been successfully updated!",
            {
              icon: "success",
            }
          );
          navigate("/services");
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
  };

  return (
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
      <form onSubmit={handleSubmit} className=" bg-white p-8 px-8 rounded-lg">
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl mt-5 absolute left-23.1 top-20 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Header
          title={
            pathParams.get("id") === "new"
              ? "Create a new service"
              : "Edit Service"
          }
        />
        <Input key={inputs[0].id} {...inputs[0]}></Input>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          serviceDescription
        </label>
        <textarea
          name="description"
          value={serviceDescription}
          onChange={(event) => {
            setServiceDescription(event.target.value);
          }}
          placeholder="Service Description"
          className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className=" grid justify-items-stretch grid-cols-6 gap-4">
          <Input key={inputs[1].id} {...inputs[1]}></Input>
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[4].id} {...inputs[4]}></Input>
          <Input key={inputs[5].id} {...inputs[5]}></Input>
          <Input key={inputs[6].id} {...inputs[6]}></Input>
        </div>
        {pathParams.get("id") === "new" ? (
          <div className=" grid justify-items-stretch grid-cols-2 gap-4">
            <InputSelect
              name="branch"
              placeholder="Branch"
              options={branches}
            ></InputSelect>
            <InputSelect
              name="resourceType"
              placeholder="resourceType"
              options={["FLOAT TANK", "SALT CAVE", "SAUNA"]}
            ></InputSelect>
          </div>
        ) : (
          <div className="pt-4 grid justify-items-stretch grid-cols-2 gap-4">
            <p className="text-lg text-slate-700">Branch: {branch}</p>
            <p className="text-lg text-slate-700">
              resourceType: {resourceType}
            </p>
          </div>
        )}
        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          type="submit"
        >
          {pathParams.get("id") === "new" ? "Submit" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AddServices;

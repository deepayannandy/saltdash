import React, { useEffect } from "react";
import axios from "axios";
import { Input, Header, InputSelect } from "../form_components";
import { useNavigate, useSearchParams,createSearchParams } from "react-router-dom";
import swal from "sweetalert";
import { BsArrowLeftShort } from "react-icons/bs";
import { format } from "date-fns";

function AddClients() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState([]);
  const [userId, setUserId] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [clientType, setClientType] = React.useState("Individual");
  const [pathParams] = useSearchParams();
  const [firstName, setFirstName] = React.useState([]);
  const [lastName, setLastName] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [alternate_email, set_alternate_Email] = React.useState([]);
  const [alternate_mobileNumber, set_alternate_MobileNumber] = React.useState([]);
  const [mobileNumber, setMobileNumber] = React.useState([]);
  const [birthDate, setBirthDate] = React.useState([]);
  const [onBoardingDate, setOnBoardingDate] = React.useState(format(new Date(),"yyyy-MM-dd"));
  const [anniversary, setAnniversary] = React.useState([]);
  const [occupation, setOccupation] = React.useState([]);
  const [clientSource, setClientSource] = React.useState([]);
  const [gender, setGender] = React.useState([]);
  const [pan, setPAN] = React.useState([]);
  const [gst, setGST] = React.useState([]);
  const [companyLegalName, setCompanyLegalName] = React.useState([]);
  const [companyTradeName, setCompanyTradeName] = React.useState([]);
  const [billingAddress, setBillingAddress] = React.useState([]);
  const [shippingAddress, setShippingAddress] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState('');

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("userinfo");


  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
  });

  useEffect(() => {
    getBranchList();
  }, []);

    const getBranchList = () => {
      axios
        .get(`${baseUrl}/api/branches/`, {
          headers: {
            "auth-token": token,
          },
        })
        .then((response) => {
          const clientList = [];
          for (let client in response.data) {
            clientList.push(response.data[client].BranchName);
          }
          setBranches(clientList);
        });
    };

  const getClientsData = () => {
    if (pathParams.get("id") !== "new") {
      axios
        .get(`${baseUrl}/api/clients/` + pathParams.get("id").toString(), {
          headers: {
            "auth-token": token,
          },
        })
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setMobileNumber(response.data.mobileNumber);
          setBirthDate(response.data.birthDate);
          setAnniversary(response.data.anniversary);
          setOccupation(response.data.occupation);
          setGST(response.data.gst);
          setPAN(response.data.pan);
          setClientType(response.data.type);
          setClientSource(response.data.source);
          setCompanyLegalName(response.data.companyLegalName);
          setCompanyTradeName(response.data.companyTradeName);
          setGender(response.data.gender);
          setShippingAddress(response.data.shippingAddress);
          setBillingAddress(response.data.billingAddress);
          setSelectedBranch(response.data.parentBranchId);
          set_alternate_MobileNumber(response.data.alternate_mobileNumber)
          set_alternate_Email(response.data.alternate_email);
          setOnBoardingDate(format(new Date(response.data.onBoardingDate),"yyyy-MM-dd"))
        })
        .catch((error) => {
          swal("Oho! \n" + error, {
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    getClientsData();
  }, []);

  const inputs = [
    {
      id: 1,
      name: "firstName",
      type: "text",
      placeholder: "First Name",
      value: firstName,
      onChange: (event) => {
        setFirstName(event.target.value);
      },
    },
    {
      id: 2,
      name: "lastName",
      type: "text",
      placeholder: "Last Name",
      value: lastName,
      onChange: (event) => {
        setLastName(event.target.value);
      },
    },
    {
      id: 3,
      name: "mobileNumber",
      type: "text",
      placeholder: "Mobile Number",
      value: mobileNumber,
      onChange: (event) => {
        setMobileNumber(event.target.value);
      },
    },
    {
      id: 4,
      name: "email",
      type: "text",
      placeholder: "Email",
      value: email,
      onChange: (event) => {
        setEmail(event.target.value);
      },
    },
    {
      id: 5,
      name: "birthDate",
      type: "date",
      placeholder: "Birth Date",
      value: birthDate,
      onChange: (event) => {
        setBirthDate(event.target.value);
      },
    },
    {
      id: 6,
      name: "anniversary",
      type: "date",
      placeholder: "Anniversary",
      value: anniversary,
      onChange: (event) => {
        setAnniversary(event.target.value);
      },
    },
    {
      id: 7,
      name: "occupation",
      type: "text",
      placeholder: "Occupation",
      value: occupation,
      onChange: (event) => {
        setOccupation(event.target.value);
      },
    },
    {
      id: 8,
      name: "source",
      type: "text",
      placeholder: "Source",
      value: clientSource,
      onChange: (event) => {
        setClientSource(event.target.value);
      },
    },
    {
      id: 9,
      name: "pan",
      type: "text",
      placeholder: "PAN",
      value: pan,
      onChange: (event) => {
        setPAN(event.target.value);
      },
    },
    {
      id: 10,
      name: "gst",
      type: "text",
      placeholder: "GST",
      value: gst,
      onChange: (event) => {
        setGST(event.target.value);
      },
    },
    {
      id: 11,
      name: "companyLegalName",
      type: "text",
      placeholder: "Company Legal Name",
      value: companyLegalName,
      onChange: (event) => {
        setCompanyLegalName(event.target.value);
      },
    },
    {
      id: 12,
      name: "companyTradeName",
      type: "text",
      placeholder: "Company Trade Name",
      value: companyTradeName,
      onChange: (event) => {
        setCompanyTradeName(event.target.value);
      },
    },
    {
      id: 13,
      name: "alternate_email",
      type: "text",
      placeholder: "Alternate Email",
      value: alternate_email,
      onChange: (event) => {
        set_alternate_Email(event.target.value);
      },
    },
    {
      id: 14,
      name: "alternate_mobileNumber",
      type: "text",
      placeholder: "Alternate Mobile Number",
      value: alternate_mobileNumber,
      onChange: (event) => {
        set_alternate_MobileNumber(event.target.value);
      },
    },
    {
      id: 15,
      name: "onBoardingDate",
      type: "date",
      placeholder: "Onboarding Date",
      value: onBoardingDate,
      onChange: (event) => {
        setOnBoardingDate(event.target.value);
      },
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const data = new FormData(e.target);
    const receivedData = Object.fromEntries(data.entries());
    if (pathParams.get("id") === "new") {
      axios
        .post(`${baseUrl}/api/clients/`, receivedData, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then((response) => {
          swal(
            "Yes! " +
              receivedData.firstName +
              " has been successfully registered!",
            {
              icon: "success",
            }
          );
          console.log(">>>>>>>> Create api response",response)
          setTimeout(function() {
            navigate({
              pathname: "/customerdetails",
              search: createSearchParams({ id: response.data }).toString(),
            });
          }, 1000);
          
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data);
            if (error.response.data["message"] !== undefined) {
              setErrorMessage(error.response.data["message"]);
            }
          }
        });
    } else {
      console.log(receivedData)
      axios
        .patch(`${baseUrl}/api/clients/` + pathParams.get("id"), receivedData, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then((response) => {
          swal(
            "Yes! user data for " +
              receivedData.firstName +
              " has been successfully updated!",
            {
              icon: "success",
            }
          );
          setTimeout(function() {
            navigate({
              pathname: "/customerdetails",
              search: createSearchParams({ id: pathParams.get("id") }).toString(),
            });
          }, 1000);
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

  const setService = (e) => {
    setClientType(e.target.value);
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
              ? "Create a new Client"
              : "Edit Client Details"
          }
        />
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
        </div>

        <div className=" grid justify-items-stretch grid-cols-4 gap-4">
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[13].id} {...inputs[13]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <Input key={inputs[12].id} {...inputs[12]}></Input>
        </div>

        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
        <Input key={inputs[4].id} {...inputs[4]}></Input>
          <Input key={inputs[5].id} {...inputs[5]}></Input>
            <InputSelect
              name="gender"
              placeholder="Gender"
              value={gender}
              onChange={event => {
                setGender(event.target.value)
              }}
              options={["Male", "Female","Not prefer to say", "Others"]}
            ></InputSelect>
        </div>
        <div className=" grid justify-items-stretch grid-cols-3 gap-4">
          <Input key={inputs[6].id} {...inputs[6]}></Input>
          <Input key={inputs[7].id} {...inputs[7]}></Input>
            <div>
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-state"
              >
                Client Type
              </label>
              <div class="relative">
                <select
                  name="type"
                  onChange={setService}
                  value={clientType}
                  class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
                  id="grid-state"
                >
                  {["Individual", "Business"].map((option) => (
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
          
        </div>
        {clientType === "Business" ? (
          <div className="grid justify-items-stretch grid-cols-4 gap-4">
            <Input key={inputs[8].id} {...inputs[8]}></Input>
            <Input key={inputs[9].id} {...inputs[9]}></Input>
            <Input key={inputs[10].id} {...inputs[10]}></Input>
            <Input key={inputs[11].id} {...inputs[11]}></Input>
          </div>
        ) : (
          <div />
        )}
        <div className="grid justify-items-stretch grid-cols-2 pt-3 gap-4">
          <dev className="flex">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Billing Address
            </label>
            <textarea
              name="billingAddress"
              placeholder="billingAddress"
              className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={billingAddress}
              onChange={(event) => {
                setBillingAddress(event.target.value);
              }}
            />
          </dev>
          <dev className="flex">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Shipping Address
            </label>
            <textarea
              name="shippingAddress"
              placeholder="shippingAddress"
              className="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={shippingAddress}
              onChange={(event) => {
                setShippingAddress(event.target.value);
              }}
            />
          </dev>
        </div>
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <InputSelect
            name="parentBranchId"
            placeholder="Branch"
            value={selectedBranch}
            options={branches}
            onchange={(event) => {
              setSelectedBranch(event.target.value);
            }}
          ></InputSelect>
          <Input key={inputs[14].id} {...inputs[14]}></Input>
        </div>
        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          type="submit"
        >
          {pathParams.get("id") === "new" ? "SUBMIT" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AddClients;

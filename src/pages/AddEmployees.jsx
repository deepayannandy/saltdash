import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Header, InputSelect } from "../form_components";
import swal from "sweetalert";
import { BsArrowLeftShort } from "react-icons/bs";

function AddEmployees() {
  const editing = { allowEditing: true };
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Edit"];
  const [branches, setBranches] = React.useState([]);
  const [paramsData] = useSearchParams();
  const [firstName, setFirstName] = React.useState([]);
  const [lastName, setLastName] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [mobile, setMobile] = React.useState([]);
  const [userBranch, setUserBranch] = React.useState('');
  const [userType, setUserType] = React.useState('');

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
        const clientList = [];
        for (const client in response.data) {
          clientList.push(response.data[client].BranchName);
        }
        setBranches(clientList);
      });
  };

  useEffect(() => {
    getBranchList();
  }, []);

  const getUserData = () => {
    if (paramsData.get("id") !== "new") {
      axios
        .get(`${baseUrl}/api/user/` + paramsData.get("id").toString(), {
          headers: {
            "auth-token": token,
          },
        })
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setMobile(response.data.mobile);
          setUserBranch(response.data.userBranch);
          setUserType(response.data.userType);
        })
        .catch((e) => {
          swal("Oho! \n" + e, {
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    getUserData();
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
      name: "email",
      type: "text",
      placeholder: "Email",
      value: email,
      onChange: (event) => {
        setEmail(event.target.value);
      },
    },
    {
      id: 4,
      name: "mobile",
      type: "text",
      placeholder: "Mobile",
      value: mobile,
      onChange: (event) => {
        setMobile(event.target.value);
      },
    },
    {
      id: 4,
      name: "password",
      type: "text",
      placeholder: "Password",
    },
  ];

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const data = new FormData(e.target);
    const receivedData = Object.fromEntries(data.entries());
    if (paramsData.get("id") === "new") {
      axios
        .post(`${baseUrl}/api/user/register`, receivedData, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then(() => {
          swal(
            "Yes! " +
              receivedData.firstName +
              " has been successfully registered!",
            {
              icon: "success",
            }
          );
          navigate("/employees");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data !== undefined) {
              setErrorMessage(error.response.data["message"]);
              swal("Oho! \n" + error.response.data["message"], {
                icon: "error",
              });
            }
          }
        });
    } else {
      axios
        .patch(`${baseUrl}/api/user/` + paramsData.get("id"), receivedData, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth-token": token,
          },
        })
        .then((data) => {
          swal(
            "Yes! user data for " +
              receivedData.firstName +
              " has been successfully updated!",
            {
              icon: "success",
            }
          );
          navigate("/employees");
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
      <form onSubmit={handleSubmit} className=" bg-white p-8 px-8 rounded-lg">
        <BsArrowLeftShort
          style={{ left: "107px" }}
          className="text-gray-700 text-3xl mt-5  absolute left-23.1 top-20 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        {paramsData.get("id") == "new" ? (
          <Header title="Create a new user" />
        ) : (
          <Header title="Edit User Details" />
        )}
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <Input key={inputs[1].id} {...inputs[1]}></Input>
        </div>
        <div className=" grid justify-items-stretch grid-cols-4 gap-4">
          <Input key={inputs[2].id} {...inputs[2]}></Input>
          <Input key={inputs[3].id} {...inputs[3]}></Input>
          <InputSelect
            name="userBranch"
            placeholder="User Branch"
            options={branches}
            value={userBranch}
            onchange={(event) => setUserBranch(event.target.value)}
          ></InputSelect>
          <InputSelect
            name="userType"
            placeholder="User Type"
            options={["Admin", "Employee", "Branch Admin"]}
            value={userType}
            onchange={(event) => setUserType(event.target.value)}
          ></InputSelect>
        </div>
        <Input key={inputs[4].id} {...inputs[4]}></Input>
        <div className=" grid justify-items-stretch grid-cols-2 gap-4"></div>
        <button
          className="w-[400px] my-5 py-2 bg-teal-600  text-white font-semibold rounded-lg"
          type="submit"
        >
          {paramsData.get("id") === "new" ? "Submit" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AddEmployees;

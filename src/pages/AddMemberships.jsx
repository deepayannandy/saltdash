import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Header, InputSelect } from "../form_components";
import { BsArrowLeftShort } from "react-icons/bs";

function AddMemberships() {
  const editing = { allowEditing: true };
  const navigate = useNavigate();
  const [errormessage, seterrormessage] = React.useState([]);
  const toolbarOptions = ["Search", "ExcelExport", "PdfExport", "Edit"];
  const [userid, setuserid] = React.useState([]);
  const [branchs, setbranchs] = React.useState([]);
  const [services, setservices] = React.useState([]);
  const [servicename, setservicename] = React.useState([]);
  const [selectedservice, setselectedservice] = React.useState([]);
  const [srs, setsrs] = React.useState(new Map());
  const [count, setcount] = useState(0);
  const [isun, setisun] = useState(false);
  //const [searchParams] = useSearchParams();

  const handlecountChange = (event) => {
    setcount(event.target.value);
  };
  let selected = "";
  var service = new Map();
  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
    let token = localStorage.getItem("userinfo");
    setuserid(token);
  });
  const getservicedata = () => {
    axios.get("https://devapi.saltworld.co/api/services/").then((response) => {
      setservices(response.data);
      let servicen = ["Select"];
      for (let services in response.data) {
        service.set(
          response.data[services].ServiceName,
          response.data[services]
        );
        servicen.push(response.data[services].ServiceName);
      }
      setservicename(servicen);
      console.log(service);
      setsrs(service);
    });
  };
  useEffect(() => {
    getservicedata();
    //getClientMembershipData();
  }, []);

    // const getClientMembershipData = () => {
    //   if (rdata.get("id") != "new") {
    //     axios
    //       .get(
    //         "https://devapi.saltworld.co/api/client_membership/" + rdata.get("id").toString()
    //       )
    //       .then((response) => {
    //         setfirstname(response.data.FirstName);
    //         setlastname(response.data.LastName);
    //         setemail(response.data.email);
    //         setmob(response.data.mobile);
    //       })
    //       .catch((e) => {
    //         swal("Oho! \n" + e, {
    //           icon: "error",
    //         });
    //       });
    //   }
    // };
    useEffect(() => {
    }, []);
  
  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      // console.log("try")
      navigate("/Login");
    }
    let token = localStorage.getItem("userinfo");
    console.log(token);
  });
  const getbranchList = () => {
    axios.get("https://devapi.saltworld.co/api/branchs/").then((response) => {
      let cllist = [];
      for (let client in response.data) {
        cllist.push(response.data[client].BranchName);
      }
      // console.log(cllist)
      setbranchs(cllist);
    });
  };
  useEffect(() => {
    getbranchList();
  }, []);
  const inputs = [
    {
      id: 1,
      name: "MembershipName",
      type: "text",
      placeholder: "Membership Name",
    },
    {
      id: 2,
      name: "MembershipCost",
      type: "number",
      placeholder: "Membership Cost",
    },
    {
      id: 3,
      name: "SellingCost",
      type: "number",
      placeholder: "Selling Cost",
    },
    {
      id: 4,
      name: "HsnCode",
      type: "text",
      placeholder: "HSN Code",
    },
    {
      id: 5,
      name: "Taxrate",
      type: "number",
      placeholder: "Tax",
    },
    {
      id: 6,
      name: "count",
      type: "number",
      value: count,
      onChange: handlecountChange,
      placeholder: "Count",
    },
    {
      id: 7,
      name: "isunlimited",
      type: "checkbox",
    },
    {
      id: 8,
      name: "validity",
      type: "number",
      placeholder: "Validity",
    },

    ,
  ];
  const handleSubmit = async (e) => {
    seterrormessage("");
    e.preventDefault();
    const data = new FormData(e.target);
    let recievedData = Object.fromEntries(data.entries());
    recievedData.Services = selectedservice;
    recievedData.isunlimited = isun;
    console.log(recievedData);
    axios
      .post("http://localhost:6622/api/memberships", recievedData, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "auth-token": userid,
        },
      })
      .then((data) => {
        navigate("/membership");
      })
      .catch((error) => {
        if (error.response) {
          seterrormessage(error.response.data);
          if (error.response.data["message"] != undefined) {
            seterrormessage(error.response.data["message"]);
          }
        }
      });
  };
  const setService = (e) => {
    selected = e.target.value;
  };
  const addequipments = (e) => {
    if (selected.length > 1 && selected != "Select") {
      console.log(selected);
      let servicewithcount = srs.get(selected);
      servicewithcount.count = count;
      setcount(0);
      setselectedservice([...selectedservice, servicewithcount]);
    }
  };

  return (
    // <div className="flex flex-row gap-1">
    <div className="  justify-center">
      {errormessage.length > 0 ? (
        <div
          class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 "
          role="alert"
        >
          <p class="font-bold">Something Went Wrong</p>
          <p>{errormessage}</p>
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
        <Header title="Create a new Membership" />
        <div className=" grid justify-items-stretch grid-cols-2 gap-4">
          <Input key={inputs[0].id} {...inputs[0]}></Input>
          <InputSelect
            name="Branch"
            placeholder="Membership Branch"
            options={branchs}
          ></InputSelect>
        </div>
        <div className="">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Membership Description
          </label>
          <textarea
            name="MembershipDescription"
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
              name="isunlimited"
              value={isun}
              onChange={() => {
                setisun(!isun);
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
                onChange={setService}
                class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
                id="grid-state"
              >
                {servicename.map((option) => (
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
            onClick={addequipments}
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
              {selectedservice.map((sr) => (
                <tr>
                  <td class="border border-slate-700 ...">{sr.ServiceName}</td>
                  <td class="border border-slate-700 ...">{sr.Duration}</td>
                  <td class="border border-slate-700 ...">{sr.SellingCost}</td>
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

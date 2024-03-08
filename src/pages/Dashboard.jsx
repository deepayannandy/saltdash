import React, { useEffect } from "react";
import DashboardStatsGrid from "./DashboardStatsGrid";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("userinfo")) {
      navigate("/Login");
    }
    let token = localStorage.getItem("userinfo");
    console.log(token);
  });

  return (
    <div className="flex flex-col gap-4">
      <DashboardStatsGrid />
      {/* <div className="flex flex-row gap-4 w-full">
				<TransactionChart/>
        		<BuyerProfilePieChart />
			</div>
			<div className="flex flex-row gap-4 w-full">
          <RecentOrders />
          <PopularProducts />
			</div> */}
    </div>
  );
}

export default Dashboard;

import React,{ useEffect, useState } from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import { useNavigate,createSearchParams,Link } from 'react-router-dom'

function Dashboard() {
	const navigate= useNavigate();
	useEffect(()=>{
    
		if (!localStorage.getItem('userinfo')){
		  console.log("try")
		  navigate('/Login');
		}
		let token= localStorage.getItem('userinfo');
		console.log(token)
		})
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
  )
}

export default Dashboard

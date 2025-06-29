import {
  HiOutlineViewGrid,
  HiEmojiHappy,
  HiTicket,
  HiUsers,
  HiUserGroup,
  HiOutlineUsers,
  HiCalendar,
  HiOutlineLogout,
} from "react-icons/hi";
import { BsCalculator } from "react-icons/bs";
import { IoFunnelSharp } from "react-icons/io5";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "sales",
    label: "POS",
    path: "/pos",
    icon: <BsCalculator />,
  },
  {
    key: "services",
    label: "Services",
    path: "/services",
    icon: <HiEmojiHappy />,
  },
  {
    key: "packages",
    label: "Service Packages",
    path: "/packages",
    icon: <HiTicket />,
  },
  {
    key: "membership",
    label: "Memberships",
    path: "/membership",
    icon: <HiUsers />,
  },
  {
    key: "employees",
    label: "Users",
    path: "/employees",
    icon: <HiUserGroup />,
  },
  {
    key: "customers",
    label: "Clients",
    path: "/customers",
    icon: <HiOutlineUsers />,
  },
  {
    key: "leadboard",
    label: "Leads",
    path: "/leads",
    icon: <IoFunnelSharp />,
  },

  // {
  // 	key: 'products',
  // 	label: 'Products',
  // 	path: '/products',
  // 	icon: <HiOutlineCube />
  // },
  // {
  // 	key: 'branch',
  // 	label: 'Branches',
  // 	path: '/branch',
  // 	icon: <HiViewBoards />
  // },
  // {
  // 	key: 'clientmemberships',
  // 	label: 'Client Membership',
  // 	path: '/clientmemberships',
  // 	icon: <HiViewBoards />
  // },
  // {
  // 	key: 'sales',
  // 	label: 'Sales',
  // 	path: '/sales',
  // 	icon: <HiViewBoards />
  // },
  // {
  // 	key: 'resources',
  // 	label: 'Resources',
  // 	path: '/resources',
  // 	icon: <HiViewBoards />
  // },
  {
    key: "appointment",
    label: "Appointment",
    path: "/appointment",
    icon: <HiCalendar />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "logout",
    label: "Logout",
    path: "/login",
    icon: <HiOutlineLogout />,
  },
];

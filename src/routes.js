// /*!

// =========================================================
// * Vision UI Free Chakra - v1.0.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
// * Copyright 2021 Creative Tim (https://www.creative-tim.com/)
// * Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

// * Design and Coded by Simmmple & Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */

// // import
import Dashboard from "Users/Superuser/Dashboard";
import MDasboard from "Users/Manager/Dashboard";
import RDasboard from "Users/Receiver/Dashboard";
import RCDasboard from "Users/Retailcrew/Dashboard";
import WStock from "Users/Retailcrew/CheckoutMainPage";
import ProdCard from "Users/Retailcrew/ProductCard";
import camera from "Users/Retailcrew/camera";
import scanInvoice from "Users/Receiver/ScanInvoice";
import Rprofile from "Users/Receiver/profile";
import Tables from "views/Dashboard/Tables.js";
import Billing from "Users/Inventory";
import SU_Dept from "Users/Departments";
import SU_Emp from "Users/Employees";
import SU_Vendors from "Users/vendors";
import SU_Items from "Users/Items";
import SU_ItemsCategories from "Users/ItemCategories";
import SU_transactions from "Users/transactions";
import SU_ScannedInvoices from "Users/Scanned_Invoices";

// import RTLPage from "views/RTL/RTLPage.js";
import Profile from "Users/Users";
import SignIn from "Users/Signin.js";

// import SignUp from "views/Pages/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  SignoutIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import { VisuallyHidden } from "@chakra-ui/react";

// const superuserRoutes = [
//   { path: "/dashboard", name: "Dashboard", component: Dashboard },
//   { path: "/inventory", name: "Inventory", component: Billing },
//   { path: "/reports", name: "Reports", component: Tables }
// ];

// const managerRoutes = [
//   { path: "/dashboard", name: "Dashboard", component: MDasboard },

// ];

// const retailCrewRoutes = [
//   { path: "/dashboard", name: "Dashboard", component: RCDasboard }
// ];

// const receiverRoutes = [
//   { path: "/dashboard", name: "Dashboard", component: RDasboard }

// ];

// const commonRoutes = [
//   { path: "/signout", name: "Sign Out", component: SignIn },
//   { path: "/profile", name: "Profile", component: Profile }
// ];
// // Export based on user role
// const getRoutesByRole = (role) => {
//   switch (role) {
//     case "superuser":
//       return [...superuserRoutes, ...commonRoutes];
//     case "manager":
//       // return managerRoutes;
//       return [...managerRoutes, ...commonRoutes];

//     case "retailcrew":
//       // return retailCrewRoutes;
//       return [...retailCrewRoutes, ...commonRoutes];

//     case "receiver":
//       // return receiverRoutes;
//       return [...receiverRoutes, ...commonRoutes];

//     default:
//       return []; // Fallback if role doesn't match
//   }
// };

// export default getRoutesByRole;
var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/Superuser",
  },
  {
    path: "/Departments",
    name: "Departments",
    icon: <HomeIcon color='inherit' />,
    component: SU_Dept,
    layout: "/Superuser",
  },
  {
    path: "/Employees",
    name: "Employees",
    icon: <HomeIcon color='inherit' />,
    component: SU_Emp,
    layout: "/Superuser",
  },
  {
    path: "/Scanned_Invoices",
    name: "Scanned_Invoices",
    icon: <HomeIcon color='inherit' />,
    component: SU_ScannedInvoices,
    layout: "/Superuser",
  },
  {
    path: "/Items",
    name: "Items",
    icon: <HomeIcon color='inherit' />,
    component: SU_Items,
    layout: "/Superuser",
  },
  {
    path: "/transactions",
    name: "transactions",
    icon: <HomeIcon color='inherit' />,
    component: SU_transactions,
    layout: "/Superuser",
  },
  {
    path: "/Vendors",
    name: "Vendors",
    icon: <HomeIcon color='inherit' />,
    component: SU_Vendors,
    layout: "/Superuser",
  },
  {
    path: "/ItemsCategories",
    name: "ItemsCategories",
    icon: <HomeIcon color='inherit' />,
    component: SU_ItemsCategories,
    layout: "/Superuser",
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/Superuser",
  },
  {
    path: "/profile",
    name: "Receiver Profile",
    icon: <StatsIcon color="inherit" />,
    component: Rprofile,
    layout: "/Receiver",
  },
  {
    path: "/scaninvoice",
    name: "Scan Invoice",
    icon: <StatsIcon color="inherit" />,
    component: scanInvoice,
    layout: "/Receiver",
  },
  {
    path: "/dashboard",
    name: "Manager Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: MDasboard,
    layout: "/Manager",
  },
  {
    path: "/dashboard",
    name: "Receiver Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: RDasboard,
    layout: "/Receiver",
  },
  {
    path: "/CheckoutMainPage",
    name: "CheckoutMainPage",
    icon: <HomeIcon color="inherit" />,
    component: WStock,
    layout: "/Retailcrew",
    hidden: true,
  },
  {
    path: "/ProductCard",
    name: "Product card",
    icon: <HomeIcon color="inherit" />,
    component: ProdCard,
    layout: "/Retailcrew",
    hidden: true,
  },
  {
    path: "/Camera",
    name: "Camera",
    icon: <HomeIcon color="inherit" />,
    component: camera,
    layout: "/Retailcrew",
    hidden: true,
  },
  {
    path: "/Dashboard",
    name: "Retail crew Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: RCDasboard,
    layout: "/Retailcrew",
  },
  {
    path: "/Users",
    name: "Users",
    icon: <PersonIcon color="inherit" />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/Superuser",
  },

  {
    path: "/billing",
    name: "Inventory",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/Superuser",
  },
  {
    path: "/tables",
    name: "Reports",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/Superuser",
  },

  {
    path: "/signin",
    name: "Sign out",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/auth",
  },
];
export default dashRoutes;

// Import necessary components
// import SuperUserDashboard from "Users/Superuser/Dashboard";
// import ManagerDashboard from "Users/Manager/Dashboard";
// import Profile from "views/Dashboard/Profile.js";
// import Billing from "views/Dashboard/Billing.js";
// import Tables from "views/Dashboard/Tables.js";

// import {
//   HomeIcon,
//   StatsIcon,
//   CreditIcon,
//   PersonIcon,
// } from "components/Icons/Icons";

// // Define routes for superuser
// const superUserRoutes = [
//   {
//     path: "/superuser/dashboard",
//     name: "Dashboard",
//     icon: <HomeIcon color='inherit' />,
//     component: SuperUserDashboard,
//     layout: "/superuser",
//   },
//   {
//     path: "/superuser/profile",
//     name: "Profile",
//     icon: <PersonIcon color='inherit' />,
//     component: Profile,
//     layout: "/superuser",
//   },
//   {
//     path: "/superuser/billing",
//     name: "Billing",
//     icon: <CreditIcon color='inherit' />,
//     component: Billing,
//     layout: "/superuser",
//   },
//   {
//     path: "/superuser/tables",
//     name: "Tables",
//     icon: <StatsIcon color='inherit' />,
//     component: Tables,
//     layout: "/superuser",
//   },
// ];

// // Define routes for manager
// const managerRoutes = [
//   {
//     path: "/manager/dashboard",
//     name: "Dashboard",
//     icon: <HomeIcon color='inherit' />,
//     component: ManagerDashboard,
//     layout: "/manager",
//   },
//   {
//     path: "/manager/profile",
//     name: "Profile",
//     icon: <PersonIcon color='inherit' />,
//     component: Profile,
//     layout: "/manager",
//   },
//   {
//     path: "/manager/billing",
//     name: "Billing",
//     icon: <CreditIcon color='inherit' />,
//     component: Billing,
//     layout: "/manager",
//   },
//   {
//     path: "/manager/tables",
//     name: "Tables",
//     icon: <StatsIcon color='inherit' />,
//     component: Tables,
//     layout: "/manager",
//   },
// ];

// // Export routes based on role
// export function getRoutesForRole(role) {
//   switch (role) {
//     case "superuser":
//       return superUserRoutes;
//     case "manager":
//       return managerRoutes;
//     default:
//       return [];
//   }
// }

// export default getRoutesForRole;

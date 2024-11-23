/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import superuser//
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import SuperuserLayout from "layouts/Superuser.js";
import Manageruserlayout from "layouts/Manager";
import Receiveruserlayout from "layouts/Receiver";
import RetailCrewuserlayout from "layouts/Retailcrew";
// import RTLLayout from "layouts/RTL.js";
import RequireAuth from './RequireAuth';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <Route path={`/admin`} component={AdminLayout} />
      <Route path={`/superuser`} component={() => (
        <RequireAuth roles={['SuperUser']}>
          <SuperuserLayout />
        </RequireAuth>
      )} />
      <Route path={`/manager`} component={() => (
        <RequireAuth roles={['Manager']}>
          <Manageruserlayout />
        </RequireAuth>
      )} />
      <Route path={`/Receiver`} component={() => (
        <RequireAuth roles={['Receiver']}>
          <Receiveruserlayout />
        </RequireAuth>
      )} />
      <Route path={`/Retailcrew`} component={() => (
        <RequireAuth roles={['RetailStaff']}>
          <RetailCrewuserlayout />
        </RequireAuth>
      )} />

      <Redirect from={`/`} to="/auth/signin" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

import React from "react";
import { Redirect } from "react-router-dom";

const getCurrentUserRoleInSession = () => {
    // Simulate an authentication check
    const userRole = localStorage.getItem("userRole");
    return userRole; // Return true if userRole is not null
};

const RequireAuth = ({ children, roles }) => {
    const userRole = getCurrentUserRoleInSession();
    // console.log(children);
    // console.log(roles);
    // console.log(userRole);
    if (!userRole) {
        // Redirect to login page if not authenticated
        return <Redirect to="/auth/signin" />;
    }

    if (roles && !roles.includes(userRole)) {
        // Redirect if the user does not have the required role
        return <Redirect to="/auth/signin" />;
    }

    return children; // Render the protected component
};

export default RequireAuth;
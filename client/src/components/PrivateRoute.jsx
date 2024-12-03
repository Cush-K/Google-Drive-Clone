import React from "react";
import { Navigate } from "react-router-dom";
import useStore from "./Store";

// PrivateRoute component
const PrivateRoute = ({ element: Component, ...rest }) => {
    const { user, loading } = useStore();

    if (loading) {
        return <div>Loading...</div>; // Optionally replace with a spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return Component;
};


export default PrivateRoute;

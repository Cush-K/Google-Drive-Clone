import React from "react";
import Signup from "./Signup";
import Login from "./Login";
import UserProfile from "./Profile";
import Home from "./Home";
import Drive from "./Drive";
import Trash from "./Trash";

const routes = [
    {
        path: "/",
        element: <Login />
    
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/home",
        element:<Home />
    },
    {
        path: "/profile",
        element: <UserProfile />
    },
    {
        path:'/my-drive',
        element:<Drive />
        
    },
    {
        path:"/trash",
        element:<Trash />
    }

]
 

export default routes;
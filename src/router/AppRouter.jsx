import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
import { observer } from "mobx-react";

import { MSTStoreContext } from "mst/store";
import Landing2 from "screens/Landing2/Landing2";
import Logo from "assets/Logo.png";

import { CiSearch } from "react-icons/ci";

import "./appRouter-styles.scss";
import { BsSearch } from "react-icons/bs";

const AppRouter = observer(() => {

  

  const routes = useRoutes([
    { path: "/", element: <Landing2 /> },
  
    { path: "*", element: <Navigate to="/" replace /> }, // Handle invalid routes
  ]);

  const navigate = useNavigate();

  // scroll to top of page after a page transition.
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className=" min-w-full min-h-full">
      
      <div className="w-full h-full">{routes}</div>
    </div>
  );
});

export default AppRouter;

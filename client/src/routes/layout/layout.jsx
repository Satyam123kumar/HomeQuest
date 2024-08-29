import "./layout.scss";
import Navbar from "../../components/navbar/Navbar"
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  );
}

//Now after creating this, go to app.jsx and register the outlet
function RequireAuth() {
  const {currentUser} = useContext(AuthContext)
  return (
    !currentUser? (<Navigate to='/login' />) : (<div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  ));
}

export {Layout, RequireAuth};

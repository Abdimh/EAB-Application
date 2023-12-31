import React from "react";
import { Route, Redirect } from "react-router-dom";

const auth = localStorage.getItem("accessToken");
const data = JSON.parse(localStorage.getItem("user"));
const PrivateRoute = ({ exact, component: Component, ...rest }) => (
  <Route
    exact={exact ? true : false}
    rest
    render={(props) =>
      auth ? (
        <Component {...props} {...rest}></Component>
      ) : (
        <Redirect to={`${process.env.PUBLIC_URL}/auth-login`}></Redirect>
      )
    }
  ></Route>
);

export default PrivateRoute;

import React, { useState, createContext } from "react";
//import { userData } from "./UserData";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const userdata = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(userdata);

  return <UserContext.Provider value={{ contextData: [data, setData] }}>{props.children}</UserContext.Provider>;
};

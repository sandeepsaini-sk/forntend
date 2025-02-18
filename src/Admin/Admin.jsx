import React from "react";
import Slidebar from "./Slidebar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <div className="flex ">
      <Slidebar />
      <div className="ml-[23%] md:ml-[20%] w-full bg-gray-50  overflow-y-auto">
        <Outlet /> 
      </div>
    </div>
  );
}

import React from "react";
import "./Layout.module.css";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function Layout() {
  return (
    <>
    <div className="min-h-screen flex flex-col">
  <Navbar />

  <div className="grow pt-20">
    <Outlet />
  </div>

  <Footer />
</div>
    </>
  );
}

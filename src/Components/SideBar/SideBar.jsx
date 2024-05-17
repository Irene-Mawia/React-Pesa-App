import React from 'react';
import "./SideBar.css";
import { FaWindowRestore,FaMoneyBills,FaMoneyBillTransfer,FaUsers,FaArrowRightToBracket } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { Link } from "react-router-dom";


const SideBar = () => {
  return (
    <div className=' flex flex-col gap-2 border-r-2 bg-cyan-900'>
    <div className="SideBarTop my-2 mb-4"><span className="Logo">PESA</span>APP</div>
    <div className="SideBarCenter">
        <ul className="mt-3 text-white font-bold">
            <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <Link to="/" className="px-3">
                <FaWindowRestore className="inline-block w-6 h-6 mr-2 -mt-2"></FaWindowRestore>
              Wallet </Link>
              </li>
              <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <Link to="/send-money" className="px-3">
                <FaMoneyBills className="inline-block w-6 h-6 mr-2 -mt-2"></FaMoneyBills>
              Send Money </Link>
              </li>
              <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <Link to="/withdraw-money" className="px-3">
                <FaMoneyBillTransfer className="inline-block w-6 h-6 mr-2 -mt-2"></FaMoneyBillTransfer>
              Withdraw Money </Link>
              </li>
              <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <Link to="/Group-contacts" className="px-3">
                <FaUsers className="inline-block w-6 h-6 mr-2 -mt-2"></FaUsers>
              Group Contacts </Link>
              </li>
        </ul>
    </div>
    <div className="SideBarBottom">
        <ul className="menu menu-md flex-col ml-3 p-2 absolute bottom-0 left-0">
        <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <a href="" className="px-3">
                <IoSettingsSharp className="inline-block w-6 h-6 mr-2 -mt-2"></IoSettingsSharp>
              Settings </a>
              </li>
              <li className="mb-2 rounded hover:shadow hover:bg-teal-500 py-2">
              <a href="" className="px-3">
                <FaArrowRightToBracket className="inline-block w-6 h-6 mr-2 -mt-2"></FaArrowRightToBracket>
              Log out </a>
              </li>
        </ul>
    </div>
    </div>
  )
}

export default SideBar
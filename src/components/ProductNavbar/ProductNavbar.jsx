import React, { useState } from "react";
import Button from "../Button/Button";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    onSearch(value.trim());
  };

  const username = localStorage.getItem("username");

  return (
    <div className="bg-white bg-opacity-80 border border-gray-200 shadow-lg rounded-lg px-6 py-4 flex justify-between items-center">
      <div className="text-[#1f2937] font-bold text-xl">Product admin</div>
      <div className="flex-1 flex justify-center mx-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <h3 className="text-black font-semibold whitespace-nowrap">
          {username ? `Welcome, ${username}` : ""}
        </h3>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}

export default Navbar;

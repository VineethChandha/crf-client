import React, { useEffect, useState } from "react";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import axios from "axios";
import { message, Spin } from "antd";
import Button from "../../../components/Button/Button";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

function ViewRestaurants() {
  const [viewRestaurant, setViewRestaurant] = useState({});
  const [loading, setLoading] = useState(false);

  const handleView = async (id) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getRestaurant`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Restaurant Data:", response.data.restaurantData);
        setViewRestaurant(response.data.restaurantData);
      } else {
        message.error("Failed to fetch restaurant details");
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      message.error("An error occurred while fetching restaurant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("restaurantId");
    if (id) {
      handleView(id);
    }
  }, []);

  const csvData = [
    [
      "Restaurant Name",
      "Phone",
      "Address",
      "Email",
      "LLC",
      "Owner Name",
      "Redeem Points",
      "Total Points",
      "Primary Contact Name",
      "Primary Contact Address",
      "Primary Contact Email",
    ],
    [
      viewRestaurant.restaurantName || "",
      viewRestaurant.phoneNumber || "",
      viewRestaurant.address || "",
      viewRestaurant.email || "",
      viewRestaurant.llc || "",
      viewRestaurant.ownerName || "",
      viewRestaurant.redeemedPoints || "",
      viewRestaurant.totalPoints || "",
      viewRestaurant.primaryContactDetails?.name || "",
      viewRestaurant.primaryContactDetails?.address || "",
      viewRestaurant.primaryContactDetails?.email || "",
    ],
  ];
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <ProductNavbar />
      <button
        className="flex items-center text-[#1f2937] hover:text-gray-900 my-4 font-semibold cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="mr-2" />
        Back
      </button>
      <div className="flex items-center justify-between my-6">
        <h3 className="text-[18px] font-semibold text-gray-800">
          Restaurant Details
        </h3>
        <div className="flex space-x-4">
          <CSVLink
            data={csvData}
            filename={`${
              viewRestaurant.restaurantName || "restaurant"
            }_data.csv`}
          >
            <Button>Download Data</Button>
          </CSVLink>
          <Button onClick={() => navigate("/product-admin/customer")}>
            View Customer
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        viewRestaurant && (
          <div>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <div className="grid grid-cols-3 gap-6 mb-6 border-gray-200">
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Restaurant Name : {viewRestaurant.restaurantName}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Phone : {viewRestaurant.phoneNumber}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Resturant Address : {viewRestaurant.address}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Email : {viewRestaurant.email}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    LLC : {viewRestaurant.llc}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Owner Name : {viewRestaurant.ownerName}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Redeem Points : {viewRestaurant.redeemedPoints}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Total Points : {viewRestaurant.totalPoints}
                  </span>
                </div>
              </div>
            </div>
            <div className="my-6">
              <h3 className="text-[18px] font-semibold text-gray-800">
                Primary Contact Details
              </h3>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <div className="grid grid-cols-3 gap-6 border-gray-200">
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">Name : </span>
                  {viewRestaurant.primaryContactDetails?.name}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Address :{" "}
                  </span>
                  {viewRestaurant.primaryContactDetails?.address}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">Email : </span>
                  {viewRestaurant.primaryContactDetails?.email}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ViewRestaurants;

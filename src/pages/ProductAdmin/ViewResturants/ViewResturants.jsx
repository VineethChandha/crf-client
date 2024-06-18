import React, { useEffect, useState } from "react";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import axios from "axios";
import { message } from "antd";
import Button from "../../../components/Button/Button";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

function ViewResturants() {
  const [viewRestaurant, setViewRestaurant] = useState({});
  const [loading, setLoading] = useState(false);

  const handleView = async (id) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/productAdmin/getRestaurant`,
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

  return (
    <div className="min-h-screen mx-[34px] my-4">
      <ProductNavbar />
      <div className="flex items-center justify-between my-4">
        <div className="">
          <h3 className="font-medium text-[18px] mb-4">Restaurant Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <Button>Download Data</Button>
          <Button variant="secondary">View Customer</Button>
        </div>
      </div>
      {viewRestaurant && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-4 border-b border-gray-200 pb-4">
            <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
              Restaurant Name : {viewRestaurant.restaurantName}
            </div>
            <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
              Phone : {viewRestaurant.phoneNumber}
            </div>
            <div className="font-semibold border-gray-200 pr-4 text-gray-600">
              Owner Name : Owner Name:{" "}
              {viewRestaurant.primaryContactDetails?.name}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
              Email: {viewRestaurant.email}
            </div>
            <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
              Address: {viewRestaurant.primaryContactDetails?.address}
            </div>
            <div className="font-semibold border-gray-200 pr-4 text-gray-600">
              LLC: {viewRestaurant.llc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewResturants;

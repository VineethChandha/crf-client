import React, { useEffect, useState } from "react";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import axios from "axios";
import { message as antdMessage } from "antd";
import Button from "../../../components/Button/Button";
import moment from "moment";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

function ViewCustomer() {
  const [viewCustomer, setViewCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [searchTerm] = useState("");

  const handleView = async (id) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getCustomers`,
        { id, page: page, limit: 10, phone: searchTerm },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      console.log("Customer Data:", response.data);
      setViewCustomer(response.data.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      antdMessage.error("An error occurred while fetching customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("restaurantId");
    if (id) {
      handleView(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen mx-[34px] my-4">
      <ProductNavbar />
      <div className="flex items-center justify-between my-4">
        <div className="">
          <h3 className="font-medium text-[18px] mb-4">Customer Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleView(localStorage.getItem("restaurantId"))}
          >
            Add Customer
          </Button>
          <Button variant="secondary">View Rewards</Button>
        </div>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {viewCustomer.map((customer) => (
              <div
                key={customer._id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <div className="grid grid-cols-3 gap-4 mb-4 border-b border-gray-200 pb-4">
                  <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
                    Name: {customer.firstName} {customer.lastName}
                  </div>
                  <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
                    Email: {customer.email}
                  </div>
                  <div className="font-semibold border-gray-200 pr-4 text-gray-600">
                    Phone: {customer.phoneNumber}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
                    DOB: {new Date(customer.dob).toLocaleDateString()}
                  </div>
                  <div className="font-semibold border-r border-gray-200 pr-4 text-gray-600">
                    Registered On :{" "}
                    {moment(customer.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div className="font-semibold border-gray-200 pr-4 text-gray-600">
                    <p>Gender : {customer.gender.join(", ")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCustomer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Table, message, Tag } from "antd";
import {
  MdOutlineEdit,
  MdOutlineAdd,
  MdDeleteOutline,
  MdRemoveRedEye,
} from "react-icons/md";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import Button from "../../../components/Button/Button";
import AddRestaurantForm from "../../../components/AddResturants/AddResturants";
import CustomerDetails from "../../../components/CustomerDetails/CustomerDetails";
import moment from "moment";
import ProductCustomerDetails from "../../../components/ProductCustomerDetails.jsx/ProductCustomerDetails";
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchedValue, setSearchedValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [viewRestaurant, setViewRestaurant] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchRestaurants = async (searchTerm, currentPage = page) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/productAdmin/getRestaurants`,
        {
          page: currentPage,
          limit: 10,
          name: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setRestaurants(response.data.data);
        setTotal(response.data.total);
      } else {
        message.error("Failed to fetch restaurants");
      }
    } catch (error) {
      message.error("An error occurred while fetching restaurants");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setEditRestaurant(null);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addRestaurant = async (restaurantData) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/productAdmin/addRestaurant`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.data && response.data.success) {
        message.success("Restaurant added successfully");
        setIsModalOpen(false);
        fetchRestaurants(searchedValue);
      } else {
        message.success(response.data.message || "Failed to add restaurant");
        setIsModalOpen(false);
        fetchRestaurants(searchedValue);
      }
    } catch (error) {
      message.error("An error occurred while adding restaurant");
    } finally {
      setLoading(false);
    }
  };

  const editRestaurantApi = async (restaurantData, id) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${apiUrl}/productAdmin/editRestaurant/${id}`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.data && response.data.success) {
        message.success("Restaurant edited successfully");
        setIsModalOpen(false);
        fetchRestaurants(searchedValue);
      } else {
        message.error(response.data.message || "Failed to edit restaurant");
        setIsModalOpen(false);
        fetchRestaurants(searchedValue);
      }
    } catch (error) {
      message.error("An error occurred while editing restaurant");
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurantApi = async (restaurantId) => {
    setLoading(true);

    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `${apiUrl}/productAdmin/deleteRestaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      message.success("Restaurant deleted successfully");
      fetchRestaurants(searchedValue);
    } catch (error) {
      message.error("An error occurred while deleting restaurant");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditRestaurant(record);
    setIsModalOpen(true);
  };

  const handleDelete = (restaurantId) => {
    deleteRestaurantApi(restaurantId);
  };

  const handleView = () => {
    navigate('/product-admin/view-resturants');
  }

  // const handleView = async (id) => {
  //   setLoading(true);
  //   try {
  //     const sessionToken = localStorage.getItem("accessToken");
  //     const response = await axios.post(
  //       `${apiUrl}/productAdmin/getRestaurant`,
  //       { id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${sessionToken}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setViewRestaurant(response.data.restaurantData);
  //       setIsDetailsModalOpen(true);
  //     } else {
  //       message.error("Failed to fetch restaurant details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching restaurant details:", error);
  //     message.error("An error occurred while fetching restaurant details");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleViewCustomers = async (restaurantId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getCustomers`,
        {
          page: page,
          limit: 10,
          restaurantId: restaurantId,
          phone: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data.data);
      setIsCustomersModalOpen(true);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchedValue(searchTerm);
    setPage(1);
    fetchRestaurants(searchTerm, 1);
  };

  useEffect(() => {
    fetchRestaurants(searchedValue);
  }, [searchedValue, page]);

  const columns = [
    {
      title: "Restaurant Name",
      dataIndex: "restaurantName",
      key: "restaurantName",
    },
    {
      title: "LLC",
      dataIndex: "llc",
      key: "llc",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isAccepted",
      key: "isAccepted",
      render: (isAccepted) => (
        <Tag color={isAccepted ? "green" : "red"}>
          {isAccepted ? "Accepted" : "Not Accepted"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span className="flex gap-4">
          <MdRemoveRedEye
            size={20}
            className="cursor-pointer"
            onClick={() => handleView(record._id)}
          />
          <MdOutlineEdit
            size={20}
            className="cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          <MdDeleteOutline
            size={20}
            className="cursor-pointer"
            onClick={() => handleDelete(record._id)}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen mx-[34px] my-4">
      <ProductNavbar onSearch={handleSearch} />
      <Modal
        title={editRestaurant ? "Edit Restaurant" : "Add Restaurant"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddRestaurantForm
          onSubmit={(data) =>
            editRestaurant
              ? editRestaurantApi(data, editRestaurant._id)
              : addRestaurant(data)
          }
          onCancel={handleCancel}
          initialData={editRestaurant}
        />
      </Modal>
      <Modal
        title="Restaurant Details"
        visible={isDetailsModalOpen}
        onOk={() => setIsDetailsModalOpen(false)}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={null}
      >
        {viewRestaurant && (
          <div className="grid grid-cols-2 space-y-2 py-6">
            <p className="text-[16px]">
              <strong>Restaurant Name:</strong> {viewRestaurant.restaurantName}
            </p>
            <p className="text-[16px]">
              <strong>Phone:</strong> {viewRestaurant.phoneNumber}
            </p>
            <p className="text-[16px]">
              <strong>Owner Name:</strong>{" "}
              {viewRestaurant.primaryContactDetails.name}
            </p>
            <p className="text-[16px]">
              <strong>Email:</strong> {viewRestaurant.email}
            </p>
            <p className="text-[16px]">
              <strong>Address:</strong>
              {viewRestaurant.primaryContactDetails.address}
            </p>
          </div>
        )}
        <div className="flex gap-8 mt-4">
          <Button>Download Data</Button>
          <Button
            variant="secondary"
            onClick={() => handleViewCustomers(viewRestaurant._id)}
          >
            View Customers
          </Button>
        </div>
      </Modal>
      <ProductCustomerDetails
        visible={isCustomersModalOpen}
        onCancel={() => setIsCustomersModalOpen(false)}
        customers={customers}
      />
      <div className="flex justify-between mt-4">
        <div>
          <h1 className="font-medium text-lg mb-4">Restaurants</h1>
        </div>
        <div>
          <Button onClick={showModal}>
            <MdOutlineAdd size={20} className="mr-[4px] font-semibold" />
            Add Restaurant
          </Button>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg my-4 p-6 border border-gray-200">
        <Table
          columns={columns}
          dataSource={restaurants}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{
            current: page,
            pageSize: 10,
            total: total,
            onChange: (page) => setPage(page),
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;

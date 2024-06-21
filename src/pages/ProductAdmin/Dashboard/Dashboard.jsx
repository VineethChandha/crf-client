import React, { useCallback, useEffect, useState } from "react";
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
  const [viewRestaurant] = useState(null);
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();

  const fetchRestaurants = useCallback(async (searchTerm, currentPage = page) => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getRestaurants`,
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
  }, [page]);

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
      message.error(error.response.data.error || "An error occurred while adding restaurant");
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
    Modal.confirm({
      title: "Are you sure you want to delete this restaurant?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          const sessionToken = localStorage.getItem("accessToken");
          await axios.delete(
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
      },
    });
  };
  const handleEdit = (record) => {
    setEditRestaurant(record);
    setIsModalOpen(true);
  };

  const handleDelete = (restaurantId) => {
    deleteRestaurantApi(restaurantId);
  };

  const handleView = (id) => {
    localStorage.setItem("restaurantId", id);
    navigate('/product-admin/view-resturants');
  }

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
      setLoading(false);
    } catch (err) {
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
  }, [searchedValue, page, fetchRestaurants]);

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

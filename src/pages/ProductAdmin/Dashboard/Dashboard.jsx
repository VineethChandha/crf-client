import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Table, message } from "antd";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import Button from "../../../components/Button/Button";
import { MdOutlineAdd } from "react-icons/md";
import AddRestaurantForm from "../../../components/AddResturants/AddResturants";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchedValue, setSearchedValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        console.log(response.data);
        message.success(response.data.message || "Failed to add restaurant");
        setIsModalOpen(false);
        fetchRestaurants(searchedValue);
      }
    } catch (error) {
      console.error("Error adding restaurant:", error);
      message.error("An error occurred while adding restaurant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(searchedValue);
  }, [searchedValue, page]);

  const handleSearch = (searchTerm) => {
    setSearchedValue(searchTerm);
    setPage(1);
    fetchRestaurants(searchTerm, 1);
  };

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
      title: "Action",
      dataIndex: "isAccepted",
      key: "isAccepted",
      render: (isAccepted) => (isAccepted ? "Accepted" : "Not Accepted"),
    },
  ];

  return (
    <div className="min-h-screen mx-[34px] my-4">
      <ProductNavbar onSearch={handleSearch} />
      <Modal
        title="Add Restaurant"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddRestaurantForm onSubmit={addRestaurant} onCancel={handleCancel} />
      </Modal>
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
      <div className=" bg-white shadow-lg rounded-lg my-4 p-6 border border-gray-200">
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

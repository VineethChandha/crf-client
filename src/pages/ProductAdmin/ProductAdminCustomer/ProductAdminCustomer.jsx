import React, { useEffect, useRef, useState } from "react";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import { Table, Spin, Alert, Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import moment from "moment";
import Button from "../../../components/Button/Button";
import AddCustomerForm from "../../../components/AddCustomer/AddCustomer";
import CustomerDetails from "../../../components/CustomerDetails/CustomerDetails";
import { FaEdit, FaEye, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

function ProductAdminCustomer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [allCustomersData, setAllCustomersData] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const csvLink = useRef(null);

  const navigate = useNavigate();

  const handleDeleteCustomer = async (_id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.delete(
            `${apiUrl}/restaurantAdmin/deleteCustomer/${_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            fetchCustomers();
          } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
          }
        } catch (err) {
          console.error("Error deleting customer:", err);
        }
      },
    });
  };

  const handleEditCustomer = async (editedData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${apiUrl}/restaurantAdmin/editCustomer/${selectedCustomer._id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditModalOpen(false);
        fetchCustomers();
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error updating customer:", err);
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

  const showEditModal = (record) => {
    setSelectedCustomer(record);
    setEditModalOpen(true);
  };

  const handleEditOk = () => {
    setEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  const fetchCustomerDetails = async (_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${apiUrl}/restaurantAdmin/getCustomer/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCustomerDetails(response.data);
        setDetailModalOpen(true);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
    }
  };

  const showRewardModal = (record, action) => {
    setSelectedCustomer(record);
    form.setFieldsValue({ action });
    setRewardModalOpen(true);
  };

  const handleRewardOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem("accessToken");
        const restaurantId = localStorage.getItem("restaurantId");
        const response = await axios.post(
          `${apiUrl}/restaurantAdmin/addReward`,
          {
            customerId: selectedCustomer._id,
            email: selectedCustomer.email,
            points: values.points,
            restaurantId: restaurantId,
            type: values.action.toLowerCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          message.success(response.data.message);
          setRewardModalOpen(false);
          form.resetFields();
        } else {
          message.error(response.data.message || "Failed to perform action");
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        message.error(error.response.data.error)
        console.error("Error adding reward points:", error);
      }
    });
  };

  const handleRewardCancel = () => {
    setRewardModalOpen(false);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Reg on",
      dataIndex: "registeredOn",
      key: "registeredOn",
      render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => showEditModal(record)}
          >
            <FaEdit />
          </button>
          <button
            className="text-green-500 hover:text-green-600"
            onClick={() => fetchCustomerDetails(record._id)}
          >
            <FaEye />
          </button>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => handleDeleteCustomer(record._id)}
          >
            <FaTrash />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-600"
            onClick={() => showRewardModal(record, "Redeem")}
          >
            <FaMinus />
          </button>
          <button
            className="text-purple-500 hover:text-purple-600"
            onClick={() => showRewardModal(record, "Add")}
          >
            <FaPlus />
          </button>
        </div>
      ),
    },
  ];

  const handleAddCustomer = async (customerData, setFormData = []) => {
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${apiUrl}/restaurantAdmin/addCustomer`,
        {
          ...customerData,
          restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Customer added successfully");
        setIsModalOpen(false);
        fetchCustomers();
        setFormData({
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          phoneNumber: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          agreePromotionalEmails: false,
          agreeDataSharing: false,
        });
      } else {
        message.error(response.data.message || "Failed to add customer");
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      if (err.response) {
        message.error(err.response.data.error || "An error occurred while adding customer");
        console.error(
          `Server Error: ${err.response.status} - ${err.response.data.error}`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error", err.message);
      }
    }
  };

  const fetchCustomers = async (p = page, limit = 10, fetchAllCustomers = false) => {
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getCustomers`,
        {
          page: p,
          limit: limit,
          restaurantId: restaurantId,
          phone: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fetchAllCustomers) {
        setAllCustomersData(response.data.data);
        return;
      }

      setData(response.data.data);
      setTotal(response.data.total);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const customerHeaders = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Gender", key: "gender" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Date of Birth", key: "dob" },
    { label: "Address", key: "address" },
    { label: "State", key: "state" },
    { label: "City", key: "city" },
    { label: "Zipcode", key: "zipCode" },
    { label: "Total Reward Added", key: "totalAddedPoints" },
    { label: "Reward Points Available", key: "totalPoints" },
    { label: "Agree Data Sharing", key: "agreeDataSharing" },
    { label: "Agree Promotional Emails", key: "agreePromotionalEmails" },
    { label: "Registered On", key: "createdAt" }
  ];

  const allCustomerDownload = allCustomersData.map((details) => ({
    firstName: details.firstName,
    lastName: details.lastName,
    gender: details.gender[0],
    email: details.email,
    phoneNumber: details.phoneNumber,
    dob: moment(details.dob).format("DD/MM/YYYY"),
    address: details.address,
    state: details.state,
    city: details.city,
    zipCode: details.zipCode,
    totalAddedPoints: details.totalAddedPoints,
    totalPoints:
      details.totalAddedPoints +
      details.totalRedeemedPoints,
    agreeDataSharing: details.agreeDataSharing ? "Yes" : "No",
    agreePromotionalEmails: details.agreePromotionalEmails
      ? "Yes"
      : "No",
    createdAt: moment(details.createdAt).format("DD/MM/YYYY"),
  }));

  const handleDownload = async () => {
    setDownloading(true);
    try {
      fetchCustomers(1, 2000, true);
    } catch (error) {
      console.error("Error downloading reward points:", error);
    }
  };

  useEffect(() => {
    if (allCustomersData.length > 0 && csvLink.current) {
      csvLink.current.link.click();
      setDownloading(false);
    }
  }, [allCustomersData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative z-10 px-[48px] py-[20px]">
        <ProductNavbar onSearch={setSearchTerm} />
        <button
          className="flex items-center text-[#1f2937] hover:text-gray-900 mt-4 font-semibold cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </button>
      </div>
      <Modal
        title="Add Customer"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddCustomerForm onSubmit={handleAddCustomer} onCancel={handleCancel} />
      </Modal>

      <Modal
        title="Edit Customer"
        visible={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={null}
      >
        {selectedCustomer && (
          <AddCustomerForm
            onSubmit={handleEditCustomer}
            onCancel={handleEditCancel}
            initialData={selectedCustomer}
          />
        )}
      </Modal>

      <Modal
        title={
          <div className="flex justify-between ">
            <span>Customer Details</span>
          </div>
        }
        visible={detailModalOpen}
        onOk={() => setDetailModalOpen(false)}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={1000}
      >
        <CustomerDetails details={customerDetails} />
      </Modal>

      <Modal
        title={`Add Reward to ${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`}
        visible={rewardModalOpen}
        onOk={handleRewardOk}
        onCancel={handleRewardCancel}
        okButtonProps={{
          style: { backgroundColor: "#4f46e5", color: "white" },
        }}
      >
        <p className="pb-2 font-semibold text-center">Total available points: {selectedCustomer?.totalPoints}</p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please input points" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="action"
            label="Action"
            rules={[{ required: true, message: "Please select an action" }]}
          >
            <Select placeholder="Select action">
              <Select.Option value="add">Add points</Select.Option>
              <Select.Option value="redeem">Redeem points</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between items-center mx-[48px]">
        <div>
          <h3 className="font-medium text-lg mb-4">Customers Details</h3>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleDownload} variant={downloading ? 'disabled' : ''} className="text-white bg-indigo-600">
            {downloading ? 'Downloading...' : 'Download'}
          </Button>
          <CSVLink
            data={allCustomerDownload}
            headers={customerHeaders}
            filename="all_customers.csv"
            ref={csvLink}
            className="hidden"
            target="_blank"
          />
          <Button onClick={showModal} >
            <MdOutlineAdd size={20} className="mr-[4px] font-semibold" />
            Add customer
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg  my-4 p-6 border border-gray-200 mx-[48px]">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: page,
              pageSize: 10,
              total: total,
              onChange: (page) => setPage(page),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }
            bordered
          />
        </div>
      </div>
    </div>
  );
}

export default ProductAdminCustomer;

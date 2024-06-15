import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const CustomerDetails = ({ details }) => {
  const [rewardPoints, setRewardPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRewardPoints = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${apiUrl}/common/getRewardPoints`,
          {
            page: 1,
            limit: 5,
            id: details.customer._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRewardPoints(response.data.data);
      } catch (error) {
        console.error("Error fetching reward points:", error);
      } finally {
        setLoading(false);
      }
    };

    if (details) {
      fetchRewardPoints();
    }
  }, [details]);

  if (!details) return null;

  const handleAddReward = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem("accessToken");
        const restaurantId = localStorage.getItem("restaurantId");
        const response = await axios.post(
          `${apiUrl}/restaurantAdmin/addReward`,
          {
            customerId: details.customer._id,
            email: details.customer.email,
            points: values.points,
            restaurantId: restaurantId,
            type: values.action,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const updatedPoints = await axios.post(
            `${apiUrl}/common/getRewardPoints`,
            {
              page: 1,
              limit: 5,
              id: details.customer._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRewardPoints(updatedPoints.data.data);
          setIsModalVisible(false);
          form.resetFields();
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error adding reward points:", error);
      }
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Reward Points",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <button
          className="border p-2 rounded border-blue-500"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusOutlined className="mr-2" />
          Add Reward
        </button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white shadow rounded-lg w-full">
      <div className="flex items-center">
        <p className="text-lg font-bold">First Name:</p>
        <p className="text-lg ml-2">{details.customer.firstName}</p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Last Name:</p>
        <p className="text-lg ml-2">{details.customer.lastName}</p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Gender:</p>
        <p className="text-lg ml-2">{details.customer.gender}</p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Registered On:</p>
        <p className="text-lg ml-2">
          {moment(details.createdAt).format("DD/MM/YYYY")}
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Email:</p>
        <p className="text-lg ml-2">{details.customer.email}</p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Phone:</p>
        <p className="text-lg ml-2">{details.customer.phoneNumber}</p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Total Reward Added:</p>
        <p className="text-lg ml-2 text-gray-800">
          {details.customer.totalAddedPoints}
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Reward Points Available:</p>
        <p className="text-lg ml-2 text-gray-800">
          {details.customer.totalAddedPoints -
            details.customer.totalRedeemedPoints}
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Agree to Promotional Emails:</p>
        <p className="text-lg ml-2 text-gray-800">
          {details.customer.agreePromotionalEmails ? "Yes" : "No"}
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-lg font-bold">Agree to Data Sharing:</p>
        <p className="text-lg ml-2 text-gray-800">
          {details.customer.agreeDataSharing ? "Yes" : "No"}
        </p>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white shadow-lg rounded-lg my-4 p-6 border border-gray-200">
        <Table
          columns={columns}
          dataSource={rewardPoints}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </div>

      <Modal
        title="Add Reward"
        visible={isModalVisible}
        onOk={handleAddReward}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="action"
            label="Action"
            rules={[{ required: true, message: "Please select an action" }]}
          >
            <Select placeholder="Select Action">
              <Select.Option value="add">Add Points</Select.Option>
              <Select.Option value="remove">Reedeem Points</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please enter points" }]}
          >
            <Input placeholder="Enter Points" />
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
};

export default CustomerDetails;

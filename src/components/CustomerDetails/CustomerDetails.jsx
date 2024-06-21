import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import Button from "../../components/Button/Button.jsx";
import { CSVLink } from "react-csv";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const CustomerDetails = ({ details }) => {
  const [rewardPoints, setRewardPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalData, setTotalData] = useState([]);

  const [downloading, setDownloading] = useState(false);
  const csvLink = useRef(null);

  const fetchRewardPoints = async (
    p = page,
    limit = 5,
    isFromDownload = false
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getRewardPoints`,
        {
          page: p,
          limit: limit,
          id: details.customer._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (isFromDownload) {
        setTotalData(response.data.data);
      } else {
        setTotal(response.data.total);
        setRewardPoints(response.data.data);
      }
      console.log("Reward Points:", rewardPoints);
    } catch (error) {
      console.error("Error fetching reward points:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      fetchRewardPoints(1, 2000, true);
    } catch (error) {
      console.error("Error downloading reward points:", error);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [details]);

  useEffect(() => {
    if (details) {
      fetchRewardPoints();
    }
  }, [page, details]);

  useEffect(() => {
    if (totalData.length > 0 && csvLink.current) {
      csvLink.current.link.click();
      setDownloading(false);
    }
  }, [totalData]);

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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => moment(text).format("hh:mm A"),
    },
    {
      title: "Reward Points",
      dataIndex: "points",
      key: "points",
    },
  ];

  const headers = [
    { label: "Date", key: "createdAt" },
    { label: "Time", key: "timestamp" },
    { label: "Reward Points", key: "points" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" }
  ];

  const customerHeaders = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Gender", key: "gender" },
    { label: "Registered On", key: "createdAt" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Total Reward Added", key: "totalAddedPoints" },
    { label: "Reward Points Available", key: "totalPoints" },
    { label: "Agree to Promotional Emails", key: "agreePromotionalEmails" },
    { label: "Agree to Data Sharing", key: "agreeDataSharing" },
  ];

  const dataForExport = totalData.map((item) => ({
    firstName: details.customer.firstName,
    lastName: details.customer.lastName,
    email: details.customer.email,
    phoneNumber: details.customer.phoneNumber,
    createdAt: moment(item.createdAt).format("DD/MM/YYYY"),
    timestamp: moment(item.timestamp, "HH:mm:ss").format("hh:mm A"),
    points: item.points,
  }));

  const customerDownload = [
    {
      firstName: details.customer.firstName,
      lastName: details.customer.lastName,
      gender: details.customer.gender[0],
      email: details.customer.email,
      phoneNumber: details.customer.phoneNumber,
      totalAddedPoints: details.customer.totalAddedPoints,
      totalPoints:
        details.customer.totalAddedPoints +
        details.customer.totalRedeemedPoints,
      agreePromotionalEmails: details.customer.agreePromotionalEmails
        ? "Yes"
        : "No",
      agreeDataSharing: details.customer.agreeDataSharing ? "Yes" : "No",
      createdAt: moment(details.createdAt).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-end pb-2">
        <Button>
          <CSVLink
            data={customerDownload}
            headers={customerHeaders}
            filename="customer_details.csv"
          >
            Download
          </CSVLink>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white shadow rounded-lg w-full">
        <div className="flex items-center">
          <p className="text-sm font-bold">First Name:</p>
          <p className="text-sm ml-2">{details.customer.firstName}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Last Name:</p>
          <p className="text-sm ml-2">{details.customer.lastName}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Gender:</p>
          <p className="text-sm ml-2">{details.customer.gender}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Registered On:</p>
          <p className="text-sm ml-2">
            {moment(details.createdAt).format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Email:</p>
          <p className="text-sm ml-2">{details.customer.email}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Phone:</p>
          <p className="text-sm ml-2">{details.customer.phoneNumber}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Total Reward Added:</p>
          <p className="text-sm ml-2 text-gray-800">
            {details.customer.totalAddedPoints}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Reward Points Available:</p>
          <p className="text-sm ml-2 text-gray-800">
            {details.customer.totalAddedPoints +
              details.customer.totalRedeemedPoints}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Agree to Promotional Emails:</p>
          <p className="text-sm ml-2 text-gray-800">
            {details.customer.agreePromotionalEmails ? "Yes" : "No"}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-bold">Agree to Data Sharing:</p>
          <p className="text-sm ml-2 text-gray-800">
            {details.customer.agreeDataSharing ? "Yes" : "No"}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white shadow-lg rounded-lg my-4 p-6 border border-gray-200">
          <Table
            columns={columns}
            dataSource={rewardPoints}
            pagination={{
              current: page,
              pageSize: 5,
              total: total,
              onChange: (page) => setPage(page),
            }}
            loading={loading}
            rowKey="id"
            title={() => (
              <div className="w-full flex justify-between items-center">
                <div className="font-semibold">
                  <p>Rewards Point Table</p>
                </div>
                <Button onClick={handleDownload} variant={downloading ? 'disabled' : ''} className="text-white bg-indigo-600">
                  {downloading ? 'Downloading...' : 'Download'}
                </Button>
                <CSVLink
                  data={dataForExport}
                  headers={headers}
                  filename="reward_points.csv"
                  ref={csvLink}
                  className="hidden"
                  target="_blank"
                />
              </div>
            )}
            scroll={{ y: 240 }}
          />
        </div>

        <Modal
          title="Add Reward"
          visible={isModalVisible}
          onOk={handleAddReward}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{
            style: { backgroundColor: "#4f46e5", color: "white" },
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="action"
              label="Action"
              rules={[{ required: true, message: "Please select an action" }]}
            >
              <Select placeholder="Select Action">
                <Select.Option value="add">Add Points</Select.Option>
                <Select.Option value="redeem">Redeem Points</Select.Option>
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
        {/* <div className="flex col-span-2">
          <Button onClick={() => setIsModalVisible(true)}>
            <PlusOutlined className="mr-2" /> Add Reward
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default CustomerDetails;

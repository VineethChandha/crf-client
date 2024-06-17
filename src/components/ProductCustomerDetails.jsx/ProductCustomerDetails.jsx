import React from "react";
import { Table, Modal } from "antd";
import moment from "moment";

const ProductCustomerDetails = ({ visible, onCancel, customers }) => {
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
      title: "Registered On",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY"),
    },
  ];

  return (
    <Modal
      title="Customer Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={customers}
        rowKey={(record) => record._id}
      />
    </Modal>
  );
};

export default ProductCustomerDetails;

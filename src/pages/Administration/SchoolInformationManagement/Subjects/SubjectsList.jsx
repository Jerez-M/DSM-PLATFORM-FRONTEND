import { Button, Popconfirm, Space, Table, Tooltip } from "antd";
import { useState, useEffect } from "react";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import authenticationService from "../../../../services/authentication.service";
import subjectService from "../../../../services/subject.service";
import EditSubject from "./EditSubject";
import {deleteColor, editColor} from "../../../../common";

const SubjectsList = () => {
  const [editSubjectModalState, setEditSubjectModalState] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const tenantId = authenticationService.getUserTenantId();

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.getAll(tenantId);

      if (response.status === 200) {
        setSubjectList(response.data);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occured during fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const subjectsTableColumns = [
    {
      title: "Subject ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subject name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Subject">
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: editColor }}
              onClick={() => editSubject(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Subject">
            <Popconfirm
              title="Delete Subject"
              description="Are you sure you want to delete this class?"
              // onConfirm={() => deleteSubjectAllocation(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                  type="danger"
                  style={{color: deleteColor}}
                  icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const editSubject = (record) => {
    setSelectedRecord(record);
    setEditSubjectModalState(true);
  };
  
  return (
    <>
      <Table dataSource={subjectList} columns={subjectsTableColumns} />

      <EditSubject
        open={editSubjectModalState}
        close={() => setEditSubjectModalState(false)}
        record={selectedRecord}
      />
    </>
  );
};

export default SubjectsList;

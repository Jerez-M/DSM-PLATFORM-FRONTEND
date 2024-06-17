import { Divider, Space, Table, Tooltip, Alert, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import authenticationService from "../../../services/authentication.service";
import subjectAllocationService from "../../../services/subject-allocation.service";
import { useNavigate } from "react-router-dom";

const SubjectList = () => {
  const [subjectAllocationList, setSubjectAllocationList] = useState([]);
  const navigate = useNavigate();

  const userId = authenticationService.getUserId();

  const fetchSubjectAllocations = async () => {
    try {
      const response =
        await subjectAllocationService.getsubjectAllocationByUserId(userId);
      if (response.status === 200) {
        setSubjectAllocationList(response.data);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occured during fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjectAllocations();
  }, []);

  const studentClassesTableColumns = [
    {
      title: "Subject class ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subject",
      dataIndex: ["subject", "name"],
      key: "subject",
    },
    {
      title: "Classroom",
      dataIndex: ["classroom", "name"],
      key: "classroom",
    },
    {
      title: "Level",
      dataIndex: ["classroom", "level", "name"],
      key: "level",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (record) => (
        <Space size="middle">
          <Tooltip title="View students">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(
                  `/teacher/subjects/classroom/${record?.classroom?.id}/students/`
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3>My subjects</h3>
      </div>
      <Divider type={"horizontal"} />
      <Alert
        closable={true}
        className={"mb-2 py-2 rounded-1"}
        showIcon={true}
        type={"info"}
        message="The following are the subjects that you teach and the classes that you were assigned."
      />

      <Table
        dataSource={subjectAllocationList}
        columns={studentClassesTableColumns}
      />
    </>
  );
};

export default SubjectList;

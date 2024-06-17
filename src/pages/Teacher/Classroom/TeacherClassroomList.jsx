import {Button, Divider, Space, Table, Tag} from "antd";
import {EyeOutlined, ManOutlined, WomanOutlined} from "@ant-design/icons";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import ClassroomService from "../../../services/classroom.service";
import AuthenticationService from "../../../services/authentication.service";

export async function teacherClassroomLoader() {
      try {
            const classResponse = await ClassroomService.getClassByTeacherUserId(
                AuthenticationService.getUserId()
            );
            if(classResponse?.status === 200) {
                const classRooms = classResponse.data;
                return { classRooms };
            }
      } catch (e) {
            return [];
      }
}

const TeacherClassroomList = () => {
      const { classRooms } = useLoaderData();
      const navigate = useNavigate();

      const tableClasses = classRooms
            ?.map((_class, key) => {
                  let teacherDetails = "";
                  if (_class.class_teacher?.user) {
                        const { firstName, lastName, username } = _class.class_teacher?.user;
                        teacherDetails = `${firstName} ${lastName} (${username})`;
                  }
                  return {
                        key: key + 1,
                        id: _class.id,
                        name: _class.name,
                        teacher: teacherDetails,
                        level: _class.level?.name,
                        occupation: (_class.males + _class.females) + "/" + _class.capacity,
                        tags: [{gender: "MALE", number: _class.males}, {gender: "FEMALE", number: _class.females}]
                  };
            })
            ?.sort((a, b) => {
                  if (a.level < b.level) return -1;
                  if (a.level > b.level) return 1;
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
            });

  const studentClassesTableColumns = [
    {
      title: "Class name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Classroom Occupation",
      dataIndex: "occupation",
      key: "occupation",
    },
    {
      title: "Gender Ratio",
      dataIndex: "genderRatio",
      key: "genderRatio",
      render: (_, { tags }) => (
          <>
            {tags.map((tag) => {
              let color = tag.gender === "MALE" ? 'geekblue' : 'pink';
              return (
                  <Tag color={color} key={tag.gender}>
                    {tag.gender} {tag.number}
                  </Tag>
              );
            })}
          </>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Students">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                navigate(
                  `/teacher/classroom/${record.id}`
                );
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
        <>
              <div className="d-flex justify-content-between align-items-center">
                <h3>{classRooms?.length > 0 ? "My Classes" : "You have no Classes"}</h3>
              </div>

          <Divider type={"horizontal"} />

          <Table columns={studentClassesTableColumns} dataSource={tableClasses} />
        </>
  );
};

export default TeacherClassroomList;

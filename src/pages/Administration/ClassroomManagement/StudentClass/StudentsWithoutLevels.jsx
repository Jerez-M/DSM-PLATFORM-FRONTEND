import {Button, Divider, Space, Table, Tooltip} from "antd";
import StudentClassService from "../../../../services/classroom.service";
import AuthenticationService from "../../../../services/authentication.service";
import { useNavigate, useLoaderData } from "react-router-dom";
import {ArrowLeftOutlined, UserOutlined} from "@ant-design/icons";
import {getColumnSearchPropsNoFilter} from "../../../../common";
import {useRef, useState} from "react";

export async function StudentsWithoutLevelsLoader() {
  try {
    const response =
      await StudentClassService.getStudentsWithoutLevelsByTenantId(
        AuthenticationService.getUserTenantId()
      );
    if (response?.status === 200) {
      const students = response?.data;
      return { students };
    }
  } catch (e) {
    return [];
  }
}
const StudentsWithoutLevels = () => {
  const { students } = useLoaderData();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const studentsTableColumns = [
    {
      title: "Reg Number",
      dataIndex: ["user", "username"],
      key: 1,
      sorter: {
        compare: (a, b) => a.user?.username?.localeCompare(b.user?.username)
      },
      onFilter: (value, record) =>
          record.user?.username
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()),
      ...getColumnSearchPropsNoFilter('username', searchInput, handleSearch, handleReset),
    },
    {
      title: "First Name",
      dataIndex: ["user", "firstName"],
      key: 2,
      sorter: {
        compare: (a, b) => a.user.firstName?.localeCompare(b.user.firstName),
      },
      onFilter: (value, record) =>
          record.user?.firstName
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()),
      ...getColumnSearchPropsNoFilter('firstName', searchInput, handleSearch, handleReset),
    },
    {
      title: "Last Name",
      dataIndex: ["user", "lastName"],
      key: 3,
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a.user?.lastname?.localeCompare(b.user?.lastname)
      },
      onFilter: (value, record) =>
          record.user?.lastName
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()),
      ...getColumnSearchPropsNoFilter('lastName', searchInput, handleSearch, handleReset),
    },
    {
      title: "Gender",
      dataIndex: ["user", "gender"],
      key: 4,
      filters: [
        {
          text: 'MALE',
          value: 'MALE',
        },
        {
          text: 'FEMALE',
          value: 'FEMALE',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.user.gender.startsWith(value),
      sorter: {
        compare: (a, b) => a.user?.gender?.localeCompare(b.user?.gender)
      },
    },
    {
      title: "Level",
      dataIndex: ["level"],
      key: 5,
      sorter: {
        compare: (a, b) => a.level.name.localeCompare(b.level.name),
        multiple: 1,
      },
      filters: [
        { text: 'FORM 1', value: 'FORM 1' },
        { text: 'FORM 2', value: 'FORM 2' },
        { text: 'FORM 3', value: 'FORM 3' },
        { text: 'FORM 4', value: 'FORM 4' },
        { text: 'FORM 5', value: 'FORM 5' },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: "Action",
      key: 6,
      render: (record) => (
        <Space size="small">
          <Tooltip title="View Student Profile">
            <Button
              className='text-light border-0'
              type="primary"
              icon={<UserOutlined/>}
              onClick={() => navigate(`/admin/students/${record.id}`)}
            />
          </Tooltip>
        </Space>
      )
    },
  ];

  return (
    <>
      <ArrowLeftOutlined
        onClick={() => navigate("/admin/student-classes")}
        className="mb-1 me-2"
      />
      <div className="d-flex justify-content-between align-items-center">
        <h3>Students Without Levels</h3>
      </div>
      <Divider type={"horizontal"} />

      <Table
        className="table-responsive"
        columns={studentsTableColumns}
        dataSource={students}
      />
    </>
  );
};

export default StudentsWithoutLevels;

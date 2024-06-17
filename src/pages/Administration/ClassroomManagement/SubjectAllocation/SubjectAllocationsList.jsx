import {Button, Divider, Input, message, Popconfirm, Space, Table, Tooltip} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined, SearchOutlined,
} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import NewSubjectClass from "./NewSubjectAllocation";
import authenticationService from "../../../../services/authentication.service";
import subjectAllocationService from "../../../../services/subject-allocation.service";
import {deleteColor, editColor, handleError, refreshPage} from "../../../../common";
import EditSubjectAllocation from "./EditSubjectAllocation";

const SubjectAllocationsList = () => {
  const [newSubjectClassModalState, setNewSubjectClassModalState] =
    useState(false);
  const [editSubjectAllocationModal, setEditSubjectAllocationModal] = useState(false);
  const [selectedSubjectAllocation, setSelectedSubjectAllocation] = useState(null)
  const [subjectAllocationList, setSubjectAllocationList] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const tenantId = authenticationService.getUserTenantId();

  const fetchSubjectAllocations = async () => {
    try {
      const response =
        await subjectAllocationService.getSubjectAllocationByInstitutionId(
          tenantId
        );

      if (response.status === 200) {
        setSubjectAllocationList(response.data);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjectAllocations();
  }, []);


  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
    ),
    filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  const edit = (record) => {
    setSelectedSubjectAllocation(record);
    setEditSubjectAllocationModal(true);
  }

  const deleteSubjectAllocation = (subject) => {
    subjectAllocationService.delete(subject.id)
        .then((res) => {
          if (res.status === 204) {
            message.success(`Subject Allocation Deleted successfully`);
            refreshPage();
          }
        })
        .catch((e) => {
          handleError(e);
        });
  }

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
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a?.subject?.name?.localeCompare(b?.subject?.name),
        multiple: 2
      },
      onFilter: (value, record) =>
          record.subject.name
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()), 
      ...getColumnSearchProps(["subject", "name"])
    },
    {
      title: "Level",
      dataIndex: ["classroom", 'level', 'name'],
      key: "level",
      defaultSortOrder: 'ascend',
      onFilter: (value, record) =>
          record.classroom.level.name
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()),
      sorter: {
        compare: (a, b) => a.classroom?.level?.name?.localeCompare(b.classroom?.level?.name),
        multiple: 4
      },
      ...getColumnSearchProps('level')
    },
    {
      title: "Classroom",
      dataIndex: ["classroom", 'name'],
      key: "classroom",
      defaultSortOrder: 'ascend',
      onFilter: (value, record) =>
          record.classroom.name
              .toString()
              .toLowerCase()
              .includes((value).toLowerCase()),

      sorter: {
        compare: (a, b) => a.classroom?.name?.localeCompare(b.classroom?.name),
        multiple: 3
      },
      ...getColumnSearchProps('classroom')
    },
    {
      title: "Subject teacher",
      dataIndex: "teacher",
      key: "teacher",
      defaultSortOrder: 'ascend',
      onFilter: (value, record) =>
          record.teacher?.user?.lastName
              .toLowerCase()
              .includes((value).toLowerCase()),
      sorter: {
        compare: (a, b) => a?.teacher?.lastName?.localeCompare(b?.teacher?.lastName),
        multiple: 1
      },
      ...getColumnSearchProps('teacher'),
      render: (_, record) => (
        <span>
          {record?.teacher?.title} {record?.teacher?.user?.lastName} {record?.teacher?.user?.firstName?.at(0)}.
        </span>
      )
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Class">
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: editColor }}
              onClick={() => edit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Class">
            <Popconfirm
              title="Delete Class"
              description="Are you sure you want to delete this class?"
              onConfirm={() => deleteSubjectAllocation(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" style={{color: deleteColor}} icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Subject allocations</h3>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          // className="border-0 bg-dark text-light"
          onClick={() => setNewSubjectClassModalState(true)}
        >
          Allocate subject
        </Button>
      </div>
      <Divider type={"horizontal"} />

      <Table
        className="table-responsive"
        dataSource={subjectAllocationList}
        columns={studentClassesTableColumns}
      />

      <NewSubjectClass
        open={newSubjectClassModalState}
        close={() => setNewSubjectClassModalState(false)}
      />

      <EditSubjectAllocation
        open={editSubjectAllocationModal}
        close={() => setEditSubjectAllocationModal(false)}
        subjectAllocation={selectedSubjectAllocation}
      />
    </>
  );
};

export default SubjectAllocationsList;

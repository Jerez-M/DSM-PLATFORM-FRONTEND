import {
    Button,
    Divider,
    Dropdown,
    message,
    Popconfirm,
    Space,
    Table,
    Tag,
} from "antd";
import {
    AuditOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {useRef, useState} from "react";
import NewStudentClass from "./NewStudentClass";
import StudentClassService from "../../../../services/classroom.service";
import AuthenticationService from "../../../../services/authentication.service";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Tooltip} from "antd";
import { useParams } from 'react-router-dom';
import {getColumnSearchProps, handleError} from "../../../../common";

export async function classesLoader() {
    try {
        const response = await StudentClassService.getAll(
            AuthenticationService.getUserTenantId()
        );
        if (response?.status === 200) {
            const classRooms = response.data;
            return {classRooms};
        }
    } catch (e) {
        return [];
    }
}

const StudentClassesList = () => {
    const [newStudentClassModalState, setNewStudentClassModalState] =
        useState(false);
    const [selectedClass, setSelectedClasses] = useState([]);
    const {classRooms} = useLoaderData();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const tableClasses = classRooms
        ?.map((_class) => {
            let teacherDetails = "";
            if (_class.class_teacher?.user) {
                const {firstName, lastName, username} = _class.class_teacher?.user;
                teacherDetails = `${firstName} ${lastName} (${username})`;
            }
            return {
                id: _class.id,
                name: _class.name,
                teacher: teacherDetails,
                level: _class.level,
                occupation: _class.occupied_sits + "/" + _class.capacity,
                tags: [
                    {gender: "MALE", number: _class.males},
                    {gender: "FEMALE", number: _class.females},
                ],
            };
        })
        ?.sort((a, b) => {
            if (a.level?.name < b.level?.name) return -1;
            if (a.level?.name > b.level?.name) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const studentClassesTableColumns = [
        {
            title: 'Class Level',
            dataIndex: ['level', 'name'],
            key: 'level',
            sorter: {
                compare: (a, b) => a.level.name.localeCompare(b.level.name),
                multiple: 3,
            },
            filters: [
                {text: 'FORM 1', value: 'FORM 1'},
                {text: 'FORM 2', value: 'FORM 2'},
                {text: 'FORM 3', value: 'FORM 3'},
                {text: 'FORM 4', value: 'FORM 4'},
                {text: 'FORM 5', value: 'FORM 5'},
            ],
            onFilter: (value, record) => record.level.name === value,
        },
        {
            title: 'Class Name',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name.localeCompare(b.name),
                multiple: 2,
            },
        },
        {
            title: 'Class Teacher',
            dataIndex: 'teacher',
            key: 'teacher',
            sorter: {
                compare: (a, b) => a.teacher.localeCompare(b.teacher),
                multiple: 1
            }
        },
        {
            title: 'Classroom Occupation',
            dataIndex: 'occupation',
            key: 'occupation',
        },
        {
            title: 'Gender Ratio',
            dataIndex: 'genderRatio',
            key: 'genderRatio',
            render: (_, {tags}) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.gender === 'MALE' ? 'geekblue' : 'pink';
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
                            icon={<EyeOutlined/>}
                            onClick={() => {
                                navigate(
                                    `/admin/student-classes/${record.id}/students/${record.name}/${record.level?.id}`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View Coursework">
                        <Button
                            // type="primary"
                            style={{background: "#ACAC12"}}
                            icon={<AuditOutlined/>}
                            onClick={() => {
                                navigate(
                                    `/admin/coursework/classroom/${record?.id}`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Class">
                        <Button
                            className="text-light border-0"
                            style={{background: "#FAAD14"}}
                            icon={<EditOutlined/>}
                            onClick={() => editClass(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Class">
                        <Popconfirm
                            title="Delete Class"
                            description="Are you sure you want to delete this class?"
                            onConfirm={() => deleteClass(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{color: "#d22323"}}
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const addNewClass = () => {
        setSelectedClasses(null);
        setNewStudentClassModalState(true);
    };

    const editClass = (classId) => {
        const selectedClass = classRooms.find(
            (studentClass) => studentClass.id === classId
        );
        setSelectedClasses(selectedClass);
        setNewStudentClassModalState(true);
    };

    const deleteClass = (classId) => {
        StudentClassService.delete(classId)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Class Deleted");
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };

    const items = [
        {
            label: "Add new class",
            key: "1",
            onClick: () => {
                addNewClass();
            },
        },
        {
            label: "Students without classes",
            key: "2",
            onClick: () => {
                navigate("/admin/classes/students-without-classes/");
            },
        },
        {
            label: "Students without levels",
            key: "3",
            onClick: () => {
                navigate("/admin/classes/students-without-levels/");
            },
        },

    ];

    const menuProps = {
        items,
    };
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>All Classes</h3>
                <div className="align-items-center">
                    <Dropdown menu={menuProps}>
                        <Button
                            className="border-0 px-3 text-white"
                            style={{background: "#39b54a"}}
                        >
                            <Space>
                                More actions...
                                <DownOutlined/>
                            </Space>
                        </Button>
                    </Dropdown>
                </div>
            </div>
            <Divider type={"horizontal"}/>

            <Table columns={studentClassesTableColumns} dataSource={tableClasses}/>

            <NewStudentClass
                open={newStudentClassModalState}
                close={() => setNewStudentClassModalState(false)}
                studentClass={selectedClass}
            />
        </>
    );
};

export default StudentClassesList;

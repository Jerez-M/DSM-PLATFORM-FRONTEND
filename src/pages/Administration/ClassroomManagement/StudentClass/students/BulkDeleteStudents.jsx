import {
    Button,
    Divider,
    FloatButton,
    Select,
    Space,
    Spin,
    Table,
    Tooltip
} from "antd";
import {Link, useLoaderData, useNavigate, useParams} from "react-router-dom";
import {
    ArrowLeftOutlined,
    UserOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import AuthenticationService from "../../../../../services/authentication.service"
import {useEffect, useRef, useState} from "react";
import AcademicYearService from "../../../../../services/academic-year.service";
import StudentClassService from "../../../../../services/student-class.service";
import ConfirmDeleteStudentsModal from "./DeleteConfirmModal";
import {getColumnSearchProps} from "../../../../../common";

export async function bulkDeleteClassStudentsLoader({params}) {
    try {
        console.log(params)
        const yearResponse = await AcademicYearService.getAllAcademicYears(AuthenticationService.getUserTenantId())

        const academicYears = yearResponse.data?.sort((a, b) => {
            if (a.startDate < b.startDate) return 1
            if (a.startDate > b.startDate) return -1
            return 0
        })

        return {academicYears};
    } catch (e) {
        return []
    }
}

const BulkDeleteStudents = () => {
    const [students, setStudents] = useState([]);

    const [filteredAcademicYears, setFilteredAcademicYears] = useState()
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const {academicYears} = useLoaderData()
    const {classId} = useParams()
    const [currentAcademicYear, setCurrentAcademicYear] = useState(null)

    const [studentsToDelete, setStudentsToDelete] = useState([])
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        const filteredAcademicYears = academicYears?.map(year => {
            if (year.active_year) {
                setCurrentAcademicYear(year.id)
            }

            return {label: year.name, value: year.id}
        })

        setFilteredAcademicYears(filteredAcademicYears)
    }, [academicYears]);

    useEffect(() => {
        currentAcademicYear && StudentClassService.getAllByClassAndYear(AuthenticationService.getUserTenantId(), classId, currentAcademicYear)
            .then((response => {
                const students = response.data;

                setStudents(students);
            }))
            .catch(e => {
                console.log({e})
            });
    }, [classId, currentAcademicYear]);

    const _students = students?.map(
        (student) => ({
            id: student?.student?.user?.id,
            registrationNumber: student?.student?.user?.username,
            firstname: student?.student?.user?.firstName,
            middlename: student?.student?.user?.middleNames,
            lastname: student?.student?.user?.lastName,
            gender: student?.student?.user?.gender,
            level: student?.student?.level?.name,
            key: student?.student?.user?.id
        })
    ).sort((a, b) => {
        if (a.lastname < b.lastname) return -1
        if (a.lastname > b.lastname) return 1
        return 0
    })

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
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Reg number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            sorter: {
                compare: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber),
            },
            ...getColumnSearchProps('registrationNumber', searchInput, handleSearch, handleReset)
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.firstname.localeCompare(b.firstname),
            },
            ...getColumnSearchProps('firstname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: {
                compare: (a, b) => a.lastname.localeCompare(b.lastname),
            },
            defaultSortOrder: 'ascend',
            ...getColumnSearchProps('lastname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: {
                compare: (a, b) => a.gender.localeCompare(b.gender),
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="small">
                    <Tooltip title="View Student Profile">
                        <Button
                            className='text-light border-0'
                            style={{background: '#2ba5d2'}}
                            icon={<UserOutlined/>}
                            onClick={() => navigate(`/admin/students/${record.id}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setStudentsToDelete(selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    const handleDeleteStudents = () => {
        console.log("deleting: ", studentsToDelete)
        setConfirmDeleteModal(true)
    }

    return (
        <>
            <Link to="/admin/student-classes" className='text-muted text-decoration-none mb-2'>
                <ArrowLeftOutlined /> Back
            </Link>

            <h3 className="text-danger">Delete Students</h3>

            <Divider type={"horizontal"}/>

            <Select
                placeholder="Select Academic Year"
                size="large"
                value={currentAcademicYear}
                onChange={(value) => setCurrentAcademicYear(value)}
                options={filteredAcademicYears}
                className="mb-3"
            />

            <Spin spinning={loading} size="large" fullscreen="true" >
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    className="table-responsive mb-5"
                    dataSource={_students}
                    pagination={false}
                    columns={studentsTableColumns}
                />
            </Spin>

            <FloatButton
                type="primary"
                className="blue-float-btn"
                style={{background: '#2ba5d2 !important'}}
                tooltip="Delete Selected Students"
                icon={<DeleteOutlined />}
                onClick={handleDeleteStudents}
            />

            <ConfirmDeleteStudentsModal
                open={confirmDeleteModal}
                close={() => setConfirmDeleteModal(false)}
                userIds={studentsToDelete}
            />
        </>
    )
}

export default BulkDeleteStudents;
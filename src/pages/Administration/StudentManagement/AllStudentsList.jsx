import {Button, Divider, Input, Select, Space, Table, Tooltip} from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import {ArrowLeftOutlined, EyeOutlined, PrinterOutlined, SearchOutlined,} from "@ant-design/icons";
import StudentService from "../../../services/student.service";
import AuthenticationService from "../../../services/authentication.service";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {getColumnSearchProps} from "../../../common";


export async function allStudentsLoader() {
    try {
        const tenantId = AuthenticationService.getUserTenantId();
        const response = await StudentService.getAllStudentsByInstitutionId(tenantId);
        if (response?.status === 200) {
            const students = response.data;
            return { students };
        }
    } catch (e) {
        return []
    }
}

const AllStudentsList = () => {
    const navigate = useNavigate();
    const { students } = useLoaderData();

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const _students = students.map(
        (student, key) => ({
            studentId: student?.id,
            registrationNumber: student?.user?.username,
            firstname: student?.user?.firstName,
            middlename: student?.user?.middleNames === 'nan' ? '' : student?.user?.middleNames,
            lastname: student?.user?.lastName,
            gender: student?.user?.gender,
            level: student?.level?.name,
            key: key + 1
        })
    )

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // const searchProps = getColumnSearchProps(
    //     dataIndex,
    //     searchInput,
    //     () => handleSearch(selectedKeys, confirm, dataIndex),
    //     () => handleReset(clearFilters)
    // )



    const studentsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Reg number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            sorter: {
                compare: (a, b) => a.registrationNumber?.localeCompare(b.registrationNumber),
                    multiple: 2
            },
            ...getColumnSearchProps('registrationNumber', searchInput, handleSearch, handleReset)
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.firstname?.localeCompare(b.firstname),
                multiple: 3
            },
            ...getColumnSearchProps('firstname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.lastname?.localeCompare(b.lastname),
                multiple: 4
            },
            ...getColumnSearchProps('lastname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: {
                compare: (a, b) => a.gender?.localeCompare(b.gender),
                multiple: 2
            },
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
            onFilter: (value, record) => record.gender.startsWith(value),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.level?.localeCompare(b.level),
                multiple: 5
            },
            ...getColumnSearchProps('level', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View student profile">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/students/${record?.studentId}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const handleStudentChange = (value) => {
        navigate(`/admin/students/${value}`);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    return (
        <>
            <ArrowLeftOutlined
                onClick={() => navigate("/admin/students")}
                className="mb-1 me-2"
            />
            <div className='d-flex justify-content-between align-items-center'>
                <h3>All Students</h3>
            </div>
            <Divider className='my-1' type={"horizontal"} />

            <div>
                <div className='mb-3 d-flex justify-content-between align-items-baseline'>
                    <div>
                        <p className='m-0'>Search student</p>
                        <Select
                            onChange={handleStudentChange}
                            className='w-50'
                            showSearch
                            placeholder="Search student by registration number"
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                (option?.label ?? '').toLowerCase().includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={(_students || []).map((i) => ({
                                value: i?.studentId,
                                label: `${i?.firstname} ${i?.lastname} (${i?.registrationNumber})`,
                            }))}
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                    >
                        Print
                    </Button>
                </div>

                <Table
                    className="table-responsive print-margins"
                    columns={studentsTableColumns}
                    dataSource={_students}
                    ref={componentRef}
                />

            </div>


        </>
    )
}

export default AllStudentsList;
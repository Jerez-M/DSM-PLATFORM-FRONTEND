import {Button, Divider, Input, Select, Space, Table, Tooltip} from "antd";
import {useLoaderData, useNavigate} from "react-router-dom";
import {EyeOutlined, PlusOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../../services/authentication.service";
import TeacherService from "../../../../services/teacher.service";
import {getColumnSearchProps} from "../../../../common";
import {useRef, useState} from "react";
import DESIGNATIONS from "../../../../utils/designations";

export async function teachersLoader() {
    try {
        const tenantId = AuthenticationService.getUserTenantId();
        const response = await TeacherService.getAllTeachersByInstitutionId(tenantId);
        if (response?.status === 200) {
            const teachers = response.data;
            return {teachers};
        }
    } catch (e) {
        return []
    }
}

const TeachersList = () => {
    const navigate = useNavigate();
    const {teachers} = useLoaderData();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const _teachers = teachers.map(
        (teacher, key) => ({
            teacherId: teacher?.id,
            registrationNumber: teacher?.user?.username,
            firstname: teacher?.user?.firstName,
            middlename: teacher?.user?.middleNames,
            lastname: teacher?.user?.lastName,
            gender: teacher?.user?.gender,
            designation: teacher?.designation,
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

    const studentsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Teacher number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            sorter: {
                compare: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber),
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
                multiple: 4
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
                multiple: 5
            },
            ...getColumnSearchProps('lastname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
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
            sorter: {
                compare: (a, b) => a.gender?.localeCompare(b.gender),
                multiple: 3
            },
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            sorter: {
                compare: (a, b) => a.designation?.localeCompare(b.designation),
                multiple: 6
            },
            filters: DESIGNATIONS.map(designation => ({text: designation.label, value: designation.value})),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.designation?.startsWith(value),        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View teacher profile">
                        <Button
                            type="primary"
                            icon={<EyeOutlined/>}
                            onClick={() => navigate(`/admin/teachers/${record?.teacherId}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>All Teachers</h3>
                <Button
                    icon={<PlusOutlined/>}
                    className='border-0 text-light'
                    style={{background: '#39b54a'}}
                    onClick={() => navigate('/admin/new-teacher')}
                >
                    Register new teacher
                </Button>
            </div>
            <Divider className='my-3' type={"horizontal"}/>

            <Table
                dataSource={_teachers}
                columns={studentsTableColumns}
            />
        </>
    )
}

export default TeachersList;
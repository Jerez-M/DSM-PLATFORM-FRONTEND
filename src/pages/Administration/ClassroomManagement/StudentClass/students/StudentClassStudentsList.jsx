import {
    Button,
    Card, DatePicker,
    Divider,
    Dropdown,
    Form,
    Input,
    message,
    Modal,
    Select,
    Space,
    Spin,
    Table,
    Tabs, Tag,
    Tooltip
} from "antd";
import {Link, useLoaderData, useNavigate, useParams} from "react-router-dom";
import {
    ClockCircleOutlined,
    DownOutlined,
    SolutionOutlined,
    SearchOutlined,
    UserOutlined, CheckCircleFilled, CloseCircleFilled
} from "@ant-design/icons";
import AuthenticationService from "../../../../../services/authentication.service";
import AddStudentsToClass from "./AddStudentsToClass";
import React, {useEffect, useRef, useState} from "react";
import AcademicYearService from "../../../../../services/academic-year.service";
import StudentMarkService from "../../../../../services/student-mark.service";
import LevelService from "../../../../../services/level.service";
import {capitalize, pluralize, refreshPage} from "../../../../../common";
import RemoveStudentsFromClass from "./RemoveStudentsFromClass";
import {useReactToPrint} from "react-to-print";
import StudentClassService from "../../../../../services/student-class.service";
import schoolTerm from "../../../../../services/schoolTerm.services";
import StudentAttendanceService from "../../../../../services/student-attendance.service";
import BackButton from "../../../../../common/BackButton";
import {fetchStudentAttendanceRecordsByClassroomIdAndDate} from "../../../../Teacher/Classroom/AttendanceMarking";
import dayjs from "dayjs";
import StudentResultsService from "../../../../../services/student-results.service";

export async function classStudentsLoader({params}) {
    try {
        const yearResponse = await AcademicYearService.getAllAcademicYears(AuthenticationService.getUserTenantId())
        const levelResponse = await LevelService.getById(params.level);

        const academicYears = yearResponse.data?.sort((a, b) => {
            if (a.startDate < b.startDate) return 1
            if (a.startDate > b.startDate) return -1
            return 0
        })

        const response = await StudentAttendanceService.checkIfClassroomHasActiveAttendanceRegister(
            params.classId
        )

        const _classDailyAttendance = await StudentAttendanceService.getDailyAttendanceReportByClassroomIdAndDate(
            params.classId,
            new Date().toISOString().split("T")[0]
        )

        const _status = response?.data?.status;
        const classDailyAttendance = _classDailyAttendance?.data;

        const level = levelResponse.data;
        return {academicYears, level, _status, classDailyAttendance};
    } catch (e) {
        return []
    }
}

const StudentCLassStudentsList = () => {
    const [addStudentsModalState, setAddStudentsModalState] = useState(false);
    const [removeStudentsModalState, setRemoveStudentsModalState] = useState(false)
    const [students, setStudents] = useState([]);

    const [filteredAcademicYears, setFilteredAcademicYears] = useState()
    const [studentMoreInfoModal, setStudentMoreInfoModal] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const {academicYears, level, _status, classDailyAttendance} = useLoaderData();
    const [form] = Form.useForm();
    const {classId, className} = useParams()
    const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
    const [activeAcademicYear, setActiveAcademicYear] = useState(null)
    const componentRef = useRef();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [isCreateClassRegisterModalOpen, setIsCreateClassRegisterModalOpen] = useState(false);
    const [schoolTermsList, setSchoolTermsList] = useState([]);
    const [isCreateClassRegisterButtonLoading, setIsCreateClassRegisterButtonLoading] = useState(false);

    const [isAttendanceRecordsModalOpen, setIsAttendanceRecordsModalOpen] = useState(false);

    const [previousTermsResults, setPreviousTermsResults] = useState([]);

    const schoolTermsListOptions = schoolTermsList?.map(term => ({
        label: term.name,
        value: term.id
    }));


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Students in ${level?.name} ${className}`,
    })

    const handleClear = () => {
        form.resetFields();
    }

    useEffect(() => {
        const filteredAcademicYears = academicYears?.map(year => {
            if (year.active_year) {
                setCurrentAcademicYear(year.id)
                setActiveAcademicYear(year)
            }

            return {label: year.name, value: year.id}
        })

        setFilteredAcademicYears(filteredAcademicYears)
    }, [academicYears]);

    useEffect(() => {
        currentAcademicYear && StudentClassService.getAllByClassAndYear(AuthenticationService.getUserTenantId(), classId, currentAcademicYear)
            .then((response => {
                const objectKeys = Object.keys(response.data);
                const keyIndex = objectKeys.findIndex(key => key === className);
                const students = response.data;

                setStudents(students);
            }))
            .catch(e => {
                console.log({e})
            });
    }, [classId, currentAcademicYear]);

    const _students = students?.map(
        (student, key) => ({
            id: student?.student?.id,
            userId: student?.student?.user?.id,
            registrationNumber: student?.student?.user?.username,
            firstname: student?.student?.user?.firstName,
            middlename: student?.student?.user?.middleNames,
            lastname: student?.student?.user?.lastName,
            gender: student?.student?.user?.gender,
            level: student?.student?.level?.name,
            key: key + 1
        })
    ).sort((a, b) => {
        if (a.lastname < b.lastname) return -1
        if (a.lastname > b.lastname) return 1
        return 0
    })

    async function studentAcademicInformation(studentId, userId) {
        try {
            setLoading(true)
            const response = await StudentMarkService.getCurrentTermResults(studentId);
            const response2 = await StudentResultsService.getPreviousResults(userId);
            const student = response.data;
            const response2Data = response2.data;
            setPreviousTermsResults(response2Data);
            setResults(student);
        } catch (e) {
            setResults([])
        } finally {
            setLoading(false)
        }
    }

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
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    const resultsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject'
        },
        {
            title: 'Mark',
            dataIndex: 'mark',
            key: 'mark'
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment'
        },
    ]

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
                compare: (a, b) => a?.registrationNumber?.localeCompare(b?.registrationNumber),
            },
            ...getColumnSearchProps('registrationNumber')
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a?.firstname?.localeCompare(b?.firstname),
            },
            ...getColumnSearchProps('firstname')
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: {
                compare: (a, b) => a?.lastname?.localeCompare(b?.lastname),
            },
            defaultSortOrder: 'ascend',
            ...getColumnSearchProps('lastname')
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
            onFilter: (value, record) => record?.gender?.startsWith(value),
            sorter: {
                compare: (a, b) => a?.gender?.localeCompare(b?.gender),
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="small">
                    <Tooltip title="View Academic info">
                        <Button
                            type="primary"
                            icon={<SolutionOutlined/>}
                            onClick={async () => {
                                await studentAcademicInformation(record?.id, record?.userId);
                                setStudentMoreInfoModal(true);
                            }}
                        />
                    </Tooltip>
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

    const tabItems = [
        {
            key: '1',
            label: <Button type={"default"} className='border-0'>End term results</Button>,
            children:
                <>
                    <Form form={form} layout={"vertical"}>
                        <Card>
                            <div className='row'>
                                <div className='col-md-2'>
                                    <Form.Item label='Reg number'>
                                        <Input
                                            value={results && results[0]?.student?.regNumber}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='First name'>
                                        <Input
                                            value={results && results[0]?.student?.firstName}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Last name'>
                                        <Input
                                            value={results && results[0]?.student?.lastName}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Grade'>
                                        <Input
                                            value={results && results[0]?.student?.level}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Term'>
                                        <Input
                                            value={results && results[0]?.term}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Year'>
                                        <Input
                                            value={results && results[0]?.academic_year}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Table
                                className="mt-3 table-responsive"
                                columns={resultsTableColumns}
                                dataSource={results[1] &&
                                    results[1].map(
                                        (subject, key) => ({
                                            key: key + 1,
                                            subject: subject?.subject,
                                            mark: subject?.total_mark,
                                            comment: subject?.comment
                                        })
                                    )
                                }
                            />
                        </Card>
                    </Form>
                </>
        },
        {
            key: '2',
            label: <Button type={"default"} className='border-0'>Previous End term results</Button>,
            children:
                <>
                    <Form form={form} layout={"vertical"}>
                        <Card>
                            <div className='row'>
                                <div className='col-md-2'>
                                    <Form.Item label='Reg number'>
                                        <Input
                                            value={results && results[0]?.student?.regNumber}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='First name'>
                                        <Input
                                            value={results && results[0]?.student?.firstName}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Last name'>
                                        <Input
                                            value={results && results[0]?.student?.lastName}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Grade'>
                                        <Input
                                            value={results && results[0]?.student?.level}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Term'>
                                        <Input
                                            value={results && results[0]?.term}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-2'>
                                    <Form.Item label='Year'>
                                        <Input
                                            value={results && results[0]?.academic_year}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            {
                                previousTermsResults?.slice(1)?.map(
                                    (termResultsItem, index) => (
                                        <Table
                                            title={() => (
                                                <h5 className='text-center fw-bold'>
                                                    {termResultsItem[0]?.term_name} {termResultsItem[0]?.academic_year}
                                                </h5>
                                            )}
                                            key={index}
                                            className="mt-3 table-responsive"
                                            columns={resultsTableColumns}
                                            dataSource={termResultsItem &&
                                                termResultsItem?.slice(1).map(
                                                    (subject, key) => ({
                                                        key: key + 1,
                                                        subject: subject?.subject,
                                                        mark: subject?.total_mark,
                                                        comment: subject?.comment
                                                    })
                                                )
                                            }
                                        />
                                    )
                                )
                            }
                        </Card>
                    </Form>
                </>
        }
    ];

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            label: 'Add Students',
            key: '1',
            onClick: () => setAddStudentsModalState(true)
        },
        {
            label: 'Print Students',
            key: '2',
            onClick: () => handlePrint()
        },
        {
            label: 'Remove Student',
            key: '3',
            onClick: () => setRemoveStudentsModalState(true)
        },
        {
            label: 'Create Class Register',
            key: '4',
            onClick: () => setIsCreateClassRegisterModalOpen(true),
            disabled: _status === true
        }
    ];

    const menuProps = {
        items,
    };

    const handleCreateClassRegister = async (values) => {
        const valuesToSubmit = {
            ...values,
            classroom: classId,
            tenant: AuthenticationService.getUserTenantId(),
            is_active: true
        }
        setIsCreateClassRegisterButtonLoading(true);
        try {
            const response = await StudentAttendanceService.create(valuesToSubmit);
            if(response.status === 201) {
                message.success('Class register created successfully');
                setIsCreateClassRegisterModalOpen(false);
                refreshPage();
            }
        } catch (e) {
            setIsCreateClassRegisterButtonLoading(false);
            message.error('Failed to create class register');
        }
    }

    const fetchTerms = async () => {
        try {
            const response = await schoolTerm.getTermsInActiveAcademicYearByInstitutionId(
                AuthenticationService.getUserTenantId()
            );

            if (response.status === 200) {
                setSchoolTermsList(response.data);
            }
        } catch (error) {
            setSchoolTermsList([])
        }
    };

    useEffect(() => {
        fetchTerms();
    }, [])


    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const _attendanceRecords = attendanceRecords?.map((attendanceRecord, key) => ({
        student: `${attendanceRecord?.student?.user?.firstName} ${attendanceRecord?.student?.user?.lastName}`,
        status: attendanceRecord?.status,
        date: attendanceRecord?.date,
        key: key + 1,
        username: attendanceRecord?.student?.user?.username
    }))

    const handleChangeDate = async (date, dateString) => {
        try {
            const response = await fetchStudentAttendanceRecordsByClassroomIdAndDate(classId, dateString);
            setAttendanceRecords(response);
            setIsAttendanceRecordsModalOpen(true);
        } catch (e) {
            setAttendanceRecords([]);
        }
    }

    const attendanceRecordsColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Reg number',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Student',
            dataIndex: 'student',
            key: 'student'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <span>{dayjs(date).format('DD/MM/YYYY')}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                if(status === 'PRESENT') {
                    return <Tag className='border-success bg-success text-white'>PRESENT</Tag>
                } else if(status === 'ABSENT') {
                    return <Tag className='border-danger bg-danger text-white'>ABSENT</Tag>
                }
            }
        }
    ]

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <BackButton/>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined/>}
                        className='border-0 px-3 text-white'
                        type="primary"
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <Divider className='my-3' type={"horizontal"}/>

            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h4>Students in {capitalize(level?.name)} - {className}</h4>

                <Select
                    placeholder="Select Academic Year"
                    size="large"
                    value={currentAcademicYear}
                    onChange={(value) => setCurrentAcademicYear(value)}
                    options={filteredAcademicYears}
                    className="mb-3"
                />
            </div>

            <div className='row mb-3'>
                <div className={"col-md-7"}>
                    <div className="card">
                        <div className="card-body">
                            <div className="me-2 mb-2">
                                <span className="text-muted">Today's students attendance - {new Date().toDateString()}</span>
                            </div>

                            <Tag
                                className='bg-success text-white border-success fw-bolder'
                                icon={<CheckCircleFilled />}
                            >
                                {classDailyAttendance?.presentMales} {pluralize(classDailyAttendance?.presentMales, 'boy')} present
                            </Tag>
                            <Tag
                                className='bg-success text-white border-success fw-bolder'
                                icon={<CheckCircleFilled />}
                            >
                                {classDailyAttendance?.presentFemales} {pluralize(classDailyAttendance?.presentFemales, 'girl')} present
                            </Tag>

                            <Tag
                                className='bg-danger text-white border-danger fw-bolder'
                                icon={<CloseCircleFilled />}
                            >
                                {classDailyAttendance?.absentMales} {pluralize(classDailyAttendance?.absentMales, 'boy')} absent
                            </Tag>
                            <Tag
                                className='bg-danger text-white border-danger fw-bolder'
                                icon={<CloseCircleFilled />}
                            >
                                {classDailyAttendance?.absentFemales} {pluralize(classDailyAttendance?.absentFemales, 'girl')} absent
                            </Tag>
                        </div>
                        <div className='card-footer small'>
                            <DatePicker
                                placeholder='Select date to view past attendances'
                                style={{width: '300px'}}
                                onChange={handleChangeDate}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Spin spinning={loading} size="large" fullscreen>
                <Table
                    className="table-responsive"
                    dataSource={_students}
                    columns={studentsTableColumns}
                />
            </Spin>

            <AddStudentsToClass
                open={addStudentsModalState}
                close={() => setAddStudentsModalState(false)}
                classDetails={{classId, className}}
                academicYears={filteredAcademicYears}
                activeAcademicYear={activeAcademicYear}
                level={level}
            />

            <RemoveStudentsFromClass
                open={removeStudentsModalState}
                close={() => setRemoveStudentsModalState(false)}
                classDetails={{classId, className}}
                selectedAcademicYear={activeAcademicYear}
                students={_students}
                level={level}
            />

            <Modal
                open={studentMoreInfoModal}
                title='More information'
                onCancel={() => {
                    setResults([]);
                    handleClear();
                    setStudentMoreInfoModal(false)
                }}
                width={1000}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                maskClosable
                destroyOnClose
            >
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    onChange={onChange}
                    style={{color: '#39b54a'}}
                />
            </Modal>

            <div className="m-4" ref={componentRef}>
                <Table
                    className="table-responsive only-print"
                    dataSource={_students}
                    columns={studentsTableColumns?.filter(col => col.title !== "Action")}
                    pagination={false}
                />
            </div>

            <Modal
                open={isCreateClassRegisterModalOpen}
                title='Create Class Register'
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                onCancel={() => setIsCreateClassRegisterModalOpen(false)}
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleCreateClassRegister}
                >
                    <Form.Item
                        label='Term' help='Please select the current term for which the register is used.'
                        name='term'
                    >
                        <Select
                            name='term'
                            size={"large"}
                            placeholder={"Select Term"}
                            options={schoolTermsListOptions}
                        />
                    </Form.Item>

                    <Button
                        type={"primary"}
                        htmlType={"submit"}
                        className='mt-3'
                        disabled={isCreateClassRegisterButtonLoading}
                        block
                    >
                        Create
                    </Button>

                </Form>
            </Modal>

            <Modal
                open={isAttendanceRecordsModalOpen}
                onCancel={() => setIsAttendanceRecordsModalOpen(false)}
                title='Attendance Records'
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                width={720}
            >
                <Table
                    columns={attendanceRecordsColumns}
                    dataSource={_attendanceRecords}
                />
            </Modal>
        </div>
    )
}

export default StudentCLassStudentsList;
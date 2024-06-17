import {Button, Divider, Dropdown, Input, message, Modal, Select, Space, Table, Tooltip} from "antd";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {DownloadOutlined, DownOutlined, EyeOutlined, MoreOutlined, PlusOutlined} from "@ant-design/icons";
import StudentService from "../../../services/student.service";
import AuthenticationService from "../../../services/authentication.service";
import {useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import ClassroomService from "../../../services/classroom.service";


export async function studentsLoader() {
    try {
        const tenantId = AuthenticationService.getUserTenantId();
        const response = await StudentService.getAllStudentsByInstitutionId(tenantId);
        if (response?.status === 200) {
            const students = response.data;
            return {students};
        }
    } catch (e) {
        return []
    }
}

const StudentsList = () => {
    const navigate = useNavigate();
    const {students} = useLoaderData();

    const [loading, setLoading] = useState(false);
    const [classrooms, setClassrooms] = useState([]);

    const [confirmAllStudentsPromotionModal, setConfirmAllStudentsPromotionModal] = useState(false);
    const [isPromoteAllStudentsBtnDisabled, setIsPromoteAllStudentsBtnDisabled] = useState(false);

    const _students = students?.map(
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

    const studentsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Reg number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber'
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname'
        },
        {
            title: 'Middle name',
            dataIndex: 'middlename',
            key: 'middlename'
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Grade',
            dataIndex: 'level',
            key: 'level'
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
                            icon={<EyeOutlined/>}
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

    const getClassUrl = (classId, className, levelName) => {
        return `/admin/student-classes/${classId}/students/${className}/${levelName}`
    }

    const fetchClassrooms = async () => {
        try {
            const response = await ClassroomService.getClassroomsWithGenderStatisticsByInstitutionId(
                AuthenticationService.getUserTenantId()
            )
            setClassrooms(response?.data)
        } catch (e) {

        }
    }

    useEffect(
        () => {
            fetchClassrooms();
        }, []
    )

    const items = [
        {
            label: "Enrol New Student",
            key: "1",
            onClick: () => {
                navigate('/admin/new-student');
            },
        },
        {
            label: "View All Students",
            key: "2",
            onClick: () => {
                navigate("/admin/students/all/");
            },
        },
        {
            label: "Promote All Students",
            key: "3",
            onClick: () => setConfirmAllStudentsPromotionModal(true),
            danger: true,
            disabled: true
        }
    ];

    const menuProps = {
        items,
    };

    const handlePromoteAllStudents = async () => {
        setIsPromoteAllStudentsBtnDisabled(true);

        try {
            const response = await StudentService.promoteAllStudentsByInstitutionId(
                AuthenticationService.getUserTenantId()
            )

            if(response.status === 200) {
                message.success("All students promoted successfully.");
                setIsPromoteAllStudentsBtnDisabled(false);
                setConfirmAllStudentsPromotionModal(false);
            }
        } catch (e) {
            message.error('An error occurred while promoting students.');
            setIsPromoteAllStudentsBtnDisabled(false);
            setConfirmAllStudentsPromotionModal(false);
        }
    }

    return (
        <>
            {/* <div className='d-flex justify-content-between align-items-center'>
                <h3>All students</h3>
                <div>
                    <Button
                        icon={<PlusOutlined/>}
                        className='border-0 text-light me-2'
                        style={{background: '#39b54a'}}
                        onClick={() => navigate('/admin/new-student')}
                    >
                        Enrol new student
                    </Button>
                </div>
            </div> */}

            <div className='d-flex justify-content-between align-items-center'>
                <h3>All Student Information</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            More Actions...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider className='my-1' type={"horizontal"}/>

            <div>
                <div className='mb-3'>
                    <p className='m-0'>Search student</p>
                    <Select
                        onChange={handleStudentChange}
                        className='w-50'
                        showSearch
                        placeholder="Search student by registration number"
                        style={{width: 200}}
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

                <div className='d-flex justify-content-start flex-md-grow-1 flex-wrap'>
                    {
                        classrooms && classrooms?.sort((a, b) => {
                            if (a.level?.name < b.level?.name) return -1;
                            if (a.level?.name > b.level?.name) return 1;
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;
                            return 0;
                        })?.map(
                            classroom => (
                                <div className='card border-0 shadow-sm me-3 mb-3' style={{width: 200}}>
                                    <div className='card-header border-0 ps-2 pb-0 pt-0 position-relative'
                                         style={{backgroundColor: '#39b54a'}}
                                    >
                                        <Link
                                            className='text-decoration-none text-white'
                                            to={getClassUrl(classroom?.id, classroom?.name, classroom?.level?.id)}
                                        >
                                            <p className='card-title m-0 small'>{classroom?.level?.name} - {classroom?.name}</p>
                                        </Link>
                                        <div className="position-absolute top-0 end-0">
                                            <div className="dropdown">
                                                <MoreOutlined
                                                    className='text-white pe-2 fw-bolder small'
                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                />
                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <Link
                                                            className="dropdown-item"
                                                            to={getClassUrl(
                                                                classroom?.id,
                                                                classroom?.name,
                                                                classroom?.level?.id
                                                            )}
                                                        >
                                                            Manage
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link className="dropdown-item bg-danger text-white disabled">
                                                            Deactivate class
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='card-body p-2'>
                                        <div className='d-flex justify-content-between'>
                                            <span>
                                                <span className='small text-muted'>Boys &nbsp;</span>
                                                <span className='fw-bolder'>{classroom?.males}</span>
                                            </span>
                                            <span>
                                                <span className='small text-muted'>Girls &nbsp;</span>
                                                <span className='fw-bolder'>{classroom?.females}</span>
                                            </span>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span className='small text-muted'>Subjects &nbsp;</span>
                                                <span className='fw-bolder'>{classroom?.subjects?.length}</span>
                                            </div>
                                            <span>
                                                <span className='small text-muted'>Capacity &nbsp;</span>
                                                <span className='fw-bolder'>
                                                    {classroom?.occupied_sits}/{classroom?.capacity}
                                                </span>
                                            </span>
                                        </div>
                                        <Divider className='my-0' type={"horizontal"}/>
                                        <p className='m-0 text-muted small'>
                                            {classroom?.class_teacher?.user?.firstName} &nbsp;
                                            {classroom?.class_teacher?.user?.lastName}
                                        </p>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>

            </div>
            <Modal
                open={confirmAllStudentsPromotionModal}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
                onCancel={() => setConfirmAllStudentsPromotionModal(false)}
                maskClosable={false}
            >
                <h3 className='fw-bold text-center p-3 text-danger'>
                    Are you sure you want to promote all the students?
                </h3>

                <div className='d-flex justify-content-evenly align-items-center'>
                    <Button
                        className='border-dark text-dark w-100 m-1'
                        size={"large"}
                        onClick={() => setConfirmAllStudentsPromotionModal(false)}
                        disabled={isPromoteAllStudentsBtnDisabled}
                    >
                        Cancel
                    </Button>

                    <Button
                        className='bg-danger border-0 text-light w-100 m-1'
                        size={"large"}
                        disabled={isPromoteAllStudentsBtnDisabled}
                        onClick={handlePromoteAllStudents}
                    >
                        Promote
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default StudentsList;
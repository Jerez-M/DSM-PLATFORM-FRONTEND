import {Avatar, Button, Divider, Dropdown, Space, Tag} from "antd";
import {
    ClockCircleOutlined,
    DownOutlined,
    TeamOutlined,
    ReadOutlined,
    BookOutlined,
    HomeOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    BankOutlined,
    UsergroupAddOutlined, CarOutlined, LaptopOutlined
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import SchoolStatistics from "./SchoolStatistics";
import BoyGirlsRatioChart from "./BoysGirlsRatioChart";
import TeacherGenderRatio from "./TeacherGenderRatio";
import AuthenticationService from "../../../services/authentication.service";
import StudentService from "../../../services/student.service";
import TeacherService from "../../../services/teacher.service";
import SubjectService from "../../../services/subject.service";
import {useEffect, useState} from "react";
import StudentClassService from "../../../services/classroom.service";
import StudentAttendanceService from "../../../services/student-attendance.service";
import {pluralize} from "../../../common";
import LibraryService from "../../../services/library.service";
import VehicleService from "../../../services/vehicle.service";
import ElectronicsService from "../../../services/electronics.service";

const Home = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState({});
    const [teachers, setTeachers] = useState({});
    const [subjects, setSubjects] = useState({});
    const [classRooms, setClassRooms] = useState({});
    const [attendance, setAttendance] = useState({});
    const [library, setLibrary] = useState({});
    const [vehicles, setVehicles] = useState({});
    const [electronics, setElectronics] = useState({});

    async function fetchSchoolStats() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const _students = await StudentService.getTotalNumberOfStudentsByInstitutionId(tenantId);
            const _teachers = await TeacherService.getTotalNumberOfTeachersByInstitutionId(tenantId);
            const _subjects = await SubjectService.getTotalNumberOfSubjectsByInstitutionId(tenantId);
            const _classRooms = await StudentClassService.getTotalNumberOfClassroomsByInstitutionId(tenantId);
            const _attendance = await StudentAttendanceService.getDailyAttendanceReportByInstitutionIdAndDate(
                tenantId,
                new Date().toISOString().split("T")[0]
            )
            const _library = await LibraryService.getTotalLibraryStatsByInstitutionId(tenantId);
            const _vehicles = await VehicleService.getVehicleStatsByInstitutionId(tenantId);
            const _electronics = await ElectronicsService.getStatsByInstitutionId(tenantId);

            setStudents(_students.data);
            setTeachers(_teachers.data);
            setSubjects(_subjects.data);
            setClassRooms(_classRooms.data);
            setAttendance(_attendance.data);
            setLibrary(_library.data);
            setVehicles(_vehicles.data);
            setElectronics(_electronics.data);
        } catch (e) {
            setStudents({});
            setTeachers({});
            setSubjects({});
            setClassRooms({});
            setAttendance({});
            setLibrary({});
            setVehicles({});
            setElectronics({});
        }
    }

    const items = [
        {
            label: 'Enrol student',
            key: '1',
            onClick: () => navigate("/admin/new-student")
        },
        {
            label: 'Register staff member',
            key: '2',
            onClick: () => navigate("/admin/new-teacher")
        },
        {
            label: 'View classes',
            key: '3',
            onClick: () => navigate("/admin/student-classes")
        }
    ];

    const menuProps = {
        items,
    };

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    useEffect(
        () => {
            fetchSchoolStats();
        }, []
    )

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h3>Dashboard</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined />}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <div className={"container-fluid p-0"}>
                <div className={"row gy-3 mb-3"}>
                    <div className={"col-md-3"}>
                        <SchoolStatistics
                            name={"Total students"}
                            value={students?.total_students}
                            icon={<ReadOutlined style={{fontSize: 40, color: "#e3ea17"}} />}
                        />
                    </div>
                    <div className={"col-md-3"}>
                        <SchoolStatistics
                            name={"Total teachers"}
                            value={teachers?.total_teachers}
                            icon={<TeamOutlined style={{fontSize: 40, color: "#d76d3f"}}/>}
                        />
                    </div>
                    <div className={"col-md-3"}>
                        <SchoolStatistics
                            name={"Total classes"}
                            value={classRooms?.total_classrooms}
                            icon={<HomeOutlined style={{fontSize: 40, color: "#6a3fd7"}}/>}
                        />
                    </div>
                    <div className={"col-md-3"}>
                        <SchoolStatistics
                            name={"Total subjects"}
                            value={subjects?.total_subjects}
                            icon={<BookOutlined style={{fontSize: 40, color: "#d73f6d"}}/>}
                        />
                    </div>
                </div>
            </div>

            <div className='row mb-3 gy-3'>
                <div className={"col-md-6"}>
                    <div className="card">
                        <div className="card-body py-4">
                            <div className="me-2 mb-2">
                                <span className="text-muted">Today's students attendance</span>
                            </div>

                            <Tag
                                className='bg-success text-white border-success fw-bolder'
                                icon={<CheckCircleFilled />}
                            >
                                {attendance?.presentMales} {pluralize(attendance?.presentMales, 'boy')} present
                            </Tag>
                            <Tag
                                className='bg-success text-white border-success fw-bolder'
                                icon={<CheckCircleFilled />}
                            >
                                {attendance?.presentFemales} {pluralize(attendance?.presentFemales, 'girl')} present
                            </Tag>

                            <Tag
                                className='bg-danger text-white border-danger fw-bolder'
                                icon={<CloseCircleFilled />}
                            >
                                {attendance?.absentMales} {pluralize(attendance?.absentMales, 'boy')} absent
                            </Tag>
                            <Tag
                                className='bg-danger text-white border-danger fw-bolder'
                                icon={<CloseCircleFilled />}
                            >
                                {attendance?.absentFemales} {pluralize(attendance?.absentFemales, 'girl')} absent
                            </Tag>
                        </div>
                        <div className='card-footer small'>
                            {new Date().toDateString()}
                        </div>
                    </div>
                </div>

                <div className={"col-md-6"}>
                    <div className="card">
                        <div className="card-body">
                            <div className="me-2 mb-2 text-center">
                                <h5>Library Statistics</h5>
                            </div>

                            <div className="row gy-2">
                                <div className="col d-flex flex-column align-items-center">
                                    <BankOutlined style={{color: "#30bbbb", fontSize: 42}} />
                                    <p className="mt-2 mb-0">
                                        <span>Total libraries:</span>
                                        <strong className="ms-2">{library?.total_libraries || 0}</strong>
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <UsergroupAddOutlined style={{color: "#d5cc30", fontSize: 42}} />
                                    <p className="mt-2 mb-0">
                                        <span>Total librarians:</span>
                                        <strong className="ms-2">{library?.total_librarians || 0}</strong>
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <BookOutlined style={{color: "#a233e3", fontSize: 42}} />
                                    <p className="mt-2 mb-0">
                                        <span>Total books:</span>
                                        <strong className="ms-2">{library?.total_books || 0}</strong>
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <ReadOutlined style={{color: "#d31f34", fontSize: 42}} />
                                    <p className="mt-2 mb-0">
                                        <span>Borrowed books:</span>
                                        <strong className="ms-2">{library?.total_borrowed_books || 0}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3 gy-3">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>
                                <Avatar size="large" style={{background: "#333a33"}} icon={<CarOutlined />} />
                                Vehicle Statistics
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row gy-2">
                                <div className="col d-flex align-items-center justify-content-center">
                                    <span>Total Vehicle Estimated Valuation: </span>
                                    <span style={{color: "#4b7716", fontWeight: "bold", fontSize: 20}}>
                                        <span className="text-nowrap">USD {vehicles?.total_vehicles_current_valuation || 0}</span>
                                    </span>
                                </div>
                            </div>
                            <Divider className="my-1" />
                            <div className="row gy-2">
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{vehicles?.total_vehicles || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Total vehicles
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{vehicles?.total_available_vehicles || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Available vehicles
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{vehicles?.total_ontrip_vehicles || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Vehicles on trip
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{vehicles?.total_damaged_vehicles || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Damaged vehicles
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>
                                <Avatar size="large" style={{background: "#333a33"}} icon={<LaptopOutlined />} />
                                Electronics Statistics
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row gy-2">
                                <div className="col d-flex align-items-center justify-content-center">
                                    <span>Total Electronics Estimated Valuation: </span>
                                    <span style={{color: "#4b7716", fontWeight: "bold", fontSize: 20}}>
                                        <span className="text-nowrap">USD {electronics?.estimated_total_net_book_value || 0}</span>
                                    </span>
                                </div>
                            </div>
                            <Divider className="my-1" />
                            <div className="row gy-2">
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{electronics?.total || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Total electronics
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{electronics?.total_available || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Available electronics
                                    </p>
                                </div>
                                <div className="col d-flex flex-column align-items-center">
                                    <span style={{color: "#0e0e0e", fontWeight: "bold", fontSize: 28}}>{electronics?.total_damaged || 0}</span>
                                    <p className="my-0" style={{color: "#6a6a6a"}}>
                                        Damaged electronics
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"container-fluid p-0"}>
                <div className={"row gy-3 mb-3"}>
                    <div className={"col-md-6"}>
                        <BoyGirlsRatioChart />
                    </div>
                    <div className={"col-md-6"}>
                        <TeacherGenderRatio />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
import {Button, Calendar, Card, Divider, Dropdown, Form, Input, Space} from "antd";
import {
    ClockCircleOutlined,
    DownOutlined,
    ReadOutlined,
    BookOutlined, HomeOutlined
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import SchoolStatistics from "./SchoolStatistics";
import AuthenticationService from "../../../services/authentication.service";
import TeacherService from "../../../services/teacher.service";
import {useEffect, useState} from "react";
import subjectService from "../../../services/subject.service";
import authenticationService from "../../../services/authentication.service";
import studentClassService from "../../../services/student-class.service";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState({});
    const [subjects, setSubjects] = useState({});
    const [classRooms, setClassRooms] = useState({});
    const [studentClassInfo, setStudentClassInfo] = useState({});
    const student = AuthenticationService.getFullName();

    async function fetchSchoolStats() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const userId = AuthenticationService.getUserId();

            const _students = await TeacherService.getTotalNumberOfStudentsTaughtByTeacher(tenantId);
            const _subjects = await subjectService.getTotalSubjectsByUserId(userId);
            const _classRooms = await TeacherService.getTotalNumberOfClassroomsByTeacher(tenantId);
            setStudents(_students.data);
            setSubjects(_subjects.data);
            setClassRooms(_classRooms.data);
        } catch (e) {
            setStudents({});
            setSubjects({});
            setClassRooms({});
        }
    }

    const items = [
        {
            label: 'View account',
            key: '1',
            onClick: () => navigate("/student/account")
        },
        {
            label: 'View results',
            key: '2',
            onClick: () => navigate("/student/subjects")
        },
        {
            label: 'View my subjects',
            key: '3',
            onClick: () => navigate("/student/end-term-results")
        }
    ];

    const menuProps = {
        items,
    };

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    async function fetchStudentDashboardLoader() {
        try {
            const studentUserId = authenticationService.getUserId()
            const studentClassroomResponse = await studentClassService.getStudentClassByStudentUserId(studentUserId);
            if (studentClassroomResponse?.status === 200) {
                setStudentClassInfo(studentClassroomResponse.data)
            }
        } catch (e) {
            return [];
        }
    }

    useEffect(
        () => {
            fetchSchoolStats();
            fetchStudentDashboardLoader();
        }, []
    )

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>WELCOME {student}</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined />}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Quick Actions:
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider type={"horizontal"}/>

            <div className={"container-fluid p-0"}>
                <div className={"row gy-3 mb-3"}>
                    <div className={"col-md-4"}>
                        <SchoolStatistics
                            name={"My Class"}
                            value={studentClassInfo?.classroom?.name}
                            icon={<ReadOutlined style={{fontSize: 60, color: "#9ad73f"}} />}
                            color={"#9ad73f"}
                        />
                    </div>
                    <div className={"col-md-4"}>
                        <SchoolStatistics
                            name={"Class teacher"}
                            value={studentClassInfo ? `Mr  ${studentClassInfo?.classroom?.class_teacher?.user?.lastName}` : "No Class teacher"}
                            icon={<HomeOutlined style={{fontSize: 60, color: "#6a3fd7"}}/>}
                            color={"#6a3fd7"}
                        />
                    </div>
                    <div className={"col-md-4"}>
                        <SchoolStatistics
                            name={"Subjects enrolled"}
                            value={subjects?.total_subjects ?? 5}
                            icon={<BookOutlined style={{fontSize: 60, color: "#d73f6d"}}/>}
                            color={"#d73f6d"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard;
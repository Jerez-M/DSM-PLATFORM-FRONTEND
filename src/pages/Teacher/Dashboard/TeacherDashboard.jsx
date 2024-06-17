import {Button, Calendar, Divider, Dropdown, Space} from "antd";
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

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState("");
    const [subjects, setSubjects] = useState("");
    const [classRooms, setClassRooms] = useState("");

    async function fetchSchoolStats() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const userId = AuthenticationService.getUserId()
            const stats = await TeacherService.getTeacherStats(tenantId, userId);

            if(stats?.data) {
                const {subjects, students, classes} = stats?.data
                setStudents(students);
                setSubjects(subjects);
                setClassRooms(classes);

            }
        } catch (e) {
            setStudents("");
            setSubjects("");
            setClassRooms("");
        }
    }

    const items = [
        {
            label: 'View classes',
            key: '1',
            onClick: () => navigate("/teacher/classes")
        },
        {
            label: 'View Subjects',
            key: '2',
            onClick: () => navigate("/teacher/subjects")
        },
        {
            label: 'Mark exam',
            key: '3',
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
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Dashboard</h3>
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
                            name={"Students taught"}
                            value={students ?? 0}
                            icon={<ReadOutlined style={{fontSize: 60, color: "#9ad73f"}} />}
                            color={"#9ad73f"}
                        />
                    </div>
                    <div className={"col-md-4"}>
                        <SchoolStatistics
                            name={"Classes taught"}
                            value={classRooms ?? 0}
                            icon={<HomeOutlined style={{fontSize: 60, color: "#6a3fd7"}}/>}
                            color={"#6a3fd7"}
                        />
                    </div>
                    <div className={"col-md-4"}>
                        <SchoolStatistics
                            name={"Subjects taught"}
                            value={subjects ?? 0}
                            icon={<BookOutlined style={{fontSize: 60, color: "#d73f6d"}}/>}
                            color={"#d73f6d"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard;
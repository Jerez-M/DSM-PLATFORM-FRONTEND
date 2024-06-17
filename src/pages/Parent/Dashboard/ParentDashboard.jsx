import {Button, Card, Divider, Dropdown, Space} from "antd";
import {
    ClockCircleOutlined,
    DownOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import AuthenticationService from "../../../services/authentication.service";
import StudentService from "../../../services/student.service";
import {useEffect, useState} from "react";
import ChildCard from "./ChildCard"

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const student = AuthenticationService.getFullName();

    const items = [
        {
            label: 'View profile',
            key: '1',
            onClick: () => navigate("/parent/profile")
        },
        {
            label: "View children's results",
            key: '2',
            onClick: () => navigate("/parent/children-reports")
        },
        {
            label: "View children's school fees",
            key: '3',
            onClick: () => navigate("/parent/fees"),
            disabled: true
        }
    ];

    const menuProps = {
        items,
    };

    async function fetchParentDashboardLoader() {
        try {
            const childrenResponse = await StudentService.getChildrenOfParent(AuthenticationService.getUserId());
            setStudents(childrenResponse.data);
        } catch (e) {
            return [];
        }
    }

    useEffect(
        () => {
            fetchParentDashboardLoader();
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
                {(students?.length > 0) && (<>
                    <h5>{(students?.length === 1) ? "Your Child:" : "Your Children:"}</h5>
                    <div className='d-flex flex-wrap justify-content-evenly justify-content-xxl-between'>
                        {students.map((student, index) => (
                            <ChildCard
                                key={index}
                                student={student}
                                onClick={() => navigate(`/parent/children-reports/${student?.user?.id}`)}
                            />
                        ))}
                    </div>
                </>)}
            </div>

            <div className="container-fluid mt-4 d-none">
                <h5 className="mb-2">School Fees Payments:</h5>
                <div className='row g-4 justify-content-between'>
                    <div className="col-md-6">
                        <Card
                            className="w-100 shadow-sm h-100"
                            style={{background: "#e7d54b", borderRadius: 14}}
                        >
                            <strong>Total Fees Balance</strong>
                            <div style={{fontSize: "3rem", fontWeight: "800"}}>12,000<span style={{fontSize: "1.5rem"}}>RTGS</span></div>
                            <p className="mt-3">
                                Taina: 4000, Anabelle: 4000, Anabella: 4000
                            </p>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card
                            className="w-100 shadow-sm h-100"
                            style={{background: "#3a72c3", borderRadius: 14}}
                        >
                            <strong>Paid Fees</strong>
                            <div
                                className='d-flex justify-content-between align-items-baseline'
                            >
                                <div style={{fontSize: "3rem", fontWeight: "800"}}>
                                    10,902<span style={{fontSize: "1.5rem"}}>RTGS</span>
                                </div>
                                <div
                                    className="rounded-pill px-3 py-1 text-dark"
                                    style={{background: "#ffffff", fontSize: "1.2rem", fontWeight: "500"}}
                                >
                                    Remaining: 1,098
                                </div>
                            </div>
                            <p className="mt-3">
                                Taina: 3402, Anabelle: 4089, Anabella: 3389
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParentDashboard;
import React from "react";
import { Button, Divider, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import AllCourseworkPage from "./Coursework/AllTeacherCourseworkPage";
import CourseworkTypeList from "./CourseworkTypes/CourseworkTypeList";
import { PlusOutlined } from "@ant-design/icons";


const TeacherCourseworkTabs = () => {
    const navigate = useNavigate();

    const tabItems = [
        {
            key: "1",
            label: "Coursework",
            children: <AllCourseworkPage />
        },
        {
            key: "2",
            label: "Coursework Type",
            children: <CourseworkTypeList />,
        },
    ];

    const items = [
        {
            label: 'New Coursework',
            key: '1',
            onClick: () => navigate(`/teacher/coursework/add`)
        },
    ]

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Coursework Management</h3>

                <div className="align-items-center">
                    <Button
                        icon={<PlusOutlined />}
                        className='border-0 px-3 text-white'
                        style={{ background: '#39b54a' }}
                        onClick={() => navigate(`/teacher/coursework/add`)}
                    >
                        Create Coursework
                    </Button>
                </div>

            </div>

            <Divider type={"horizontal"} />
            <Tabs defaultActiveKey="1" items={tabItems} style={{ color: '#39b54a' }} />
        </>
    );
}
export default TeacherCourseworkTabs;

import React, { useState } from "react";
import { Button, Divider, Dropdown, Tabs } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AllParentCourseworkPage from "./Coursework/AllParentCourseworkPage";
import CourseworkMarkList from "./CourseworkMarks/CourseworkMarkList";
import BackButton from "../../../common/BackButton";


const ParentCourseworkTabs = () => {
    const navigate = useNavigate();
    const [NewCourseworkTypeModal, setNewCourseworkTypeModal] = useState(false);


    const tabItems = [
        {
            key: "1",
            label: "Coursework",
            children: <AllParentCourseworkPage />
        },
        {
            key: "2",
            label: "Coursework Marks",
            children: <CourseworkMarkList />,
        },
    ];

    return (
        <>
            <BackButton/>
            
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Coursework Management</h3>
            </div>

            <Divider type={"horizontal"} />

            <Tabs defaultActiveKey="1" items={tabItems} style={{ color: '#39b54a' }} />
        </>
    );
}
export default ParentCourseworkTabs;
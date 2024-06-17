import React, { useState } from "react";
import { Button, Divider, Dropdown, Tabs } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AllStudentCourseworkPage from "./Coursework/AllStudentCourseworkPage";
import CourseworkMarkList from "./CourseworkMarks/CourseworkMarkList";


const StudentCourseworkTabs = () => {
    const navigate = useNavigate();
    const [NewCourseworkTypeModal, setNewCourseworkTypeModal] = useState(false);


    const tabItems = [
        {
            key: "1",
            label: "Coursework",
            children: <AllStudentCourseworkPage />
        },
        {
            key: "2",
            label: "Coursework Marks",
            children: <CourseworkMarkList />,
        },
    ];

    const items = [
        {
            label: 'New Coursework',
            key: '1',
            // onClick: () => navigate(`/teacher/coursework/add`)
        },
        {
            label: 'New Coursework Type',
            key: '2',
            // onClick: () => setNewCourseworkTypeModal(true)
        },
    ]

    const menuProps = {
        items,
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Coursework Management</h3>

                {/* <div className="align-items-center">
                    <Dropdown menu={menuProps}>
                        <Button
                            type="primary"
                            icon={<DownOutlined />}
                        >
                            Select Year
                        </Button>
                    </Dropdown>
                </div> */}

            </div>

            <Divider type={"horizontal"} />
            <Tabs defaultActiveKey="1" items={tabItems} style={{ color: '#39b54a' }} />

            {/* <NewCourseworkType
                open={NewCourseworkTypeModal}
                close={() => setNewCourseworkTypeModal(false)}
            /> */}
        </>
    );
}
export default StudentCourseworkTabs;
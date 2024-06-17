import {Button, Divider, Dropdown, Space, Tabs} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {useState} from "react";
import ListTeachersSms from "./TeachersSms/ListTeachersSms";
import ListStudentsSms from "./StudentsSms/ListStudentsSms";
import ListParentsSms from "./ParentsSms/ListParentsSms";
import NewStudentsSms from "./StudentsSms/NewStudentsSms";
import NewTeachersSms from "./TeachersSms/NewTeachersSms";
import NewParentsSms from "./ParentsSms/NewParentsSms";
import NewBulkySms from "./BulkySms/NewBulkySms";
import ListBulkySms from "./BulkySms/ListBulkySms";

const SmsManagementIndex = () => {
    const [bulkySmsModalState, setBulkySmsModalState] = useState(false);
    const [allParentsSmsModalState, setAllParentsSmsModalState] = useState(false);
    const [allStudentsSmsModalState, setAllStudentsSmsModalState] = useState(false);
    const [allTeachersModalState, setAllTeachersModalState] = useState(false);

    const items = [
        {
            label: 'Teachers',
            key: '1',
            onClick: () => setAllTeachersModalState(true)
        },
        {
            label: 'Students',
            key: '2',
            onClick: () => setAllStudentsSmsModalState(true)
        },
        {
            label: 'Parents',
            key: '3',
            onClick: () => setAllParentsSmsModalState(true)
        },
        {
            label: 'Bulky Audience',
            key: '4',
            onClick: () => setBulkySmsModalState(true)
        },
    ];

    const menuProps = {
        items,
    };

    const tabItems = [
        {
            key: '1',
            label: <Button type={"default"} className='border-0'>Teachers SMSs</Button>,
            children: <ListTeachersSms />
        },
        {
            key: '2',
            label: <Button type={"default"} className='border-0'>Students SMSs</Button>,
            children: <ListStudentsSms />
        },
        {
            key: '3',
            label: <Button type={"default"} className='border-0'>Parents SMSs</Button>,
            children: <ListParentsSms />
        },
        {
            key: '4',
            label: <Button type={"default"} className='border-0'>All SMSs</Button>,
            children: <ListBulkySms />
        },
        
    ];

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>SMS MANAGEMENT</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Send sms to...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider type={"horizontal"}/>

            <div className='container-fluid p-0'>
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    onChange={onChange}
                    style={{color: '#39b54a'}}
                />
            </div>

            <NewParentsSms open={allParentsSmsModalState} close={() => setAllParentsSmsModalState(false)} />
            <NewStudentsSms open={allStudentsSmsModalState} close={() => setAllStudentsSmsModalState(false)}/>
            <NewTeachersSms open={allTeachersModalState} close={() => setAllTeachersModalState(false)} />
            <NewBulkySms open={bulkySmsModalState} close={() => setBulkySmsModalState(false)}/>
        </>
    )
}

export default SmsManagementIndex;
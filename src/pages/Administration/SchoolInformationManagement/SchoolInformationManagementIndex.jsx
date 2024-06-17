import {Button, Divider, Dropdown, message, Space, Tabs} from "antd";
import {DownOutlined} from "@ant-design/icons";
import SubjectsList from "./Subjects/SubjectsList";
import {useState} from "react";
import NewSubject from "./Subjects/NewSubject";
import LevelsList from "./Levels/LevelsList";
import NewLevel from "./Levels/NewLevel";
import AcademicYearsList from "./AcademicYears/AcademicYearsList";
import NewAcademicYear from "./AcademicYears/NewAcademicYear";
import NewTerm from "./Terms/NewTerm";
import TermsList from "./Terms/TermsList";
import DepartmentsList from "./Departments/DepartmentsList";
import NewDepartment from "./Departments/NewDepartment";
import AcademicYearService from "../../../services/academic-year.service";
import GradingScaleList from "./GradingScale/GradingScaleList";
import NewGradingScale from "./GradingScale/NewGradingScale";
import CourseworkTypeList from "./Coursework/CourseworkTypeList";
import NewCourseworkType from "./Coursework/NewCoursework";

const SchoolInformationManagementIndex = () => {
    const [newSubjectModalState, setNewSubjectModalState] = useState(false);
    const [newLevelModalState, setNewLevelModalState] = useState(false);
    const [newAcademicYearModalState, setNewAcademicYearModalState] = useState(false);
    const [newTermModalState, setNewTermModalState] = useState(false);
    const [newDepartmentModalState, setNewDepartmentModalState] = useState(false);
    const [newGradingScaleState, setNewGradingScaleState] = useState(false)
    const [newCourseworkTypeModalState, setNewCourseworkTypeModalState] = useState(false)

    const createNewAcademicYear = async () => {
        message.info('Creating academic year. Loading...')
        try {
            const response = await AcademicYearService.create();
            if(response.status === 201) {
                message.success('Academic year created successfully.');
                window.location.reload();
            }
        } catch (e) {
            if(e.response.status === 403) {
                message.error(e.response.data.error)
            }
        }
    }

    const items = [
        {
            label: 'Academic year',
            key: '1',
            onClick: () => createNewAcademicYear()
        },
        {
            label: 'Term',
            key: '3',
            onClick: () => setNewTermModalState(true)
        },
        {
            label: 'Level/grade',
            key: '2',
            onClick: () => setNewLevelModalState(true)
        },
        {
            label: 'Department',
            key: '5',
            onClick: () => setNewDepartmentModalState(true)
        },
        {
            label: 'Subject',
            key: '4',
            onClick: () => setNewSubjectModalState(true)
        },
        {
            label: 'Grade Scales',
            key: '6',
            onClick: () => setNewGradingScaleState(true)
        },
        {
            label: 'Coursework Type',
            key: '7',
            onClick: () => setNewCourseworkTypeModalState(true)
        },
    ];

    const menuProps = {
        items,
    };

    const tabItems = [
        {
            key: '1',
            label: <Button type={"default"} className='border-0'>Academic years</Button>,
            children: <AcademicYearsList />
        },
        {
            key: '2',
            label: <Button type={"default"} className='border-0'>Terms</Button>,
            children: <TermsList />
        },
        {
            key: '3',
            label: <Button type={"default"} className='border-0'>Levels/grades</Button>,
            children: <LevelsList />
        },
        {
            key: '4',
            label: <Button type={"default"} className='border-0'>Departments</Button>,
            children: <DepartmentsList />
        },
        {
            key: '5',
            label: <Button type={"default"} className='border-0 mx-1'>Subjects</Button>,
            children: <SubjectsList />
        },
        {
            key: '6',
            label: <Button type={"default"} className='border-0 mx-1'>Grade Scales</Button>,
            children: <GradingScaleList />
        },
        {
            key: '7',
            label: <Button type={"default"} className='border-0 mx-1'>Coursework Types</Button>,
            children: <CourseworkTypeList />
        },
    ];

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>General school information</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Add new...
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

            <NewSubject open={newSubjectModalState} close={() => setNewSubjectModalState(false)} />
            <NewLevel open={newLevelModalState} close={() => setNewLevelModalState(false)}/>
            <NewAcademicYear open={newAcademicYearModalState} close={() => setNewAcademicYearModalState(false)}/>
            <NewTerm open={newTermModalState} close={() => setNewTermModalState(false)} />
            <NewDepartment open={newDepartmentModalState} close={() => setNewDepartmentModalState(false)} />
            <NewGradingScale open={newGradingScaleState} close={() => setNewGradingScaleState(false)} />
            <NewCourseworkType
                open={newCourseworkTypeModalState}
                close={() => setNewCourseworkTypeModalState(false)}
            />
        </>
    )
}

export default SchoolInformationManagementIndex;
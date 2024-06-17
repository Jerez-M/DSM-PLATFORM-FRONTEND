import {Button, Card, Divider, Dropdown, Space, Tag, Tooltip, Typography} from "antd";
import {
    ClockCircleOutlined,
    DownOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
} from "@ant-design/icons";
import React, {useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import courseworkService from "../../../../services/coursework.service";
import BackButton from "../../../../common/BackButton";
import { toHumanDate } from "../../../../common";
import PDFViewer from "../../../../common/PdfViewer";
import Link from "antd/es/typography/Link";


export async function teacherCourseworkPageLoader({params}) {
    try {
        const courseworkResponse = await courseworkService.getById(params.id);
        return {coursework: courseworkResponse.data};
    } catch (e) {
        console.log(e);
        return {coursework: null};
    }
}
const TeacherCourseworkPage = () => {
    const {coursework} = useLoaderData();
    const navigate = useNavigate();
    const [fullscreen, setFullscreen] = useState(false)

    const items = [
        {
            label: 'Edit Coursework',
            key: '1',
            onClick: () => navigate(`/teacher/coursework/edit/${coursework.id}`)
        },
        {
            label: 'Mark Coursework',
            key: '2',
            onClick: () => navigate(`/teacher/coursework/mark/${coursework.id}`)
        },
    ];

    const getDueDateColor = () => {
        if (new Date(coursework?.due_date)?.toDateString() === new Date().toDateString()) return "warning";
        if (new Date(coursework?.due_date) < new Date()) return "gold";
        return "success"
    }

    const getDueDateTag = () => {
        if (new Date(coursework?.due_date)?.toDateString() === new Date().toDateString()) return <h5 className="text-strong">Due today</h5>;
        if (new Date(coursework?.due_date) < new Date()) return <h5 className="text-strong">Due date past</h5>;
        return <h5 className="text-strong">Not due yet</h5>;
    }

    // const courseworkName = coursework.file.split('/').pop(); 
    const courseworkName = coursework?.file ? coursework.file.split('/').pop() : null;

    return (
        <>
            <BackButton />
            <div className="d-flex justify-content-between align-items-center">
                <h3>View Coursework</h3>
                <Dropdown menu={{items}}>
                    <Button type="primary" icon={<ClockCircleOutlined />}>
                        <Space>
                            Quick actions...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <Divider />

            <Card>
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-2">{coursework?.title}</h3>
                    <Tag bordered={true} color={getDueDateColor()}>
                        {getDueDateTag()}
                    </Tag>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <p className="table-row">
                            <span>Created By:</span>
                            <strong>
                                {coursework?.teacher?.title} {coursework?.teacher?.user?.lastName} {coursework?.teacher?.user?.firstName?.at(0)}.
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Due date:</span>
                            <strong className={
                                (new Date(coursework?.due_date)?.toDateString() === new Date().toDateString()) ? "text-warn" :
                                    (new Date(coursework?.due_date) < new Date()) ? "text-danger" : ""}
                            >
                                {toHumanDate(coursework?.due_date)}
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Total Mark:</span>
                            <strong>{coursework?.total_mark}</strong>
                        </p>
                        <p className="table-row">
                            <span>Subject:</span>
                            <strong>{coursework?.subject?.name}</strong>
                        </p>
                    </div>
                    <div className="col-md-6">
                        <p className="table-row">
                            <span>Created date:</span>
                            <strong>
                                {toHumanDate(coursework?.date_created)}
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Term:</span>
                            <span>{coursework?.term?.name}</span>
                        </p>
                        <p className="table-row">
                            <span>Type:</span>
                            <strong>{coursework?.coursework_type?.name}</strong>
                        </p>
                        <p className="table-row">
                            <span>Classrooms:</span>
                            {coursework?.classrooms?.map((classroom, index) => (
                                <strong key={index}>{`[${classroom?.level?.name}-${classroom?.name}]`}</strong>
                            ))}
                        </p>
                    </div>
                </div>

                <Divider />
        
                {coursework?.content && (
                    <>
                    <h3 className="text-strong">{coursework?.coursework_type?.name} CONTENT</h3>

                    <div
                        className="border border-2 border-black px-2 py-2"
                        style={{
                        overflow: 'auto',
                        maxHeight: '600px',
                        fontFamily: 'Georgia, serif',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        textAlign: 'justify',
                        hyphens: 'auto',
                        background: 'rgba(240, 240, 240, 0.9)',
                        }}
                    >
                        <Typography.Paragraph className="mt-2">
                        <div dangerouslySetInnerHTML={{ __html: coursework?.content }} />
                        </Typography.Paragraph>
                    </div>
                    </>
                )}
            </Card>

            {coursework?.file && (
                <Card className="mt-3">
                    <h3 className="text-strong">{coursework?.coursework_type?.name} FILE</h3>
                    <div className="d-flex justify-content-between align-items-center">
                        
                        {/* <PDFViewer file={coursework?.file}/> */}
                        
                        <h6>
                            <strong>{courseworkName}</strong>
                        </h6>
                        <Link href={`${coursework?.file}`} target="_blank">
                            <Button type="primary">Open file</Button>
                        </Link> 
                    </div>  
                </Card>
            )}
        </>
    )
}

export default TeacherCourseworkPage
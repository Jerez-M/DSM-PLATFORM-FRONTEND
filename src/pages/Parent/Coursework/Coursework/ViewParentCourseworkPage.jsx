import { Alert, Button, Card, Divider, Dropdown, Form, Input, Modal, Space, Tag, Tooltip, Typography } from "antd";
import {
    ClockCircleOutlined,
    DownOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import courseworkService from "../../../../services/coursework.service";
import BackButton from "../../../../common/BackButton";
import { toHumanDate } from "../../../../common";
import Link from "antd/es/typography/Link";
import authenticationService from "../../../../services/authentication.service";
import studentService from "../../../../services/student.service";
import courseworkMarksService from "../../../../services/coursework-marks.service";


export async function ParentCourseworkPageLoader({ params }) {
    try {
        const courseworkResponse = await courseworkService.getById(params.id);
        return { coursework: courseworkResponse.data };
    } catch (e) {
        console.log(e);
        return { coursework: null };
    }
}
const ViewParentCourseworkPage = () => {
    const { coursework } = useLoaderData();
    const {childId} = useParams()
    const navigate = useNavigate();
    const [fullscreen, setFullscreen] = useState(false)

    const [studentMarkModalState, setStudentMarkModalState] = useState(false);
    const [studentCourseworkMark, setStudentCourseworkMark] = useState([]);
    const [solutionModalState, setSolutionModalState] = useState(false);
    const [submitModalState, setSubmitModalState] = useState(false);


    const items = [
        {
            label: 'Check Solution',
            key: '2',
            onClick: async () => {
                // fetchCourseworkSolution();
                setSolutionModalState(true);
            }
        },
        {
            label: 'View Mark',
            key: '3',
            onClick: async () => {
                fetchStudentCourseworkMark();
                setStudentMarkModalState(true);
            }
        },
    ];

    const fetchStudentCourseworkMark = async () => {
        const response = await studentService.getChildrenOfParent(authenticationService.getUserId());
        const targetStudent = response?.data.find(student => student.user.id === parseInt(childId));

        const student_id = targetStudent?.id
        const coursework_id = coursework?.id

        try {
            const studentCourseworkMarkResponse = await courseworkMarksService.getByStudentIdAndCourseworkId(student_id, coursework_id)
            setStudentCourseworkMark(studentCourseworkMarkResponse?.data)
        } catch (error) {
            console.log("error occured: ", error)
        }
    }

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

    const courseworkName = coursework?.file ? coursework.file.split('/').pop() : null;

    return (
        <>
            <BackButton />
            <div className="d-flex justify-content-between align-items-center">
                <h3>View Coursework</h3>
                <Dropdown menu={{ items }}>
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

            <Modal
                open={studentMarkModalState}
                onCancel={() => {
                    setStudentMarkModalState(false);
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
            >
                {studentCourseworkMark.length === 0 ? (
                    <Alert
                        message="Mark not yet available, please consult your subject teacher."
                        type="info"
                        showIcon
                    />
                ) : (
                    <Form layout="vertical">
                        <Form.Item label="Coursework">
                            <Input value={studentCourseworkMark[0]?.coursework?.title} />
                        </Form.Item>
                        <Form.Item label="Student Name">
                            <Input
                                value={`${studentCourseworkMark[0]?.student?.user?.firstName} ${studentCourseworkMark[0]?.student?.user?.lastName}`}
                            />
                        </Form.Item>
                        <Form.Item label="Scored mark">
                            <Input value={studentCourseworkMark[0]?.mark} />
                        </Form.Item>
                        <Form.Item label="Comment">
                            <Input.TextArea
                                size="large"
                                value={studentCourseworkMark[0]?.comment}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Modal
                open={solutionModalState}
                onCancel={() => {
                    setSolutionModalState(false);
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
            >
                {studentCourseworkMark.length === 0 ? (
                    <Alert
                        message="Solution not yet available, please consult your subject teacher."
                        type="info"
                        showIcon
                    />
                ) : (
                    <Alert
                        message="Solution not yet available, please consult your subject teacher."
                        type="info"
                        showIcon
                    />
                    // <Form layout="vertical">
                    //     <Form.Item label="Comment">
                    //         <Input.TextArea
                    //             size="large"
                    //             value={studentCourseworkMark[0]?.comment}
                    //         />
                    //     </Form.Item>
                    // </Form>
                )}
            </Modal>

            <Modal
                open={submitModalState}
                onCancel={() => {
                    setSubmitModalState(false);
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
            >
                {studentCourseworkMark.length === 0 ? (
                    <Alert
                        message="Submit link not yet available, please consult your subject teacher."
                        type="info"
                        showIcon
                    />
                ) : (
                    <Alert
                        message="Submit Link not yet available, please consult your subject teacher."
                        type="info"
                        showIcon
                    />
                    // <Form layout="vertical">
                    //     <Form.Item label="Comment">
                    //         <Input.TextArea
                    //             size="large"
                    //             value={studentCourseworkMark[0]?.comment}
                    //         />
                    //     </Form.Item>
                    // </Form>
                )}
            </Modal>
        </>
    )
}

export default ViewParentCourseworkPage
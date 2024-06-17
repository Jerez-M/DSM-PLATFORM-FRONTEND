import {Button, Divider, Form, Input, Modal, Table, Tag, Tooltip, DatePicker, Select, message} from "antd";
import {PlayCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import LiveClassesService from "../../../services/live-classes.service";
import authenticationService from "../../../services/authentication.service";
import classroomService from "../../../services/classroom.service";
import teacherService from "../../../services/teacher.service";
import liveClassesService from "../../../services/live-classes.service";
import {useNavigate} from "react-router-dom";


const LiveClasses = () => {
    const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
    const [liveClasses, setLiveClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
    const [form] = Form.useForm();
    const [meetingName, setMeetingName] = useState('');
    const [meetingStartTime, setMeetingStartTime] = useState('');
    const [meetingEndTime, setMeetingEndTime] = useState('');
    const [meetingClasses, setMeetingClasses] = useState([]);
    const [meetingModerator, setMeetingModerator] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const institutionId = authenticationService.getUserTenantId();
    const [reload, setReload] = useState(false);

    const teachersSelectData = teachers?.map(
        teacher => ({
            label: `${teacher?.title} ${teacher?.user?.lastName} ${teacher?.user?.firstName[0]}`,
            value: teacher?.id
        })
    )

    const classesSelectData = classrooms?.map(
        classroom => ({
            label: `${classroom?.level?.name} ${classroom?.name}`,
            value: classroom?.id
        })
    )

    const liveClassesTableData = liveClasses?.map(
        meeting => ({
            key: meeting?.id,
            id: meeting?.meeting_id,
            name: meeting?.name,
            teacher: `${meeting?.moderator?.title}
             ${meeting?.moderator?.user?.lastName} ${meeting?.moderator?.user?.firstName[0]}`,
            startTime:
                `${new Date(meeting?.start_time).toDateString()} 
            ${new Date(meeting?.start_time).toLocaleTimeString()}`
            ,
            endTime: meeting?.end_time &&
                `${new Date(meeting?.end_time).toDateString()} 
            ${new Date(meeting?.end_time).toLocaleTimeString()}`
            ,
            classrooms: meeting?.classrooms.map(
                classroom => (
                    <Tag>{classroom?.level?.name} {classroom?.name}</Tag>
                )
            ),
            status: {status: meeting?.status, id: meeting?.meeting_id}
        })
    )

    const fetchLiveClasses = async () => {
        try {
            const response = await LiveClassesService.getByInstitution(authenticationService.getUserTenantId());
            setLiveClasses(response?.data);
            setIsLoading(false);
        } catch (e) {
            setLiveClasses([]);
            setIsLoading(false);
        }
    }

    const fetchClasses = async () => {
        try {
            const response = await classroomService.getAll(authenticationService.getUserTenantId());
            setClassrooms(response?.data);
        } catch (e) {
            setClassrooms([]);
        }
    }

    const fetchTeachers = async () => {
        try {
            const response = await teacherService.getAllTeachersByInstitutionId(authenticationService.getUserTenantId())
            setTeachers(response?.data);
        } catch (e) {
            setTeachers([]);
        }
    }

    const handleCreateMeeting = async () => {
        const today = new Date().toISOString();
        const startDate = new Date(meetingStartTime).toISOString();
        const endDate = new Date(meetingEndTime).toISOString();

        if (startDate < today) {
            message.error('You cannot enter past dates as start time');
            return;
        } else if (endDate < startDate) {
            message.error('You cannot enter past dates as end time');
            return
        }

        setSubmitBtnLoading(true);
        try {
            const response = await liveClassesService.create({
                name: meetingName,
                institution: institutionId,
                start_time: meetingStartTime,
                end_time: meetingEndTime,
                classrooms: meetingClasses,
                moderator: meetingModerator
            })
            if(response?.status === 201) {
                message.success('Meeting created successfully');
                setSubmitBtnLoading(false);
                setIsCreateMeetingModalOpen(false);
                setReload(true);
                setIsLoading(true);
                form.resetFields();
                setMeetingName('');
                setMeetingClasses([]);
                setMeetingStartTime('');
                setMeetingModerator(null);
            }
        } catch (e) {
            setSubmitBtnLoading(false);
            if (e.response.status === 400) {
                message.error(`Please choose another name because ${e.response.data['name']}`);
                return;
            }
            message.error('Meeting not created. An error occurred');
        }
    }

    const handleChangeClasses = (value) => {
        setMeetingClasses(value);
    }

    const handleChangeTeacher = (value) => {
        setMeetingModerator(value);
    }

    const liveClassesTableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Teacher',
            dataIndex: 'teacher',
            key: 'teacher'
        },
        {
            title: 'Start time',
            dataIndex: 'startTime',
            key: 'startTime'
        },
        {
            title: 'End time',
            dataIndex: 'endTime',
            key: 'endTime'
        },
        {
            title: 'Classrooms',
            dataIndex: 'classrooms',
            key: 'classrooms'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: value => value.status
        },
        {
            title: 'Action',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value.status === 'IN PROGRESS') {
                    return (
                        <Tooltip title='Join meeting'>
                            <PlayCircleOutlined
                                className='text-success fs-4'
                                onClick={() => {
                                    window.open(
                                        `${window.location.origin}/meeting/?meetingId=${value?.id}`,
                                        '_blank',
                                    )
                                }}
                            />
                        </Tooltip>
                    )
                } else {
                    return (
                        <Tooltip
                            title={
                                value.status === 'SCHEDULED' ?
                                    'The meeting has not yet started' : value.status === 'ENDED' ? 'The meeting ended' : value.status
                            }
                        >
                            <PlayCircleOutlined className={`${ value.status === 'SCHEDULED' ? 'opacity-50' : ''}  text-danger fs-4`}/>
                        </Tooltip>
                    )
                }
            }
        },
    ]

    useEffect(() => {
        fetchLiveClasses();
        fetchClasses();
        fetchTeachers();
    }, [reload])

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h4>Live classes</h4>
                <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    onClick={() => setIsCreateMeetingModalOpen(true)}
                >
                    Create meeting
                </Button>
            </div>
            <Divider className='my-2'/>

            <Table
                dataSource={liveClassesTableData}
                columns={liveClassesTableColumns}
                size={"small"}
                className='table-responsive'
                loading={isLoading}
            />

            <Modal
                title='Create meeting'
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                open={isCreateMeetingModalOpen}
                onCancel={() => setIsCreateMeetingModalOpen(false)}
                destroyOnClose
                maskClosable
            >
                <Form
                    layout="vertical"
                    onFinish={handleCreateMeeting}
                    form={form}
                >
                    <Form.Item
                        label="Meeting name"
                        name="name"
                        rules={[{ required: true, message: 'Meeting name is required' }]}
                    >
                        <Input
                            placeholder="e.g. group presentations"
                            onChange={e => setMeetingName(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Meeting start time"
                        name="startTime"
                        rules={[{ required: true, message: 'Starting time is required' }]}
                    >
                        <DatePicker
                            showTime
                            onChange={(value, dateString) => {
                                setMeetingStartTime(dateString);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Meeting end time"
                        name="endTime"
                        rules={[{ required: true, message: 'Ending time is required' }]}
                    >
                        <DatePicker
                            showTime
                            onChange={(value, dateString) => {
                                setMeetingEndTime(dateString);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Classes"
                        name="classes"
                        rules={[{ required: true, message: 'Please provide the classes' }]}
                    >
                        <Select
                            placeholder='Select the classes'
                            mode={"multiple"}
                            onChange={handleChangeClasses}
                            options={classesSelectData}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Teacher"
                        name="teacher"
                        rules={[{ required: true, message: 'Please select the teacher' }]}
                    >
                        <Select
                            placeholder='Select the teacher'
                            onChange={handleChangeTeacher}
                            options={teachersSelectData}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        className="mt-4"
                        loading={submitBtnLoading}
                        disabled={submitBtnLoading}
                        block
                        htmlType="submit"
                    >
                        Create meeting
                    </Button>
                </Form>
            </Modal>
        </>
    )
}

export default LiveClasses;
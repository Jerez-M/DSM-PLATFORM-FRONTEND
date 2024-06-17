import { Divider, Table, Tooltip } from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import LiveClassesService from "../../../services/live-classes.service";
import authenticationService from "../../../services/authentication.service";


const StudentLiveClasses = () => {
    const [liveClasses, setLiveClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            status: {status: meeting?.status, id: meeting?.meeting_id}
        })
    )

    const fetchLiveClasses = async () => {
        try {
            const response = await LiveClassesService.getByStudent(authenticationService.getUserId());
            setLiveClasses(response?.data);
            setIsLoading(false);
        } catch (e) {
            setLiveClasses([]);
            setIsLoading(false);
        }
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
    }, [])

    return (
        <>
            <div>
                <h4>Live classes</h4>
            </div>
            <Divider className='my-2'/>

            <Table
                dataSource={liveClassesTableData}
                columns={liveClassesTableColumns}
                size={"small"}
                className='table-responsive'
                loading={isLoading}
            />
        </>
    )
}

export default StudentLiveClasses;
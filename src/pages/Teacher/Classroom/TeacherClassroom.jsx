import {Button, Space, Table, Tabs, Tooltip} from "antd";
import {useLoaderData, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, EyeOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../services/authentication.service";
import classroomService from "../../../services/classroom.service";
import AttendanceMarking from "./AttendanceMarking";
import BackButton from "../../../common/BackButton";

export async function teacherClassStudentsLoader({params}) {
    try {
        const classroomId = await params?.classroomId
        const response = await classroomService.getStudentsByTeacherUserIdAndClassroomId(AuthenticationService.getUserId(), classroomId)
        const students = response?.data
        return {students}
    } catch (e) {
        return []
    }
}

const TeacherClassroom = () => {
    const navigate = useNavigate()
    const { students } = useLoaderData();

    const _students = students?.map(
        (student, key) => ({
            registrationNumber: student?.student?.user?.username,
            firstname: student?.student?.user?.firstName,
            middlename: student?.student?.user?.middleNames,
            lastname: student?.student?.user?.lastName,
            gender: student?.student?.user?.gender,
            level: student?.student?.level?.name,
            userId: student?.student?.user?.id,
            key: key + 1
        })
    ).sort((a, b) => {
        if(a.lastname < b.lastname) return -1
        if(a.lastname > b.lastname) return 1
        return 0
    })

    const studentsTableColumns = [
        {
            title: 'Reg number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber'
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname'
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Current Results">
                        <Button
                            type="primary"
                            icon={<EyeOutlined/>}
                            onClick={() => {
                                navigate(
                                    `/teacher/class/current-term-report/${record?.userId}/`,
                                )
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View Previous Results">
                        <Button
                            type="primary"
                            icon={<EyeOutlined/>}
                            onClick={() => {
                                navigate(
                                    `/teacher/class/previous-terms-report/${record?.userId}/`,
                                )
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        }
    ]

    const tabItems = [
        {
            key: '1',
            label: "Students",
            children: <Table
                dataSource={_students}
                columns={studentsTableColumns}
            />
        },
        {
            key: '2',
            label: "Attendance",
            children: <AttendanceMarking studentsList={students}/>
        },
    ]

    return (
        <>
            <BackButton />

            <Tabs
                items={tabItems}
            />

        </>
    )
}

export default TeacherClassroom;
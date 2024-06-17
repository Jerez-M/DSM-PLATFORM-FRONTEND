import SubjectAllocationService from "../../../services/subject-allocation.service";
import AuthenticationService from "../../../services/authentication.service";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Alert, Button, Divider, Space, Table, Tooltip} from "antd";
import {EyeOutlined} from "@ant-design/icons";

export async function subjectAllocationsListLoader() {
    try {
        const userId = AuthenticationService.getUserId();
        const response = await SubjectAllocationService.getSubjectAllocationByTeacherUserId(userId);
        if (response?.status === 200) {
            const subjectAllocations = response.data;
            return {subjectAllocations};
        }
    } catch (e) {
        return []
    }
}

const TeacherSubjectAllocationsList = () => {
    const {subjectAllocations} = useLoaderData();
    const navigate = useNavigate();

    const _subjectAllocations = subjectAllocations.map(
        (i, key) => ({
            classroom: i?.classroom?.name,
            classroomId: i?.classroom?.id,
            subject: i?.subject?.name,
            level: i?.classroom?.level?.name,
            levelId: i?.classroom?.level?.id,
            subjectId: i?.subject?.id,
            key
        })
    )

    const subjectAllocationsListTableColumns = [
        {
            title: 'Class ID',
            dataIndex: 'classroomId',
            key: 'classroomId'
        },
        {
            title: 'Class name',
            dataIndex: 'classroom',
            key: 'classroom'
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject'
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title="View students">
                            <Button
                                type="primary"
                                icon={<EyeOutlined/>}
                                onClick={
                                    () => navigate(
                                        `/teacher/examinations/subject/${record.subjectId}/level/${record?.levelId}/classroom/${record?.classroomId}`
                                    )
                                }
                            />
                        </Tooltip>
                    </Space>
                )
            }
        }
    ]
    return (
        <>
            <div className=''>
                <h3>Set student marks</h3>
            </div>
            <Divider type={"horizontal"}/>
            <Alert
                closable={true}
                className={'mb-2 py-2 rounded-1'}
                showIcon={true}
                type={"info"}
                message='The following are the classes that you teach.
                Click on the view icon to view the students in that class and enter their marks.'
            />
            <Table
                dataSource={_subjectAllocations}
                columns={subjectAllocationsListTableColumns}
                bordered={true}
                className="table-responsive"
            />
        </>
    )
}

export default TeacherSubjectAllocationsList;
import StudentMarkService from "../../../services/student-mark.service";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {Card, Divider, Form, Input, Table} from "antd";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";

export async function studentAcademicInformationLoader({params}) {
    try {
        const response = await StudentMarkService.getCurrentTermResults(params?.id);
        if (response?.status === 200) {
            const student = response.data;
            return {student};
        }
    } catch (e) {
        return []
    }
}

const AdministrationStudentAcademicInformation = () => {
    const {student} = useLoaderData();
    const navigate = useNavigate();
    const {id} = useParams();

    const resultsData = student[1].map(
        (subject, key) => ({
            key: key + 1,
            subject: subject?.subject,
            mark: subject?.total_mark,
            comment: subject?.comment
        })
    )

    const resultsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject'
        },
        {
            title: 'Mark',
            dataIndex: 'mark',
            key: 'mark'
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment'
        },
    ]

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <span className='d-flex justify-content-between align-content-center'>
                    <ArrowLeftOutlined onClick={() => navigate(`/admin/students/${id}`)} className='mb-1 me-2'/>
                    <h3>Academic information
                    </h3>
                </span>
            </div>
            <Divider type={"horizontal"}/>

            <Form layout={"vertical"}>
                <Card>
                    <div className='row'>
                        <div className='col-md-2'>
                            <Form.Item label='Registration number'>
                                <Input
                                    value={student[0]?.student?.regNumber}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-md-2'>
                            <Form.Item label='First name'>
                                <Input
                                    value={student[0]?.student?.firstName}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-md-2'>
                            <Form.Item label='Last name'>
                                <Input
                                    value={student[0]?.student?.lastName}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-md-2'>
                            <Form.Item label='Grade'>
                                <Input
                                    value={student[0]?.student?.level}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-md-2'>
                            <Form.Item label='Term'>
                                <Input
                                    value={student[0]?.term}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-md-2'>
                            <Form.Item label='Year'>
                                <Input
                                    value={student[0]?.academic_year}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Card>
            </Form>

            <Table
                className='mt-3'
                columns={resultsTableColumns}
                dataSource={resultsData}
            />
        </>
    )
}

export default AdministrationStudentAcademicInformation;
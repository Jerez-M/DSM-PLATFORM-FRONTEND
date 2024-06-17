import {Button, Card, Divider, Form, Input, Space, Table} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Tooltip} from "antd";
import ClassroomService from "../../../services/classroom.service";
import studentClassService from "../../../services/student-class.service";
import authenticationService from "../../../services/authentication.service";

export async function studentClassroomLoader() {
    try {
        const studentUserId = authenticationService.getUserId()
        const studentClassroomResponse = await studentClassService.getStudentClassByStudentUserId(studentUserId);
        if (studentClassroomResponse?.status === 200) {
            const classRoom = studentClassroomResponse.data;
            return {classRoom};
        }
    } catch (e) {
        return [];
    }
}

const StudentClassroom = () => {
    const {classRoom} = useLoaderData();

    const studentClassesTableColumns = [
        {
            title: "Class name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Class level",
            dataIndex: "level",
            key: "level",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            //   render: (_, record) => (
            //     <Space size="middle">
            //       <Tooltip title="View Students">
            //         <Button
            //           type="primary"
            //           icon={<EyeOutlined />}
            //           onClick={() => {
            //             navigate(
            //               `/teacher/class/${record.id}/${record.name}/${record.level}`
            //             );
            //           }}
            //         />
            //       </Tooltip>
            //     </Space>
            //   ),
        },
    ];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>My Classes</h3>
            </div>

            <Divider type={"horizontal"}/>

            <Card>
                <Form layout={"vertical"}>
                    <div className='row'>
                        <div className='col-md-6'>
                            <Form.Item label='Class name'>
                                <Input value={classRoom?.classroom?.name}/>
                            </Form.Item>
                          <Form.Item label='Class level'>
                            <Input value={classRoom?.classroom?.level?.name}/>
                          </Form.Item>
                        </div>
                        <div className='col-md-6'>
                            <Form.Item label='Class teacher'>
                                <Input value={`${
                                    classRoom?.classroom?.class_teacher?.user?.firstName
                                } ${
                                    classRoom?.classroom?.class_teacher?.user?.lastName
                                }`}/>
                            </Form.Item>
                        </div>
                    </div>

                </Form>
            </Card>
        </>
    );
};

export default StudentClassroom;

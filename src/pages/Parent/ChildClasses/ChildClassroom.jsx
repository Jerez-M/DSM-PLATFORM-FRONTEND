import {Alert, Button, Card, Divider, Form, Input, Space, Table} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Tooltip} from "antd";
import ClassroomService from "../../../services/classroom.service";
import studentClassService from "../../../services/student-class.service";
import authenticationService from "../../../services/authentication.service";
import StudentService from "../../../services/student.service";
import {primaryColor} from "../../../common";

export async function childClassroomLoader({params}) {
    try {
        const studentClassroomResponse = await studentClassService.getStudentClassByStudentUserId(params.childId);
        const studentSubjectsResponse = await studentClassService.getStudentSubjectsByStudentUserId(params.childId);

        return {
            classRoom: studentClassroomResponse.data,
            subjects: studentSubjectsResponse.data,
        };
    } catch (e) {
        return [];
    }
}

const ChildClassroom = () => {
    const {classRoom, subjects, student} = useLoaderData();

    const studentSubjectsTableColumns = [
        {
            title: "Subject class ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Subject",
            dataIndex: ["name"],
            key: "name",
        }
    ];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Your Child's class and subjects</h3>
            </div>

            <Divider />


            <h6 style={{color: primaryColor}} className="mb-4">
                Your Child is in {classRoom?.classroom?.level?.name} - {classRoom?.classroom?.name} which is managed by
                {" "}{classRoom?.classroom?.class_teacher?.title} {classRoom?.classroom?.class_teacher?.user?.lastName}
            </h6>

            <Table
                dataSource={subjects}
                columns={studentSubjectsTableColumns}
            />

        </>
    );
};

export default ChildClassroom;

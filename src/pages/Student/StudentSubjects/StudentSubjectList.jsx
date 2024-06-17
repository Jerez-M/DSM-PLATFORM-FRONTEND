import {Divider, Table, Alert} from "antd";
import authenticationService from "../../../services/authentication.service";
import studentClassService from "../../../services/student-class.service";
import {useLoaderData} from "react-router-dom";


export async function fetchSubjects() {
    try {
        const studentUserId = authenticationService.getUserId();
        const response = await studentClassService.getStudentSubjectsByStudentUserId(studentUserId);
        const subjects = response.data;
        return {subjects}
    } catch (error) {
        return []
    }
};
const StudentSubjectsList = () => {
    const {subjects} = useLoaderData();

    const studentClassesTableColumns = [
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
                <h3>My subjects</h3>
            </div>
            <Divider type={"horizontal"}/>
            <Alert
                closable={true}
                className={"mb-2 py-2 rounded-1"}
                showIcon={true}
                type={"info"}
                message="The following are the subjects that you were assigned."
            />

            <Table
                dataSource={subjects}
                columns={studentClassesTableColumns}
            />
        </>
    );
};

export default StudentSubjectsList;

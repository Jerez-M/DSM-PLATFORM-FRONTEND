import {Divider, Table} from "antd";
import {useLoaderData} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";
import ClassroomService from "../../../services/classroom.service";
import AuthenticationService from "../../../services/authentication.service";

export async function subjectClassStudentsLoader({params}) {
    try {
        const studentsResponse = await ClassroomService.getStudentsByClassroomId(params?.id, AuthenticationService.getUserTenantId())
        const classroomsResponse = await ClassroomService.getById(params?.id)

        return { students: studentsResponse?.data, classroom: classroomsResponse?.data}
    } catch (e) {
        return []
    }
}

const SubjectClassStudentsList = () => {
    const { students, classroom } = useLoaderData();

    const studentsTableColumns = [
        {
            title: 'Reg number',
            dataIndex: 'regnumber',
            key: 'registrationNumber'
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            sorter: {
                compare: (a, b) => a.firstname < b.firstname
            }
        },
        {
            title: 'Middle name',
            dataIndex: 'middlenames',
            key: 'middlenames'
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => a.lastname < b.lastname,
            }
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: {
                compare: (a, b) => a.gender < b.gender
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: () => (
                <EyeOutlined
                    style={{color: 'blue'}}
                />
            )
        }
    ]

    console.clear()
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Students in {classroom?.level?.name} {classroom?.name}</h3>
            </div>

            <Divider type={"horizontal"}/>

            <Table
                dataSource={students}
                columns={studentsTableColumns}
            />

        </>
    )
}

export default SubjectClassStudentsList;
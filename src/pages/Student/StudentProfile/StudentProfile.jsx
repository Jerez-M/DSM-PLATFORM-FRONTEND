import StudentService from "../../../services/student.service";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Button, Card, Divider, Form, Input} from "antd";
import {useState} from "react";
import {EditOutlined} from "@ant-design/icons";
import ChangePasswordForm from "../../../common/ChangePasswordForm";


export async function studentProfileLoader() {
    try {
        const response = await StudentService.getStudentByUserId();
        if(response?.status === 200) {
            const student = response.data;
            return { student };
        }
    } catch (e) {
        return []
    }
}
const StudentProfile = () => {
    const {student} = useLoaderData();
    const [changePasswordBtnModal, setChangePasswordBtnModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Profile</h3>
                <div className="buttons">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => setChangePasswordBtnModal(true)}
                        danger={true}
                        type={"primary"}
                        className="mx-3"
                    >
                        Change password
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate("edit")}
                        type="primary"
                    >
                        Update Profile
                    </Button>
                </div>
            </div>
            <Divider type={"horizontal"}/>

            <Form layout={"vertical"}>
                <div className='row'>
                    <div className='col-md-3'>
                        <Card hoverable>
                            <Form.Item label='First name'>
                                <Input
                                    value={student?.user?.firstName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Middle name'>
                                <Input
                                    value={student?.user?.middleNames}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Last name'>
                                <Input
                                    value={student?.user?.lastName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Gender'>
                                <Input
                                    value={student?.user?.gender}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Date of birth'>
                                <Input
                                    value={student?.user?.dateOfBirth}
                                    size={"large"}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                    <div className='col-md-9'>
                        <Card>
                            <Form.Item label='Registration number'>
                                <Input
                                    value={student?.user?.username}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Email'>
                                <Input
                                    value={student?.user?.email}
                                    size={"large"}
                                />
                            </Form.Item>

                            <Form.Item label='Phone number'>
                                <Input
                                    value={student?.user?.phoneNumber}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Address'>
                                <Input
                                    value={student?.address}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Birth certificate number'>
                                <Input
                                    value={student?.birthCertNumber}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Enrollment date'>
                                <Input
                                    value={student?.enrollmentDate}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Level'>
                                <Input
                                    value={student?.level?.name}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Medical aid number'>
                                <Input
                                    value={student?.medicalAidNumber}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Province'>
                                <Input
                                    value={student?.province}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Residence status'>
                                <Input
                                    value={student?.residenceType}
                                    size={"large"}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                </div>
            </Form>
            <ChangePasswordForm open={changePasswordBtnModal} close={() => setChangePasswordBtnModal(false)} />
        </div>
    )
}

export default StudentProfile;
import {useLoaderData} from "react-router-dom";
import {Button, Card, Divider, Form, Input} from "antd";
import {useState} from "react";
import {EditOutlined} from "@ant-design/icons";
import TeacherService from "../../../services/teacher.service";
import AuthenticationService from "../../../services/authentication.service";
import ChangePasswordForm from "../../../common/ChangePasswordForm";


export async function teacherProfileLoader() {
    try {
        const userId = AuthenticationService.getUserId();
        const response = await TeacherService.getTeacherByUserId(userId);
        if(response?.status === 200) {
            const teacher = response.data;
            return { teacher };
        }
    } catch (e) {
        return []
    }
}

const TeacherProfile = () => {
    const {teacher} = useLoaderData();
    const [changePasswordBtnModal, setChangePasswordBtnModal] = useState(false);


    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Profile</h3>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => setChangePasswordBtnModal(true)}
                    danger={true}
                    type={"primary"}
                >
                    Change password
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <Form layout={"vertical"}>
                <div className='row'>
                    <div className='col-md-3'>
                        <Card hoverable>
                            <Form.Item label='Title'>
                                <Input
                                    value={teacher?.title}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='First name'>
                                <Input
                                    value={teacher?.user?.firstName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Middle name'>
                                <Input
                                    value={teacher?.user?.middleNames}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Last name'>
                                <Input
                                    value={teacher?.user?.lastName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Gender'>
                                <Input
                                    value={teacher?.user?.gender}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Date of birth'>
                                <Input
                                    value={teacher?.user?.dateOfBirth}
                                    size={"large"}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                    <div className='col-md-9'>
                        <Card>
                            <Form.Item label='Teacher number'>
                                <Input
                                    value={teacher?.user?.username}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Designation'>
                                <Input
                                    value={teacher?.designation}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Email'>
                                <Input
                                    value={teacher?.alt_email}
                                    size={"large"}
                                />
                            </Form.Item>

                            <Form.Item label='Phone number'>
                                <Input
                                    value={teacher?.user?.phoneNumber}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Address'>
                                <Input
                                    value={teacher?.address}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='National ID number'>
                                <Input
                                    value={teacher?.national_id}
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

export default TeacherProfile;
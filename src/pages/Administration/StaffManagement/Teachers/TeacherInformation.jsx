import {useLoaderData, useNavigate} from "react-router-dom";
import {Button, Card, Divider, Form, Input} from "antd";
import {ArrowLeftOutlined, EditOutlined} from "@ant-design/icons";
import TeacherService from "../../../../services/teacher.service";
import BackButton from "../../../../common/BackButton";

export async function teacherInformationLoader({params}) {
    try {
        const response = await TeacherService.get(params?.id);
        if (response?.status === 200) {
            const teacher = response.data;
            return {teacher};
        }
    } catch (e) {
        return []
    }
}

const TeacherInformation = () => {
    const {teacher} = useLoaderData();
    const navigate = useNavigate();

    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-center">
                <BackButton />
                <Button
                    icon={<EditOutlined/>}
                    className="border-0 text-light"
                    style={{background: '#39b54a'}}
                    onClick={()=> navigate("edit")}
                >
                    Update teacher information
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <h3>Teacher profile</h3>

            <Form layout={"vertical"}>
                <div className='row'>
                    <div className='col-md-3'>
                        <Card>
                            <Form.Item label='First name'>
                                <Input
                                    size={"large"}
                                    value={teacher?.user?.firstName}
                                />
                            </Form.Item>
                            <Form.Item label='Middle names'>
                                <Input
                                    size={"large"}
                                    value={teacher?.user?.middleNames}
                                />
                            </Form.Item>
                            <Form.Item label='Last name'>
                                <Input
                                    size={"large"}
                                    value={teacher?.user?.lastName}
                                />
                            </Form.Item>
                            <Form.Item label='Date of birth'>
                                <Input
                                    size={"large"}
                                    value={teacher?.user?.dateOfBirth}
                                />
                            </Form.Item>
                            <Form.Item label='Gender'>
                                <Input
                                    size={"large"}
                                    value={teacher?.user?.gender}
                                />
                            </Form.Item>
                            <Form.Item label='National ID number'>
                                <Input
                                    size={"large"}
                                    value={teacher?.national_id}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                    <div className='col-md-9'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <Card>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <Form.Item label='Registration number'>
                                                <Input
                                                    size={"large"}
                                                    value={teacher?.user?.username}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className='col-md-4'>
                                            <Form.Item label='Email'>
                                                <Input
                                                    size={"large"}
                                                    value={teacher?.user?.email}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className='col-md-4'>
                                            <Form.Item label='Phone number'>
                                                <Input
                                                    size={"large"}
                                                    value={teacher?.user?.phoneNumber}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-12 my-3'>
                                <Card>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <Form.Item label='Address'>
                                                <Input
                                                    size={"large"}
                                                    value={teacher?.address}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className='col-md-4'>
                                            <Form.Item label='Designation'>
                                                <Input
                                                    size={"large"}
                                                    value={teacher?.designation}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

        </div>
    )
}

export default TeacherInformation;
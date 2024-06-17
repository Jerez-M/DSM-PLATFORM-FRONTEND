import {useLoaderData} from "react-router-dom";
import {Button, Card, Divider, Dropdown, Form, Input, Space} from "antd";
import {useState} from "react";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../services/authentication.service";
import ChangePasswordForm from "../../../common/ChangePasswordForm";
import ParentService from "../../../services/parent.service";
import TextArea from "antd/es/input/TextArea";
import EditParent from "./EditParentForm";


export async function parentProfileLoader() {
    try {
        const userId = AuthenticationService.getUserId();
        const response = await ParentService.getParentByUserId(userId);
        if(response?.status === 200) {
            const parent = response.data;
            return { parent };
        }
    } catch (e) {
        return []
    }
}

const ParentProfile = () => {
    const {parent} = useLoaderData();
    const [changePasswordBtnModal, setChangePasswordBtnModal] = useState(false);
    const [editProfileModal, setEditProfileModal] = useState(false);

    const childrenNames = parent?.students?.map(child =>
        `${child?.user?.firstName} ${child?.user?.lastName} (${child?.user?.username}) `)


    const items = [
        {
            label: 'Edit profile',
            key: '1',
            onClick: () => setEditProfileModal(true)
        },
        {
            label: "Change Password",
            key: '2',
            onClick: () => setChangePasswordBtnModal(true)
        }
    ];

    const menuProps = {
        items,
    };

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Profile</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<PlusOutlined />}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Actions
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <Divider type={"horizontal"}/>

            <Form layout={"vertical"}>
                <div className='row'>
                    <div className='col-md-3'>
                        <Card>
                            <Form.Item label='Registration number'>
                                <Input
                                    value={parent?.user?.username}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='First name'>
                                <Input
                                    value={parent?.user?.firstName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Middle name'>
                                <Input
                                    value={parent?.user?.middleNames}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Last name'>
                                <Input
                                    value={parent?.user?.lastName}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Phone number'>
                                <Input
                                    value={parent?.user?.phoneNumber}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Gender'>
                                <Input
                                    value={parent?.user?.gender}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Parental Role'>
                                <Input
                                    value={parent?.user?.parentType}
                                    size={"large"}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                    <div className='col-md-9'>
                        <Card>
                            <Form.Item label='Email'>
                                <Input
                                    value={parent?.user?.email}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Address'>
                                <Input
                                    value={parent?.address}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='National ID number'>
                                <Input
                                    value={parent?.nationalId}
                                    size={"large"}
                                />
                            </Form.Item>

                            <Divider />

                            <Form.Item label='Occupation'>
                                <Input
                                    value={parent?.occupation}
                                    size={"large"}
                                />
                            </Form.Item>
                            <Form.Item label='Work Address'>
                                <Input
                                    value={parent?.employer_address}
                                    size={"large"}
                                />
                            </Form.Item>

                            <Divider />

                            <Form.Item label="Children" >
                                <TextArea
                                    value={childrenNames}
                                    size={"large"}
                                />
                            </Form.Item>
                        </Card>
                    </div>
                </div>
            </Form>

            <ChangePasswordForm open={changePasswordBtnModal} close={() => setChangePasswordBtnModal(false)} />

            <EditParent open={editProfileModal} close={() => setEditProfileModal(false)} parent={parent} />
        </div>
    )
}

export default ParentProfile;
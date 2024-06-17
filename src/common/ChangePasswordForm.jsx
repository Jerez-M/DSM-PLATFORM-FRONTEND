import {Button, Form, Input, message, Modal} from "antd";
import AuthenticationService from "../services/authentication.service";
import {useState} from "react";
import {EditOutlined} from "@ant-design/icons";

const ChangePasswordForm = ({open, close}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmationPassword, setConfirmationNewPassword] = useState('');
    const [changePasswordBtnLoading, setChangePasswordBtnLoading] = useState(false);
    const [form] = Form.useForm();

    const handleChangePassword = async () => {
        if (oldPassword === '') {
            message.warning('Please enter the current password.');
            return -1;
        }

        if (newPassword === '') {
            message.warning('Please enter the new password.');
            return -1;
        }

        if (confirmationPassword === '') {
            message.warning('Please enter the confirmation password.');
            return -1;
        }

        if (newPassword !== confirmationPassword) {
            message.error('Passwords do not match.');
            return -1;
        }

        if (confirmationPassword.length < 8) {
            message.info('Your password must contain at least 8 characters.');
            return -1;
        }

        try {
            setChangePasswordBtnLoading(true);
            const response = await AuthenticationService.verifyPassword({
                username: AuthenticationService.getUsername(),
                password: oldPassword
            })
            if (response?.status === 200) {
                const res = await AuthenticationService.changePassword({
                        username: AuthenticationService.getUsername(),
                        password: confirmationPassword
                    })
                if(res?.status === 200) {
                    message.success('Password updated successfully.');
                    setChangePasswordBtnLoading(false);
                    close();
                    setTimeout(AuthenticationService.logout, 1500)
                }
            }

        } catch (e) {
            if (e.response.status === 403) {
                message.error('Enter the correct current password.')
            }
        }
    }
    return (
        <Modal
            open={open}
            onCancel={() => close()}
            okButtonProps={{
                className: 'd-none'
            }}
            cancelButtonProps={{
                className: 'd-none'
            }}
            maskClosable
            destroyOnClose
        >
            <Form layout={"vertical"} form={form} onFinish={handleChangePassword}>
                <Form.Item
                    label="Current password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Current password is required!' }]}
                >
                    <Input.Password
                        placeholder='Current password'
                        size={"large"}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="New password"
                    name="newPassword"
                    rules={[{ required: true, message: 'New password is required!' }]}
                >
                    <Input.Password
                        placeholder='new password'
                        size={"large"}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Repeat password"
                    name="confirmationPassword"
                    rules={[{ required: true, message: 'Repeat password is required!' }]}
                >
                    <Input.Password
                        placeholder='Repeat password'
                        size={"large"}
                        onChange={e => setConfirmationNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Button
                    className='text-light'
                    style={{background: '#39b54a'}}
                    size={"large"}
                    htmlType="submit"
                    icon={<EditOutlined />}
                    loading={changePasswordBtnLoading}
                    block
                >
                    Change password
                </Button>
            </Form>
        </Modal>
    )
}

export default ChangePasswordForm;
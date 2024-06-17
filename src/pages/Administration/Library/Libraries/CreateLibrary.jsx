import {Button, Form, Input, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {handleJerryError, refreshPage} from "../../../../common";
import AuthenticationService from "../../../../services/authentication.service";
import LibraryService from "../../../../services/library.service";
import AccountsService from "../../../../services/accounts.service";

const CreateLibrary = ({ open, close, library }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [librarians, setLibrarians] = useState()

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            const requestData = {...values, institution: AuthenticationService.getUserTenantId()}
            if(library?.id) {
                const response = await LibraryService.update(library?.id, requestData);
                if (response.status === 200) {
                    message.success("Library Updated Successfully");
                    refreshPage()
                }
            } else {
                const response = await LibraryService.create(requestData);

                if (response.status === 201) {
                    message.success("Library Created Successfully");
                    refreshPage()
                } else {
                    console.log("Request was not successful. Status:", response.status);
                    message.error(response?.data?.error ?? "An error occurred, please check your network.");
                }
            }
        } catch (error) {
            handleJerryError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AccountsService.getAllAccountsByInstitution(AuthenticationService.getUserTenantId())
            .then(response => {
                if (response.status === 200) {
                    const users = response.data.map(user => ({
                        value: user.id,
                        label: `${user.firstName} ${user.lastName}`
                    }))
                    setLibrarians(users);
                }
            })
            .catch(error => {
                handleJerryError(error)
            })
    }, [])

    useEffect(() => {
        if(library) {
            let librarians = []
            library?.librarians.map(librarian => {
                librarians.push(librarian.id)
            })

            form.setFieldsValue({
                name: library?.name,
                contact_info: library?.contact_info,
                librarians: librarians,
            })
        }
    }, [library]);

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <>
            <Modal
                title={library?.id ? "Update Library" : "Create Library"}
                open={open}
                onCancel={() => {
                    handleClear();
                    close()
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
                maskClosable
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    id="library-form"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the library name" }]}
                    >
                        <Input
                            placeholder="Name"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Contact Info"
                        name="contact_info"
                    >
                        <Input
                            placeholder="Contact"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Librarians"
                        name="librarians"
                    >
                        <Select
                            placeholder="Librarians"
                            mode="multiple"
                            size="large"
                            allowClear
                            options={librarians}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                (option?.label ?? '').toLowerCase().includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        size="large"
                        className="mt-4"
                        loading={loading}
                        block
                        htmlType="submit"
                        icon={<PlusOutlined />}
                    >
                        {library?.id ? "Update Library" : "Create Library"}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default CreateLibrary;

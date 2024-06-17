import {Button, Form, Input, message, Modal} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../../../services/authentication.service";
import {handleJerryError, refreshPage} from "../../../../../common";
import ElectronicsCategoryService from "../../../../../services/electronics-category.service";

const NewElectronicCategory = ({open, close, category}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(category) {
            form.setFieldsValue({"name":  category?.name})
        }
    }, [open]);

    const handleFormSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {
                ...values,
                institution: AuthenticationService.getUserTenantId()
            };

            if(category?.id) {
                const response = await ElectronicsCategoryService.update(category?.id, requestData);

                if (response.status === 200) {
                    message.success("Electric Category Updated Successfully")
                    refreshPage()
                }
            } else {
                const response = await ElectronicsCategoryService.create(requestData);

                if (response.status === 201) {
                    message.success("Electric Category Created Successfully")
                    refreshPage()
                }
            }
        } catch (e) {
            handleJerryError(e)
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <Modal
            title={category?.id ? "Edit Electronic Category" : "Add New Electronic Category"}
            open={open}
            onCancel={() => {
                handleClear();
                close()
            }}
            forceRender
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
                layout="vertical"
                form={form}
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Electronic category name is required!' }]}
                >
                    <Input
                        size="large"
                        placeholder="Name"
                    />
                </Form.Item>

                <Button
                    icon={<PlusOutlined/>}
                    type="primary"
                    size="large"
                    loading={loading}
                    block
                    htmlType="submit"
                >
                    {category?.id ? "Edit Electronic Category" : "Add New Electronic Category"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewElectronicCategory;
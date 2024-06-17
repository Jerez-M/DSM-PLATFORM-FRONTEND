import {Button, Form, Input, message, Modal} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../../../services/authentication.service";
import {handleJerryError, phoneNumberPrefix, refreshPage} from "../../../../../common";
import TextArea from "antd/es/input/TextArea";
import ElectronicsSupplierService from "../../../../../services/electronics-supplier.service";

const NewElectronicSupplier = ({open, close, supplier}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(supplier) {
            form.setFieldsValue({
                "supplier_name": supplier?.supplier_name,
                "email": supplier?.email,
                "address": supplier?.address,
            })
        }
        if(supplier?.contact) {
            const num = supplier?.contact;
            const phoneNumber = +num.slice(-9)
            const prefix = num.split(phoneNumber)[0]

            form.setFieldsValue({
                "countryCode":  prefix,
                "phoneNumber": phoneNumber,
            })
        }
    }, [open]);

    const handleFormSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {
                ...values,
                institution: AuthenticationService.getUserTenantId()
            };
            if(values.phoneNumber) requestData.contact = values.countryCode + values.phoneNumber;

            if(supplier?.id) {
                const response = await ElectronicsSupplierService.update(supplier?.id, requestData);

                if (response.status === 200) {
                    message.success("Electric Supplier Updated Successfully")
                    refreshPage()
                }
            } else {
                const response = await ElectronicsSupplierService.create(requestData);

                if (response.status === 201) {
                    message.success("Electric Supplier Created Successfully")
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
            title={supplier?.id ? "Edit Electronic Supplier" : "Add New Electronic Supplier"}
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
                    name="supplier_name"
                    label="Name"
                    rules={[{ required: true, message: 'Supplier Name is required!' }]}
                    initialValue={supplier?.supplier_name}
                >
                    <Input
                        size="large"
                        placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone number"
                    rules={supplier === null && [{len: 9, message: 'Number should have 9 characters'}]}
                >
                    <Input
                        addonBefore={phoneNumberPrefix}
                        name="phoneNumber"
                        className="w-100"
                        size={"large"}
                        type="number"
                        min={9}
                        maxLength={9}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: 'email', message: 'Email is invalid!' }]}
                    initialValue={supplier?.email}
                >
                    <Input
                        size="large"
                        placeholder="E.g. supplier@mail.com"
                    />
                </Form.Item>


                <Form.Item
                    name="address"
                    label="Address"
                    initialValue={supplier?.address}
                >
                    <TextArea
                        size="large"
                        placeholder="Address"
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
                    {supplier?.id ? "Edit Electronic Supplier" : "Add New Electronic Supplier"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewElectronicSupplier;
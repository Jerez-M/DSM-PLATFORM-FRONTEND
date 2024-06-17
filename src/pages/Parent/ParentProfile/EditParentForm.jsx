import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    message,
} from "antd";
import {useEffect, useState} from "react";
import parentService from "../../../services/parent.service";
import {PlusOutlined} from "@ant-design/icons";
import {capitaliseFirstLetters, handleError, phoneNumberPrefix, refreshPage, toInputUppercase} from "../../../common";

const EditParent = ({open, close, parent}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            firstName: parent?.user?.firstName,
            lastName: parent?.user?.lastName,
            middleNames: parent?.user?.middleNames,
            role: parent?.user?.role,
            gender: parent?.user?.gender,
            email: parent?.user?.email,
            phoneNumber: parent?.user?.phoneNumber,
            address: parent?.address,
            parentType: parent?.parentType,
            employer_address: parent?.employer_address,
            nationalId: parent?.nationalId,
            monthlyIncome: parent?.monthlyIncome,
            occupation: parent?.occupation
        })

        if(parent.user?.phoneNumber) {
            const num = parent.user?.phoneNumber;
            const phoneNumber = +num.slice(-9)
            const prefix = num.split(phoneNumber)[0]

            form.setFieldsValue({"countryCode":  prefix})
            form.setFieldsValue({"phoneNumber": phoneNumber})
            form.validateFields();
        }
    }, [])

    const handleFormSubmit = async (values) => {
        let phoneNumber
        if (values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;

        try {
            setLoading(true);
            setDisabled(true);

            const {
                firstName,
                lastName,
                middleNames,
                role,
                gender,
                email,
                employer_address,
                password,
                parentType,
                address,
                occupation,
                monthlyIncome,
                singleParent,
                inActive,
                nationalId
            } = values;

            const data = {
                user: {
                    firstName: capitaliseFirstLetters(firstName),
                    lastName: capitaliseFirstLetters(lastName),
                    middleNames: capitaliseFirstLetters(middleNames),
                    role,
                    gender,
                    email,
                    phoneNumber,
                    password,
                },
                address,
                parentType,
                employer_address,
                occupation: capitaliseFirstLetters(occupation),
                monthlyIncome,
                singleParent,
                inActive,
                nationalId,
            };

            const response = await parentService.update(parent.id, data);

            if (response.status === 200) {
                close();
                setLoading(false);
                setDisabled(false);
                message.success("Parent Added Successfully");
                refreshPage();
            } else {
                message.error("Error adding parent");
                setLoading(false);
                setDisabled(false);
            }
        } catch (e) {
            setLoading(false);
            setDisabled(false);
            handleError(e)
        }
    };

    return (
        <>
            <Modal
                title="Edit Information"
                open={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form
                    layout="vertical"
                    form={form}
                    width={1000}
                    onFinish={handleFormSubmit}
                    initialValues={{
                        firstName: parent?.firstName,
                        lastName: parent?.lastName
                    }}
                >
                    <div className="row">
                        <div className="col-6">
                            <Form.Item name="firstName" label="First name" >
                                <Input
                                    placeholder="First Name"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item name="middleNames" label="Middle name">
                                <Input
                                    placeholder="Middlename"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item name="email" label="Email">
                                <Input
                                    placeholder="Email"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item name="address" label="Address">
                                <Input
                                    placeholder="Address"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item name="occupation" label="Occupation">
                                <Input
                                    placeholder="Occupation"
                                    size="large"
                                />
                            </Form.Item>
                        </div>

                        <div className="col-6">
                            <Form.Item name="lastName" label="Last name" >
                                <Input
                                    placeholder="Last Name"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item label="Gender" name="gender">
                                <Select
                                    placeholder="Gender"
                                    size="large"
                                    options={[
                                        {label: "MALE", value: "MALE"},
                                        {label: "FEMALE", value: "FEMALE"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Parent type" name="parentType">
                                <Select
                                    placeholder="Parent Role"
                                    size="large"
                                    options={[
                                        {label: "Father", value: "Father"},
                                        {label: "Mother", value: "Mother"},
                                        {label: "Guardian", value: "Guardian"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Employer Address" name="employerAddress">
                                <Input
                                    placeholder="Employer Address"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item name="nationalId" label="National Id" >
                                <Input
                                    placeholder="63-232257R18"
                                    size="large"
                                    onInput={toInputUppercase}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone number"
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
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        icon={<PlusOutlined/>}
                        disabled={disabled}
                        block
                        htmlType={"submit"}
                    >
                        Edit Profile
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default EditParent;
